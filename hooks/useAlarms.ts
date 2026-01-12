import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const useAlarms = (userId?: string) => {
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
            if (Notification.permission === 'default') {
                Notification.requestPermission().then(setPermission);
            }
        }
    }, []);

    useEffect(() => {
        if (!userId) return;

        const checkAlarms = async () => {
            if (permission !== 'granted') return;

            const now = new Date();
            const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }); // HH:mm
            const todayDate = now.toISOString().split('T')[0];

            // Fetch active events that might trigger now
            // This is a simplified check. For precise daily/weekly logic, we need more processing.
            // Strategy: Fetch all 'active' events with notification_sent = false (for one-time) OR recurrence != 'none'

            const { data: events } = await supabase
                .from('health_events')
                .select('*')
                .eq('is_active', true);

            if (!events) return;

            events.forEach(async (event) => {
                if (!event.event_time) return;

                // Check time match (simple HH:mm check)
                // We only trigger if the minute exactly matches to avoid duplicates, 
                // OR we use a 'last_notified' timestamp in local storage/DB. 
                // For this MVP, exact minute match + local storage duplicate guard.

                const eventTimeShort = event.event_time.substring(0, 5); // HH:mm
                if (eventTimeShort !== currentTime) return;

                // Check Date/Recurrence matches
                let shouldTrigger = false;

                if (event.recurrence === 'daily') {
                    shouldTrigger = true;
                } else if (event.recurrence === 'weekly') {
                    // Check day of week (assuming event_date implies the day, or we just rely on event_date matching day of week?)
                    // Simplest: Check if today is same day of week as event_date
                    const eventDay = new Date(event.event_date).getDay();
                    const currentDay = now.getDay();
                    if (eventDay === currentDay) shouldTrigger = true;
                } else {
                    // One-time event
                    if (event.event_date === todayDate && !event.notification_sent) {
                        shouldTrigger = true;
                        // Mark as sent in DB to prevent re-send? 
                        // Or just rely on minute check.
                    }
                }

                if (shouldTrigger) {
                    // Local duplication guard (session based)
                    const storageKey = `notif_${event.id}_${todayDate}_${currentTime}`;
                    if (sessionStorage.getItem(storageKey)) return;

                    // Trigger Notification
                    new Notification(`Recordatorio: ${event.title}`, {
                        body: event.notes || `Es hora de tu evento de ${event.event_type || 'salud'}`,
                        icon: '/pwa-192x192.png' // Ensure this exists or use valid path
                    });

                    sessionStorage.setItem(storageKey, 'true');

                    // If one-time, update DB
                    if (event.recurrence === 'none' || !event.recurrence) {
                        await supabase.from('health_events').update({ notification_sent: true }).eq('id', event.id);
                    }
                }
            });
        };

        // Check every minute
        const interval = setInterval(checkAlarms, 60000);
        // Initial check
        checkAlarms();

        return () => clearInterval(interval);
    }, [userId, permission]);

    return { permission };
};
