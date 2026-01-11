
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface SidebarProps {
  userName: string;
  currentPath: string;
}

const Sidebar: React.FC<SidebarProps> = ({ userName, currentPath }) => {
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', label: 'Panel de Control', icon: 'grid_view' },
    { icon: 'menu_book', label: 'Guías', path: '/guias' },
    { icon: 'emergency_home', label: 'Alertas', path: '/alertas-feed' },
    { icon: 'medical_services', label: 'Salud', path: '/salud' },
    { icon: 'health_and_safety', label: 'Directorio', path: '/directorio' },
    { icon: 'auto_stories', label: 'Blog', path: '/blog' },
    { icon: 'settings', label: 'Configuración', path: '/configuracion' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Helper to check if a path is active
  const isActive = (path: string) => {
    if (path === '/familia') {
      return currentPath.startsWith('/familia');
    }
    if (path === '/guias') {
      return currentPath.startsWith('/guias');
    }
    return currentPath === path;
  };

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen bg-white dark:bg-surface-dark border-r border-gray-100 dark:border-gray-700/50 p-6 justify-between flex-shrink-0 z-20 shadow-sm sticky top-0">
      <div className="flex flex-col gap-8">
        <Link to="/dashboard" className="flex items-center gap-3 px-2">
          <div className="bg-primary/10 p-2 rounded-xl">
            <span className="material-symbols-outlined text-primary text-3xl">family_star</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[#121716] dark:text-white text-xl font-black leading-none tracking-tight">parental</h1>
            <p className="text-[#678380] dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-1.5">Plataforma Digital</p>
          </div>
        </Link>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive(item.path)
                ? 'bg-background-light dark:bg-white/5 text-primary'
                : 'text-[#678380] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#121716] dark:hover:text-white'
                }`}
            >
              <span className={`material-symbols-outlined ${isActive(item.path) ? 'icon-filled' : ''} group-hover:scale-110 transition-transform`}>
                {item.icon}
              </span>
              <span className={`text-sm ${isActive(item.path) ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        <Link
          to="/alerta"
          className="relative overflow-hidden w-full group cursor-pointer rounded-xl bg-rose-500 hover:bg-rose-600 text-white p-4 transition-all shadow-lg shadow-rose-200 dark:shadow-none"
        >
          <div className="flex items-center justify-center gap-2 relative z-10">
            <span className="material-symbols-outlined animate-pulse">emergency_home</span>
            <span className="text-sm font-bold tracking-wide">ALERTA AMBER</span>
          </div>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </Link>

        <div className="flex items-center gap-3 px-2 pt-4 border-t border-gray-100 dark:border-gray-700/50">
          <Link
            to="/perfil"
            className={`flex items-center gap-3 flex-1 overflow-hidden p-2 rounded-xl transition-all hover:bg-gray-50 dark:hover:bg-white/5 ${currentPath === '/perfil' || currentPath === '/configuracion' ? 'bg-gray-50 dark:bg-white/5' : ''}`}
          >
            <div className="relative shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCP3Ue0DsunU4p0nyLgaEZAGA6SCqkAnWtoIMMAh2y2XW0o0JHfLmV2XXosN_0CxEhVZc5BM3ndwBy2ou0GkGgdomRI7Zb3ii8HqYbQqQ-xUKilmm--GTX9PHb87pgx9iK4KabtdUznolYJnuioIrSAj3PK2tSmIZMDYiWhXc5CmfIdrcPQ3zS_UH9TNjta7SKXVaucgOXWux1mb3QS0_ItfKXgAbBKZw7tNyU-oXWJa-Gj3_Ye42OELUzkqMFdv5YlTcroFASltTI"
                alt="Perfil"
                className="rounded-full h-10 w-10 ring-2 ring-white dark:ring-surface-dark shadow-sm object-cover"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-surface-dark rounded-full"></span>
            </div>
            <div className="flex flex-col text-left overflow-hidden">
              <p className="text-[#121716] dark:text-white text-sm font-bold truncate">{userName}</p>
              <p className="text-[10px] text-[#678380] dark:text-gray-400 uppercase font-bold tracking-tighter">Usuario</p>
            </div>
          </Link>
          <button onClick={handleLogout} className="text-[#678380] hover:text-[#121716] dark:text-gray-400 dark:hover:text-white transition-colors p-2">
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
