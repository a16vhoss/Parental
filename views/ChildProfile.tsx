import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useEffect } from 'react';

// Added FamilyMember to fix import error
import { FamilyMember } from '../types';

interface ChildProfileProps {
  childId: string | null;
  // Changed Baby[] to FamilyMember[]
  childrenList: FamilyMember[];
  // Changed Baby to FamilyMember
  onUpdateChild: (child: FamilyMember) => void;
  onBack: () => void;
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

const ChildProfile: React.FC<ChildProfileProps> = ({ childId, childrenList, onUpdateChild, onBack }) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [growthLogs, setGrowthLogs] = useState<GrowthPoint[]>([]);
  /* eslint-enable @typescript-eslint/no-unused-vars */
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState<GrowthPoint | null>(null); // Track log being edited
  const [newWeight, setNewWeight] = useState('');
  const [newHeight, setNewHeight] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]); // Default to today

  // Datos de crecimiento predefinidos (mock)


  const child = childrenList.find(c => c.id === childId) || childrenList[0];

  useEffect(() => {
    if (!childId) return;

    const fetchLogs = async () => {
      const { data } = await supabase
        .from('growth_logs')
        .select('*')
        .eq('member_id', childId)
        .order('date', { ascending: true });

      if (data && data.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedLogs = data.map((log: any) => ({
          id: log.id,
          date: log.date,
          month: new Date(log.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
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

  const history = growthLogs.length > 0 ? growthLogs : [
    { month: 'Hoy', weight: parseFloat(child?.vitals?.weight || '0'), height: parseFloat(child?.vitals?.height || '0'), percentile: 50, heightPercent: 70 }
  ];

  const handleShare = async () => {
    const shareData = {
      title: `Perfil de ${child.name}`,
      text: `Mira el progreso de ${child.name} (${child.age}) en Guía Parental.`,
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

    await supabase.from('growth_logs').delete().eq('id', selectedLog.id);

    // Refresh local
    setGrowthLogs(prev => prev.filter(l => l.id !== selectedLog.id));
    setShowLogModal(false);
  };

  const handleSaveMetrics = async () => {
    if (!newWeight || !newHeight || !newDate) return;

    if (childId) {
      if (selectedLog?.id) {
        // UPDATE
        await supabase.from('growth_logs').update({
          weight: newWeight,
          height: newHeight,
          date: newDate
        }).eq('id', selectedLog.id);

        // Update local
        setGrowthLogs(prev => prev.map(l => l.id === selectedLog.id ? {
          ...l,
          weight: Number(newWeight),
          height: Number(newHeight),
          date: newDate,
          month: new Date(newDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
          heightPercent: Math.min((Number(newHeight) / 120) * 100, 100)
        } : l));

      } else {
        // INSERT
        const { data } = await supabase.from('growth_logs').insert([{
          member_id: childId,
          weight: newWeight,
          height: newHeight,
          date: newDate
        }]).select();

        if (data) {
          const newLog = data[0];
          setGrowthLogs(prev => [...prev, {
            id: newLog.id,
            date: newLog.date,
            month: new Date(newLog.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
            weight: Number(newLog.weight),
            height: Number(newLog.height),
            percentile: 50,
            heightPercent: Math.min((Number(newLog.height) / 120) * 100, 100)
          }].sort((a, b) => new Date(a.date || '').getTime() - new Date(b.date || '').getTime()));
        }
      }
    }

    // 2. Update current vitals IF it's the latest date (logic verification needed, but for now update latest)
    // Simple logic: If we are adding/editing, we update the profile display to reflect this change if it's recent
    const updatedChild = {
      ...child,
      vitals: {
        ...child.vitals,
        weight: `${newWeight}kg`,
        height: `${newHeight}cm`,
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
          <h1 className="text-3xl font-bold text-[#121716] dark:text-white">Perfil de {child.name.split(' ')[0]}</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-50 text-sm font-bold shadow-sm transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">share</span> Compartir
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 text-sm font-bold active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add</span> Registro
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm relative overflow-hidden group border border-gray-100 dark:border-gray-800">
            <div className={`absolute top-0 left-0 w-full h-24 bg-gradient-to-r ${child.vitals.sex === 'Male' ? 'from-blue-500/10 to-primary/20' : 'from-primary/10 to-accent-peach/20'}`}></div>
            <div className="relative flex flex-col items-center mt-4 text-center">
              <img
                src={child.avatar}
                alt={child.name}
                className="h-32 w-32 rounded-full border-4 border-white dark:border-surface-dark shadow-md object-cover transition-transform group-hover:scale-105 duration-500"
              />
              <h2 className="text-2xl font-bold mt-4 text-[#121716] dark:text-white">{child.name}</h2>
              <p className="text-[#678380] dark:text-gray-400 font-medium">{child.age}</p>
              <div className="mt-3 inline-flex items-center px-3 py-1 bg-primary/10 rounded-full text-xs font-bold text-primary animate-pulse-slow">
                {child.status}
              </div>
            </div>
          </div>

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
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 relative">
            <h3 className="text-lg font-bold mb-6 text-[#121716] dark:text-white">Seguimiento de Crecimiento</h3>

            <div className="h-64 w-full relative flex items-end justify-between px-2 gap-4 border-b border-gray-50 dark:border-gray-800/50 pb-2">
              {history.map((point, i) => (
                <div
                  key={i}
                  className="flex-1 group relative flex flex-col items-center h-full justify-end"
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Tooltip con animación de subida sutil */}
                  <div className={`absolute bottom-full mb-6 w-40 bg-white dark:bg-surface-dark border border-primary/20 p-3 rounded-xl shadow-2xl z-50 transition-all duration-300 transform origin-bottom ${hoveredPoint === i ? 'opacity-100 scale-100 -translate-y-2' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'}`}>
                    <div className="flex flex-col gap-1 text-xs">
                      <p className="font-black text-primary uppercase mb-1 border-b border-gray-50 dark:border-gray-800 pb-1">{point.month}</p>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Peso:</span>
                        <span className="font-bold text-[#121716] dark:text-white">{point.weight} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Talla:</span>
                        <span className="font-bold text-[#121716] dark:text-white">{point.height} cm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Percentil:</span>
                        <span className="font-bold text-primary">{point.percentile}%</span>
                      </div>
                    </div>
                    <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 bg-white dark:bg-surface-dark border-r border-b border-primary/20 rotate-45"></div>
                  </div>

                  {/* Barra interactiva con efecto de "punto" marcador */}
                  <div
                    className="relative w-full h-full flex flex-col justify-end items-center group/bar"
                    onClick={() => handleOpenModal(point)} // Make bar clickable
                  >
                    <div
                      style={{ height: `${point.heightPercent}%` }}
                      className={`w-full max-w-[40px] rounded-t-xl transition-all duration-700 ease-out cursor-pointer relative ${hoveredPoint === i
                        ? 'bg-primary scale-x-110 -translate-y-1 shadow-[0_-10px_20px_-5px_rgba(42,157,144,0.4)]'
                        : (i === history.length - 1 ? 'bg-primary opacity-90' : 'bg-primary/20 dark:bg-primary/10 hover:bg-primary/40')
                        }`}
                    >
                      {/* El "Punto" del gráfico que aparece al hacer hover */}
                      <div className={`absolute -top-1 left-1/2 -translate-x-1/2 size-3 rounded-full border-2 border-white dark:border-surface-dark bg-primary shadow-md transition-all duration-300 ${hoveredPoint === i ? 'scale-125 opacity-100 -translate-y-1' : 'scale-50 opacity-0 group-hover/bar:opacity-100 group-hover/bar:scale-100'}`}></div>
                    </div>
                  </div>

                  <span className={`mt-4 text-[10px] font-bold transition-all duration-300 ${hoveredPoint === i ? 'text-primary scale-110' : 'text-gray-400'}`}>
                    {point.month}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-6">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-primary"></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Peso/Talla</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-primary/20"></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Histórico</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-bold mb-8 text-[#121716] dark:text-white">Hitos de Desarrollo</h3>
            <div className="space-y-8 relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100 dark:bg-gray-800"></div>

              <div className="flex gap-6 group relative">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white shrink-0 z-10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${child.vitals.sex === 'Male' ? 'bg-blue-400 group-hover:shadow-blue-400/20' : 'bg-accent-peach group-hover:shadow-accent-peach/20'}`}>
                  <span className="material-symbols-outlined">dentistry</span>
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
