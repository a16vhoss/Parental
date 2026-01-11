export const calculateAge = (dob?: string) => {
    if (!dob) return { label: 'Edad desconocida', years: 0, months: 0, days: 0 };

    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
        // Get days in previous month to add to days
        // const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        // days += prevMonth.getDate(); 
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    // Return object for logic usage, and label for display
    let label = '';

    if (years === 0 && months === 0) {
        const diffTime = Math.abs(today.getTime() - birthDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        label = `${diffDays} días`;
    } else if (years === 0) {
        label = `${months} ${months === 1 ? 'mes' : 'meses'}`;
    } else if (years > 0 && years < 3) {
        label = months > 0
            ? `${years} ${years === 1 ? 'año' : 'años'} y ${months} ${months === 1 ? 'mes' : 'meses'}`
            : `${years} ${years === 1 ? 'año' : 'años'}`;
    } else {
        label = `${years} años`;
    }

    return { label, years, months, days };
};
