
export const getMonthNumber = (month) => {
    if (!month) return null; // Handle null or undefined cases

    const months = {
        january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
        july: 7, august: 8, september: 9, october: 10, november: 11, december: 12
    };

    return months[month.toLowerCase()] || null; // Convert to lowercase and return the corresponding number
};