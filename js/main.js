// DOM Manipulation for first page
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. LIVE TIME UPDATE (DOM Feature)
    function updateDateTime() {
        const now = new Date();
        document.getElementById('currentTime').textContent = 
            now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById('currentDate').textContent = 
            now.toLocaleDateString();
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();
    
    // 2. SEARCH FUNCTIONALITY (Your main requirement)
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    // Sample departments data
    const departments = [
        "CSE Department - Block A",
        "Library - Central Building",
        "Administration Office - Ground Floor",
        "ECE Lab - Block B",
        "Cafeteria - Near Gate 2",
        "Sports Complex - East Campus"
    ];
    
    // Live search suggestions (DOM Feature)
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        if (query.length > 0) {
            // You can show dropdown here later
            console.log("Searching for:", query);
        }
    });
    
    // Search button click
    searchBtn.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            // Redirect to search results page
            localStorage.setItem('searchQuery', query);
            window.location.href = 'search-results.html';
        } else {
            alert("Please type something to search");
        }
    });
    
    // Enter key support
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
    
    // 3. SCAN BUTTON (Same as before)
    document.getElementById('scanBtn').addEventListener('click', function() {
        window.location.href = 'scanner.html';
    });
});
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. LIVE TIME UPDATE
    function updateDateTime() {
        const now = new Date();
        const timeEl = document.getElementById('currentTime');
        const dateEl = document.getElementById('currentDate');
        if(timeEl) timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if(dateEl) dateEl.textContent = now.toLocaleDateString();
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();
    
    // 2. SEARCH FUNCTIONALITY
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query) {
                localStorage.setItem('searchQuery', query);
                window.location.href = 'search-results.html';
            } else {
                alert("Please type something to search");
            }
        });
    }

    // 3. SCAN BUTTON NAVIGATION
    const scanBtn = document.getElementById('scanBtn');
    if (scanBtn) {
        scanBtn.addEventListener('click', function() {
            window.location.href = 'scanner.html';
        });
    }

    // ==========================================
    // 4. BACKEND INTEGRATION LOGIC (For Scanner)
    // ==========================================
    // Ye function tab chalana hai jab aapka QR scan ho jaye
    window.handleQRScan = function(decodedText) {
        console.log("Connecting to backend for ID:", decodedText);

        // Server (server.js) se baat karna
        fetch(`/get-guide/${decodedText}`)
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    // Agar database mein link mil gaya toh wahan bhej do
                    window.location.href = data.url; 
                } else {
                    alert("Database mein iska video link nahi mila!");
                }
            })
            .catch(err => {
                console.error("Backend Error:", err);
                alert("Server se connection nahi ho raha. Pehle 'node server.js' run karein.");
            });
    }
    // Modal Functions
function openReportModal() {
    document.getElementById('reportModal').style.display = 'flex';
}

function closeReportModal() {
    document.getElementById('reportModal').style.display = 'none';
}

// Close modal if user clicks outside of it
window.onclick = function(event) {
    let modal = document.getElementById('reportModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Database Submission logic
document.getElementById('issueForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const data = {
        type: document.getElementById('issueType').value,
        location: document.getElementById('locName').value,
        message: document.getElementById('issueDesc').value
    };

    fetch('/api/report-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {
        if(result.success) {
            alert('Shukriya! Issue report database mein save ho gaya hai.');
            closeReportModal();
            this.reset();
        }
    })
    .catch(err => alert('Server connection error!'));
});
});