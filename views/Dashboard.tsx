
import React, { useState, useMemo } from 'react';
// Changed Baby to FamilyMember to fix import error
import { FamilyMember } from '../types';
import { getMemberIcon } from '../utils/memberUtils';

interface DashboardProps {
  userName: string;
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

const Dashboard: React.FC<DashboardProps> = ({ userName, childrenList, onViewProfile, onAddChild }) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [readArticles, setReadArticles] = useState<Set<string>>(new Set());
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  // States for new buttons
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

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

  // Filtrar guías relevantes basadas en la lista de hijos Y la búsqueda
  const relevantGuides = useMemo(() => {
    let guides = ALL_GUIDES;

    // Filter by child age
    if (childrenList.length > 0) {
      const childrenMonths = childrenList.map(c => parseAgeToMonths(c.age));
      guides = guides.filter(guide => {
        return childrenMonths.some(months => months >= guide.minAgeMonths && months <= guide.maxAgeMonths);
      });
    } else {
      guides = guides.slice(0, 2);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      guides = ALL_GUIDES.filter(g =>
        g.title.toLowerCase().includes(query) ||
        g.description.toLowerCase().includes(query) ||
        g.category.toLowerCase().includes(query)
      );
    }

    return guides;
  }, [childrenList, searchQuery]);

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

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10 pb-28 lg:pb-10 w-full scroll-smooth bg-background-light dark:bg-background-dark" onClick={() => setShowNotifications(false)}>
      <div className="max-w-[800px] mx-auto flex flex-col gap-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative">
          <div className="flex flex-col gap-2 w-full">
            <p className="text-[#678380] dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}
            </p>

            {isSearchOpen ? (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="relative flex-1 max-w-md">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Buscar guías, consejos..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-surface-dark border-none shadow-sm focus:ring-2 focus:ring-primary/50 outline-none text-[#121716] dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  )}
                </div>
                <button
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"
                >
                  <span className="text-xs font-bold">Cancelar</span>
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-[#121716] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.02em]">
                  Buenos días, <span className="text-primary">{userName}</span>
                </h1>
                <p className="text-[#678380] dark:text-gray-300 text-base font-normal">Aquí tienes el resumen familiar de hoy.</p>
              </>
            )}
          </div>

          <div className="hidden md:flex gap-2 relative">
            <button
              onClick={(e) => { e.stopPropagation(); setIsSearchOpen(!isSearchOpen); }}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all ${isSearchOpen ? 'bg-primary text-white' : 'bg-white dark:bg-surface-dark text-[#121716] dark:text-white'}`}
            >
              <span className="material-symbols-outlined">search</span>
            </button>

            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); }}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all relative ${showNotifications ? 'bg-primary/10 text-primary' : 'bg-white dark:bg-surface-dark text-[#121716] dark:text-white'}`}
              >
                <span className={`material-symbols-outlined ${showNotifications ? 'icon-filled' : ''}`}>notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-bold text-[#121716] dark:text-white">Notificaciones</h3>
                    <span className="text-xs text-primary font-bold cursor-pointer">Marcar leídas</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {[
                      { icon: 'vaccines', color: 'text-blue-500', title: 'Vacuna Próxima', desc: 'Refuerzo de 6 meses para Santi mañana.', time: 'Hace 2h' },
                      { icon: 'auto_awesome', color: 'text-purple-500', title: 'Nuevo Consejo IA', desc: 'Blog: "Cómo manejar los terribles 2".', time: 'Hace 5h' },
                      { icon: 'event', color: 'text-orange-500', title: 'Cita Pediatra', desc: 'Recordatorio: Dr. Martínez el Jueves.', time: 'Ayer' },
                    ].map((topic, i) => (
                      <div key={i} className="p-4 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer border-b border-gray-50 dark:border-gray-800 last:border-0 flex gap-3">
                        <div className={`w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${topic.color}`}>
                          <span className="material-symbols-outlined text-lg">{topic.icon}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-[#121716] dark:text-white leading-tight">{topic.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{topic.desc}</p>
                          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{topic.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-white/5 text-center">
                    <button className="text-xs font-bold text-gray-500 hover:text-primary transition-colors">Ver todas</button>
                  </div>
                </div>
              )}
            </div>
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
            {childrenList.map(child => {
              const hasAvatar = child.avatar && !child.avatar.includes('unsplash') && !child.avatar.includes('default');
              const memberIcon = getMemberIcon(child);

              return (
                <div
                  key={child.id}
                  onClick={() => onViewProfile(child.id)}
                  className="snap-start min-w-[280px] flex-1 bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 rounded-2xl p-5 flex items-center gap-5 relative overflow-hidden group hover:shadow-md transition-all cursor-pointer"
                >
                  {hasAvatar ? (
                    <img src={child.avatar} alt={child.name} className="rounded-full w-16 h-16 shadow-inner ring-4 ring-gray-50 dark:ring-gray-700 z-10 object-cover" />
                  ) : (
                    <div className="rounded-full w-16 h-16 shadow-inner ring-4 ring-gray-50 dark:ring-gray-700 z-10 bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl text-primary">{memberIcon}</span>
                    </div>
                  )}
                  <div className="flex flex-col z-10">
                    <h3 className="text-[#121716] dark:text-white text-lg font-bold">{child.name.split(' ')[0]}</h3>
                    <p className="text-[#678380] dark:text-gray-300 text-sm mb-2">{child.age}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-lg bg-primary/10 dark:bg-primary/5 text-xs font-bold text-primary w-max">
                      {child.status}
                    </span>
                  </div>
                </div>
              );
            })}
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
              const isBookmarked = bookmarked.has(guide.id);

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
                        <button
                          onClick={(e) => toggleBookmark(guide.id, e)}
                          title={isBookmarked ? "Quitar de guardados" : "Guardar para después"}
                          className={`p-2 rounded-lg transition-colors flex items-center justify-center ${isBookmarked ? 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                        >
                          <span className={`material-symbols-outlined text-[22px] ${isBookmarked ? 'icon-filled' : ''}`}>
                            {isBookmarked ? 'bookmark' : 'bookmark_add'}
                          </span>
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
