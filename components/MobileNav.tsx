import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MobileNav: React.FC = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const isActive = (path: string) => {
        if (path === '/familia') return currentPath.startsWith('/familia');
        return currentPath === path;
    };

    const navItems = [
        { path: '/dashboard', label: 'Inicio', icon: 'grid_view' },
        { path: '/directorio', label: 'Directorio', icon: 'health_and_safety' },
        { path: '/alerta', label: 'Alerta', icon: 'emergency_home', isSpecial: true },
        { path: '/blog', label: 'Blog', icon: 'auto_stories' },
        { path: '/configuracion', label: 'Ajustes', icon: 'settings' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 pb-safe lg:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    if (item.isSpecial) {
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="relative -top-5 flex flex-col items-center justify-center"
                            >
                                <div className="w-14 h-14 bg-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-200 dark:shadow-none animate-pulse-slow">
                                    <span className="material-symbols-outlined text-white text-2xl">emergency_home</span>
                                </div>
                                <span className="text-[10px] font-bold text-rose-500 mt-1 uppercase tracking-wider">Alerta</span>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${isActive(item.path)
                                    ? 'text-primary'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                        >
                            <span className={`material-symbols-outlined text-2xl mb-0.5 ${isActive(item.path) ? 'icon-filled' : ''}`}>
                                {item.icon}
                            </span>
                            <span className={`text-[10px] ${isActive(item.path) ? 'font-bold' : 'font-medium'}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileNav;
