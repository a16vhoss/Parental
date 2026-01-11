import React from 'react';
import { FamilyMember } from '../types';

interface FamilyTreeProps {
    members: FamilyMember[];
    onAddMember: (role: 'Abuelo/a' | 'Padre/Madre' | 'Hijo/a') => void;
    onEditMember: (member: FamilyMember) => void;
}

const NodeCard = ({
    member,
    rolePlaceholder,
    onAddMember,
    onEditMember
}: {
    member?: FamilyMember;
    rolePlaceholder: string;
    onAddMember: (role: any) => void;
    onEditMember: (member: FamilyMember) => void;
}) => {
    if (!member) {
        return (
            <button
                onClick={() => onAddMember(rolePlaceholder)}
                className="flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5 transition-all group"
            >
                <span className="material-symbols-outlined text-gray-400 group-hover:text-primary text-2xl">add</span>
                <span className="text-xs text-gray-400 group-hover:text-primary font-medium mt-1">Agregar</span>
            </button>
        );
    }

    return (
        <div
            onClick={() => onEditMember(member)}
            className="flex flex-col items-center group cursor-pointer relative"
        >
            <div className="relative">
                <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white dark:border-surface-dark shadow-md object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute bottom-0 right-0 bg-white dark:bg-surface-dark rounded-full p-1 shadow-sm border border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-primary text-base block">edit</span>
                </div>
            </div>
            <div className="mt-2 text-center bg-white dark:bg-surface-dark px-3 py-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 z-10">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[120px]">{member.name.split(' ')[0]}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">{member.role}</p>
            </div>
        </div>
    );
};

const FamilyTree: React.FC<FamilyTreeProps> = ({ members, onAddMember, onEditMember }) => {
    // Group members by generation
    const grandparents = members.filter(m => m.role === 'Abuelo/a');
    const parents = members.filter(m => m.role === 'Padre/Madre');
    const children = members.filter(m => m.role === 'Hijo/a');

    return (
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 overflow-x-auto">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-8 text-[#121716] dark:text-white sticky left-0">
                <span className="material-symbols-outlined text-primary">diversity_2</span> Árbol Familiar
            </h3>

            <div className="min-w-[500px] flex flex-col items-center gap-12 relative">
                {/* Connector Lines Logic - Simplified for 3 levels */}

                {/* Generation 1: Grandparents */}
                <div className="flex justify-center gap-8 md:gap-16 relative z-10">
                    {/* Ensure at least 2 slots for grandparents visually, filling with existing or placeholders */}
                    <div className="flex gap-4">
                        {grandparents.length > 0 ? (
                            grandparents.map(gp => <NodeCard key={gp.id} member={gp} rolePlaceholder="Abuelo/a" onAddMember={onAddMember} onEditMember={onEditMember} />)
                        ) : (
                            <>
                                <NodeCard rolePlaceholder="Abuelo/a" onAddMember={onAddMember} onEditMember={onEditMember} />
                                <NodeCard rolePlaceholder="Abuelo/a" onAddMember={onAddMember} onEditMember={onEditMember} />
                            </>
                        )}
                        {/* Always allow adding more if existing are displayed, but maybe limit visually? For now just append add button if < 4 */}
                        {grandparents.length > 0 && grandparents.length < 4 && (
                            <NodeCard rolePlaceholder="Abuelo/a" onAddMember={onAddMember} onEditMember={onEditMember} />
                        )}
                    </div>
                </div>

                {/* Vertical Line 1 -> 2 */}
                {parents.length > 0 && (
                    <div className="absolute top-[100px] h-12 w-0.5 bg-gray-200 dark:bg-gray-700 -z-0"></div>
                )}

                {/* Generation 2: Parents */}
                <div className="flex justify-center gap-8 md:gap-16 relative z-10">
                    {parents.length > 0 ? (
                        parents.map(p => <NodeCard key={p.id} member={p} rolePlaceholder="Padre/Madre" onAddMember={onAddMember} onEditMember={onEditMember} />)
                    ) : (
                        <>
                            <NodeCard rolePlaceholder="Padre/Madre" onAddMember={onAddMember} onEditMember={onEditMember} />
                            <NodeCard rolePlaceholder="Padre/Madre" onAddMember={onAddMember} onEditMember={onEditMember} />
                        </>
                    )}
                    {parents.length > 0 && parents.length < 2 && (
                        <NodeCard rolePlaceholder="Padre/Madre" onAddMember={onAddMember} onEditMember={onEditMember} />
                    )}
                </div>

                {/* Vertical Line 2 -> 3 */}
                {children.length > 0 && (
                    <div className="absolute top-[280px] h-12 w-0.5 bg-gray-200 dark:bg-gray-700 -z-0"></div>
                )}

                {/* Generation 3: Children */}
                <div className="flex justify-center gap-6 relative z-10 pt-4 border-t-2 border-gray-100 dark:border-gray-800 border-dashed w-full max-w-2xl">
                    {children.map(child => (
                        <NodeCard key={child.id} member={child} rolePlaceholder="Hijo/a" onAddMember={onAddMember} onEditMember={onEditMember} />
                    ))}
                    <NodeCard rolePlaceholder="Hijo/a" onAddMember={onAddMember} onEditMember={onEditMember} />
                </div>
            </div>
        </div>
    );
};

export default FamilyTree;
