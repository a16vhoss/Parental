import { FamilyMember } from '../types';
import { calculateAge } from './dateUtils';

// Helper to determine icon based on age and role
export const getMemberIcon = (member: FamilyMember) => {
    // 1. Check age if calculated
    if (member.vitals?.dob) {
        const { years } = calculateAge(member.vitals.dob);
        if (years < 2) return 'child_care'; // Baby
        if (years < 13) return 'face'; // Child
        if (years < 20) return 'face_6'; // Teen
        if (years < 60) return 'person'; // Adult
        return 'elderly'; // Senior
    }

    // 2. Fallback to Role
    switch (member.role) {
        case 'Abuelo/a': return 'elderly';
        case 'Padre/Madre': return 'person'; // or supervisor_account
        case 'Tío/a': return 'person';
        case 'Hijo/a': return 'child_care'; // Default to baby/child
        case 'Primo/a': return 'face';
        default: return 'person';
    }
};
