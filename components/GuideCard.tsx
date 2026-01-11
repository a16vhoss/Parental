// GuideCard Component - Displays a guide card with progress and applicable children
import React from 'react';
import { Stage, GuideWithChildren } from '../types/guidesTypes';

interface GuideCardProps {
    guide: GuideWithChildren;
    onClick: () => void;
    isNew?: boolean;
}

const GuideCard: React.FC<GuideCardProps> = ({ guide, onClick, isNew }) => {
    const { stage, applicableChildren, progress } = guide;

    return (
        <div
            onClick={onClick}
            className="group relative bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800 cursor-pointer overflow-hidden"
        >
            {/* Gradient Background */}
            <div
                className="absolute -top-12 -right-12 size-40 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20"
                style={{ backgroundColor: stage.color }}
            />

            {/* New Badge */}
            {isNew && (
                <div className="absolute top-4 right-4 px-2 py-1 bg-primary text-white text-[10px] font-black uppercase rounded-full animate-pulse">
                    Nueva
                </div>
            )}

            {/* Content */}
            <div className="relative z-10">
                {/* Icon & Title */}
                <div className="flex items-start gap-4 mb-4">
                    <div
                        className="size-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                        style={{ backgroundColor: stage.color }}
                    >
                        <span className="material-symbols-outlined text-2xl icon-filled">{stage.icon}</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-black text-[#121716] dark:text-white leading-tight">{stage.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{stage.description}</p>
                    </div>
                </div>

                {/* Applicable Children */}
                {applicableChildren.length > 0 && (
                    <div className="mb-4">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">Para:</p>
                        <div className="flex flex-wrap gap-2">
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
                    </div>
                )}

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">Progreso</span>
                        <span className="font-bold" style={{ color: stage.color }}>
                            {progress.completed}/{progress.total} módulos
                        </span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${progress.percentage}%`,
                                backgroundColor: stage.color
                            }}
                        />
                    </div>
                    {progress.percentage === 100 && (
                        <div className="flex items-center gap-1 text-xs font-bold text-green-600">
                            <span className="material-symbols-outlined text-sm icon-filled">check_circle</span>
                            ¡Completada!
                        </div>
                    )}
                </div>
            </div>

            {/* Chevron */}
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-gray-300">chevron_right</span>
            </div>
        </div>
    );
};

export default GuideCard;
