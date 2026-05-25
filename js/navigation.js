// =====================
// NAVIGATION FUNCTIONS
// =====================

// Function for "Explore Departments" button
function goToDepartments() {
    window.location.href = 'search-departments.html';
}

// Function for QR Scanner page (optional)
function goToScanner() {
    window.location.href = 'scanner.html';
}

// Function to go back home
function goToHome() {
    window.location.href = 'index.html';
}

// =====================
// QR → VIDEO FUNCTION
// =====================

function scanQRForDepartment(deptId) {

    // TEST: sirf Computer Science
    if (deptId !== 1) {
        alert("Video abhi sirf Computer Science Department ke liye available hai.");
        return;
    }

    // Temporary QR code (DB se match hoga)
    const qrCode = "CCS001";

    fetch(`http://localhost:5000/api/videos/${qrCode}`)
        .then(res => {
            if (!res.ok) {
                throw new Error("Video not found");
            }
            return res.json();
        })
        .then(data => {

            // Overlay popup
            const overlay = document.createElement("div");
            overlay.style.position = "fixed";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.width = "100%";
            overlay.style.height = "100%";
            overlay.style.background = "rgba(0,0,0,0.7)";
            overlay.style.display = "flex";
            overlay.style.alignItems = "center";
            overlay.style.justifyContent = "center";
            overlay.style.zIndex = "9999";

            overlay.innerHTML = `
                <div style="background:white; padding:20px; border-radius:12px; width:90%; max-width:600px;">
                    <h3 style="margin-bottom:10px;">${data.title}</h3>

                    <video controls autoplay style="width:100%; border-radius:8px;">
                        <source src="${data.url}" type="video/mp4">
                    </video>

                    <button 
                        style="margin-top:15px; padding:8px 16px; border:none; background:#2E7D32; color:white; border-radius:6px; cursor:pointer;"
                        onclick="this.parentElement.parentElement.remove()">
                        Close
                    </button>
                </div>
            `;

            document.body.appendChild(overlay);
        })
        .catch(() => {
            alert("Backend se video load nahi ho raha.");
        });
}

// =====================
// PAGE LOAD
// =====================

document.addEventListener('DOMContentLoaded', function() {
    console.log("FJWU Navigator Loaded");
});
