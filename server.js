const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use('/videos', express.static(path.join(__dirname, 'videos')));

// ========== SPLASH SCREEN AS HOMEPAGE ==========
app.get('/', (req, res) => {
    const splashPath = path.join(__dirname, 'splash.html');
    
    if (fs.existsSync(splashPath)) {
        res.sendFile(splashPath);
    } else {
        const indexPath = path.join(__dirname, 'index.html');
        if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            res.send(`
                <html>
                    <head><title>FJWU Navigator</title></head>
                    <body>
                        <h1>Welcome to FJWU Campus Navigator</h1>
                        <p>Available pages:</p>
                        <ul>
                            <li><a href="/splash.html">Splash Screen</a></li>
                            <li><a href="/index.html">Home Page</a></li>
                            <li><a href="/search-departments.html">Department Search</a></li>
                            <li><a href="/scanner.html">QR Scanner</a></li>
                        </ul>
                    </body>
                </html>
            `);
        }
    }
});

// ========== QR CODE API ==========
// ========== QR CODE API ==========
app.get('/get-guide/:id', (req, res) => {
    const qrId = req.params.id;
    const dbPath = path.join(__dirname, 'backend', 'data', 'campus.db');

    console.log(`🔍 Looking for QR: ${qrId}`);
    console.log(`📁 Database path: ${dbPath}`);

    try {
        // Check if file exists
        if (!fs.existsSync(dbPath)) {
            console.log(`❌ Database file not found at: ${dbPath}`);
            
            // Create default response for common QRs
            const defaultUrls = {
                'CCS001': 'video-player.html?file=guide.mp4',
                'CA002': 'video-player.html?file=computer_arts.mp4',
                'ENG003': 'video-player.html?file=english.mp4',
                'MPH004': 'video-player.html?file=mphall.mp4',
                'SPT005': 'video-player.html?file=sports_and_gym.mp4',
                'ISL006': 'video-player.html?file=islamiyat.mp4',
                'MED007': 'video-player.html?file=media.mp4',
                'MBD008': 'video-player.html?file=main_building.mp4',
                'VCL009': 'video-player.html?file=vc_lawn.mp4',
                'ECF010': 'video-player.html?file=economics_finance.mp4',
                'CHE011': 'video-player.html?file=chemistry.mp4',
                'PRT012': 'video-player.html?file=print_shop.mp4',
                'CAF013': 'video-player.html?file=cafeteria.mp4',
                'TRN014': 'video-player.html?file=transport_office.mp4',
                'BIC015': 'video-player.html?file=bic_building.mp4',
                'HST016': 'video-player.html?file=hostel.mp4',
                'ICT017': 'video-player.html?file=ict_lab.mp4',
                'AUD018': 'video-player.html?file=auditorium.mp4',
                'ENV019': 'video-player.html?file=environmental_science.mp4',
                'PRY020': 'video-player.html?file=prayer_room.mp4',
                'SWE011': 'video-player.html?file=software_engineering.mp4',
                'LIB005': 'video-player.html?file=library.mp4',
                'EDU006': 'video-player.html?file=education.mp4',
                'GNS007': 'video-player.html?file=gender_studies.mp4',
                'IR008': 'video-player.html?file=international_relations.mp4',
                'BAD009': 'video-player.html?file=business_admin.mp4',
                'PAD010': 'video-player.html?file=public_admin.mp4'
            };

            if (defaultUrls[qrId]) {
                console.log(`✅ Using default URL for ${qrId}`);
                return res.json({ 
                    success: true, 
                    url: defaultUrls[qrId],
                    note: 'Using default (database file missing)' 
                });
            }
            
            return res.json({ 
                success: false, 
                message: `Database file not found and no default for ${qrId}` 
            });
        }

        // Read and parse database
        const rawData = fs.readFileSync(dbPath, 'utf8');
        
        if (!rawData.trim()) {
            console.log('⚠️ Database file is empty');
            return res.json({ success: false, message: "Database is empty" });
        }

        const campusData = JSON.parse(rawData);

        const guide = campusData.find(item =>
            item.qrCode.toUpperCase().trim() === qrId.toUpperCase().trim()
        );

        if (guide) {
            console.log(`✅ Found: ${guide.qrCode} - ${guide.title}`);
            res.json({ success: true, url: guide.url });
        } else {
            console.log(`❌ Not found in database: ${qrId}`);
            res.json({ success: false, message: `Database mein ye ID nahi milt: ${qrId}` });
        }
    } catch (error) {
        console.error("❌ Database reading error:", error.message);
        res.json({ 
            success: false, 
            message: "Server error: " + error.message 
        });
    }
});
// ========== FEEDBACK API ==========
app.post('/api/feedback', (req, res) => {
    const { rating, type, message, email, page } = req.body;
    
    console.log("📥 Received feedback:", req.body);
    
    if (!rating || !message) {
        return res.status(400).json({ 
            success: false, 
            message: "Rating and message are required" 
        });
    }
    
    const feedbackPath = path.join(__dirname, 'backend', 'data', 'feedback.db');
    
    try {
        let feedbackData = [];
        
        if (fs.existsSync(feedbackPath)) {
            try {
                const rawData = fs.readFileSync(feedbackPath, 'utf8');
                const trimmedData = rawData.trim();
                
                if (trimmedData === '' || trimmedData === '��[]') {
                    console.log("⚠️ File is empty/corrupted, initializing...");
                    feedbackData = [];
                } else {
                    feedbackData = JSON.parse(trimmedData);
                }
            } catch (parseError) {
                console.error("❌ JSON parse error:", parseError.message);
                feedbackData = [];
            }
        } else {
            console.log("📄 Creating new feedback.db file");
            const dir = path.dirname(feedbackPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            feedbackData = [];
        }
        
        const newFeedback = {
            id: feedbackData.length > 0 ? Math.max(...feedbackData.map(f => f.id)) + 1 : 1,
            rating: parseInt(rating),
            type: type || 'suggestion',
            message: message.trim(),
            email: email || '',
            page: page || 'unknown',
            date: new Date().toISOString(),
            ip: req.ip
        };
        
        feedbackData.push(newFeedback);
        
        fs.writeFileSync(feedbackPath, JSON.stringify(feedbackData, null, 2), 'utf8');
        
        console.log("✅ Feedback saved! ID:", newFeedback.id, "Total:", feedbackData.length);
        
        res.json({ 
            success: true, 
            message: "Feedback submitted successfully",
            id: newFeedback.id
        });
        
    } catch (error) {
        console.error("❌ Feedback save error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to save feedback: " + error.message 
        });
    }
});

