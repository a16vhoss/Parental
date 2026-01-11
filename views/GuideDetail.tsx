// GuideDetail - Shows all modules for a specific stage/guide
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FamilyMember } from '../types';
import { STAGES, GuideModule } from '../types/guidesTypes';
import { getModulesByStage } from '../data/guidesData';
import ModuleCard from '../components/ModuleCard';

interface GuideDetailProps {
    childrenList: FamilyMember[];
}

// Parse age to months helper
const parseAgeToMonths = (ageStr: string, dob?: string): number => {
    if (dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
        return Math.max(0, months);
    }
    const age = ageStr.toLowerCase();
    if (age.includes('mes')) {
        const match = age.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }
    if (age.includes('año')) {
        const match = age.match(/(\d+)/);
        return match ? parseInt(match[1]) * 12 : 12;
    }
    return 0;
};

// LocalStorage helpers
const getStoredProgress = (stageId: string) => {
    try {
        const stored = localStorage.getItem(`guide_progress_${stageId}`);
        return stored ? JSON.parse(stored) : { completed: [], favorites: [] };
    } catch {
        return { completed: [], favorites: [] };
    }
};

const saveProgress = (stageId: string, data: { completed: string[], favorites: string[] }) => {
    localStorage.setItem(`guide_progress_${stageId}`, JSON.stringify(data));
};

const GuideDetail: React.FC<GuideDetailProps> = ({ childrenList }) => {
    const { stageId } = useParams<{ stageId: string }>();
    const navigate = useNavigate();

    const [progress, setProgress] = useState<{ completed: string[], favorites: string[] }>({ completed: [], favorites: [] });
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'favorites'>('all');

    // Find stage
    const stage = STAGES.find(s => s.id === stageId);
    const modules = stageId ? getModulesByStage(stageId) : [];

    // Get children
    const children = childrenList.filter(m => m.role === 'Hijo/a');

    // Find applicable children for this stage
    const applicableChildren = useMemo(() => {
        if (!stage) return [];
        return children
            .map(child => ({
                id: child.id,
                name: child.name.split(' ')[0],
                ageMonths: parseAgeToMonths(child.age, child.vitals?.dob)
            }))
            .filter(c => c.ageMonths >= stage.minMonths && c.ageMonths < stage.maxMonths);
    }, [stage, children]);

    // Load progress on mount
    useEffect(() => {
        if (stageId) {
            setProgress(getStoredProgress(stageId));
        }
    }, [stageId]);

    // Filter modules
    const filteredModules = useMemo(() => {
        let result = modules;
        if (filter === 'pending') {
            result = modules.filter(m => !progress.completed.includes(m.id));
        } else if (filter === 'completed') {
            result = modules.filter(m => progress.completed.includes(m.id));
        } else if (filter === 'favorites') {
            result = modules.filter(m => progress.favorites.includes(m.id));
        }
        return result;
    }, [modules, progress, filter]);

    // Toggle favorite
    const handleToggleFavorite = (moduleId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newFavorites = progress.favorites.includes(moduleId)
            ? progress.favorites.filter(id => id !== moduleId)
            : [...progress.favorites, moduleId];

        const newProgress = { ...progress, favorites: newFavorites };
        setProgress(newProgress);
        if (stageId) saveProgress(stageId, newProgress);
    };

    // Calculate progress percentage
    const completedCount = progress.completed.length;
    const totalCount = modules.length;
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    if (!stage) {
        return (
            <main className="flex-grow p-8 flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">error</span>
                    <p className="text-gray-500">Guía no encontrada</p>
                    <button onClick={() => navigate('/guias')} className="mt-4 text-primary font-bold">
                        Volver a Guías
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-grow p-4 md:p-8 lg:px-12 max-w-[1000px] mx-auto w-full animate-in fade-in duration-500">
            {/* Back Button */}
            <button
                onClick={() => navigate('/guias')}
                className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 font-medium transition-colors"
            >
                <span className="material-symbols-outlined">arrow_back</span>
                Volver a Guías
            </button>

            {/* Header */}
            <header className="bg-white dark:bg-surface-dark rounded-3xl p-6 md:p-8 mb-8 border border-gray-100 dark:border-gray-800 relative overflow-hidden">
                {/* Background Gradient */}
                <div
                    className="absolute -top-20 -right-20 size-60 rounded-full blur-3xl opacity-20"
                    style={{ backgroundColor: stage.color }}
                />

                <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-6">
                    {/* Icon */}
                    <div
                        className="size-20 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"
                        style={{ backgroundColor: stage.color }}
                    >
                        <span className="material-symbols-outlined text-4xl icon-filled">{stage.icon}</span>
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl font-black text-[#121716] dark:text-white mb-2">{stage.name}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">{stage.description}</p>

                        {/* Applicable Children */}
                        {applicableChildren.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="text-xs text-gray-400 uppercase tracking-wider font-bold mr-1">Para:</span>
                                {applicableChildren.map(child => (
                                    <span
                                        key={child.id}
                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
                                        style={{ backgroundColor: `${stage.color}15`, color: stage.color }}
                                    >
                                        <span className="material-symbols-outlined text-sm">child_care</span>
                                        {child.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Progress */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">Progreso general</span>
                                <span className="font-bold" style={{ color: stage.color }}>
                                    {completedCount}/{totalCount} módulos ({percentage}%)
                                </span>
                            </div>
                            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%`, backgroundColor: stage.color }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {[
                    { key: 'all', label: 'Todos', count: modules.length },
                    { key: 'pending', label: 'Pendientes', count: modules.length - progress.completed.length },
                    { key: 'completed', label: 'Completados', count: progress.completed.length },
                    { key: 'favorites', label: 'Favoritos', count: progress.favorites.length }
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key as any)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${filter === tab.key
                            ? 'text-white shadow-md'
                            : 'bg-white dark:bg-surface-dark text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                            }`}
                        style={filter === tab.key ? { backgroundColor: stage.color } : undefined}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {/* Modules List */}
            <div className="space-y-3">
                {filteredModules.map(module => (
                    <ModuleCard
                        key={module.id}
                        module={module}
                        isCompleted={progress.completed.includes(module.id)}
                        isFavorite={progress.favorites.includes(module.id)}
                        stageColor={stage.color}
                        onClick={() => navigate(`/guias/${stageId}/${module.id}`)}
                        onToggleFavorite={(e) => handleToggleFavorite(module.id, e)}
                    />
                ))}

                {filteredModules.length === 0 && (
                    <div className="text-center py-12 bg-white dark:bg-surface-dark rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                        <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">
                            {filter === 'favorites' ? 'star_outline' : filter === 'completed' ? 'task_alt' : 'check_circle'}
                        </span>
                        <p className="text-gray-500">
                            {filter === 'favorites' && 'Aún no tienes módulos favoritos'}
                            {filter === 'completed' && 'Aún no has completado módulos'}
                            {filter === 'pending' && '¡Completaste todos los módulos!'}
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default GuideDetail;
