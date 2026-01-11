// InteractiveChecklist Component - Saveable checklist items
import React from 'react';
import { ChecklistItem } from '../types/guidesTypes';

interface InteractiveChecklistProps {
    items: ChecklistItem[];
    checkedItems: Record<string, boolean>;
    onToggle: (itemId: string) => void;
    stageColor: string;
}

const InteractiveChecklist: React.FC<InteractiveChecklistProps> = ({
    items,
    checkedItems,
    onToggle,
    stageColor
}) => {
    // Group items by category
    const groupedItems = items.reduce((acc, item) => {
        const category = item.category || 'General';
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
    }, {} as Record<string, ChecklistItem[]>);

    const completedCount = Object.values(checkedItems).filter(Boolean).length;
    const totalCount = items.length;
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div className="bg-gray-50 dark:bg-background-dark rounded-2xl p-5">
            {/* Header with Progress */}
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-[#121716] dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined" style={{ color: stageColor }}>checklist</span>
                    Checklist
                </h4>
                <span className="text-sm font-bold" style={{ color: stageColor }}>
                    {completedCount}/{totalCount}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-6">
                <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%`, backgroundColor: stageColor }}
                />
            </div>

            {/* Grouped Checklist Items */}
            <div className="space-y-6">
                {(Object.entries(groupedItems) as [string, ChecklistItem[]][]).map(([category, categoryItems]) => (
                    <div key={category}>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{category}</p>
                        <div className="space-y-2">
                            {categoryItems.map(item => {
                                const isChecked = checkedItems[item.id] || false;
                                return (
                                    <label
                                        key={item.id}
                                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${isChecked ? 'bg-green-50 dark:bg-green-900/20' : 'bg-white dark:bg-surface-dark hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => onToggle(item.id)}
                                            className="sr-only"
                                        />
                                        <div
                                            className={`size-6 rounded-lg border-2 flex items-center justify-center transition-all ${isChecked ? 'border-green-500 bg-green-500' : 'border-gray-300 dark:border-gray-600'}`}
                                        >
                                            {isChecked && (
                                                <span className="material-symbols-outlined text-white text-sm">check</span>
                                            )}
                                        </div>
                                        <span className={`text-sm ${isChecked ? 'line-through text-gray-400' : 'text-[#121716] dark:text-white'}`}>
                                            {item.text}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Success message when complete */}
            {percentage === 100 && (
                <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center gap-2 text-green-700 dark:text-green-400">
                    <span className="material-symbols-outlined icon-filled">celebration</span>
                    <span className="text-sm font-bold">¡Completaste toda la lista!</span>
                </div>
            )}
        </div>
    );
};

export default InteractiveChecklist;
