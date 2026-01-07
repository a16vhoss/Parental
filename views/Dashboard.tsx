
import React, { useState, useMemo } from 'react';
// Changed Baby to FamilyMember to fix import error
import { FamilyMember } from '../types';

interface DashboardProps {
  // Changed Baby[] to FamilyMember[]
  childrenList: FamilyMember[];
  onViewProfile: (id: string) => void;
  onAddChild: () => void;
}

interface GuideArticle {
  id: string;
  title: string;
  category: string;
  description: string;
  readTime: string;
  image: string;
  minAgeMonths: number;
  maxAgeMonths: number;
}

const ALL_GUIDES: GuideArticle[] = [
  {
    id: 'solids',
    title: '5 Consejos para iniciar sólidos sin estrés',
    category: 'Nutrición',
    description: 'La transición a alimentos sólidos es un hito importante. Aprende a identificar cuándo tu bebé está listo.',
    readTime: '5 min',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4ugh9mRAvdHCpT7jaNiVEkZjVrv0GkJwSosbqauzFJqwYgEZt8GjZykdSjxB0t7-wWcm6f0CjDoS9YqtIF8LJi3pZYlhF6qsi4Ey8GuCYxtL5WAw-S169hs4l25lRj4z4DKmdQpnTguYtX3PJ8qiCl0DK-Hu7P25hmMDspE4nVjZKDMkEO-rvNFo2q389-kBq4JMQC1dCrTOqRCKeEMLI1dCOUF6Y97A_J2vEJZaI1SIFgjwKeDN4SFjuCUZ6j9mTf3VYhHW0Pjg',
    minAgeMonths: 5,
    maxAgeMonths: 14
  },
  {
    id: 'sleep-0-12',
    title: 'Rutinas de sueño: Guía del primer año',
    category: 'Sueño',
    description: 'Establece hábitos saludables de sueño desde los primeros meses para un mejor descanso familiar.',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop',
    minAgeMonths: 0,
    maxAgeMonths: 12
  },
  {
    id: 'tantrums',
    title: 'Manejo de berrinches y emociones fuertes',
    category: 'Conducta',
    description: 'Estrategias de disciplina positiva para navegar la etapa de los 2 y 3 años con calma y empatía.',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1476703395618-500ec39bee31?q=80&w=800&auto=format&fit=crop',
    minAgeMonths: 18,
    maxAgeMonths: 48
  },
  {
    id: 'preschool-ready',
    title: '¿Listo para el preescolar? Checklist esencial',
    category: 'Educación',
    description: 'Todo lo que necesitas saber antes de que tu pequeño dé el gran paso hacia su primera escuela.',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=800&auto=format&fit=crop',
    minAgeMonths: 30,
    maxAgeMonths: 60
  }
];

