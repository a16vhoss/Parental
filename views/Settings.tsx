
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

  // Family State
  const [familyCode, setFamilyCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [hasFamily, setHasFamily] = useState(false);
  const [isLoadingFamily, setIsLoadingFamily] = useState(false);
  const [familyMessage, setFamilyMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchFamilyStatus();
  }, []);

  const fetchFamilyStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Get Profile to see if linked to family
      let { data: profile } = await supabase
        .from('profiles')
        .select('family_id, role')
        .eq('id', user.id)
        .single();

      // If no profile exists yet (new implementation), create one
      if (!profile) {
        const { data: newProfile, error } = await supabase
          .from('profiles')
          .insert([{ id: user.id }])
          .select()
          .single();

        if (newProfile) profile = newProfile;
      }

      if (profile?.family_id) {
        // 2. Fetch Family Details
        const { data: family } = await supabase
          .from('families')
          .select('name, invite_code')
          .eq('id', profile.family_id)
          .single();

        if (family) {
          setHasFamily(true);
          setFamilyName(family.name);
          setFamilyCode(family.invite_code);
        }
      }
    } catch (error) {
      console.error('Error fetching family:', error);
    }
  };

  const generateInviteCode = () => {
    // Generate simple 6-char alphanumeric code
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateFamily = async () => {
    setIsLoadingFamily(true);
    setFamilyMessage(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const code = generateInviteCode();

      // 1. Create Family
      const { data: family, error: familyError } = await supabase
        .from('families')
        .insert([{
          name: `Familia de ${user.user_metadata?.full_name || 'Usuario'}`,
          invite_code: code,
          created_by: user.id
        }])
        .select()
        .single();

      if (familyError) throw familyError;

      // 2. Update Profile to link to family
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ family_id: family.id, role: 'admin' })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // 3. Update Family Members (optional migration: link orphan members to this family)
      // This step is tricky without "orphan" logic, but RLS will handle visibility.
      // Ideally we update any existing members created by this user to have this family_id
      await supabase
        .from('family_members')
        .update({ family_id: family.id })
        .eq('user_id', user.id)
        .is('family_id', null);

      setHasFamily(true);
      setFamilyName(family.name);
      setFamilyCode(family.invite_code);
      setFamilyMessage({ type: 'success', text: '¡Grupo familiar creado!' });

    } catch (err: any) {
      setFamilyMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoadingFamily(false);
    }
  };

  const handleJoinFamily = async () => {
    if (!joinCode) return;
    setIsLoadingFamily(true);
    setFamilyMessage(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      // 1. Find Family by Code
      const { data: family, error: findError } = await supabase
        .from('families')
        .select('id, name, invite_code')
        .eq('invite_code', joinCode.toUpperCase())
        .single();

      if (findError || !family) throw new Error('Código inválido o grupo no encontrado.');

      // 2. Update Profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ family_id: family.id, role: 'member' })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // 3. Update My Existing Family Members to this family ID (Merge)
      await supabase
        .from('family_members')
        .update({ family_id: family.id })
        .eq('user_id', user.id)
        .is('family_id', null);

      setHasFamily(true);
      setFamilyName(family.name);
      setFamilyCode(family.invite_code);
      setFamilyMessage({ type: 'success', text: `¡Te uniste a ${family.name}!` });

    } catch (err: any) {
      setFamilyMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoadingFamily(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(familyCode);
    alert('Código copiado al portapapeles');
  };

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

        <section className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-indigo-100 dark:border-indigo-900/30">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <span className="material-symbols-outlined">diversity_3</span>
            {language === 'es' ? 'Gestión Familiar' : 'Family Management'}
          </h3>

          {familyMessage && (
            <div className={`mb-4 p-3 rounded-lg text-sm font-bold ${familyMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {familyMessage.text}
            </div>
          )}

          {hasFamily ? (
            <div className="space-y-4">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl text-center">
                <p className="text-sm text-gray-500 uppercase font-bold mb-1">Perteneces a</p>
                <h4 className="text-xl font-black text-indigo-700 dark:text-indigo-300">{familyName}</h4>
              </div>

              <div className="bg-white dark:bg-background-dark border-2 border-dashed border-gray-300 dark:border-gray-700 p-4 rounded-xl flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Tu Código de Invitación</span>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-mono font-black tracking-widest text-[#121716] dark:text-white">{familyCode}</span>
                  <button onClick={copyCode} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                    <span className="material-symbols-outlined text-primary">content_copy</span>
                  </button>
                </div>
                <p className="text-xs text-center text-gray-400 mt-1">Comparte este código con tu pareja para sincronizar cuentas.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Vincula cuentas para compartir la información de tus hijos y alertas en tiempo real.
                </p>
                <button
                  onClick={handleCreateFamily}
                  disabled={isLoadingFamily}
                  className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none mb-4"
                >
                  {isLoadingFamily ? 'Creando...' : 'Crear Nueva Familia'}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-surface-dark text-gray-500">O únete a una existente</span>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Código (ej. AB12CD)"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="flex-1 bg-gray-50 dark:bg-background-dark border-none rounded-xl p-3 text-center font-mono uppercase tracking-widest focus:ring-2 focus:ring-indigo-500"
                  maxLength={6}
                />
                <button
                  onClick={handleJoinFamily}
                  disabled={isLoadingFamily || !joinCode}
                  className="bg-gray-900 dark:bg-white text-white dark:text-black font-bold px-6 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  Unirse
                </button>
              </div>
            </div>
          )}
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
