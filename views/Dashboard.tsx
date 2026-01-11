
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Changed Baby to FamilyMember to fix import error
import { FamilyMember } from '../types';
import { getMemberIcon } from '../utils/memberUtils';
import { supabase } from '../lib/supabase';


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
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [readArticles, setReadArticles] = useState<Set<string>>(new Set());
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  // States for new buttons
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [activeAlertChildIds, setActiveAlertChildIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchNotifications = async () => {
      // 1. Fetch Active Alerts
      // Try simple fetch first to avoid RLS issues on joins
      const { data: alerts, error } = await supabase
        .from('amber_alerts')
        .select('*') // No joins for notifications to be safe
        .eq('status', 'active')
        .limit(5);

      if (error) console.error('Error fetching dashboard alerts:', error);

      // Extract child IDs from active alerts
      if (alerts) {
        const childIds = new Set(alerts.map((a: any) => a.child_id as string));
        setActiveAlertChildIds(childIds);
      }

      const alertNotifs = alerts?.map(a => ({
        id: a.id,
        type: 'alert',
        title: 'ALERTA AMBER ACTIVA',
        desc: `Alerta activa. Revisa en 'Alertas' para más detalles.`,
        time: 'AHORA',
        icon: 'emergency_home',
        color: 'text-red-500 bg-red-50',
        link: `/alerta/detalles/${a.id}`
      })) || [];

      // 2. Mock Tips (Future: Real database notifications)
      const mockNotifs = [
        { id: 'vac-1', type: 'info', title: 'Recordatorio de Vacuna', desc: 'Revisar cartilla de vacunación.', time: 'Hoy', icon: 'vaccines', color: 'text-blue-500 bg-blue-50' },
        { id: 'tip-1', type: 'tip', title: 'Consejo del Día', desc: 'La hidratación es clave en días calurosos.', time: 'Hace 2h', icon: 'lightbulb', color: 'text-amber-500 bg-amber-50' }
      ];

      setNotifications([...alertNotifs, ...mockNotifs]);
      setUnreadCount(alertNotifs.length + 1); // Mock unread count
    };

    fetchNotifications();

    // Subscribe to new alerts
    const channel = supabase
      .channel('dashboard_notifs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'amber_alerts' }, payload => {
        fetchNotifications();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

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
        <header className="flex flex-row items-start md:items-end justify-between gap-4 relative">
          <div className="flex flex-col gap-2 w-full">
            <p className="hidden md:block text-[#678380] dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}
            </p>

            <>
              <h1 className="text-[#121716] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.02em]">
                Buenos días, <span className="text-primary">{userName}</span>
              </h1>
              <p className="text-[#678380] dark:text-gray-300 text-base font-normal">Aquí tienes el resumen familiar de hoy.</p>
            </>
          </div>

          <div className="flex bg-white dark:bg-surface-dark md:bg-transparent rounded-2xl p-2 md:p-0 shadow-sm md:shadow-none gap-2 relative">
            <button
              onClick={(e) => { e.stopPropagation(); navigate('/alertas-feed'); }}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all bg-white dark:bg-surface-dark text-red-500`}
            >
              <span className="material-symbols-outlined">warning</span>
            </button>

            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); }}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all relative ${showNotifications ? 'bg-primary/10 text-primary' : 'bg-white dark:bg-surface-dark text-[#121716] dark:text-white'}`}
              >
                <span className={`material-symbols-outlined ${showNotifications ? 'icon-filled' : ''}`}>notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white dark:border-surface-dark rounded-full animate-pulse"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                    <h3 className="font-bold text-[#121716] dark:text-white">Notificaciones</h3>
                    <button onClick={() => setUnreadCount(0)} className="text-xs text-primary font-bold hover:underline">Marcar leídas</button>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-400">
                        <span className="material-symbols-outlined text-3xl mb-2">notifications_off</span>
                        <p className="text-xs">Sin notificaciones nuevas</p>
                      </div>
                    ) : (
                      notifications.map((notif, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            if (notif.link) navigate(notif.link);
                            setShowNotifications(false);
                          }}
                          className={`p-4 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer border-b border-gray-50 dark:border-gray-800 last:border-0 flex gap-3 ${notif.type === 'alert' ? 'bg-red-50/30 dark:bg-red-900/10' : ''}`}
                        >
                          <div className={`w-10 h-10 rounded-full flex shrink-0 items-center justify-center ${notif.color} ${notif.type === 'alert' ? 'animate-pulse' : ''}`}>
                            <span className="material-symbols-outlined text-lg">{notif.icon}</span>
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-bold leading-tight ${notif.type === 'alert' ? 'text-red-600 dark:text-red-400' : 'text-[#121716] dark:text-white'}`}>{notif.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{notif.desc}</p>
                            <p className="text-[10px] text-gray-400 mt-1.5 uppercase tracking-wider font-medium">{notif.time}</p>
                          </div>
                        </div>
                      ))
                    )}
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

              // Check if this child has an active alert
              const hasActiveAlert = notifications.some(n => n.type === 'alert' && n.link?.includes(child.id));
              // Alternatively, if notifications doesn't carry child_id easily, we might need to rely on a separate specific list or the fact that notifications link usually contains the alert ID, not child ID directly. 
              // Better approach: filter the fetched 'alerts' data in useEffect to get child_ids. 
              // Since we don't have that state readily available in render scope without adding it, let's use a more robust check if we can, or just rely on 'status' if we update it?
              // Actually, best way: The 'notifications' state comes from 'alerts' fetch.
              // Let's rely on a specific prop or state.
              // For now, let's assume we can check against the alerts fetched.
              // We need to store activeAlertChildIds. 
              // Refactor step: I'll assume we add 'activeAlertChildIds' state loop below.

              const isMissing = activeAlertChildIds.has(child.id);

              return (
                <div
                  key={child.id}
                  onClick={() => onViewProfile(child.id)}
                  className={`snap-start min-w-[280px] flex-1 bg-white dark:bg-surface-dark border rounded-2xl p-5 flex items-center gap-5 relative overflow-hidden group hover:shadow-md transition-all cursor-pointer ${isMissing ? 'border-red-500 shadow-red-100 dark:shadow-none animate-pulse ring-2 ring-red-500 ring-offset-2 dark:ring-offset-background-dark' : 'border-gray-100 dark:border-gray-700'}`}
                >
                  {isMissing && (
                    <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-xl uppercase tracking-wider z-20">
                      Desaparecido
                    </div>
                  )}

                  {hasAvatar ? (
                    <img src={child.avatar} alt={child.name} className={`rounded-full w-16 h-16 shadow-inner ring-4 z-10 object-cover ${isMissing ? 'ring-red-100 dark:ring-red-900/50 grayscale' : 'ring-gray-50 dark:ring-gray-700'}`} />
                  ) : (
                    <div className={`rounded-full w-16 h-16 shadow-inner ring-4 z-10 flex items-center justify-center ${isMissing ? 'bg-red-100 ring-red-200 text-red-600' : 'bg-primary/10 ring-gray-50 dark:ring-gray-700'}`}>
                      <span className={`material-symbols-outlined text-3xl ${isMissing ? 'text-red-500' : 'text-primary'}`}>{isMissing ? 'person_alert' : memberIcon}</span>
                    </div>
                  )}
                  <div className="flex flex-col z-10">
                    <h3 className={`text-lg font-bold ${isMissing ? 'text-red-600' : 'text-[#121716] dark:text-white'}`}>{child.name.split(' ')[0]}</h3>
                    <p className="text-[#678380] dark:text-gray-300 text-sm mb-2">{child.age}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold w-max ${isMissing ? 'bg-red-600 text-white' : 'bg-primary/10 dark:bg-primary/5 text-primary'}`}>
                      {isMissing ? '🚨 ALERTA ACTIVA' : child.status}
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

        {/* Mobile Only: Blog Access */}
        <div
          onClick={() => navigate('/blog')}
          className="md:hidden bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700 rounded-2xl p-4 flex items-center justify-between shadow-sm cursor-pointer active:scale-95 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <span className="material-symbols-outlined">rss_feed</span>
            </div>
            <div>
              <h3 className="font-bold text-[#121716] dark:text-white">Blog Baby Care Box</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Novedades y artículos recientes</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-gray-400">chevron_right</span>
        </div>

        {/* Guides Section - Simple Link */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[#121716] dark:text-white text-2xl font-bold tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">menu_book</span>
              Guías Baby Care Box
            </h2>
          </div>

          <div
            onClick={() => navigate('/guias')}
            className="group bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-2xl p-6 border border-primary/20 hover:border-primary/40 cursor-pointer transition-all hover:shadow-lg relative overflow-hidden"
          >
            {/* Decorative gradient */}
            <div className="absolute -top-20 -right-20 size-40 rounded-full blur-3xl bg-primary/20 group-hover:opacity-50 transition-opacity" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="size-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shrink-0">
                <span className="material-symbols-outlined text-3xl icon-filled">auto_stories</span>
              </div>

              <div className="flex-1 w-full sm:w-auto">
                <h3 className="text-xl font-bold text-[#121716] dark:text-white mb-1">Explora nuestras guías</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  8 etapas de desarrollo con contenido especializado para cada fase de crecimiento de tu hijo.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-white dark:bg-surface-dark px-4 py-2 rounded-xl shadow group-hover:bg-primary group-hover:text-white transition-all w-full sm:w-auto justify-center sm:justify-start">
                <span className="text-sm font-bold">Abrir</span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>

            {/* Stats */}
            <div className="relative z-10 mt-5 pt-4 border-t border-primary/10 flex gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-primary text-lg">school</span>
                <span><b className="text-[#121716] dark:text-white">8</b> etapas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-primary text-lg">library_books</span>
                <span><b className="text-[#121716] dark:text-white">80</b> módulos</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-primary text-lg">checklist</span>
                <span>Checklists interactivos</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
