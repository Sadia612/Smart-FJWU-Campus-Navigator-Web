// Department Search Module
class DepartmentSearch {
    constructor() {
        this.departments = this.loadDepartments();
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.initializeElements();
        this.setupEventListeners();
    }
    
    initializeElements() {
        this.searchInput = document.getElementById('searchInput');
        this.searchButton = document.getElementById('searchButton');
        this.suggestionsBox = document.getElementById('suggestionsBox');
        this.resultsGrid = document.getElementById('resultsGrid');
        this.resultsSection = document.getElementById('resultsSection');
        this.resultsCount = document.getElementById('resultsCount');
        this.filterButtons = document.querySelectorAll('.filter-chip');
    }
    
    setupEventListeners() {
        // Search input events
        this.searchInput.addEventListener('input', this.handleSearchInput.bind(this));
        this.searchInput.addEventListener('focus', this.showSuggestions.bind(this));
        
        // Search button
        this.searchButton.addEventListener('click', this.performSearch.bind(this));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && document.activeElement !== this.searchInput) {
                e.preventDefault();
                this.searchInput.focus();
            }
        });
        
        // Filter buttons
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.setActiveFilter(button.dataset.filter);
                this.updateResults();
            });
        });
    }
    
    handleSearchInput() {
        const query = this.searchInput.value.trim();
        this.searchTerm = query.toLowerCase();
        
        if (query.length === 0) {
            this.hideSuggestions();
            return;
        }
        
        this.showSuggestions();
        this.updateSuggestions();
    }
    
    updateSuggestions() {
        const suggestions = this.getFilteredDepartments().slice(0, 5);
        
        if (suggestions.length === 0) {
            this.suggestionsBox.innerHTML = this.createNoSuggestionsTemplate();
        } else {
            this.suggestionsBox.innerHTML = suggestions
                .map(dept => this.createSuggestionTemplate(dept))
                .join('');
        }
    }
    
    createSuggestionTemplate(dept) {
        return `
            <div class="suggestion-item" data-id="${dept.id}">
                <span class="suggestion-icon">${dept.icon}</span>
                <div>
                    <div class="suggestion-title">${dept.name}</div>
                    <div class="suggestion-subtitle">${dept.location}</div>
                </div>
            </div>
        `;
    }
    
    createNoSuggestionsTemplate() {
        return `
            <div class="suggestion-item">
                <span class="suggestion-icon">🔍</span>
                <div>
                    <div class="suggestion-title">No results found</div>
                    <div class="suggestion-subtitle">Try different keywords</div>
                </div>
            </div>
        `;
    }
    
    showSuggestions() {
        this.suggestionsBox.style.display = 'block';
    }
    
    hideSuggestions() {
        this.suggestionsBox.style.display = 'none';
    }
    
    performSearch() {
        this.searchTerm = this.searchInput.value.trim().toLowerCase();
        this.updateResults();
        this.hideSuggestions();
    }
    
    setActiveFilter(filter) {
        this.currentFilter = filter;
        
        // Update UI
        this.filterButtons.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.filter === filter) {
                button.classList.add('active');
            }
        });
    }
    
    getFilteredDepartments() {
        let filtered = [...this.departments];
        
        // Apply search term filter
        if (this.searchTerm) {
            filtered = filtered.filter(dept => 
                dept.name.toLowerCase().includes(this.searchTerm) ||
                dept.location.toLowerCase().includes(this.searchTerm) ||
                dept.description.toLowerCase().includes(this.searchTerm)
            );
        }
        
        // Apply category filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(dept => dept.category === this.currentFilter);
        }
        
        return filtered;
    }
    
    updateResults() {
        const filteredDepartments = this.getFilteredDepartments();
        
        // Update results count
        if (this.resultsCount) {
            this.resultsCount.textContent = `${filteredDepartments.length} results found`;
        }
        
        // Show/hide results section
        if (filteredDepartments.length === 0) {
            this.showNoResults();
        } else {
            this.showResults(filteredDepartments);
        }
        
        // Scroll to results
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    showResults(departments) {
        this.resultsSection.classList.remove('hidden');
        this.resultsGrid.innerHTML = departments
            .map(dept => this.createDepartmentCard(dept))
            .join('');
    }
    
    showNoResults() {
        this.resultsGrid.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h3>No departments found</h3>
                <p>Try adjusting your search or filters</p>
                <button class="btn btn-secondary mt-2" onclick="window.location.reload()">
                    Reset Search
                </button>
            </div>
        `;
    }
    
    createDepartmentCard(dept) {
        return `
            <div class="dept-card" data-id="${dept.id}">
                <div class="dept-header">
                    <div class="dept-icon">${dept.icon}</div>
                    <div>
                        <h3 class="dept-title">${dept.name}</h3>
                        <div class="dept-location">📍 ${dept.location}</div>
                    </div>
                </div>
                <p class="dept-description">${dept.description}</p>
                <div class="dept-footer">
                    <span class="dept-category">${dept.category}</span>
                    <button class="btn btn-primary" onclick="viewDepartmentGuide(${dept.id})">
                        View Guide
                    </button>
                </div>
            </div>
        `;
    }
    
    loadDepartments() {
        // In production, this would be an API call
        return [
            {
                id: 1,
                name: "Department of Computer Science",
                location: "Academic Block, 2nd Floor",
                description: "Offering BSCS, MSCS, and PhD programs with state-of-the-art labs.",
                category: "academic",
                icon: "💻"
            },
            // ... more departments
        ];
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const searchApp = new DepartmentSearch();
    window.searchApp = searchApp; // Make it globally accessible
});

// ✅ NEW - Scanner page pe redirect karega
function viewDepartmentGuide(deptId) {
    // Pehle department ka naam nikalo
    const dept = departments.find(d => d.id === deptId);
    
    if (dept) {
        // Scanner page pe jao with department info
        localStorage.setItem('scanForDepartment', JSON.stringify({
            id: dept.id,
            name: dept.name,
            location: dept.location
        }));
        
        // Scanner page khole
        window.location.href = 'scanner.html';
        
        // Ya phir message show karo
        alert(`📷 Please scan QR code for: ${dept.name}\n\nScanner opening...`);
    }
}