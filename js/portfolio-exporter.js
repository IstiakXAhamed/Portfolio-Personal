// ===================================
// PORTFOLIO EXPORT & PDF GENERATOR
// ===================================

class PortfolioExporter {
    constructor() {
        this.init();
    }

    init() {
        this.createExportButton();
    }

    createExportButton() {
        const button = document.createElement('button');
        button.id = 'export-btn';
        button.innerHTML = '📥';
        button.title = 'Export Portfolio';
        button.style.cssText = `
            position: fixed;
            bottom: 910px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: var(--bg-card);
            border: 3px solid #EF4444;
            border-radius: 50%;
            font-size: 1.8rem;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 5px 20px rgba(239, 68, 68, 0.4);
        `;
        button.addEventListener('click', () => this.showExportOptions());
        document.body.appendChild(button);
    }

    showExportOptions() {
        const modal = document.createElement('div');
        modal.id = 'export-modal';
        modal.innerHTML = `
            <div class="export-container">
                <div class="export-header">
                    <h2>📥 Export Portfolio</h2>
                    <button class="close-btn" onclick="document.getElementById('export-modal').remove()">✕</button>
                </div>
                
                <div class="export-options">
                    <div class="export-option" data-type="pdf">
                        <div class="option-icon">📄</div>
                        <h3>Export as PDF</h3>
                        <p>Generate a professional PDF version of your portfolio</p>
                        <button class="export-action-btn" onclick="portfolioExporter.exportAsPDF()">
                            Generate PDF
                        </button>
                    </div>

                    <div class="export-option" data-type="resume">
                        <div class="option-icon">📋</div>
                        <h3>Generate Resume</h3>
                        <p>Create a formatted resume from your portfolio data</p>
                        <button class="export-action-btn" onclick="portfolioExporter.generateResume()">
                            Generate Resume
                        </button>
                    </div>

                    <div class="export-option" data-type="json">
                        <div class="option-icon">📊</div>
                        <h3>Export Data (JSON)</h3>
                        <p>Download your portfolio data in JSON format</p>
                        <button class="export-action-btn" onclick="portfolioExporter.exportAsJSON()">
                            Download JSON
                        </button>
                    </div>

                    <div class="export-option" data-type="print">
                        <div class="option-icon">🖨️</div>
                        <h3>Print Portfolio</h3>
                        <p>Print-optimized version of your portfolio</p>
                        <button class="export-action-btn" onclick="portfolioExporter.printPortfolio()">
                            Print Now
                        </button>
                    </div>

                    <div class="export-option" data-type="share">
                        <div class="option-icon">🔗</div>
                        <h3>Share Link</h3>
                        <p>Generate a shareable link to your portfolio</p>
                        <button class="export-action-btn" onclick="portfolioExporter.sharePortfolio()">
                            Copy Link
                        </button>
                    </div>

                    <div class="export-option" data-type="html">
                        <div class="option-icon">💾</div>
                        <h3>Download HTML</h3>
                        <p>Download complete HTML source code</p>
                        <button class="export-action-btn" onclick="portfolioExporter.exportAsHTML()">
                            Download HTML
                        </button>
                    </div>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10003;
            animation: fadeIn 0.3s ease;
        `;

        document.body.appendChild(modal);
    }

    async exportAsPDF() {
        if (window.notificationSystem) {
            window.notificationSystem.show(
                '📄 Generating PDF...',
                'This may take a few moments',
                'info'
            );
        }

        // Simulate PDF generation (in real implementation, use jsPDF or similar library)
        setTimeout(() => {
            const printContent = this.generatePrintableContent();
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();

            if (window.notificationSystem) {
                window.notificationSystem.show(
                    '✅ PDF Ready!',
                    'Click print to save as PDF',
                    'success'
                );
            }
        }, 1000);

        document.getElementById('export-modal').remove();
    }

