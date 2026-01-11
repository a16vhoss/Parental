import { useCallback } from 'react';
import { supabase } from '../lib/supabase';

export type ActionType =
    | 'ALERT_CREATED'
    | 'ALERT_RESOLVED'
    | 'PROFILE_UPDATED'
    | 'MEMBER_ADDED'
    | 'MEMBER_REMOVED'
    | 'GUIDE_COMPLETED'
    | 'HEALTH_LOG';

interface LogActivityParams {
    actionType: ActionType;
    description: string;
    entityId?: string;
    entityType?: 'child' | 'alert' | 'guide' | 'family' | 'event';
}

export const useLogger = () => {
    const logActivity = useCallback(async ({
        actionType,
        description,
        entityId,
        entityType
    }: LogActivityParams) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get user profile for family_id and name
            const { data: profile } = await supabase
                .from('profiles')
                .select('family_id, full_name')
                .eq('id', user.id)
                .single();

            if (!profile || !profile.family_id) {
                console.warn('Cannot log activity: Missing profile or family_id');
                return;
            }

            const { error } = await supabase
                .from('activity_logs')
                .insert({
                    family_id: profile.family_id,
                    actor_id: user.id,
                    actor_name: profile.full_name || user.email?.split('@')[0] || 'Usuario',
                    action_type: actionType,
                    description,
                    entity_id: entityId,
                    entity_type: entityType
                });

            if (error) throw error;

        } catch (err) {
            console.error('Failed to log activity:', err);
            // Fail silently to not disrupt user experience
        }
    }, []);

    return { logActivity };
};
