import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface AlertNotificationProps {
    alert: any;
    onDismiss: () => void;
    onViewDetails: () => void;
}

const AlertNotification: React.FC<AlertNotificationProps> = ({ alert, onDismiss, onViewDetails }) => {
    const [child, setChild] = useState<any>(null);

    useEffect(() => {
        const fetchChild = async () => {
            const { data } = await supabase
                .from('family_members')
                .select('*')
                .eq('id', alert.child_id)
                .single();
            if (data) setChild(data);
        };
        fetchChild();
    }, [alert.child_id]);

    if (!child) return null;

    return (
        <div className="fixed top-4 left-4 right-4 z-[9999] md:left-1/2 md:-translate-x-1/2 md:w-[600px] animate-in slide-in-from-top duration-500">
            <div className="bg-white dark:bg-[#253336] rounded-2xl shadow-2xl border-l-8 border-red-600 overflow-hidden flex flex-col md:flex-row">
                {/* Alert Banner */}
                <div className="bg-red-600 text-white p-4 md:w-12 flex items-center justify-center animate-pulse">
                    <span className="material-symbols-outlined text-3xl">emergency_home</span>
                </div>

                <div className="p-4 flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="text-red-600 font-extrabold text-lg uppercase tracking-wider">Alerta de Comunidad</h3>
                            <p className="text-xs font-bold text-gray-500">NIÑO REPORTADO COMO DESAPARECIDO EN TU ZONA</p>
                        </div>
                        <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="flex gap-4 mt-3">
                        <img src={child.avatar || `https://ui-avatars.com/api/?name=${child.name}&background=random`} className="w-16 h-16 rounded-lg object-cover border-2 border-red-100" />
                        <div>
                            <p className="font-bold text-xl dark:text-white">{child.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {child.age} • Hora de reporte: {new Date(alert.last_seen_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {alert.clothing_description && (
                                <p className="text-xs text-gray-500 mt-1 italic line-clamp-1">{alert.clothing_description}</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={onViewDetails}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">visibility</span> VER DETALLES
                        </button>
                        <button
                            onClick={onDismiss}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-200"
                        >
                            CERRAR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertNotification;
