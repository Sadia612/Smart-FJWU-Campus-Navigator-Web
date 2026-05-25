// Utility Functions for FJWU Navigator

const Utils = {
    // Debounce function for search input
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Format date and time
    formatDateTime(date = new Date()) {
        return {
            date: date.toLocaleDateString('en-PK'),
            time: date.toLocaleTimeString('en-PK', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            day: date.toLocaleDateString('en-PK', { weekday: 'long' })
        };
    },
    
    // Local storage helper
    storage: {
        set(key, value) {
            localStorage.setItem(`fjwu_${key}`, JSON.stringify(value));
        },
        
        get(key) {
            const item = localStorage.getItem(`fjwu_${key}`);
            return item ? JSON.parse(item) : null;
        },
        
        remove(key) {
            localStorage.removeItem(`fjwu_${key}`);
        },
        
        clear() {
            const keys = Object.keys(localStorage).filter(key => key.startsWith('fjwu_'));
            keys.forEach(key => localStorage.removeItem(key));
        }
    },
    
    // API call simulation
    async fetchDepartments() {
        // Simulate API call
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    // Department data
                ]);
            }, 500);
        });
    },
    
    // Show toast notification
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    },
    
    // Validate email
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Get current campus time
    getCampusTime() {
        const now = new Date();
        return this.formatDateTime(now);
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}