// ========== GET ALL FEEDBACK ==========
app.get('/api/feedback', (req, res) => {
    const feedbackPath = path.join(__dirname, 'backend', 'data', 'feedback.db');
    
    try {
        if (!fs.existsSync(feedbackPath)) {
            return res.json({ 
                success: true, 
                feedback: [],
                count: 0 
            });
        }
        
        const rawData = fs.readFileSync(feedbackPath, 'utf8');
        const trimmedData = rawData.trim();
        
        if (trimmedData === '' || trimmedData === '��[]') {
            return res.json({ 
                success: true, 
                feedback: [],
                count: 0 
            });
        }
        
        const feedbackData = JSON.parse(trimmedData);
        
        res.json({ 
            success: true, 
            feedback: feedbackData,
            count: feedbackData.length
        });
        
    } catch (error) {
        console.error("❌ Get feedback error:", error);
        res.json({ 
            success: true, 
            feedback: [],
            count: 0 
        });
    }
});

// ========== REPORT ISSUE API ==========
app.post('/api/report-issue', (req, res) => {
    console.log("=".repeat(50));
    console.log("📥 REPORT ISSUE API CALLED!");
    console.log("Request body:", req.body);
    
    const { 
        name, 
        contact, 
        issueType, 
        details, 
        location 
    } = req.body;
    
    console.log("Parsed data:", { name, contact, issueType, details, location });
    
    if (!name || !contact || !issueType || !details) {
        console.log("❌ Validation failed - missing fields");
        return res.status(400).json({ 
            success: false, 
            message: "Required fields: Name, Contact, Issue Type, Details" 
        });
    }
    
    const reportsPath = path.join(__dirname, 'backend', 'data', 'reports.db');
    console.log("Reports path:", reportsPath);
    
    try {
        // Create directory if it doesn't exist
        const dir = path.dirname(reportsPath);
        if (!fs.existsSync(dir)) {
            console.log("📁 Creating directory:", dir);
            fs.mkdirSync(dir, { recursive: true });
        }
        
        let reportsData = [];
        
        // Check if file exists
        if (fs.existsSync(reportsPath)) {
            console.log("📄 Reports.db file exists");
            try {
                const rawData = fs.readFileSync(reportsPath, 'utf8');
                console.log("File size:", rawData.length);
                
                if (rawData.trim() === '') {
                    console.log("⚠️ File is empty");
                    reportsData = [];
                } else {
                    reportsData = JSON.parse(rawData);
                    console.log(`📊 Existing reports: ${reportsData.length}`);
                }
            } catch (parseError) {
                console.error("❌ JSON parse error:", parseError.message);
                console.log("Starting with empty array");
                reportsData = [];
            }
        } else {
            console.log("📄 Creating new reports.db file");
            reportsData = [];
        }
        
        // Create new report
        const newReport = {
            id: reportsData.length > 0 ? Math.max(...reportsData.map(r => r.id)) + 1 : 1,
            name: name.trim(),
            contact: contact.trim(),
            issueType: issueType.trim(),
            details: details.trim(),
            location: location ? location.trim() : '',
            page: 'home',
            date: new Date().toISOString(),
            timestamp: new Date().toLocaleString('en-PK'),
            status: 'pending',
            ip: req.ip || 'unknown'
        };
        
        console.log("📋 New report:", newReport);
        
        reportsData.push(newReport);
        
        // Save to file
        fs.writeFileSync(reportsPath, JSON.stringify(reportsData, null, 2), 'utf8');
        
        console.log("✅ Report saved to reports.db!");
        console.log(`📊 Total reports now: ${reportsData.length}`);
        
        // Verify file was saved
        const fileStats = fs.statSync(reportsPath);
        console.log(`📁 File size after save: ${fileStats.size} bytes`);
        
        res.json({ 
            success: true, 
            message: "Issue reported successfully!",
            reportId: newReport.id
        });
        
    } catch (error) {
        console.error("❌ Report save error:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ 
            success: false, 
            message: "Failed to save report: " + error.message 
        });
    }
    
    console.log("=".repeat(50));
});