    generatePrintableContent() {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Portfolio - PDF Export</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
                    h1 { color: #2d3748; margin-bottom: 20px; border-bottom: 3px solid #4299e1; padding-bottom: 10px; }
                    h2 { color: #4299e1; margin: 30px 0 15px; }
                    .section { margin-bottom: 30px; page-break-inside: avoid; }
                    .skills { display: flex; flex-wrap: wrap; gap: 10px; }
                    .skill-tag { background: #e2e8f0; padding: 5px 15px; border-radius: 20px; }
                    .project { margin-bottom: 20px; padding: 15px; border-left: 4px solid #4299e1; background: #f7fafc; }
                    @media print { 
                        body { padding: 20px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <h1>Professional Portfolio</h1>
                
                <div class="section">
                    <h2>About</h2>
                    <p>${document.querySelector('.about-section p')?.textContent || 'Professional developer'}</p>
                </div>

                <div class="section">
                    <h2>Skills</h2>
                    <div class="skills">
                        <div class="skill-tag">JavaScript</div>
                        <div class="skill-tag">React</div>
                        <div class="skill-tag">Node.js</div>
                        <div class="skill-tag">Python</div>
                        <div class="skill-tag">CSS</div>
                        <div class="skill-tag">HTML</div>
                    </div>
                </div>

                <div class="section">
                    <h2>Projects</h2>
                    <div class="project">
                        <h3>Featured Projects</h3>
                        <p>Multiple professional projects showcasing modern web development skills</p>
                    </div>
                </div>

                <div class="section">
                    <h2>Contact</h2>
                    <p>Available for freelance work and collaboration opportunities</p>
                </div>
            </body>
            </html>
        `;
    }

    generateResume() {
        const resumeData = {
            name: 'Your Name',
            title: 'Full Stack Developer',
            email: 'your@email.com',
            phone: '+1234567890',
            skills: ['JavaScript', 'React', 'Node.js', 'Python', 'CSS', 'HTML'],
            experience: [
                { title: 'Senior Developer', company: 'Tech Company', duration: '2020-Present' }
            ],
            education: [
                { degree: 'Computer Science', school: 'University', year: '2019' }
            ]
        };

        const blob = new Blob([JSON.stringify(resumeData, null, 2)], { type: 'application/json' });
        this.downloadFile(blob, 'resume.json');

        if (window.notificationSystem) {
            window.notificationSystem.show(
                '✅ Resume Generated!',
                'Resume data downloaded as JSON',
                'success'
            );
        }

        document.getElementById('export-modal').remove();
    }

    exportAsJSON() {
        const portfolioData = {
            exportDate: new Date().toISOString(),
            analytics: JSON.parse(localStorage.getItem('portfolioAnalytics') || '{}'),
            userProfile: JSON.parse(localStorage.getItem('userProfile') || '{}'),
            theme: localStorage.getItem('selectedTheme'),
            version: '1.0.0'
        };

        const blob = new Blob([JSON.stringify(portfolioData, null, 2)], { type: 'application/json' });
        this.downloadFile(blob, 'portfolio-data.json');

        if (window.notificationSystem) {
            window.notificationSystem.show(
                '✅ Data Exported!',
                'Portfolio data downloaded successfully',
                'success'
            );
        }

        document.getElementById('export-modal').remove();
    }

    printPortfolio() {
        window.print();
        document.getElementById('export-modal').remove();

        if (window.notificationSystem) {
            window.notificationSystem.show(
                '🖨️ Print Dialog Opened',
                'Use print dialog to save or print',
                'info'
            );
        }
    }

    sharePortfolio() {
        const url = window.location.href;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                if (window.notificationSystem) {
                    window.notificationSystem.show(
                        '✅ Link Copied!',
                        'Portfolio link copied to clipboard',
                        'success'
                    );
                }
            });
        } else {
            prompt('Copy this link:', url);
        }

        document.getElementById('export-modal').remove();
    }

    exportAsHTML() {
        const htmlContent = document.documentElement.outerHTML;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        this.downloadFile(blob, 'portfolio.html');

        if (window.notificationSystem) {
            window.notificationSystem.show(
                '✅ HTML Downloaded!',
                'Portfolio source code downloaded',
                'success'
            );
        }

        document.getElementById('export-modal').remove();
    }

    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Add export styles
const exportStyle = document.createElement('style');
exportStyle.textContent = `
    .export-container {
        background: var(--bg-card);
        border-radius: 20px;
        width: 90%;
        max-width: 1000px;
        max-height: 90vh;
        overflow-y: auto;
        padding: 30px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }

    .export-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid var(--accent-primary);
    }

    .export-header h2 {
        color: var(--text-primary);
        font-size: 2rem;
        margin: 0;
    }

    .export-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
    }

    .export-option {
        background: var(--bg-secondary);
        border-radius: 15px;
        padding: 25px;
        text-align: center;
        border: 2px solid var(--accent-secondary);
        transition: all 0.3s ease;
    }

    .export-option:hover {
        transform: translateY(-5px);
        border-color: var(--accent-primary);
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    .option-icon {
        font-size: 4rem;
        margin-bottom: 15px;
    }

    .export-option h3 {
        color: var(--text-primary);
        margin-bottom: 10px;
        font-size: 1.2rem;
    }

    .export-option p {
        color: var(--text-secondary);
        margin-bottom: 20px;
        font-size: 0.9rem;
        line-height: 1.6;
    }

    .export-action-btn {
        background: var(--accent-primary);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        width: 100%;
    }

    .export-action-btn:hover {
        background: var(--accent-secondary);
        transform: scale(1.05);
    }

    @media print {
        .export-container,
        #export-modal,
        #export-btn,
        nav,
        footer,
        .floating-buttons {
            display: none !important;
        }
    }
`;
document.head.appendChild(exportStyle);

// Initialize exporter
let portfolioExporter;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        portfolioExporter = new PortfolioExporter();
    });
} else {
    portfolioExporter = new PortfolioExporter();
}

window.portfolioExporter = portfolioExporter;
