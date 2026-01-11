import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { FamilyMember } from '../types';
import { useLogger } from '../hooks/useLogger';

interface HealthViewProps {
    childrenList: FamilyMember[];
}

interface HealthEvent {
    id: string;
    family_id: string;
    child_id: string | null;
    title: string;
    event_type: 'vaccine' | 'appointment' | 'medication' | 'other';
    event_date: string;
    notes?: string;
}

const HealthView: React.FC<HealthViewProps> = ({ childrenList }) => {
    const { logActivity } = useLogger();
    const [events, setEvents] = useState<HealthEvent[]>([]);
    const [filterType, setFilterType] = useState<string>('all');
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [newEvent, setNewEvent] = useState<Partial<HealthEvent>>({
        event_type: 'appointment',
        event_date: new Date().toISOString().split('T')[0]
    });

    const children = childrenList.filter(c => c.role === 'Hijo/a');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setIsLoading(true);
        const { data } = await supabase
            .from('health_events')
            .select('*')
            .order('event_date', { ascending: true });

        if (data) setEvents(data);
        setIsLoading(false);
    };

    const handleSaveEvent = async () => {
        if (!newEvent.title || !newEvent.event_date) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            // Get family_id from first child or profile (simplified assumption: user has one family)
            // A better way is fetching the user's family_id from profiles table
            const { data: profile } = await supabase.from('profiles').select('family_id').eq('id', user?.id).single();
            if (!profile?.family_id) throw new Error('No family found');

            if (!profile?.family_id) throw new Error('No family found');

            const payload = {
                ...newEvent,
                family_id: profile.family_id,
                created_by: user?.id
            };

            let data, error;

            if (editingId) {
                // Update existing
                const result = await supabase
                    .from('health_events')
                    .update(payload)
                    .eq('id', editingId)
                    .select();
                data = result.data;
                error = result.error;
            } else {
                // Insert new
                const result = await supabase
                    .from('health_events')
                    .insert([payload])
                    .select();
                data = result.data;
                error = result.error;
            }

            if (error) throw error;

            if (data) {
                if (editingId) {
                    setEvents(events.map(e => e.id === editingId ? data[0] : e));
                    await logActivity({
                        actionType: 'HEALTH_LOG',
                        description: `Actualizó evento: ${newEvent.title}`,
                        entityId: data[0].id,
                        entityType: 'event'
                    });
                } else {
                    setEvents([...events, data[0]]);
                    await logActivity({
                        actionType: 'HEALTH_LOG',
                        description: `Agendó evento: ${newEvent.title}`,
                        entityId: data[0].id,
                        entityType: 'event'
                    });
                }
            }

            setShowModal(false);
            setEditingId(null);
            setNewEvent({ event_type: 'appointment', event_date: new Date().toISOString().split('T')[0] });

        } catch (e: any) {
            console.error('Error saving event:', e);
            alert('Error al guardar el evento: ' + e.message);
        }
    };

    const filteredEvents = useMemo(() => {
        let result = events;
        if (filterType !== 'all') {
            result = result.filter(e => e.event_type === filterType);
        }
        // Filter out past events if desired, or show all separately?
        // Let's current show upcoming first
        return result.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
    }, [events, filterType]);

    const upcomingEvents = filteredEvents.filter(e => new Date(e.event_date) >= new Date(new Date().setHours(0, 0, 0, 0)));
    const pastEvents = filteredEvents.filter(e => new Date(e.event_date) < new Date(new Date().setHours(0, 0, 0, 0)));

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto w-full pb-24">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#121716] dark:text-white flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-3xl">calendar_month</span>
                        Calendario de Salud
                    </h1>
                    <p className="text-gray-500 mt-1">Vacunas, citas médicas y recordatorios</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:bg-primary-dark transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined">add</span>
                    Nuevo Evento
                </button>
            </header>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {[
                    { id: 'all', label: 'Todos', icon: 'list' },
                    { id: 'vaccine', label: 'Vacunas', icon: 'vaccines' },
                    { id: 'appointment', label: 'Citas', icon: 'stethoscope' },
                    { id: 'medication', label: 'Medicinas', icon: 'pill' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilterType(tab.id)}
                        className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold whitespace-nowrap transition-all ${filterType === tab.id ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-surface-dark text-gray-500 hover:bg-gray-50'}`}
                    >
                        <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {EventsList("Próximos Eventos", upcomingEvents, children, (e) => {
                setNewEvent(e);
                setEditingId(e.id);
                setShowModal(true);
            }, async (id) => {
                if (!confirm('¿Eliminar evento?')) return;
                const { error } = await supabase.from('health_events').delete().eq('id', id);
                if (!error) setEvents(events.filter(e => e.id !== id));
            })}

            {pastEvents.length > 0 && (
                <div className="mt-12 opacity-60 hover:opacity-100 transition-opacity">
                    {EventsList("Historial Pasado", pastEvents, children)}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
                        <h3 className="text-xl font-black mb-6 dark:text-white">{editingId ? 'Editar Evento' : 'Nuevo Evento'}</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Título</label>
                                <input
                                    className="w-full p-3 bg-gray-50 dark:bg-background-dark rounded-xl mt-1 outline-none focus:ring-2 ring-primary"
                                    placeholder="Ej. Vacuna de los 6 meses"
                                    value={newEvent.title || ''}
                                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Tipo</label>
                                    <select
                                        className="w-full p-3 bg-gray-50 dark:bg-background-dark rounded-xl mt-1 outline-none"
                                        value={newEvent.event_type}
                                        onChange={e => setNewEvent({ ...newEvent, event_type: e.target.value as any })}
                                    >
                                        <option value="appointment">Cita Médica</option>
                                        <option value="vaccine">Vacuna</option>
                                        <option value="medication">Medicina</option>
                                        <option value="other">Otro</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Fecha</label>
                                    <input
                                        type="date"
                                        className="w-full p-3 bg-gray-50 dark:bg-background-dark rounded-xl mt-1 outline-none"
                                        value={newEvent.event_date}
                                        onChange={e => setNewEvent({ ...newEvent, event_date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Niño (Opcional)</label>
                                <div className="flex gap-2 mt-1 overflow-x-auto pb-2">
                                    {children.map(child => (
                                        <button
                                            key={child.id}
                                            onClick={() => setNewEvent({ ...newEvent, child_id: newEvent.child_id === child.id ? null : child.id })}
                                            className={`px-3 py-2 rounded-lg text-sm border font-bold whitespace-nowrap transition-all ${newEvent.child_id === child.id ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 text-gray-500'}`}
                                        >
                                            {child.name.split(' ')[0]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Notas</label>
                                <textarea
                                    className="w-full p-3 bg-gray-50 dark:bg-background-dark rounded-xl mt-1 outline-none h-24 resize-none"
                                    placeholder="Detalles adicionales..."
                                    value={newEvent.notes || ''}
                                    onChange={e => setNewEvent({ ...newEvent, notes: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveEvent}
                                className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const EventsList = (title: string, list: HealthEvent[], children: FamilyMember[], onEdit?: (e: HealthEvent) => void, onDelete?: (id: string) => void) => (
    <section className="mb-8">
        <h3 className="font-bold text-lg text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">{title}</h3>

        <div className="grid gap-4">
            {list.length === 0 ? (
                <p className="text-gray-400 italic">No hay eventos.</p>
            ) : list.map(event => {
                const child = children.find(c => c.id === event.child_id);
                const isPast = new Date(event.event_date) < new Date(new Date().setHours(0, 0, 0, 0));
                const typeColors = {
                    vaccine: 'bg-blue-50 text-blue-600',
                    appointment: 'bg-purple-50 text-purple-600',
                    medication: 'bg-amber-50 text-amber-600',
                    other: 'bg-gray-50 text-gray-600'
                };
                const icons = {
                    vaccine: 'vaccines',
                    appointment: 'stethoscope',
                    medication: 'pill',
                    other: 'event'
                };

                return (
                    <div key={event.id} className={`group bg-white dark:bg-surface-dark p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-start gap-4 ${isPast ? 'grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all' : 'shadow-sm'}`}>
                        <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${typeColors[event.event_type] || typeColors.other}`}>
                            <span className="material-symbols-outlined">{icons[event.event_type] || 'event'}</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-lg text-[#121716] dark:text-white">{event.title}</h4>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isPast ? 'bg-gray-100 text-gray-500' : 'bg-primary/10 text-primary'}`}>
                                        {new Date(event.event_date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'long' })}
                                    </span>
                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(event)}
                                            className="p-1 text-gray-400 hover:text-primary transition-colors"
                                            title="Editar"
                                        >
                                            <span className="material-symbols-outlined text-lg">edit</span>
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={() => onDelete(event.id)}
                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Eliminar"
                                        >
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                            {child && (
                                <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                                    <span className="material-symbols-outlined text-xs">child_care</span>
                                    For: <span className="font-bold text-gray-700 dark:text-gray-300">{child.name}</span>
                                </div>
                            )}
                            {event.notes && <p className="mt-2 text-sm text-gray-400">{event.notes}</p>}
                        </div>
                    </div>
                );
            })}
        </div>
    </section>
);

export default HealthView;