// ========== GET ALL REPORTS ==========
// ========== SIMPLE TEST ENDPOINT ==========
app.get('/api/test', (req, res) => {
    console.log("✅ /api/test endpoint called");
    res.json({
        success: true,
        message: "Server is working perfectly!",
        time: new Date().toISOString(),
        endpoints: [
            "GET  /api/debug",
            "GET  /api/test", 
            "POST /api/feedback",
            "POST /api/report-issue",
            "GET  /api/reports",
            "POST /api/create-test",
            "DELETE /api/reports/clear"
        ]
    });
});
// ========== DEBUG ENDPOINTS ==========
app.get('/api/debug', (req, res) => {
    console.log("🔧 Debug endpoint called");
    
    const reportsPath = path.join(__dirname, 'backend', 'data', 'reports.db');
    const feedbackPath = path.join(__dirname, 'backend', 'data', 'feedback.db');
    const campusPath = path.join(__dirname, 'backend', 'data', 'campus.db');
    
    const result = {
        server: {
            time: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage()
        },
        files: {
            reports: {
                exists: fs.existsSync(reportsPath),
                path: reportsPath,
                size: fs.existsSync(reportsPath) ? fs.statSync(reportsPath).size : 0
            },
            feedback: {
                exists: fs.existsSync(feedbackPath),
                path: feedbackPath,
                size: fs.existsSync(feedbackPath) ? fs.statSync(feedbackPath).size : 0
            },
            campus: {
                exists: fs.existsSync(campusPath),
                path: campusPath,
                size: fs.existsSync(campusPath) ? fs.statSync(campusPath).size : 0
            }
        },
        endpoints: [
            "GET  /api/debug",
            "POST /api/feedback",
            "GET  /api/feedback",
            "POST /api/report-issue",
            "GET  /api/reports",
            "GET  /get-guide/:id"
        ]
    };
    
    console.log("Debug info:", result);
    
    res.json(result);
});

app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: "Server is working!",
        time: new Date().toISOString(),
        instructions: "Use POST /api/report-issue to submit reports"
    });
});

// ========== CLEAR ALL REPORTS (For testing) ==========
app.delete('/api/reports/clear', (req, res) => {
    const reportsPath = path.join(__dirname, 'backend', 'data', 'reports.db');
    
    try {
        fs.writeFileSync(reportsPath, JSON.stringify([]), 'utf8');
        console.log("🗑️ All reports cleared");
        res.json({ success: true, message: "All reports cleared" });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

// ========== CREATE TEST DATA ==========
app.post('/api/create-test', (req, res) => {
    const reportsPath = path.join(__dirname, 'backend', 'data', 'reports.db');
    const dir = path.dirname(reportsPath);
    
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    const testData = [
        {
            id: 1,
            name: "Test User 1",
            contact: "test1@example.com",
            issueType: "qr_not_scanning",
            details: "QR code not working",
            location: "Main Building",
            date: new Date().toISOString(),
            status: "pending"
        },
        {
            id: 2,
            name: "Test User 2",
            contact: "test2@example.com",
            issueType: "video_not_playing",
            details: "Video not loading",
            location: "VC Lawn",
            date: new Date().toISOString(),
            status: "pending"
        }
    ];
    
    fs.writeFileSync(reportsPath, JSON.stringify(testData, null, 2), 'utf8');
    
    console.log("✅ Test data created at:", reportsPath);
    
    res.json({
        success: true,
        message: "Test data created",
        path: reportsPath,
        count: testData.length
    });
});

// ========== START SERVER ==========
app.listen(PORT, () => {
    console.log("=".repeat(60));
    console.log(`🚀 SERVER STARTED: http://localhost:${PORT}`);
    console.log(`📁 Working directory: ${__dirname}`);
    console.log(`📁 Reports DB: ${path.join(__dirname, 'backend', 'data', 'reports.db')}`);
    console.log(`💬 Feedback DB: ${path.join(__dirname, 'backend', 'data', 'feedback.db')}`);
    console.log("=".repeat(60));
    console.log("📋 TEST ENDPOINTS:");
    console.log("1. GET  /api/debug           - Check server status");
    console.log("2. GET  /api/test            - Simple test");
    console.log("3. POST /api/create-test     - Create test data");
    console.log("4. GET  /api/reports         - View reports");
    console.log("5. POST /api/report-issue    - Submit report");
    console.log("6. DELETE /api/reports/clear - Clear all reports");
    console.log("=".repeat(60));
});