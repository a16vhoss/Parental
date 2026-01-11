
import React from 'react';

interface LandingPageProps {
  onEnterApp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  return (
    <div className="w-full">
      <nav className="sticky top-0 z-50 w-full bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <span className="material-symbols-outlined icon-filled" style={{ fontSize: '24px' }}>family_star</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-black tracking-tighter text-text-main dark:text-white leading-none">The Baby Care Box</h1>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted dark:text-gray-400">Guía Digital</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a className="text-sm font-semibold text-text-main dark:text-gray-200 hover:text-primary transition-colors" href="/#features">Funciones</a>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={onEnterApp} className="h-10 px-5 flex items-center justify-center rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-colors shadow-lg shadow-primary/20">
                Acceso Plataforma
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative w-full py-12 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto">
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm dark:shadow-none border border-gray-100 dark:border-gray-800 relative">
          <div className="grid lg:grid-cols-2 gap-0 min-h-[560px]">
            <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-start z-10 relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>verified</span>
                PLATAFORMA DIGITAL
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-6 text-text-main dark:text-white">
                Bienvenido a <span className="text-primary">The Baby Care Box</span>.
              </h2>
              <p className="text-lg text-text-muted dark:text-gray-300 mb-8 max-w-md leading-relaxed">
                Optimiza el cuidado y seguridad de tu familia con nuestra plataforma diseñada para la crianza moderna.
              </p>
              <div className="flex flex-wrap gap-4 w-full sm:w-auto">
                <button onClick={onEnterApp} className="h-12 px-8 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-base transition-all shadow-xl shadow-primary/25 flex items-center gap-2 w-full sm:w-auto justify-center">
                  Comenzar Registro
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
            <div className="relative w-full h-64 lg:h-auto overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-surface-light dark:from-surface-dark to-transparent z-10 lg:block hidden"></div>
              <img
                alt="Familia feliz"
                className="w-full h-full object-cover object-center scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSRn7e8swh8lEf6NbBcWQMttFPcpxQ2JgqV93p5W983a4QTIofQFY6hsm8Wt5G0iTvtUsGUS9cMCXum2QVR6dAVmU7jO6mEiQpbVLVFESXFrrWRSeZ8JJ1Fej1EG_EcgezwWM8tvKXqgExShMtupF4QUh8kwZ444g0SK4an3z-3QZ2eUYEFFwXwXRzOWWPbn6S5xYp7JEOjami-AyZKnmRpiM5bpJx0eqh4ObBbh_VZEggCL2P-yQ9i79-HbuYwR7CRcLT5VwQUqs"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto w-full">
        <h2 className="text-3xl font-black tracking-tight text-text-main dark:text-white mb-12 flex items-center gap-3">
          <span className="w-12 h-1 bg-primary rounded-full"></span>
          ¿Qué es The Baby Care Box?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all flex flex-col gap-4 group">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl w-fit group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>child_care</span>
            </div>
            <h3 className="text-xl font-bold text-text-main dark:text-white">Cuidado Familiar</h3>
            <p className="text-text-muted dark:text-gray-400 text-sm">Sistemas de seguimiento para el crecimiento y salud de tus hijos en tiempo real.</p>
          </div>
          <div id="directory" className="p-8 rounded-2xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all flex flex-col gap-4 group">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>hub</span>
            </div>
            <h3 className="text-xl font-bold text-text-main dark:text-white">Red de Apoyo</h3>
            <p className="text-text-muted dark:text-gray-400 text-sm">Conexión directa con un directorio verificado de especialistas y servicios de emergencia.</p>
          </div>
          <div id="security" className="p-8 rounded-2xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all flex flex-col gap-4 group">
            <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl w-fit group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>security</span>
            </div>
            <h3 className="text-xl font-bold text-text-main dark:text-white">Seguridad Total</h3>
            <p className="text-text-muted dark:text-gray-400 text-sm">Activación de protocolos de seguridad comunitaria y Alertas Amber locales de forma inmediata.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
