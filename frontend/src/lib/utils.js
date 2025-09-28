export const formatDate = (dateString) => {
    // Handle null, undefined, or empty strings
    if (!dateString) {
        return 'No date available';
    }
    
    // Parse the date string
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return 'Invalid date';
    }
    
    // Format the date for display
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Optional: Currency formatting utility
export const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '$0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(Number(amount));
};

export const formatPhone = (phone) => {
    if (!phone) return '';
    // Basic formatting - you can enhance this
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    }
    return phone;
};