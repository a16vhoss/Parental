import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { calculateDistance } from '../lib/geo';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

interface AlertWithChild {
    id: string;
    child_id: string;
    latitude: number;
    longitude: number;
    radius_km: number;
    description: string;
    created_at: string;
    child: {
        name: string;
        avatar: string;
        age: string;
    };
    reporter: {
        full_name: string;
    };
}

const AlertsFeed: React.FC = () => {
    const [alerts, setAlerts] = useState<AlertWithChild[]>([]);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAlerts();
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(pos => {
                setUserLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
            });
        }
    }, []);

    const fetchAlerts = async () => {
        try {
            setLoading(true);
            // We need to join with family_members to get child details
            // However, Supabase simple join syntax depends on foreign keys.
            // Assuming 'family_members' is referenced by 'child_id' in 'amber_alerts'
            // and 'profiles' by 'created_by' (reporter)

            const { data, error } = await supabase
                .from('amber_alerts')
                .select(`
          *,
          child:family_members(name, avatar, age),
          reporter:profiles(full_name)
        `)
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                setAlerts(data as any as AlertWithChild[]);
            }
        } catch (err) {
            console.error('Error fetching alerts:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDistance = (lat: number, lng: number) => {
        if (!userLocation) return null;
        const dist = calculateDistance(userLocation.lat, userLocation.lng, lat, lng);
        return dist < 1 ? `${(dist * 1000).toFixed(0)}m` : `${dist.toFixed(1)}km`;
    };

    return (
        <main className="flex-grow p-4 md:p-8 lg:px-12 max-w-[1200px] mx-auto w-full animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-4xl font-black text-[#121716] dark:text-white tracking-tight flex items-center gap-3">
                        <span className="material-symbols-outlined text-red-500 text-4xl animate-pulse">emergency_home</span>
                        Alertas Activas
                    </h1>
                    <p className="text-[#678380] dark:text-gray-400 mt-2 text-lg">
                        Monitor de alertas Amber en tiempo real. Tu ayuda puede salvar vidas.
                    </p>
                </div>
                <button
                    onClick={fetchAlerts}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/10 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                >
                    <span className="material-symbols-outlined">refresh</span> Actualizar
                </button>
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-gray-100 dark:bg-surface-dark rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : alerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-green-50 dark:bg-green-900/10 rounded-3xl border border-green-100 dark:border-green-800 border-dashed">
                    <span className="material-symbols-outlined text-6xl text-green-500 mb-4">check_circle</span>
                    <h3 className="text-2xl font-black text-green-700 dark:text-green-400">Sin Alertas Activas</h3>
                    <p className="text-green-600 dark:text-green-300 mt-2">No hay reportes de desaparecidos en este momento.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {alerts.map(alert => (
                        <div
                            key={alert.id}
                            onClick={() => navigate(`/alerta/detalles/${alert.id}`)}
                            className="bg-white dark:bg-surface-dark rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800 group cursor-pointer"
                        >
                            {/* Maps Preview Header */}
                            <div className="h-40 bg-gray-200 relative">
                                <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                                    <Map
                                        mapId={`mini-map-${alert.id}`}
                                        defaultCenter={{ lat: alert.latitude, lng: alert.longitude }}
                                        defaultZoom={11}
                                        disableDefaultUI={true}
                                        gestureHandling={'none'}
                                        style={{ width: '100%', height: '100%' }}
                                    >
                                        <AdvancedMarker position={{ lat: alert.latitude, lng: alert.longitude }}>
                                            <Pin background={'#EF4444'} borderColor={'#ffffff'} glyphColor={'#ffffff'} scale={1} />
                                        </AdvancedMarker>
                                    </Map>
                                </APIProvider>
                                <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse shadow-lg z-10">
                                    Activa
                                </div>
                            </div>

                            <div className="p-6 relative">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-black text-[#121716] dark:text-white leading-tight mb-1">
                                            {alert.child?.name?.split(' ')[0] || 'Desconocido'}
                                        </h3>
                                        <p className="text-primary font-bold text-xs uppercase tracking-widest">{alert.child?.age || '?'} años</p>
                                    </div>
                                    {alert.child?.avatar && (
                                        <img src={alert.child.avatar} alt="child" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md" />
                                    )}
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="material-symbols-outlined text-lg text-primary">location_on</span>
                                        <span className="truncate">Cerca de tu ubicación {formatDistance(alert.latitude, alert.longitude) && `(${formatDistance(alert.latitude, alert.longitude)})`}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <span className="material-symbols-outlined text-lg text-primary">schedule</span>
                                        <span>{new Date(alert.created_at).toLocaleDateString()} {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>

                                <button className="w-full py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-lg">visibility</span>
                                    Ver Detalles y Ayudar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
};

export default AlertsFeed;
