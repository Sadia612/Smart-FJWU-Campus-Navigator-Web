const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Sab departments ke QR codes
const departments = [
    { code: 'CCS001', title: 'Computer Science' },
    { code: 'CA002', title: 'Computer Arts' },
    { code: 'ENG003', title: 'English Department' },
    { code: 'MPH004', title: 'M.Phil Hall' },
    { code: 'LIB005', title: 'Library' },
    { code: 'EDU006', title: 'Education Department' },
    { code: 'GNS007', title: 'Gender Studies' },
    { code: 'IR008', title: 'International Relations' },
    { code: 'BAD009', title: 'Business Administration' },
    { code: 'PAD010', title: 'Public Administration' },
    { code: 'SWE011', title: 'Software Engineering' },
    { code: 'SPT005', title: 'Sports and Gymnasium' },
    { code: 'ISL006', title: 'Department of Islamiyat' },
    { code: 'MED007', title: 'Department of Media' },
    { code: 'MBD008', title: 'Main Building' },
    { code: 'VCL009', title: 'VC Lawn' },
    { code: 'ECF010', title: 'Department of Economics & Finance' },
    { code: 'CHE011', title: 'Department of Chemistry' },
    { code: 'PRT012', title: 'Print Shop' },
    { code: 'CAF013', title: 'Cafeteria' },
    { code: 'TRN014', title: 'Transport Office' },
    { code: 'BIC015', title: 'BIC Building' },
    { code: 'HST016', title: 'Hostel' },
    { code: 'ICT017', title: 'ICT Lab' },
    { code: 'AUD018', title: 'New Auditorium' },
    { code: 'ENV019', title: 'Department of Environmental Science' },
    { code: 'PRY020', title: 'Prayer Room' }
];

// Output folder
const outputDir = 'qrcodes';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
    console.log(`📁 Created folder: ${outputDir}`);
}

// Generate QR codes
async function generateQR() {
    console.log('📱 Generating QR Codes...\n');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const dept of departments) {
        try {
            const filePath = path.join(outputDir, `${dept.code}.png`);
            
            await QRCode.toFile(filePath, dept.code, {
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                },
                width: 400,
                margin: 2,
                errorCorrectionLevel: 'H'
            });
            
            console.log(`✅ ${dept.code} - ${dept.title}`);
            successCount++;
            
        } catch (err) {
            console.log(`❌ ${dept.code}: ${err.message}`);
            errorCount++;
        }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`🎉 Total QR Codes Generated: ${successCount}`);
    console.log(`📁 Location: ${path.join(__dirname, outputDir)}`);
    console.log('='.repeat(50));
}

generateQR();