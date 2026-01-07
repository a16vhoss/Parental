
import React, { useState } from 'react';

interface EmergencyAlertProps {
  onCancel: () => void;
}

const EmergencyAlert: React.FC<EmergencyAlertProps> = ({ onCancel }) => {
  const [pin, setPin] = useState(['', '', '', '']);

  const handlePinChange = (val: string, index: number) => {
    const newPin = [...pin];
    newPin[index] = val.slice(0, 1);
    setPin(newPin);
    if (val && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <main className="flex-grow flex flex-col items-center py-6 px-4 md:px-8 lg:px-20 bg-background-light dark:bg-background-dark min-h-screen">
      <div className="w-full max-w-[1100px] flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-red-500 animate-pulse">emergency_home</span>
              <p className="text-red-600 font-bold text-xs uppercase tracking-widest">Protocolo de Emergencia</p>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#121716] dark:text-white tracking-tight">Activar Alerta de Comunidad</h1>
            <p className="text-[#678380] dark:text-gray-400 mt-2 max-w-xl">
              Esta acción notificará inmediatamente a otros padres verificados en su zona.
            </p>
          </div>
          <button onClick={onCancel} className="h-10 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-[#1a2a2d] dark:text-white rounded-xl font-bold transition-colors">Salir</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white dark:bg-[#253336] rounded-xl p-6 shadow-sm border-l-4 border-primary">
              <h3 className="font-bold text-lg flex items-center gap-2 text-primary mb-4">
                <span className="material-symbols-outlined fill-current">check_circle</span> Niño Seleccionado
              </h3>
              <div className="flex items-center gap-4 bg-[#f4f6f3] dark:bg-[#1a2a2d] p-3 rounded-lg">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtDHTlOeQgRs5mZhuaVrTjY6wWX3kCTW5K-odG6OGTL-ocsN7q1FQlR3tz0MK-A6GfLsrkolqeW-sCybbmPq3XKxlbOy8V9F7J5qgIRA2f6aCW093X4Tn1cDlzMP94NPYTeODuOHHK9OP6A1_lwuB2EpBhp-Im-Qn65CaLkyVq5bXNPiD0ZFLM3_KRR6MLGF8ohylzqLY_ilD6yisZ5xlqfPvJqpgSoITgAuJknUdOcQEU4KDOrs8uVL6JYocxCeBXkx3sd1pDuIY" className="h-16 w-16 rounded-full object-cover" alt="Sofia" />
                <div>
                  <p className="font-bold text-lg dark:text-white">Sofia (3 años)</p>
                  <p className="text-sm text-[#678380]">Pelo castaño, vestía suéter amarillo.</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#253336] rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h3 className="font-bold text-xl mb-1">Última Ubicación Conocida</h3>
                <p className="text-sm text-[#678380]">Arrastra el marcador a la ubicación exacta.</p>
              </div>
              <div className="h-64 bg-gray-200 relative">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC81DM0SVsq5KeTtdY4wYzolIw0Z9aoz1FA-R5Pjm_lV6_alAlkAizs4ORVPaGTRM9ETr2rN5b1vxYQZ38J_zas0-8ViTTN_dHo5pKcUoM0ypjuXCz2TFqeJSVqu5KOegD1MqpaZly2RxGFjrqR925G3EmKDO7HSUieT1oeIrdGbPEmeAxRXx4kNI9hKql-TPhN79VjVqTBxEx720i3zbxeqhzTvDCvYPvM_l4L86_eJW_tHruYbKdU_R_stLuaG45hDaoI6kInlHc" className="w-full h-full object-cover grayscale opacity-50" alt="Map" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-600 text-5xl animate-bounce">location_on</span>
                </div>
              </div>
              <div className="p-6 grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold">Hora</label>
                  <input type="time" defaultValue="14:30" className="bg-[#f4f6f3] dark:bg-[#1a2a2d] border-none rounded-lg p-3" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold">Radio (Km)</label>
                  <input type="range" min="1" max="10" className="h-2 bg-gray-200 rounded-lg accent-primary" />
                </div>
              </div>
            </div>

            <div className="bg-accent-peach/20 border border-accent-peach rounded-xl p-6">
              <h3 className="font-bold text-xl mb-4">Verificación de Seguridad</h3>
              <div className="flex gap-2">
                {pin.map((p, i) => (
                  <input 
                    key={i}
                    id={`pin-${i}`}
                    type="password" 
                    value={p}
                    onChange={(e) => handlePinChange(e.target.value, i)}
                    className="w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 border-primary bg-white dark:bg-[#1a2a2d]" 
                  />
                ))}
              </div>
              <button className="w-full mt-6 bg-rose-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-rose-700 transition-all shadow-lg">
                <span className="material-symbols-outlined">campaign</span> ACTIVAR ALERTA AHORA
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#253336] rounded-xl p-6 shadow-sm">
              <h4 className="font-bold mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary">local_police</span> Autoridades</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100">
                  <span className="font-bold">Emergencias (911)</span>
                  <span className="material-symbols-outlined text-red-600">call</span>
                </div>
              </div>
            </div>
            <div className="bg-[#f4f6f3] dark:bg-[#1a2a2d] rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-[#678380] leading-relaxed">
                <strong>Importante:</strong> Guía Parental es una red de apoyo comunitario. Para activación oficial de Alerta Amber nacional, contacte a la Fiscalía.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EmergencyAlert;
