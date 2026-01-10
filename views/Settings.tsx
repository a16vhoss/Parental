
import React, { useState } from 'react';

interface SettingsProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onBack: () => void;
}

type MeasurementSystem = 'metric' | 'imperial';
type Language = 'es' | 'en';

const Settings: React.FC<SettingsProps> = ({ isDarkMode, onToggleDarkMode, onBack }) => {
  const [measurementSystem, setMeasurementSystem] = useState<MeasurementSystem>('metric');
  const [language, setLanguage] = useState<Language>('es');

  return (
    <main className="flex-grow p-4 md:p-8 lg:px-12 max-w-[800px] mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-[#678380] hover:text-[#121716] dark:hover:text-white transition-all shadow-sm"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-3xl font-black text-[#121716] dark:text-white tracking-tight">
            {language === 'es' ? 'Configuración' : 'Settings'}
          </h1>
          <p className="text-[#678380] dark:text-gray-400 mt-1">
            {language === 'es' ? 'Personaliza tu experiencia en la plataforma.' : 'Customize your platform experience.'}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <section className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">display_settings</span>
            {language === 'es' ? 'Apariencia' : 'Appearance'}
          </h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-background-dark rounded-xl">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${isDarkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-amber-100 text-amber-600'}`}>
                <span className="material-symbols-outlined">
                  {isDarkMode ? 'dark_mode' : 'light_mode'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-[#121716] dark:text-white">
                  {language === 'es' ? 'Modo Oscuro' : 'Dark Mode'}
                </span>
                <span className="text-xs text-[#678380]">
                  {language === 'es' ? 'Activa el tema oscuro para mayor comodidad visual' : 'Enable the dark theme for better visual comfort'}
                </span>
              </div>
            </div>
            <div className="relative inline-flex items-center cursor-pointer" onClick={onToggleDarkMode}>
              <div className={`w-14 h-7 rounded-full transition-colors duration-200 ${isDarkMode ? 'bg-primary' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 transform ${isDarkMode ? 'translate-x-7' : 'translate-x-0'}`}></div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">language</span>
            {language === 'es' ? 'Región y Preferencias' : 'Region and Preferences'}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-background-dark rounded-xl">
              <span className="text-sm font-bold text-[#121716] dark:text-white">
                {language === 'es' ? 'Idioma' : 'Language'}
              </span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent border-none text-sm font-medium focus:ring-0 text-primary cursor-pointer"
              >
                <option value="es">{language === 'es' ? 'Español (México)' : 'Spanish (Mexico)'}</option>
                <option value="en">{language === 'es' ? 'Inglés (EE. UU.)' : 'English (US)'}</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-background-dark rounded-xl">
              <span className="text-sm font-bold text-[#121716] dark:text-white">
                {language === 'es' ? 'Sistema de Medida' : 'Measurement System'}
              </span>
              <div className="flex bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
                <button
                  onClick={() => setMeasurementSystem('metric')}
                  className={`px-4 py-1.5 text-xs font-bold transition-all rounded-md ${measurementSystem === 'metric'
                      ? 'bg-white dark:bg-surface-dark shadow-sm text-primary'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  {language === 'es' ? 'Métrico' : 'Metric'}
                </button>
                <button
                  onClick={() => setMeasurementSystem('imperial')}
                  className={`px-4 py-1.5 text-xs font-bold transition-all rounded-md ${measurementSystem === 'imperial'
                      ? 'bg-white dark:bg-surface-dark shadow-sm text-primary'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  {language === 'es' ? 'Imperial' : 'Imperial'}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">security</span>
            {language === 'es' ? 'Privacidad' : 'Privacy'}
          </h3>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-background-dark rounded-xl group">
              <span className="text-sm font-bold text-[#121716] dark:text-white group-hover:text-primary transition-colors">
                {language === 'es' ? 'Verificar mi Identidad' : 'Verify my Identity'}
              </span>
              <span className="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-background-dark rounded-xl group text-rose-600">
              <span className="text-sm font-bold">
                {language === 'es' ? 'Eliminar mi cuenta' : 'Delete my account'}
              </span>
              <span className="material-symbols-outlined">delete_forever</span>
            </button>
          </div>
        </section>

        <section className="flex justify-end pt-4">
          <button
            onClick={() => alert(language === 'es' ? '¡Cambios guardados exitosamente!' : 'Changes saved successfully!')}
            className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            {language === 'es' ? 'Guardar Cambios' : 'Save Changes'}
          </button>
        </section>
      </div>
    </main>
  );
};

export default Settings;
