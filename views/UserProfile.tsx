
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface UserProfileProps {
  userName: string;
  userEmail: string;
  userAvatar?: string | null;
  joinedAt?: string;
  onNavigateToSettings: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  userName,
  userEmail,
  userAvatar,
  joinedAt,
  onNavigateToSettings
}) => {
  // Format joined date (e.g., "Octubre 2023")
  const formattedJoinDate = joinedAt ? new Date(joinedAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) : 'recientemente';
  const displayJoinDate = formattedJoinDate.charAt(0).toUpperCase() + formattedJoinDate.slice(1);

  // State for form fields
  const [fullName, setFullName] = useState(userName);
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Initialize state when props change
  useEffect(() => {
    setFullName(userName);
    // Note: Phone and Location are not currently passed in props but we can fetch them or pass them if stored in metadata
    // For now, we'll just handle local state updates
  }, [userName]);

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          phone: phone,
          location: location
        }
      });

      if (error) throw error;
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);

      // Reload page to reflect changes if necessary, or rely on App.tsx session listener
      window.location.reload();

    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Default fallback avatar if none provided
  const avatarSrc = userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`;

  return (
    <main className="flex-grow p-4 md:p-8 lg:px-12 max-w-[1000px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#121716] dark:text-white tracking-tight">Mi Cuenta</h1>
          <p className="text-[#678380] dark:text-gray-400 mt-1">Gestiona tu información personal y preferencias de seguridad.</p>
        </div>
        <button
          onClick={onNavigateToSettings}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-sm font-bold shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
          Configuración
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="relative mb-4">
              <img
                src={avatarSrc}
                alt={userName}
                className="h-32 w-32 rounded-full border-4 border-white dark:border-surface-dark shadow-md object-cover"
              />
              <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </button>
            </div>
            <h2 className="text-xl font-bold text-[#121716] dark:text-white">{userName}</h2>
            <p className="text-sm text-[#678380] dark:text-gray-400">Miembro desde {displayJoinDate}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
              <span className="material-symbols-outlined text-sm">verified_user</span> Usuario Verificado
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">Estadísticas</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[#678380]">Miembros registrados</span>
                <span className="font-bold text-primary">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[#678380]">Alertas apoyadas</span>
                <span className="font-bold text-primary">14</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[#678380]">Reseñas en directorio</span>
                <span className="font-bold text-primary">8</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <section className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
            {message && (
              <div className={`mb-4 p-3 rounded-lg text-sm font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                <span className="material-symbols-outlined text-lg">
                  {message.type === 'success' ? 'check_circle' : 'error'}
                </span>
                {message.text}
              </div>
            )}

            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">person</span> Información Personal
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Nombre Completo</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-background-dark border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Correo Electrónico</label>
                <input
                  type="email"
                  value={userEmail}
                  disabled
                  className="w-full bg-gray-50 dark:bg-background-dark border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-primary opacity-60 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Teléfono</label>
                <input
                  type="tel"
                  placeholder="+52 (000) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-background-dark border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Ubicación Actual</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ej. Ciudad de México"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-background-dark border-none rounded-xl p-3 pl-10 text-sm font-medium focus:ring-2 focus:ring-primary"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-xl">location_on</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="mt-8 bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </section>

          <section className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">notifications_active</span> Preferencias de Notificación
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-background-dark rounded-xl">
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-[#121716] dark:text-white">Alertas Comunitarias</span>
                  <span className="text-xs text-[#678380]">Recibe avisos de niños extraviados en tu zona</span>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-background-dark rounded-xl">
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-[#121716] dark:text-white">Recordatorios de Salud</span>
                  <span className="text-xs text-[#678380]">Citas médicas y calendario de vacunación</span>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default UserProfile;
