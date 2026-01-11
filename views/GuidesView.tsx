// GuidesView - Main view listing all guides relevant to user's children
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FamilyMember } from '../types';
import { STAGES, GuideWithChildren } from '../types/guidesTypes';
import { getModulesByStage } from '../data/guidesData';
import GuideCard from '../components/GuideCard';

interface GuidesViewProps {
    childrenList: FamilyMember[];
    onAddChild: () => void;
}

// Parse age string to months
const parseAgeToMonths = (ageStr: string, dob?: string): number => {
    // If we have DOB, calculate exactly
    if (dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
        return Math.max(0, months);
    }

    // Fallback to parsing age string
    const age = ageStr.toLowerCase();
    if (age.includes('mes')) {
        const match = age.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }
    if (age.includes('año')) {
        const match = age.match(/(\d+)/);
        return match ? parseInt(match[1]) * 12 : 12;
    }
    if (age === 'nuevo' || age === 'recién nacido') return 0;
    return 0;
};

// Supabase
import { supabase } from '../lib/supabase';

const GuidesView: React.FC<GuidesViewProps> = ({ childrenList, onAddChild }) => {
    const navigate = useNavigate();
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // State for progress data: Map of stageId -> { completed: number }
    const [progressMap, setProgressMap] = useState<Record<string, { completed: number }>>({});

    // Get children only (Hijo/a role)
    const children = childrenList.filter(m => m.role === 'Hijo/a');

    // Fetch all progress once
    useEffect(() => {
        const fetchProgress = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get counts of completed modules per stage
            const { data, error } = await supabase
                .from('user_guide_progress')
                .select('stage_id, module_id')
                .eq('user_id', user.id)
                .not('completed_at', 'is', null);

            if (error) {
                console.error('Error fetching progress:', error);
                return;
            }

            // Group by stage
            const newMap: Record<string, { completed: number }> = {};
            data?.forEach(row => {
                if (!newMap[row.stage_id]) newMap[row.stage_id] = { completed: 0 };
                newMap[row.stage_id].completed++;
            });
            setProgressMap(newMap);
        };
        fetchProgress();
    }, []);

    // Build guides with applicable children and progress
    const guidesWithData = useMemo((): GuideWithChildren[] => {
        return STAGES.map(stage => {
            const modules = getModulesByStage(stage.id);
            const stageProgress = progressMap[stage.id] || { completed: 0 };

            // Find children in this age range
            const applicableChildren = children
                .map(child => ({
                    id: child.id,
                    name: child.name.split(' ')[0],
                    ageMonths: parseAgeToMonths(child.age, child.vitals?.dob)
                }))
                .filter(c => c.ageMonths >= stage.minMonths && c.ageMonths < stage.maxMonths);

            return {
                stage,
                modules,
                applicableChildren,
                progress: {
                    completed: stageProgress.completed,
                    total: modules.length,
                    percentage: modules.length > 0 ? Math.round((stageProgress.completed / modules.length) * 100) : 0
                }
            };
        });
    }, [children, progressMap]);

    // Filter guides - prioritize those with applicable children
    const filteredGuides = useMemo(() => {
        let guides = guidesWithData;

        // If search query, search across all guides
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            guides = guides.filter(g =>
                g.stage.name.toLowerCase().includes(query) ||
                g.stage.description.toLowerCase().includes(query) ||
                g.modules.some(m => m.title.toLowerCase().includes(query))
            );
        }

        // Sort: guides with applicable children first
        return guides.sort((a, b) => {
            if (a.applicableChildren.length > 0 && b.applicableChildren.length === 0) return -1;
            if (a.applicableChildren.length === 0 && b.applicableChildren.length > 0) return 1;
            return a.stage.minMonths - b.stage.minMonths;
        });
    }, [guidesWithData, searchQuery, filterCategory]);

    const hasApplicableGuides = filteredGuides.some(g => g.applicableChildren.length > 0);

    return (
        <main className="flex-grow p-4 md:p-8 lg:px-12 max-w-[1200px] mx-auto w-full animate-in fade-in duration-500">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-4xl font-black text-text-main dark:text-white tracking-tight flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-4xl">menu_book</span>
                        Guías Parentales
                    </h1>
                    <p className="text-text-muted dark:text-gray-400 mt-2 text-lg">
                        Todo lo que necesitas saber para cuidar a tu bebé en cada etapa.
                    </p>
                </div>

                {/* Search */}
                <div className="relative max-w-xs w-full">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    <input
                        type="text"
                        placeholder="Buscar guías..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                    />
                </div>
            </header>

            {/* No Children Message */}
            {children.length === 0 && (
                <div className="bg-white dark:bg-surface-dark rounded-3xl p-10 text-center border border-dashed border-gray-200 dark:border-gray-700 mb-8">
                    <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-primary text-4xl">child_care</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#121716] dark:text-white mb-2">
                        Agrega a tus hijos para ver guías personalizadas
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        Las guías se personalizan según la edad de tus hijos. Agrega un hijo para ver las guías relevantes para su etapa de desarrollo.
                    </p>
                    <button
                        onClick={onAddChild}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
                    >
                        <span className="material-symbols-outlined">person_add</span>
                        Agregar Hijo
                    </button>
                </div>
            )}

            {/* Applicable Guides Section */}
            {hasApplicableGuides && (
                <section className="mb-10">
                    <h2 className="text-2xl font-black text-text-main dark:text-white mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">auto_awesome</span>
                        Para tus hijos
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredGuides
                            .filter(g => g.applicableChildren.length > 0)
                            .map(guide => (
                                <GuideCard
                                    key={guide.stage.id}
                                    guide={guide}
                                    onClick={() => navigate(`/guias/${guide.stage.id}`)}
                                />
                            ))}
                    </div>
                </section>
            )}

            {/* All Guides Section */}
            <section>
                <h2 className="text-2xl font-black text-text-main dark:text-white mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">library_books</span>
                    {hasApplicableGuides ? 'Otras etapas' : 'Todas las guías'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGuides
                        .filter(g => !hasApplicableGuides || g.applicableChildren.length === 0)
                        .map(guide => (
                            <GuideCard
                                key={guide.stage.id}
                                guide={guide}
                                onClick={() => navigate(`/guias/${guide.stage.id}`)}
                            />
                        ))}
                </div>

                {filteredGuides.length === 0 && searchQuery && (
                    <div className="text-center py-12 text-gray-500">
                        <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                        <p>No se encontraron guías para "{searchQuery}"</p>
                    </div>
                )}
            </section>
        </main>
    );
};

export default GuidesView;
