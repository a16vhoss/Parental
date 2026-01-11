// ModuleView - Full content of a single module with interactive elements
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { STAGES } from '../types/guidesTypes';
import { ALL_GUIDE_MODULES } from '../data/guidesData';
import InteractiveChecklist from '../components/InteractiveChecklist';

// Supabase helpers
import { supabase } from '../lib/supabase';
import { useLogger } from '../hooks/useLogger';

// Checklist storage can remain local for now as it's granular, or moving it to DB would require a JSONB column. 
// For simplicity in this phase, we keep checklist local, but sync completion to DB.
const getChecklistState = (moduleId: string): Record<string, boolean> => {
    try {
        const stored = localStorage.getItem(`checklist_${moduleId}`);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
};

const saveChecklistState = (moduleId: string, state: Record<string, boolean>) => {
    localStorage.setItem(`checklist_${moduleId}`, JSON.stringify(state));
};

const ModuleView: React.FC = () => {
    const { stageId, moduleId } = useParams<{ stageId: string; moduleId: string }>();
    const navigate = useNavigate();
    const { logActivity } = useLogger();

    const [isCompleted, setIsCompleted] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});

    // Find stage and module
    const stage = STAGES.find(s => s.id === stageId);
    const module = ALL_GUIDE_MODULES.find(m => m.id === moduleId && m.stageId === stageId);

    // Get all modules for navigation
    const stageModules = ALL_GUIDE_MODULES
        .filter(m => m.stageId === stageId)
        .sort((a, b) => a.order - b.order);
    const currentIndex = stageModules.findIndex(m => m.id === moduleId);
    const prevModule = currentIndex > 0 ? stageModules[currentIndex - 1] : null;
    const nextModule = currentIndex < stageModules.length - 1 ? stageModules[currentIndex + 1] : null;

    // Load saved state on mount
    useEffect(() => {
        const loadState = async () => {
            if (stageId && moduleId) {
                // Checklist local
                setChecklistState(getChecklistState(moduleId));

                // DB Progress
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data } = await supabase
                    .from('user_guide_progress')
                    .select('completed_at, is_favorite')
                    .eq('user_id', user.id)
                    .eq('module_id', moduleId)
                    .single();

                if (data) {
                    setIsCompleted(!!data.completed_at);
                    setIsFavorite(!!data.is_favorite);
                }
            }
        };
        loadState();
    }, [stageId, moduleId]);

    // Toggle completed
    const handleToggleCompleted = async () => {
        if (!stageId || !moduleId) return;

        const nextState = !isCompleted;
        setIsCompleted(nextState); // Optimistic

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('user_guide_progress')
            .upsert({
                user_id: user.id,
                module_id: moduleId,
                stage_id: stageId,
                completed_at: nextState ? new Date().toISOString() : null
            }, { onConflict: 'user_id, module_id' });

        if (error) console.error('Error saving completion:', error);

        if (nextState) {
            await logActivity({
                actionType: 'GUIDE_COMPLETED',
                description: `Completó el módulo: ${module?.title}`,
                entityId: moduleId,
                entityType: 'guide'
            });
        }
    };

    // Toggle favorite
    const handleToggleFavorite = async () => {
        if (!stageId || !moduleId) return;

        const nextState = !isFavorite;
        setIsFavorite(nextState); // Optimistic

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('user_guide_progress')
            .upsert({
                user_id: user.id,
                module_id: moduleId,
                stage_id: stageId,
                is_favorite: nextState
            }, { onConflict: 'user_id, module_id' });

        if (error) console.error('Error saving favorite:', error);
    };

    // Handle checklist toggle
    const handleChecklistToggle = (itemId: string) => {
        if (!moduleId) return;

        const newState = { ...checklistState, [itemId]: !checklistState[itemId] };
        setChecklistState(newState);
        saveChecklistState(moduleId, newState);
    };

    if (!stage || !module) {
        return (
            <main className="flex-grow p-8 flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">error</span>
                    <p className="text-gray-500">Módulo no encontrado</p>
                    <button onClick={() => navigate('/guias')} className="mt-4 text-primary font-bold">
                        Volver a Guías
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-grow p-4 md:p-8 lg:px-12 max-w-[800px] mx-auto w-full animate-in fade-in duration-500 pb-32">
            {/* Back Button */}
            <button
                onClick={() => navigate(`/guias/${stageId}`)}
                className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 font-medium transition-colors"
            >
                <span className="material-symbols-outlined">arrow_back</span>
                Volver a {stage.name}
            </button>

            {/* Module Header */}
            <header className="mb-8">
                <div className="flex items-start gap-4 mb-4">
                    <div
                        className="size-14 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"
                        style={{ backgroundColor: stage.color }}
                    >
                        <span className="material-symbols-outlined text-2xl">{module.icon}</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: stage.color }}>
                            Módulo {module.order} de {stageModules.length}
                        </p>
                        <h1 className="text-2xl md:text-3xl font-black text-[#121716] dark:text-white">{module.title}</h1>
                    </div>
                </div>

                {/* Priority Badge */}
                {module.isPriority && !isCompleted && (
                    <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 dark:bg-rose-500/10 rounded-xl text-rose-600 text-xs font-bold uppercase tracking-wider">
                        <span className="material-symbols-outlined text-sm">priority_high</span>
                        Recomendado leer pronto
                    </div>
                )}
            </header>

            {/* Content */}
            <article className="bg-white dark:bg-surface-dark rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-800 space-y-8">
                {/* Intro */}
                <div className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {module.content.intro}
                </div>

                {/* Sections */}
                {module.content.sections.map((section, i) => (
                    <section key={i} className="space-y-3">
                        <h2 className="text-xl font-bold text-[#121716] dark:text-white flex items-center gap-2">
                            <span className="size-7 rounded-lg flex items-center justify-center text-xs font-black text-white" style={{ backgroundColor: stage.color }}>
                                {i + 1}
                            </span>
                            {section.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed pl-9">
                            {section.content}
                        </p>
                    </section>
                ))}

                {/* Checklist */}
                {module.content.checklist && module.content.checklist.length > 0 && (
                    <InteractiveChecklist
                        items={module.content.checklist}
                        checkedItems={checklistState}
                        onToggle={handleChecklistToggle}
                        stageColor={stage.color}
                    />
                )}

                {/* Tips */}
                {module.content.tips && module.content.tips.length > 0 && (
                    <section className="bg-primary/5 rounded-2xl p-5">
                        <h3 className="font-bold text-[#121716] dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">lightbulb</span>
                            Tips
                        </h3>
                        <ul className="space-y-2">
                            {module.content.tips.map((tip, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Warning Signals */}
                {module.content.warningSignals && module.content.warningSignals.length > 0 && (
                    <section className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-5 border border-rose-100 dark:border-rose-900/30">
                        <h3 className="font-bold text-rose-700 dark:text-rose-400 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">warning</span>
                            Señales de Alerta
                        </h3>
                        <ul className="space-y-2">
                            {module.content.warningSignals.map((signal, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-rose-700 dark:text-rose-400">
                                    <span className="material-symbols-outlined text-sm mt-0.5">error</span>
                                    {signal}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <button
                        onClick={handleToggleCompleted}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all ${isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-green-100 hover:text-green-600'
                            }`}
                    >
                        <span className={`material-symbols-outlined ${isCompleted ? 'icon-filled' : ''}`}>
                            {isCompleted ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                        {isCompleted ? 'Completado' : 'Marcar como leído'}
                    </button>

                    <button
                        onClick={handleToggleFavorite}
                        className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold transition-all ${isFavorite
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-amber-100 hover:text-amber-600'
                            }`}
                    >
                        <span className={`material-symbols-outlined ${isFavorite ? 'icon-filled' : ''}`}>star</span>
                    </button>
                </div>
            </article>

            {/* Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 p-4 md:static md:bg-transparent md:backdrop-blur-none md:border-0 md:mt-6 md:p-0">
                <div className="max-w-[800px] mx-auto flex gap-3">
                    {prevModule ? (
                        <button
                            onClick={() => navigate(`/guias/${stageId}/${prevModule.id}`)}
                            className="flex-1 flex items-center gap-2 py-3 px-4 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                            <span className="truncate text-sm">{prevModule.title}</span>
                        </button>
                    ) : (
                        <div className="flex-1" />
                    )}

                    {nextModule && (
                        <button
                            onClick={() => navigate(`/guias/${stageId}/${nextModule.id}`)}
                            className="flex-1 flex items-center justify-end gap-2 py-3 px-4 rounded-xl font-medium text-white transition-colors"
                            style={{ backgroundColor: stage.color }}
                        >
                            <span className="truncate text-sm">{nextModule.title}</span>
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    )}
                </div>
            </nav>
        </main>
    );
};

export default ModuleView;
