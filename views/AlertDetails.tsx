import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { FamilyMember } from '../types';
import { calculateDistance } from '../lib/geo';

const AlertDetails: React.FC = () => {
    const { alertId } = useParams();
    const navigate = useNavigate();
    const [alert, setAlert] = useState<any>(null);
    const [child, setChild] = useState<FamilyMember | null>(null);
    const [distance, setDistance] = useState<string>('...');
    const [sightingDesc, setSightingDesc] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (alertId) fetchAlertDetails();
    }, [alertId]);

    const fetchAlertDetails = async () => {
        const { data: alertData, error } = await supabase
            .from('amber_alerts')
            .select('*')
            .eq('id', alertId)
            .single();

        if (error || !alertData) {
            // Handle error
            return;
        }
        setAlert(alertData);

        const { data: childData } = await supabase
            .from('family_members')
            .select('*')
            .eq('id', alertData.child_id)
            .single();

        if (childData) setChild(childData);

        // Calculate distance
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const dist = calculateDistance(
                    pos.coords.latitude,
                    pos.coords.longitude,
                    alertData.latitude,
                    alertData.longitude
                );
                setDistance(dist.toFixed(1));
            });
        }
    };

    const handleReportSighting = async () => {
        if (!sightingDesc.trim()) return alert('Por favor describe lo que has visto.');
        setIsSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            const { error } = await supabase.from('alert_responses').insert({
                alert_id: alertId,
                responder_id: user?.id,
                response_type: 'sighting',
                message: sightingDesc,
                latitude: alert?.latitude, // In a real app, capture user's current lat/long
                longitude: alert?.longitude
            });

            if (error) throw error;

            alert('Gracias. Tu reporte ha sido enviado a la familia y autoridades.');
            navigate('/dashboard');

        } catch (err) {
            console.error(err);
            alert('Error al enviar el reporte.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!alert || !child) return <div className="p-10 text-center">Cargando alerta...</div>;

    return (
        <main className="flex-grow p-4 md:p-8 bg-background-light dark:bg-background-dark min-h-screen">
            <div className="max-w-3xl mx-auto space-y-6">
                <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-500 mb-4">
                    <span className="material-symbols-outlined">arrow_back</span> Regresar
                </button>

                <div className="bg-white dark:bg-[#253336] rounded-2xl p-6 shadow-xl border-t-8 border-red-600">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">Alerta Activa</span>
                            <h1 className="text-3xl font-black text-[#121716] dark:text-white mt-3">NIÑO DESAPARECIDO</h1>
                            <p className="text-gray-500">A {distance} km de tu ubicación</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-red-600">REPORTE URGENTE</p>
                            <p className="text-xs text-gray-500">{new Date(alert.created_at).toLocaleDateString()} {new Date(alert.created_at).toLocaleTimeString()}</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-shrink-0">
                            <img src={child.avatar || `https://ui-avatars.com/api/?name=${child.name}&background=random`} className="w-48 h-48 rounded-xl object-cover border-4 border-red-100 shadow-lg" />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <h2 className="text-2xl font-bold dark:text-white">{child.name}</h2>
                                <p className="text-lg text-gray-600 dark:text-gray-300">{child.age} • {child.vitals?.sex === 'Male' ? 'Masculino' : 'Femenino'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-[#1a2a2d] p-3 rounded-lg">
                                    <span className="block text-xs font-bold text-gray-400 uppercase">Estatura</span>
                                    <span className="font-bold dark:text-white">{child.vitals?.height || '--'}</span>
                                </div>
                                <div className="bg-gray-50 dark:bg-[#1a2a2d] p-3 rounded-lg">
                                    <span className="block text-xs font-bold text-gray-400 uppercase">Peso</span>
                                    <span className="font-bold dark:text-white">{child.vitals?.weight || '--'}</span>
                                </div>
                            </div>

                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Descripción / Vestimenta</span>
                                <p className="text-gray-700 dark:text-gray-300 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border-l-2 border-red-400">
                                    {alert.clothing_description || alert.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Section */}
                <div className="bg-white dark:bg-[#253336] rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">visibility</span>
                        ¿Has visto a {child.name}?
                    </h3>

                    <textarea
                        className="w-full bg-[#f4f6f3] dark:bg-[#1a2a2d] border-none rounded-xl p-4 min-h-[120px]"
                        placeholder={`Describe dónde y cuándo viste a ${child.name}...`}
                        value={sightingDesc}
                        onChange={e => setSightingDesc(e.target.value)}
                    />

                    <button
                        onClick={handleReportSighting}
                        disabled={isSubmitting}
                        className="w-full mt-4 bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <span className="material-symbols-outlined animate-spin">sync</span>
                        ) : (
                            <span className="material-symbols-outlined">send</span>
                        )}
                        ENVIAR REPORTE DE AVISTAMIENTO
                    </button>
                    <p className="text-xs text-center text-gray-400 mt-2">Tu ubicación se compartirá con las autoridades.</p>
                </div>
            </div>
        </main>
    );
};

export default AlertDetails;
