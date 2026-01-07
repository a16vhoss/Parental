
import React, { useState } from 'react';
// Changed Baby to FamilyMember to fix import error
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
  month: string;
  weight: number;
  height: number;
  percentile: number;
  heightPercent: number;
}

const ChildProfile: React.FC<ChildProfileProps> = ({ childId, childrenList, onUpdateChild, onBack }) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newHeight, setNewHeight] = useState('');

  // Datos de crecimiento predefinidos (mock)
  const growthHistory: Record<string, GrowthPoint[]> = {
    leo: [
      { month: 'Mes 1', weight: 3.8, height: 52, percentile: 50, heightPercent: 40 },
      { month: 'Mes 2', weight: 4.5, height: 56, percentile: 52, heightPercent: 50 },
      { month: 'Mes 3', weight: 5.2, height: 60, percentile: 55, heightPercent: 62 },
      { month: 'Mes 4', weight: 6.1, height: 64, percentile: 54, heightPercent: 70 },
      { month: 'Mes 5', weight: 7.0, height: 68, percentile: 58, heightPercent: 80 },
      { month: 'Hoy', weight: 8.5, height: 72, percentile: 62, heightPercent: 90 },
    ],
    sofia: [
      { month: 'Mes 1', weight: 3.5, height: 50, percentile: 45, heightPercent: 40 },
      { month: 'Mes 2', weight: 4.2, height: 54, percentile: 48, heightPercent: 50 },
      { month: 'Mes 3', weight: 4.9, height: 58, percentile: 50, heightPercent: 62 },
      { month: 'Mes 4', weight: 5.6, height: 62, percentile: 52, heightPercent: 70 },
      { month: 'Mes 5', weight: 6.4, height: 66, percentile: 53, heightPercent: 80 },
      { month: 'Hoy', weight: 14.0, height: 98, percentile: 65, heightPercent: 95 },
    ]
  };

  const child = childrenList.find(c => c.id === childId) || childrenList[0];
  // Added null safety when parsing vitals which are now optional
  const history = (childId && growthHistory[childId]) ? growthHistory[childId] : [
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

  const handleSaveMetrics = () => {
    if (!newWeight || !newHeight) return;
    
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
    <main className="flex-grow p-4 md:p-8 lg:px-12 max-w-[1400px] mx-auto w-full relative">
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
            onClick={() => setShowLogModal(true)}
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
                <p className="text-2xl font-bold text-primary">{child.vitals.weight?.replace('kg','') || '--'} <span className="text-sm font-normal text-gray-500">kg</span></p>
              </div>
              <div className="bg-background-light dark:bg-background-dark rounded-xl p-4 border border-gray-100 dark:border-gray-700 transition-transform hover:scale-[1.02]">
                <p className="text-gray-500 text-xs font-medium uppercase mb-1">Talla</p>
                <p className="text-2xl font-bold text-primary">{child.vitals.height?.replace('cm','') || '--'} <span className="text-sm font-normal text-gray-500">cm</span></p>
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
                  <div className="relative w-full h-full flex flex-col justify-end items-center group/bar">
                    <div 
                      style={{height: `${point.heightPercent}%`}} 
                      className={`w-full max-w-[40px] rounded-t-xl transition-all duration-700 ease-out cursor-pointer relative ${
                        hoveredPoint === i 
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
              <h3 className="text-xl font-bold text-[#121716] dark:text-white">Registrar Métricas</h3>
              <button onClick={() => setShowLogModal(false)} className="text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined">close</span></button>
            </div>
            
            <div className="space-y-4">
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
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ChildProfile;