const Dashboard: React.FC<DashboardProps> = ({ childrenList, onViewProfile, onAddChild }) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [readArticles, setReadArticles] = useState<Set<string>>(new Set());

  // Helper para convertir la cadena de edad a meses aproximados para la lógica de filtrado
  const parseAgeToMonths = (ageStr: string): number => {
    const age = ageStr.toLowerCase();
    if (age.includes('mes')) {
      const match = age.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    }
    if (age.includes('año')) {
      const match = age.match(/\d+/);
      return match ? parseInt(match[0]) * 12 : 12;
    }
    return 0;
  };

  // Filtrar guías relevantes basadas en la lista de hijos
  const relevantGuides = useMemo(() => {
    const childrenMonths = childrenList.map(c => parseAgeToMonths(c.age));
    
    // Si no hay hijos, mostrar todas las guías destacadas
    if (childrenMonths.length === 0) return ALL_GUIDES.slice(0, 2);

    return ALL_GUIDES.filter(guide => {
      return childrenMonths.some(months => months >= guide.minAgeMonths && months <= guide.maxAgeMonths);
    });
  }, [childrenList]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReadArticles(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10 w-full scroll-smooth bg-background-light dark:bg-background-dark">
      <div className="max-w-[800px] mx-auto flex flex-col gap-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-[#678380] dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}
            </p>
            <h1 className="text-[#121716] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.02em]">
              Buenos días, <span className="text-primary">Mariana</span>
            </h1>
            <p className="text-[#678380] dark:text-gray-300 text-base font-normal">Aquí tienes el resumen familiar de hoy.</p>
          </div>
          <div className="hidden md:flex gap-2">
            <button className="w-10 h-10 rounded-full bg-white dark:bg-surface-dark flex items-center justify-center text-[#121716] dark:text-white shadow-sm hover:shadow-md transition-all">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-white dark:bg-surface-dark flex items-center justify-center text-[#121716] dark:text-white shadow-sm hover:shadow-md transition-all relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
          </div>
        </header>

        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-[#121716] dark:text-white text-lg font-bold">Tus Hijos</h2>
            <button 
              onClick={onAddChild}
              className="text-primary text-sm font-bold hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Agregar
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
            {childrenList.map(child => (
              <div 
                key={child.id}
                onClick={() => onViewProfile(child.id)}
                className="snap-start min-w-[280px] flex-1 bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 rounded-2xl p-5 flex items-center gap-5 relative overflow-hidden group hover:shadow-md transition-all cursor-pointer"
              >
                <img src={child.avatar} alt={child.name} className="rounded-full w-16 h-16 shadow-inner ring-4 ring-gray-50 dark:ring-gray-700 z-10 object-cover" />
                <div className="flex flex-col z-10">
                  <h3 className="text-[#121716] dark:text-white text-lg font-bold">{child.name.split(' ')[0]}</h3>
                  <p className="text-[#678380] dark:text-gray-300 text-sm mb-2">{child.age}</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-lg bg-primary/10 dark:bg-primary/5 text-xs font-bold text-primary w-max">
                    {child.status}
                  </span>
                </div>
              </div>
            ))}
            <div 
              onClick={onAddChild}
              className="snap-start min-w-[200px] bg-dashed border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 group hover:border-primary/50 transition-all cursor-pointer opacity-70 hover:opacity-100"
            >
              <span className="material-symbols-outlined text-3xl text-gray-400 group-hover:text-primary group-hover:scale-110 transition-transform">add_circle</span>
              <p className="text-xs font-bold text-gray-500 group-hover:text-primary">Nuevo Miembro</p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[#121716] dark:text-white text-2xl font-bold tracking-tight">Personalizado para ti</h2>
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Guía del Día</p>
          </div>
          
          <div className="flex flex-col gap-4">
            {relevantGuides.map((guide) => {
              const isFav = favorites.has(guide.id);
              const isRead = readArticles.has(guide.id);

              return (
                <article 
                  key={guide.id} 
                  className={`bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700/50 flex flex-col md:flex-row gap-5 items-start relative ${isRead ? 'opacity-75 grayscale-[0.3]' : ''}`}
                >
                  <div className="w-full md:w-1/4 aspect-video md:aspect-square rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden relative group shrink-0">
                    <img 
                      src={guide.image}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      alt={guide.title}
                    />
                    <div className="absolute top-2 left-2 bg-white/90 dark:bg-black/60 backdrop-blur text-[10px] font-black uppercase px-2 py-1 rounded shadow-sm text-[#121716] dark:text-white">
                      {guide.category}
                    </div>
                    {isRead && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[1px]">
                        <span className="material-symbols-outlined text-white text-4xl icon-filled drop-shadow-md">check_circle</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-xl font-bold text-[#121716] dark:text-white leading-snug ${isRead ? 'line-through decoration-primary/50 text-gray-400' : ''}`}>
                        {guide.title}
                      </h3>
                    </div>
                    
                    <p className="text-[#678380] dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
                      {guide.description}
                    </p>
                    
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50 dark:border-gray-700/50">
                      <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1 uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">schedule</span> {guide.readTime} lectura
                      </span>
                      
                      <div className="flex gap-1">
                        <button 
                          onClick={(e) => toggleRead(guide.id, e)}
                          title={isRead ? "Marcar como no leído" : "Marcar como leído"}
                          className={`p-2 rounded-lg transition-colors flex items-center justify-center ${isRead ? 'text-primary bg-primary/10' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                        >
                          <span className={`material-symbols-outlined text-[22px] ${isRead ? 'icon-filled' : ''}`}>
                            {isRead ? 'visibility' : 'visibility_off'}
                          </span>
                        </button>
                        <button 
                          onClick={(e) => toggleFavorite(guide.id, e)}
                          title={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
                          className={`p-2 rounded-lg transition-colors flex items-center justify-center ${isFav ? 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                        >
                          <span className={`material-symbols-outlined text-[22px] ${isFav ? 'icon-filled' : ''}`}>
                            favorite
                          </span>
                        </button>
                        <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                          <span className="material-symbols-outlined text-[22px]">bookmark_add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}

            {relevantGuides.length === 0 && (
              <div className="py-12 text-center bg-white dark:bg-surface-dark rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                <span className="material-symbols-outlined text-5xl text-gray-300 mb-2">auto_stories</span>
                <p className="text-gray-500 font-bold">No hay guías específicas para esta etapa hoy.</p>
                <p className="text-sm text-gray-400">Pronto tendremos más contenido.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
