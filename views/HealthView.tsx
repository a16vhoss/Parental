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
    event_type: 'vaccine' | 'appointment' | 'medication' | 'feeding' | 'other';
    event_date: string;
    event_time?: string;
    recurrence?: 'none' | 'daily' | 'weekly';
    is_active?: boolean;
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
        event_date: new Date().toISOString().split('T')[0],
        event_time: '09:00',
        recurrence: 'none',
        is_active: true
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
            const { data: profile } = await supabase.from('profiles').select('family_id').eq('id', user?.id).single();
            if (!profile?.family_id) throw new Error('No family found');

            const payload = {
                ...newEvent,
                family_id: profile.family_id,
                created_by: user?.id,
                // Ensure defaults
                recurrence: newEvent.recurrence || 'none',
                is_active: newEvent.is_active ?? true
            };

            let data, error;

            if (editingId) {
                const result = await supabase
                    .from('health_events')
                    .update(payload)
                    .eq('id', editingId)
                    .select();
                data = result.data;
                error = result.error;
            } else {
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
            setNewEvent({
                event_type: 'appointment',
                event_date: new Date().toISOString().split('T')[0],
                event_time: '09:00',
                recurrence: 'none',
                is_active: true
            });

        } catch (e: any) {
            console.error('Error saving event:', e);
            alert('Error al guardar el evento: ' + e.message);
        }
    };

    const toggleEventStatus = async (event: HealthEvent) => {
        try {
            const newStatus = !event.is_active;
            const { error } = await supabase
                .from('health_events')
                .update({ is_active: newStatus })
                .eq('id', event.id);

            if (!error) {
                setEvents(events.map(e => e.id === event.id ? { ...e, is_active: newStatus } : e));
            }
        } catch (e) { console.error('Error toggling status', e); }
    };

    const filteredEvents = useMemo(() => {
        let result = events;
        if (filterType !== 'all') {
            result = result.filter(e => e.event_type === filterType);
        }
        return result.sort((a, b) => {
            // Sort by Date then Time
            const dateA = new Date(`${a.event_date}T${a.event_time || '00:00'}`);
            const dateB = new Date(`${b.event_date}T${b.event_time || '00:00'}`);
            return dateA.getTime() - dateB.getTime();
        });
    }, [events, filterType]);

    // Separate logic: "Rutina" (Recurring) vs "Calendario" (One-time)?
    // Or just group by upcoming vs past.
    // Let's stick to Upcoming vs Past, but recurring events are always "Upcoming" effectively if active.

    const upcomingEvents = filteredEvents.filter(e => {
        if (e.recurrence !== 'none') return true; // Always show recurring
        return new Date(e.event_date) >= new Date(new Date().setHours(0, 0, 0, 0));
    });

    // Past only for non-recurring
    const pastEvents = filteredEvents.filter(e => {
        if (e.recurrence !== 'none') return false;
        return new Date(e.event_date) < new Date(new Date().setHours(0, 0, 0, 0));
    });

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto w-full pb-24">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#121716] dark:text-white flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-3xl">calendar_month</span>
                        Salud y Rutina
                    </h1>
                    <p className="text-gray-500 mt-1">Control de alimentación, medicamentos y citas</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:bg-primary-dark transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined">add_alarm</span>
                    Nuevo Recordatorio
                </button>
            </header>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 hide-scrollbar">
                {[
                    { id: 'all', label: 'Todos', icon: 'list' },
                    { id: 'feeding', label: 'Comida', icon: 'baby_bottle' },
                    { id: 'medication', label: 'Medicinas', icon: 'pill' },
                    { id: 'vaccine', label: 'Vacunas', icon: 'vaccines' },
                    { id: 'appointment', label: 'Citas', icon: 'stethoscope' }
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

            {EventsList("Próximos / Rutinas", upcomingEvents, children, (e) => {
                setNewEvent(e);
                setEditingId(e.id);
                setShowModal(true);
            }, async (id) => {
                if (!confirm('¿Eliminar evento?')) return;
                const { error } = await supabase.from('health_events').delete().eq('id', id);
                if (!error) setEvents(events.filter(e => e.id !== id));
            }, toggleEventStatus)}

            {pastEvents.length > 0 && (
                <div className="mt-12 opacity-60 hover:opacity-100 transition-opacity">
                    {EventsList("Historial Pasado", pastEvents, children)}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black dark:text-white">{editingId ? 'Editar Evento' : 'Nuevo Recordatorio'}</h3>
                            <button onClick={() => setShowModal(false)} className="material-symbols-outlined text-gray-400">close</button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Título</label>
                                <input
                                    className="w-full p-3 bg-gray-50 dark:bg-background-dark rounded-xl mt-1 outline-none focus:ring-2 ring-primary"
                                    placeholder="Ej. Toma de leche"
                                    value={newEvent.title || ''}
                                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Tipo</label>
                                    <select
                                        className="w-full p-3 bg-gray-50 dark:bg-background-dark rounded-xl mt-1 outline-none font-medium"
                                        value={newEvent.event_type}
                                        onChange={e => setNewEvent({ ...newEvent, event_type: e.target.value as any })}
                                    >
                                        <option value="feeding">Alimentación</option>
                                        <option value="medication">Medicina</option>
                                        <option value="appointment">Cita Médica</option>
                                        <option value="vaccine">Vacuna</option>
                                        <option value="other">Otro</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Hora</label>
                                    <input
                                        type="time"
                                        className="w-full p-3 bg-gray-50 dark:bg-background-dark rounded-xl mt-1 outline-none"
                                        value={newEvent.event_time || ''}
                                        onChange={e => setNewEvent({ ...newEvent, event_time: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Fecha Inicio</label>
                                    <input
                                        type="date"
                                        className="w-full p-3 bg-gray-50 dark:bg-background-dark rounded-xl mt-1 outline-none"
                                        value={newEvent.event_date}
                                        onChange={e => setNewEvent({ ...newEvent, event_date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Repetición</label>
                                    <select
                                        className="w-full p-3 bg-gray-50 dark:bg-background-dark rounded-xl mt-1 outline-none"
                                        value={newEvent.recurrence || 'none'}
                                        onChange={e => setNewEvent({ ...newEvent, recurrence: e.target.value as any })}
                                    >
                                        <option value="none">Una vez</option>
                                        <option value="daily">Diariamente</option>
                                        <option value="weekly">Semanalmente</option>
                                    </select>
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
                                    placeholder="Detalles adicionales (dosis, cantidad, etc)..."
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
                                {editingId ? 'Actualizar' : 'Crear Alarma'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const EventsList = (
    title: string,
    list: HealthEvent[],
    children: FamilyMember[],
    onEdit?: (e: HealthEvent) => void,
    onDelete?: (id: string) => void,
    onToggle?: (e: HealthEvent) => void
) => (
    <section className="mb-8">
        <h3 className="font-bold text-lg text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-800 pb-2 flex justify-between items-center">
            {title}
            <span className="text-xs normal-case font-normal bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-full">{list.length}</span>
        </h3>

        <div className="grid gap-4">
            {list.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">event_busy</span>
                    <p className="text-gray-400 font-medium">No hay recordatorios activos.</p>
                </div>
            ) : list.map(event => {
                const child = children.find(c => c.id === event.child_id);
                const isPast = event.recurrence === 'none' && new Date(event.event_date) < new Date(new Date().setHours(0, 0, 0, 0));

                const typeColors: any = {
                    vaccine: 'bg-blue-50 text-blue-600',
                    appointment: 'bg-purple-50 text-purple-600',
                    medication: 'bg-rose-50 text-rose-600',
                    feeding: 'bg-emerald-50 text-emerald-600',
                    other: 'bg-gray-50 text-gray-600'
                };
                const icons: any = {
                    vaccine: 'vaccines',
                    appointment: 'stethoscope',
                    medication: 'pill',
                    feeding: 'baby_bottle',
                    other: 'event'
                };

                return (
                    <div key={event.id} className={`group bg-white dark:bg-surface-dark p-5 rounded-2xl border flex items-start gap-4 transition-all ${isPast || (event.is_active === false) ? 'border-gray-100 dark:border-gray-800 opacity-75' : 'border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md'}`}>
                        <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${typeColors[event.event_type] || typeColors.other}`}>
                            <span className="material-symbols-outlined">{icons[event.event_type] || 'event'}</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className={`font-bold text-lg ${event.is_active === false ? 'text-gray-400 decoration-slate-400' : 'text-[#121716] dark:text-white'}`}>{event.title}</h4>
                                    <div className="flex items-center gap-3 mt-1">
                                        {event.event_time && (
                                            <div className="flex items-center gap-1 text-primary font-bold text-sm bg-primary/5 px-2 py-0.5 rounded-lg">
                                                <span className="material-symbols-outlined text-base">schedule</span>
                                                {event.event_time.substring(0, 5)}
                                            </div>
                                        )}
                                        {event.recurrence !== 'none' && (
                                            <div className="flex items-center gap-1 text-purple-600 font-bold text-xs bg-purple-50 px-2 py-0.5 rounded-lg uppercase">
                                                <span className="material-symbols-outlined text-base">update</span>
                                                {event.recurrence === 'daily' ? 'Diario' : 'Semanal'}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    {onToggle && event.recurrence !== 'none' && (
                                        <button
                                            onClick={() => onToggle(event)}
                                            className={`mx-2 text-2xl ${event.is_active ? 'text-primary' : 'text-gray-300'}`}
                                            title={event.is_active ? 'Desactivar' : 'Activar'}
                                        >
                                            <span className="material-symbols-outlined">
                                                {event.is_active ? 'toggle_on' : 'toggle_off'}
                                            </span>
                                        </button>
                                    )}

                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(event)}
                                            className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-gray-50 rounded-full"
                                            title="Editar"
                                        >
                                            <span className="material-symbols-outlined text-lg">edit</span>
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            onClick={() => onDelete(event.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-full"
                                            title="Eliminar"
                                        >
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 mt-3">
                                <span className={`text-xs font-medium px-2 py-1 rounded-lg ${isPast ? 'bg-gray-100 text-gray-500' : 'bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400'}`}>
                                    📅 {new Date(event.event_date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                                </span>

                                {child && (
                                    <div className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-lg">
                                        <span className="material-symbols-outlined text-sm">child_care</span>
                                        {child.name.split(' ')[0]}
                                    </div>
                                )}
                            </div>

                            {event.notes && <p className="mt-2 text-sm text-gray-400 italic bg-gray-50/50 p-2 rounded-lg border border-gray-50 dark:border-gray-800">{event.notes}</p>}
                        </div>
                    </div>
                );
            })}
        </div>
    </section>
);

export default HealthView;
