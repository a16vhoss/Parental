// ModuleCard Component - Individual module card with completion status and favorite
import React from 'react';
import { GuideModule } from '../types/guidesTypes';

interface ModuleCardProps {
    module: GuideModule;
    isCompleted: boolean;
    isFavorite: boolean;
    stageColor: string;
    onClick: () => void;
    onToggleFavorite: (e: React.MouseEvent) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
    module,
    isCompleted,
    isFavorite,
    stageColor,
    onClick,
    onToggleFavorite
}) => {
    return (
        <div
            onClick={onClick}
            className={`group relative bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-800 cursor-pointer ${isCompleted ? 'opacity-75' : ''}`}
        >
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                    className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${isCompleted ? 'bg-green-100 dark:bg-green-900/30' : ''}`}
                    style={{ backgroundColor: isCompleted ? undefined : `${stageColor}15` }}
                >
                    <span
                        className={`material-symbols-outlined text-xl ${isCompleted ? 'text-green-600 icon-filled' : ''}`}
                        style={{ color: isCompleted ? undefined : stageColor }}
                    >
                        {isCompleted ? 'check_circle' : module.icon}
                    </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h4 className={`font-bold text-[#121716] dark:text-white leading-tight ${isCompleted ? 'line-through text-gray-400' : ''}`}>
                                {module.title}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                                {module.description}
                            </p>
                        </div>

                        {/* Favorite Button */}
                        <button
                            onClick={onToggleFavorite}
                            className={`p-2 rounded-lg transition-colors shrink-0 ${isFavorite ? 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' : 'text-gray-300 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10'}`}
                        >
                            <span className={`material-symbols-outlined text-lg ${isFavorite ? 'icon-filled' : ''}`}>
                                star
                            </span>
                        </button>
                    </div>

                    {/* Priority Badge */}
                    {module.isPriority && !isCompleted && (
                        <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 bg-rose-50 dark:bg-rose-500/10 rounded-lg text-rose-600 text-[10px] font-bold uppercase tracking-wider">
                            <span className="material-symbols-outlined text-xs">priority_high</span>
                            Recomendado leer pronto
                        </div>
                    )}
                </div>
            </div>

            {/* Chevron on Hover */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-gray-300">chevron_right</span>
            </div>
        </div>
    );
};

export default ModuleCard;
