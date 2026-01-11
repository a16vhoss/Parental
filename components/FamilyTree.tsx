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
                className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 transition-all group relative bg-gray-50 dark:bg-white/5"
            >
                <span className="material-symbols-outlined text-gray-300 group-hover:text-primary text-xl">add</span>
                <span className="absolute -bottom-6 text-[10px] text-gray-400 font-medium uppercase tracking-wide">{rolePlaceholder}</span>
            </button>
        );
    }

    return (
        <div
            onClick={() => onEditMember(member)}
            className="flex flex-col items-center group cursor-pointer relative z-10"
        >
            <div className="relative">
                <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white dark:border-surface-dark shadow-lg object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute bottom-0 right-0 bg-white dark:bg-surface-dark rounded-full p-1.5 shadow-sm border border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                    <span className="material-symbols-outlined text-primary text-sm block">edit</span>
                </div>
            </div>
            <div className="mt-3 text-center bg-white dark:bg-surface-dark px-4 py-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[100px]">{member.name.split(' ')[0]}</p>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">{member.role}</p>
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
        <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 overflow-x-auto">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-10 text-[#121716] dark:text-white sticky left-0">
                <span className="material-symbols-outlined text-primary">diversity_2</span> Árbol Familiar
            </h3>

            <div className="min-w-[500px] flex flex-col items-center relative py-4">

                {/* Connector Lines Logic - Simplified for 3 levels */}

                {/* Generation 1: Grandparents */}
                <div className="flex justify-center gap-12 relative z-10">
                    {/* Ensure at least 2 slots for grandparents visually, filling with existing or placeholders */}
                    <div className="flex gap-6">
                        {grandparents.length > 0 ? (
                            grandparents.map(gp => <NodeCard key={gp.id} member={gp} rolePlaceholder="Abuelo/a" onAddMember={onAddMember} onEditMember={onEditMember} />)
                        ) : (
                            <>
                                <NodeCard rolePlaceholder="Abuela" onAddMember={onAddMember} onEditMember={onEditMember} />
                                <NodeCard rolePlaceholder="Abuelo" onAddMember={onAddMember} onEditMember={onEditMember} />
                            </>
                        )}
                        {/* Always allow adding more if existing are displayed, but maybe limit visually? For now just append add button if < 4 */}
                        {grandparents.length > 0 && grandparents.length < 4 && (
                            <NodeCard rolePlaceholder="Abuelo/a" onAddMember={onAddMember} onEditMember={onEditMember} />
                        )}
                    </div>
                </div>

                {/* Vertical Line 1 -> 2 */}
                <div className="h-10 w-px bg-gray-200 dark:bg-gray-700 my-2"></div>

                {/* Generation 2: Parents */}
                <div className="flex justify-center gap-12 relative z-10">
                    {parents.length > 0 ? (
                        parents.map(p => <NodeCard key={p.id} member={p} rolePlaceholder="Padre/Madre" onAddMember={onAddMember} onEditMember={onEditMember} />)
                    ) : (
                        <>
                            <NodeCard rolePlaceholder="Mamá" onAddMember={onAddMember} onEditMember={onEditMember} />
                            <NodeCard rolePlaceholder="Papá" onAddMember={onAddMember} onEditMember={onEditMember} />
                        </>
                    )}
                    {parents.length > 0 && parents.length < 2 && (
                        <NodeCard rolePlaceholder="Padre/Madre" onAddMember={onAddMember} onEditMember={onEditMember} />
                    )}
                </div>

                {/* Vertical Line 2 -> 3 */}
                <div className="h-10 w-px bg-gray-200 dark:bg-gray-700 my-2"></div>

                {/* Generation 3: Children */}
                <div className="relative pt-6 border-t border-gray-200 dark:border-gray-700 w-full max-w-md flex justify-center">
                    {/* Curved lines to children optional, keeping it simple for now */}
                    <div className="-mt-6 absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 border-x border-t border-gray-200 dark:border-gray-700 rounded-t-xl" style={{ display: children.length > 1 ? 'block' : 'none' }}></div>

                    <div className="flex justify-center gap-6 relative z-10">
                        {children.map(child => (
                            <NodeCard key={child.id} member={child} rolePlaceholder="Hijo/a" onAddMember={onAddMember} onEditMember={onEditMember} />
                        ))}
                        <NodeCard rolePlaceholder="Hermano/a" onAddMember={onAddMember} onEditMember={onEditMember} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FamilyTree;
