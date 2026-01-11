
import React from 'react';
import { FamilyMember, AppView } from '../types';
import { getMemberIcon } from '../utils/memberUtils';

interface FamilyViewProps {
  childrenList: FamilyMember[];
  onViewChild: (id: string) => void;
  onAddChild: () => void;
  onEditMember?: (member: FamilyMember) => void;
  onDeleteMember?: (id: string) => void;
}

const FamilyView: React.FC<FamilyViewProps> = ({ childrenList, onViewChild, onAddChild, onEditMember, onDeleteMember }) => {
  const children = childrenList.filter(m => m.role === 'Hijo/a');
  const others = childrenList.filter(m => m.role !== 'Hijo/a');

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que quieres eliminar este perfil?')) {
      onDeleteMember?.(id);
    }
  };

  const MemberCard = ({ member }: { member: FamilyMember }) => {
    const hasAvatar = member.avatar && !member.avatar.includes('unsplash') && !member.avatar.includes('default');
    const memberIcon = getMemberIcon(member);

    return (
      <div
        onClick={() => onViewChild(member.id)}
        className="group relative bg-white dark:bg-surface-dark rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800 cursor-pointer overflow-hidden"
      >
        {/* Delete button */}
        {onDeleteMember && (
          <button
            onClick={(e) => handleDelete(e, member.id)}
            className="absolute top-4 right-4 z-20 p-2 bg-red-100 hover:bg-red-500 text-red-500 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
            title="Eliminar"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        )}

        <div className={`absolute -top-12 -right-12 size-40 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${member.vitals?.sex === 'Male' ? 'bg-blue-500' : 'bg-rose-500'}`}></div>

        <div className="flex flex-col items-center text-center relative z-10">
          <div className="relative mb-6">
            {hasAvatar ? (
              <img
                src={member.avatar}
                alt={member.name}
                className="size-32 rounded-full object-cover ring-8 ring-gray-50 dark:ring-gray-800 shadow-xl transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="size-32 rounded-full ring-8 ring-gray-50 dark:ring-gray-800 shadow-xl bg-primary/10 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                <span className="material-symbols-outlined text-5xl text-primary">{memberIcon}</span>
              </div>
            )}
            <div className={`absolute bottom-1 right-1 size-8 rounded-full border-4 border-white dark:border-surface-dark flex items-center justify-center text-white text-xs ${member.vitals?.sex === 'Male' ? 'bg-blue-500' : 'bg-rose-500'}`}>
              <span className="material-symbols-outlined text-[16px]">
                {member.vitals?.sex === 'Male' ? 'male' : 'female'}
              </span>
            </div>
          </div>

          <h3 className="text-2xl font-black text-text-main dark:text-white mb-1 group-hover:text-primary transition-colors">{member.name}</h3>
          <p className="text-primary font-bold text-xs uppercase tracking-[0.2em] mb-1">{member.role}</p>
          <p className="text-text-muted dark:text-gray-400 font-bold text-sm uppercase tracking-widest mb-4">{member.age}</p>

          {member.role === 'Hijo/a' && (
            <div className="flex gap-2 mb-8">
              <span className="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-tighter">
                {member.vitals?.weight || '--'}
              </span>
              <span className="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-tighter">
                {member.vitals?.height || '--'}
              </span>
            </div>
          )}

          <div className="w-full grid grid-cols-2 gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); onEditMember?.(member); }}
              className="flex items-center justify-center gap-2 py-3 bg-gray-50 dark:bg-background-dark rounded-2xl text-xs font-bold hover:bg-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">edit</span> Editar
            </button>
            <button className="flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-2xl text-xs font-bold hover:bg-primary-dark transition-all shadow-md">
              Detalles
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="flex-grow p-4 md:p-8 lg:px-12 max-w-[1200px] mx-auto w-full animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-text-main dark:text-white tracking-tight">Círculo Familiar</h1>
          <p className="text-text-muted dark:text-gray-400 mt-2 text-lg">Tu red de apoyo y bienestar en un solo lugar.</p>
        </div>
        <button
          onClick={onAddChild}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white hover:bg-primary-dark transition-all font-bold shadow-lg shadow-primary/20 active:scale-95"
        >
          <span className="material-symbols-outlined">person_add</span>
          Agregar Miembro
        </button>
      </header>

      {/* Resumen Familiar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5">
          <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl icon-filled">family_star</span>
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Miembros</p>
            <p className="text-3xl font-black text-text-main dark:text-white">{childrenList.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5">
          <div className="size-14 rounded-2xl bg-accent-peach/20 flex items-center justify-center text-orange-600">
            <span className="material-symbols-outlined text-3xl icon-filled">home_health</span>
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Salud Grupal</p>
            <p className="text-lg font-bold text-text-main dark:text-white">Excelente</p>
          </div>
        </div>
        <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5">
          <div className="size-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
            <span className="material-symbols-outlined text-3xl icon-filled">calendar_month</span>
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Próximos Eventos</p>
            <p className="text-3xl font-black text-text-main dark:text-white">2</p>
          </div>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-black text-text-main dark:text-white mb-6 px-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">child_care</span> Nuestros Pequeños
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {children.map((child) => <MemberCard key={child.id} member={child} />)}
          <div
            onClick={onAddChild}
            className="bg-dashed border-4 border-dashed border-gray-200 dark:border-gray-800 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 group hover:border-primary/50 transition-all cursor-pointer min-h-[400px]"
          >
            <div className="size-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all group-hover:scale-110">
              <span className="material-symbols-outlined text-4xl">add</span>
            </div>
            <div className="text-center">
              <p className="text-lg font-black text-gray-400 group-hover:text-primary transition-colors">Nuevo Integrante</p>
              <p className="text-sm text-gray-400">Registra un familiar o cuidador</p>
            </div>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section>
          <h2 className="text-2xl font-black text-text-main dark:text-white mb-6 px-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">supervised_user_circle</span> Cuidadores y Familiares
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {others.map((member) => <MemberCard key={member.id} member={member} />)}
          </div>
        </section>
      )}

      <section className="mt-16 bg-white dark:bg-surface-dark rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
        <h3 className="text-xl font-black text-text-main dark:text-white mb-8">Bitácora de Seguridad</h3>
        <div className="space-y-6">
          {[
            { child: 'Mariana', action: 'Actualizó permisos de emergencia', time: 'Hoy, 9:00 AM', icon: 'security' },
            { child: 'Leo', action: 'Registro de alimentación por Abuela Rosa', time: 'Hace 1 hora', icon: 'restaurant' },
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-background-dark transition-colors group">
              <div className="size-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined">{activity.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-text-main dark:text-white">
                  <span className="text-primary">{activity.child}:</span> {activity.action}
                </p>
                <p className="text-xs text-text-muted dark:text-gray-500">{activity.time}</p>
              </div>
              <span className="material-symbols-outlined text-gray-300">verified</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default FamilyView;
