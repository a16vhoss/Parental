import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useEffect } from 'react';

// Added FamilyMember to fix import error
import { FamilyMember, FamilyRole } from '../types';
import FamilyTree from '../components/FamilyTree';
import { calculateAge } from '../utils/dateUtils';
import { getMemberIcon } from '../utils/memberUtils';
import GrowthChart from '../components/GrowthChart';
import { useLogger } from '../hooks/useLogger';

interface ChildProfileProps {
  childId: string | null;
  // Changed Baby[] to FamilyMember[]
  childrenList: FamilyMember[];
  currentUserId?: string;
  // Changed Baby to FamilyMember
  onUpdateChild: (child: FamilyMember) => void;
  onBack: () => void;
  onEditMember?: (member: FamilyMember) => void;
  onAddMember?: (role: FamilyRole) => void;
}

interface GrowthPoint {
  id?: string; // Added ID for editing
  date?: string; // Reference date for picker
  month: string; // Display string
  weight: number;
  height: number;
  percentile: number;
  heightPercent: number;
}


const ChildProfile: React.FC<ChildProfileProps> = ({ childId, childrenList, currentUserId, onUpdateChild, onBack, onEditMember, onAddMember }) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [growthLogs, setGrowthLogs] = useState<GrowthPoint[]>([]);
  /* eslint-enable @typescript-eslint/no-unused-vars */
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState<GrowthPoint | null>(null); // Track log being edited
  const [newWeight, setNewWeight] = useState('');
  const [newHeight, setNewHeight] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const navigate = useNavigate();
  const { logActivity } = useLogger();

  const child = childrenList.find(c => c.id === childId) || childrenList[0];

  // Check if current user is the creator (owner)
  const canEdit = child && (!child.created_by || child.created_by === currentUserId);

  const { label: dynamicAge } = calculateAge(child?.vitals?.dob);

  useEffect(() => {
    if (!childId) return;

    const fetchLogs = async () => {
      const { data } = await supabase
        .from('child_vitals_history')
        .select('*')
        .eq('child_id', childId)
        .order('recorded_at', { ascending: true });

      if (data && data.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedLogs = data.map((log: any) => ({
          id: log.id,
          date: log.recorded_at,
          month: new Date(log.recorded_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
          weight: Number(log.weight),
          height: Number(log.height),
          percentile: 50,
          heightPercent: Math.min((Number(log.height) / 120) * 100, 100)
        }));
        setGrowthLogs(mappedLogs);
      } else {
        setGrowthLogs([]);
      }
    };

    fetchLogs();
  }, [childId]);

  // Check for active alerts for this child
  const [activeAlertId, setActiveAlertId] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    if (childId) checkAlertStatus();
  }, [childId]);

  const checkAlertStatus = async () => {
    const { data } = await supabase
      .from('amber_alerts')
      .select('id')
      .eq('child_id', childId)
      .eq('status', 'active')
      .limit(1); // Removed .single() to avoid error if 0 rows

    if (data && data.length > 0) {
      setActiveAlertId(data[0].id);
    } else {
      setActiveAlertId(null);
    }
  };



  const handleSaveMeasurement = async () => {
    if (!childId || (!newWeight && !newHeight)) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const dateToSave = newDate || new Date().toISOString();

      const { data, error } = await supabase.from('child_vitals_history').insert({
        child_id: childId,
        weight: newWeight ? parseFloat(newWeight) : null,
        height: newHeight ? parseFloat(newHeight) : null,
        recorded_at: dateToSave,
        recorded_by: user.id
      }).select();

      if (error) throw error;

      // Update local state (growthLogs)
      if (data) {
        const newLog = data[0];
        const mappedLog: GrowthPoint = {
          id: newLog.id,
          date: newLog.recorded_at,
          month: new Date(newLog.recorded_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
          weight: Number(newLog.weight),
          height: Number(newLog.height),
          percentile: 50, // Placeholder
          heightPercent: Math.min((Number(newLog.height) / 120) * 100, 100)
        };

        setGrowthLogs(prev => [...prev, mappedLog].sort((a, b) => new Date(a.date || '').getTime() - new Date(b.date || '').getTime()));

        // Log activity
        await logActivity({
          actionType: 'HEALTH_LOG',
          description: `Registró medición: ${newWeight ? newWeight + 'kg' : ''} ${newHeight ? newHeight + 'cm' : ''}`,
          entityId: childId,
          entityType: 'child'
        });
      }

      setShowLogModal(false);
      setNewWeight('');
      setNewHeight('');
    } catch (err) {
      console.error("Error saving measurement:", err);
      alert("Error al guardar: " + (err as Error).message);
    }
  };

  const handleToggleAlert = async () => {
    // ... existing toggle alert logic
    if (activeAlertId) {
      // MARK AS FOUND -> Validate pin or just confirm
      if (window.confirm('¿Confirmas que el niño ha sido localizado? Esto desactivará la alerta inmediatamente.')) {
        setLoadingStatus(true);
        const { error } = await supabase
          .from('amber_alerts')
          .update({ status: 'resolved', resolved_at: new Date().toISOString() })
          .eq('id', activeAlertId);

        if (error) {
          alert(`Error al desactivar alerta: ${error.message} (${error.code})`);
        } else {
          setActiveAlertId(null);
          alert('¡Excelente noticia! La alerta ha sido desactivada.');
        }
        setLoadingStatus(false);
      }
    } else {
      // MARK AS LOST -> Redirect to EmergencyAlert
      navigate('/alerta', { state: { selectedChildId: childId } });
    }
  };

  const history = growthLogs.length > 0 ? growthLogs : [
    { month: 'Hoy', weight: parseFloat(child?.vitals?.weight || '0'), height: parseFloat(child?.vitals?.height || '0'), percentile: 50, heightPercent: 70 }
  ];

  const handleShare = async () => {
    const shareData = {
      title: `Perfil de ${child.name}`,
      text: `Mira el progreso de ${child.name} (${dynamicAge}) en Guía Parental.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error compartiendo:', err);
      }
    } else {
      alert('Perfil copiado al portapapeles (Simulado)');
    }
  };

  const handleOpenModal = (log?: GrowthPoint) => {
    if (log) {
      setSelectedLog(log);
      setNewWeight(log.weight.toString());
      setNewHeight(log.height.toString());
      setNewDate(log.date || new Date().toISOString().split('T')[0]);
    } else {
      setSelectedLog(null);
      setNewWeight('');
      setNewHeight('');
      setNewDate(new Date().toISOString().split('T')[0]);
    }
    setShowLogModal(true);
  };

  const handleDeleteLog = async () => {
    if (!selectedLog?.id) return;

    if (!confirm('¿Estás seguro de eliminar este registro?')) return;

    const { data, error } = await supabase.from('child_vitals_history').delete().eq('id', selectedLog.id).select();

    if (error) {
      console.error('Error deleting log:', error);
      alert('Error al eliminar el registro. Por favor intenta de nuevo.');
      return;
    }

    if (!data || data.length === 0) {
      alert('No se pudo eliminar el registro. Es posible que no tengas permisos.');
      return;
    }

    // Refresh local
    setGrowthLogs(prev => prev.filter(l => l.id !== selectedLog.id));
    setShowLogModal(false);
  };

  const handleSaveMetrics = async () => {
    if (!newWeight && !newHeight) return;
    const dateToSave = newDate || new Date().toISOString();

    if (childId) {
      if (selectedLog?.id) {
        // UPDATE
        await supabase.from('child_vitals_history').update({
          weight: newWeight ? parseFloat(newWeight) : null,
          height: newHeight ? parseFloat(newHeight) : null,
          recorded_at: dateToSave
        }).eq('id', selectedLog.id);

        // Update local
        setGrowthLogs(prev => prev.map(l => l.id === selectedLog.id ? {
          ...l,
          weight: Number(newWeight),
          height: Number(newHeight),
          date: dateToSave,
          month: new Date(dateToSave).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
          heightPercent: Math.min((Number(newHeight) / 120) * 100, 100)
        } : l));

      } else {
        // INSERT
        const { data: { user } } = await supabase.auth.getUser();

        const { data } = await supabase.from('child_vitals_history').insert([{
          child_id: childId,
          weight: newWeight ? parseFloat(newWeight) : null,
          height: newHeight ? parseFloat(newHeight) : null,
          recorded_at: dateToSave,
          recorded_by: user?.id
        }]).select();

        if (data) {
          const newLog = data[0];
          setGrowthLogs(prev => [...prev, {
            id: newLog.id,
            date: newLog.recorded_at,
            month: new Date(newLog.recorded_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
            weight: Number(newLog.weight),
            height: Number(newLog.height),
            percentile: 50,
            heightPercent: Math.min((Number(newLog.height) / 120) * 100, 100)
          }].sort((a, b) => new Date(a.date || '').getTime() - new Date(b.date || '').getTime()));

          // Log activity
          await logActivity({
            actionType: 'HEALTH_LOG',
            description: `Registró medición: ${newWeight ? newWeight + 'kg' : ''} ${newHeight ? newHeight + 'cm' : ''}`,
            entityId: childId,
            entityType: 'child'
          });
        }
      }
    }

    // 2. Update current vitals IF it's the latest date (logic verification needed, but for now update latest)
    // Simple logic: If we are adding/editing, we update the profile display to reflect this change if it's recent
    const updatedChild = {
      ...child,
      vitals: {
        ...child.vitals,
        weight: newWeight ? `${newWeight}kg` : child.vitals.weight,
        height: newHeight ? `${newHeight}cm` : child.vitals.height,
      },
      status: '📈 Métricas actualizadas'
    };

    onUpdateChild(updatedChild);
    setShowLogModal(false);
    setNewWeight('');
    setNewHeight('');
  };

  if (!child) return <div className="p-10">Niño no encontrado.</div>;

  return (
    <main className="flex-grow p-4 md:p-8 lg:px-12 pb-28 lg:pb-12 max-w-[1400px] mx-auto w-full relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Regresar al Círculo Familiar
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span>Mi Familia</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-primary font-medium">{child.name.split(' ')[0]}</span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-[#121716] dark:text-white">Perfil de {child.name.split(' ')[0]}</h1>
            {onEditMember && canEdit && (
              <button
                onClick={() => onEditMember(child)}
                className="p-1.5 bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-primary rounded-full transition-all"
                title="Editar perfil"
              >
                <span className="material-symbols-outlined text-lg">edit</span>
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-50 text-sm font-bold shadow-sm transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">share</span> Compartir
          </button>

          {canEdit && (
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 text-sm font-bold active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">add</span> Registro
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm relative overflow-hidden group border border-gray-100 dark:border-gray-800">
            <div className={`absolute top-0 left-0 w-full h-24 bg-gradient-to-r ${child.vitals.sex === 'Male' ? 'from-blue-500/10 to-primary/20' : 'from-primary/10 to-accent-peach/20'}`}></div>
            <div className="relative flex flex-col items-center mt-4 text-center">

              {/* STATUS TOGGLE BUTTON */}
              {canEdit && (
                <button
                  onClick={handleToggleAlert}
                  disabled={loadingStatus}
                  className={`mb-6 px-6 py-2 rounded-full font-bold text-sm shadow-lg transform transition-all active:scale-95 flex items-center gap-2 ${activeAlertId
                    ? 'bg-green-500 text-white hover:bg-green-600 animate-pulse'
                    : 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-100'
                    }`}
                >
                  {activeAlertId ? (
                    <>
                      <span className="material-symbols-outlined">check_circle</span>
                      MARCAR COMO ENCONTRADO
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">warning</span>
                      MARCAR COMO DESAPARECIDO
                    </>
                  )}
                </button>
              )}

              {child.avatar ? (
                <img
                  src={child.avatar}
                  alt={child.name}
                  className="h-32 w-32 rounded-full border-4 border-white dark:border-surface-dark shadow-md object-cover transition-transform group-hover:scale-105 duration-500"
                />
              ) : (
                <div className="h-32 w-32 rounded-full border-4 border-white dark:border-surface-dark shadow-md bg-gray-100 dark:bg-white/5 flex items-center justify-center transition-transform group-hover:scale-105 duration-500">
                  <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600">{getMemberIcon(child)}</span>
                </div>
              )}
              <h2 className="text-2xl font-bold mt-4 text-[#121716] dark:text-white">{child.name}</h2>
              <p className="text-[#678380] dark:text-gray-400 font-medium">{dynamicAge}</p>
              <div className="mt-3 inline-flex items-center px-3 py-1 bg-primary/10 rounded-full text-xs font-bold text-primary animate-pulse-slow">
                {child.status}
              </div>
            </div>
          </div>

          {/* MI HISTORIA SECTION */}
          {child.vitals.birthWeight && (
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4"></div>
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-[#121716] dark:text-white relative z-10">
                <span className="material-symbols-outlined text-primary">auto_stories</span> Mi Historia
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed italic relative z-10">
                "Mi nombre es <span className="font-bold text-primary">{child.name.split(' ')[0]}</span>.
                Nací el <span className="font-bold">
                  {child.vitals.dob ? (() => {
                    // Manual parsing to avoid timezone issues
                    const parts = child.vitals.dob.split('-');
                    if (parts.length === 3) {
                      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
                    }
                    return new Date(child.vitals.dob).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
                  })() : '...'}
                </span>,
                pesando <span className="font-bold">{child.vitals.birthWeight} kg</span> y midiendo <span className="font-bold">{child.vitals.birthHeight} cm</span>.
                Mi tipo de sangre es <span className="font-bold">{child.vitals.bloodGroup}</span>.
                Nací en la ciudad de <span className="font-bold">{child.vitals.birthCity || '...'}</span> del país de <span className="font-bold">{child.vitals.birthCountry || '...'}</span>."
              </p>
            </div>
          )}



          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">

            <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-[#121716] dark:text-white">
              <span className="material-symbols-outlined text-primary">ecg_heart</span> Signos Vitales
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background-light dark:bg-background-dark rounded-xl p-4 border border-gray-100 dark:border-gray-700 transition-transform hover:scale-[1.02]">
                <p className="text-gray-500 text-xs font-medium uppercase mb-1">Peso</p>
                {/* Added null safety for weight and height display */}
                <p className="text-2xl font-bold text-primary">{child.vitals.weight?.replace('kg', '') || '--'} <span className="text-sm font-normal text-gray-500">kg</span></p>
              </div>
              <div className="bg-background-light dark:bg-background-dark rounded-xl p-4 border border-gray-100 dark:border-gray-700 transition-transform hover:scale-[1.02]">
                <p className="text-gray-500 text-xs font-medium uppercase mb-1">Talla</p>
                <p className="text-2xl font-bold text-primary">{child.vitals.height?.replace('cm', '') || '--'} <span className="text-sm font-normal text-gray-500">cm</span></p>
              </div>
              <div className="bg-background-light dark:bg-background-dark rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                <p className="text-gray-500 text-xs font-medium uppercase mb-1">Sangre</p>
                <p className="text-2xl font-bold text-[#121716] dark:text-white">{child.vitals.bloodGroup}</p>
              </div>
              <div className="bg-background-light dark:bg-background-dark rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                <p className="text-gray-500 text-xs font-medium uppercase mb-1">Sexo</p>
                <p className="text-xl font-bold text-[#121716] dark:text-white">{child.vitals.sex === 'Male' ? 'Masculino' : 'Femenino'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex flex-col gap-8">
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-lg text-[#121716] dark:text-white mb-4">Curva de Peso</h3>
              <GrowthChart
                data={growthLogs.filter(v => v.weight).map(v => ({ date: v.date!, weight: v.weight }))}
                type="weight"
                color="#10b981"
              />
            </div>

            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-lg text-[#121716] dark:text-white mb-4">Curva de Talla</h3>
              <GrowthChart
                data={growthLogs.filter(v => v.height).map(v => ({ date: v.date!, height: v.height }))}
                type="height"
                color="#3b82f6"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-bold mb-8 text-[#121716] dark:text-white">Hitos de Desarrollo</h3>
            <div className="space-y-8 relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100 dark:bg-gray-800"></div>

              <div className="flex gap-6 group relative">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white shrink-0 z-10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${child.vitals.sex === 'Male' ? 'bg-blue-400 group-hover:shadow-blue-400/20' : 'bg-accent-peach group-hover:shadow-accent-peach/20'}`}>
                  <span className="material-symbols-outlined">{getMemberIcon(child)}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg dark:text-white transition-colors group-hover:text-primary">Recién nacido</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Primeros días en casa. Adaptándose a los horarios y reconociendo voces.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAMILY TREE SECTION (Moved) */}
          <div className="mb-6">
            {/* Using full width here since it is in the main column now */}
            <FamilyTree
              members={childrenList}
              onAddMember={(role) => onAddMember && onAddMember(role)}
              onEditMember={(member) => onEditMember && onEditMember(member)}
              currentUserId={currentUserId}
            />
          </div>
        </div>
      </div>

      {/* MODAL DE REGISTRO */}
      {showLogModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#121716] dark:text-white">
                {selectedLog ? 'Editar Registro' : 'Registrar Métricas'}
              </h3>
              <button onClick={() => setShowLogModal(false)} className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined">close</span></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Fecha</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-background-dark border-none rounded-xl focus:ring-2 focus:ring-primary text-[#121716] dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nuevo Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="Ej. 8.7"
                  className="w-full p-3 bg-gray-50 dark:bg-background-dark border-none rounded-xl focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nueva Talla (cm)</label>
                <input
                  type="number"
                  value={newHeight}
                  onChange={(e) => setNewHeight(e.target.value)}
                  placeholder="Ej. 74"
                  className="w-full p-3 bg-gray-50 dark:bg-background-dark border-none rounded-xl focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              {selectedLog && (
                <button
                  onClick={handleDeleteLog}
                  className="px-4 py-3 bg-red-100 text-red-600 font-bold rounded-xl hover:bg-red-200 transition-colors"
                  title="Eliminar"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              )}
              <button
                onClick={() => setShowLogModal(false)}
                className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveMetrics}
                className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
              >
                {selectedLog ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ChildProfile;
