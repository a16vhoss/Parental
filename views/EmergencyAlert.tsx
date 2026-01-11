import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FamilyMember } from '../types';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useNavigate } from 'react-router-dom';

interface EmergencyAlertProps {
  onCancel: () => void;
}

const EmergencyAlert: React.FC<EmergencyAlertProps> = ({ onCancel }) => {
  // const [pin, setPin] = useState(['', '', '', '']); // Removed for speed
  const [children, setChildren] = useState<FamilyMember[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [radius, setRadius] = useState(5);
  const [description, setDescription] = useState('');
  const [clothing, setClothing] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChildren();
    getCurrentLocation();
  }, []);

  const fetchChildren = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get family members that are children
    const { data } = await supabase
      .from('family_members')
      .select('*')
      .eq('family_id', (await getUserFamilyId(user.id)))
      .eq('role', 'Hijo/a');

    if (data) {
      setChildren(data as FamilyMember[]);
      if (data.length > 0) setSelectedChildId(data[0].id);
    }
  };

  const getUserFamilyId = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('family_id').eq('id', userId).single();
    return data?.family_id;
  };

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsLoadingLocation(false);
      }, (error) => {
        console.error("Error getting location", error);
        setIsLoadingLocation(false);
        // Default to CDMX if error
        setLocation({ lat: 19.4326, lng: -99.1332 });
      });
    }
  };

  // Removed handlePinChange

  const selectedChild = children.find(c => c.id === selectedChildId);

  const handleActivate = async () => {
    try {
      if (!selectedChildId || !location) return alert('Datos incompletos');
      setIsActivating(true);

      // 1. Verify Authentication
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 2. Create Alert
      const { error } = await supabase.from('amber_alerts').insert({
        family_id: (await getUserFamilyId(user.id)),
        child_id: selectedChildId,
        created_by: user.id,
        status: 'active',
        latitude: location.lat,
        longitude: location.lng,
        radius_km: radius,
        last_seen_time: new Date().toISOString(),
        description: description,
        clothing_description: clothing
      });

      if (error) throw error;

      alert('ALERTA ACTIVADA. Se ha notificado a los usuarios cercanos.');
      onCancel(); // Close modal/view

    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsActivating(false);
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

            {/* Child Selector */}
            <div className="bg-white dark:bg-[#253336] rounded-xl p-6 shadow-sm border-l-4 border-primary">
              <h3 className="font-bold text-lg flex items-center gap-2 text-primary mb-4">
                <span className="material-symbols-outlined fill-current">check_circle</span> Niño Seleccionado
              </h3>

              {children.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {children.map(child => (
                    <button
                      key={child.id}
                      onClick={() => setSelectedChildId(child.id)}
                      className={`flex items-center gap-4 p-3 rounded-lg border-2 transition-all min-w-[250px] ${selectedChildId === child.id ? 'border-primary bg-primary/5' : 'border-transparent bg-[#f4f6f3] dark:bg-[#1a2a2d]'}`}
                    >
                      <img src={child.avatar || `https://ui-avatars.com/api/?name=${child.name}&background=random`} className="h-12 w-12 rounded-full object-cover" alt={child.name} />
                      <div className="text-left">
                        <p className="font-bold text-lg dark:text-white">{child.name}</p>
                        <p className="text-xs text-[#678380]">{child.age} • {child.vitals?.sex === 'Male' ? 'Niño' : 'Niña'}</p>
                      </div>
                      {selectedChildId === child.id && <span className="material-symbols-outlined text-primary ml-auto">check_circle</span>}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No tienes hijos registrados en tu perfil.</p>
              )}
            </div>

            {/* Details Form */}
            <div className="bg-white dark:bg-[#253336] rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <h3 className="font-bold text-xl mb-1">Detalles de la Desaparición</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold block mb-1">Descripción de Vestimenta</label>
                  <textarea
                    className="w-full bg-[#f4f6f3] dark:bg-[#1a2a2d] border-none rounded-lg p-3 h-24 text-sm"
                    placeholder="Camiseta roja, pantalones azules, zapatos blancos..."
                    value={clothing}
                    onChange={e => setClothing(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-bold block mb-1">Otras Señas Particulares</label>
                  <textarea
                    className="w-full bg-[#f4f6f3] dark:bg-[#1a2a2d] border-none rounded-lg p-3 h-24 text-sm"
                    placeholder="Cicatriz en la ceja, lleva mochila de Spiderman..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Location & Radius */}
            <div className="bg-white dark:bg-[#253336] rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 h-[500px] flex flex-col">
              <div className="p-6">
                <h3 className="font-bold text-xl mb-1">Última Ubicación y Radio</h3>
                <p className="text-sm text-[#678380]">
                  {isLoadingLocation ? 'Obteniendo ubicación...' : location ? `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}` : 'Ubicación no disponible'}
                </p>
              </div>

              {/* Interactive Google Map */}
              <div className="flex-grow bg-gray-200 relative">
                {location ? (
                  <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                    <Map
                      mapId="amber-alert-map"
                      defaultCenter={location}
                      defaultZoom={14}
                      gestureHandling={'greedy'}
                      disableDefaultUI={true}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <AdvancedMarker position={location}>
                        <div className="relative flex items-center justify-center">
                          <div className="w-6 h-6 bg-red-600 border-4 border-white rounded-full shadow-lg z-10 animate-bounce"></div>
                          <div className="absolute w-24 h-24 bg-red-500/20 rounded-full animate-ping"></div>
                          <div className="absolute w-48 h-48 bg-red-500/10 rounded-full animate-pulse"></div>
                        </div>
                      </AdvancedMarker>

                      {/* Radius Circle Visualization (Approximate) */}
                      {/* We can't draw a perfect Circle with AdvancedMarker easily without the Maps Circle object, 
                                but we can simulate the intent or leave the pin as the center. 
                                Ideally we would use the Circle component if available in the library or native API.
                                For now, the visual pulsing rings serve as a good "radius" indicator. 
                            */}
                    </Map>
                  </APIProvider>
                ) : (
                  <div className="absolute inset-0 bg-gray-100 dark:bg-[#1a2a2d] flex items-center justify-center text-gray-400">
                    {isLoadingLocation ? 'Cargando mapa...' : (
                      <button onClick={getCurrentLocation} className="text-primary font-bold">
                        Habilitar Ubicación
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col gap-2 bg-white dark:bg-[#253336] relative z-10">
                <div className="flex justify-between">
                  <label className="text-sm font-bold">Radio de Alerta: {radius} km</label>
                  <span className="text-xs text-gray-500">Máx: 20 km</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value))}
                  className="h-2 bg-gray-200 rounded-lg accent-primary w-full cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>1 km</span>
                  <span>10 km</span>
                  <span>20 km</span>
                </div>
              </div>
            </div>

            <div className="bg-accent-peach/20 border border-accent-peach rounded-xl p-6">
              <h3 className="font-bold text-xl mb-2 text-red-600">⚠ ALERTA INMEDIATA</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-6 font-medium">
                Al activar esta alerta, se enviará una notificación PUSH prioritaria a todos los usuarios en el radio seleccionado.
                <br /><br />
                <strong>Esta acción es irreversible y debe usarse SOLO en casos de emergencia real.</strong>
              </p>

              <button
                onClick={handleActivate}
                disabled={isActivating || !selectedChildId}
                className="w-full mt-2 bg-rose-600 text-white font-bold py-5 rounded-xl flex items-center justify-center gap-3 hover:bg-rose-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg animate-pulse"
              >
                {isActivating ? (
                  <span className="material-symbols-outlined animate-spin text-2xl">sync</span>
                ) : (
                  <span className="material-symbols-outlined text-2xl">campaign</span>
                )}
                {isActivating ? 'ACTIVANDO...' : 'ACTIVAR ALERTA AHORA'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#253336] rounded-xl p-6 shadow-sm">
              <h4 className="font-bold mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary">local_police</span> Autoridades</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 cursor-pointer hover:bg-red-100" onClick={() => window.open('tel:911')}>
                  <span className="font-bold">Emergencias (911)</span>
                  <span className="material-symbols-outlined text-red-600">call</span>
                </div>
              </div>
            </div>
            <div className="bg-[#f4f6f3] dark:bg-[#1a2a2d] rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-[#678380] leading-relaxed">
                <strong>Importante:</strong> Guía Parental es una red de apoyo comunitario. Para activación oficial de Alerta Amber nacional, contacte a la Fiscalía. La activación de esta alerta notificará a todos los usuarios con la app en un radio de {radius}km.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EmergencyAlert;
