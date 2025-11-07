// ===================================
// QUICK ACTIONS DROPDOWN MENU
// Single dropdown replacing multiple floating buttons
// ===================================

class QuickActions {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createActionButton();
    }

    createActionButton() {
        const container = document.createElement('div');
        container.id = 'quick-actions-container';
        container.innerHTML = `
            <button id="quick-actions-btn" class="quick-actions-main-btn" title="Quick Actions">
                <span class="action-icon">⚡</span>
                <span class="action-label">Actions</span>
            </button>
            
            <div id="quick-actions-menu" class="quick-actions-menu hidden">
                <div class="actions-header">
                    <span>Quick Actions</span>
                </div>
                
                <button class="action-item" data-action="download-cv">
                    <span class="item-icon">📄</span>
                    <div class="item-content">
                        <span class="item-title">Download CV</span>
                        <span class="item-desc">Get my resume PDF</span>
                    </div>
                </button>

                <button class="action-item" data-action="email-me">
                    <span class="item-icon">✉️</span>
                    <div class="item-content">
                        <span class="item-title">Email Me</span>
                        <span class="item-desc">Send me a message</span>
                    </div>
                </button>

                <button class="action-item" data-action="schedule-call">
                    <span class="item-icon">📞</span>
                    <div class="item-content">
                        <span class="item-title">Schedule Call</span>
                        <span class="item-desc">Book a meeting</span>
                    </div>
                </button>

                <button class="action-item" data-action="share-portfolio">
                    <span class="item-icon">🔗</span>
                    <div class="item-content">
                        <span class="item-title">Share Portfolio</span>
                        <span class="item-desc">Copy link to clipboard</span>
                    </div>
                </button>

                <button class="action-item" data-action="view-github">
                    <span class="item-icon">🐙</span>
                    <div class="item-content">
                        <span class="item-title">GitHub Profile</span>
                        <span class="item-desc">View my repositories</span>
                    </div>
                </button>

                <button class="action-item" data-action="linkedin">
                    <span class="item-icon">💼</span>
                    <div class="item-content">
                        <span class="item-title">LinkedIn</span>
                        <span class="item-desc">Connect with me</span>
                    </div>
                </button>
            </div>
        `;

        document.body.appendChild(container);
        this.attachEventListeners();
    }

    attachEventListeners() {
        const mainBtn = document.getElementById('quick-actions-btn');
        const menu = document.getElementById('quick-actions-menu');

        mainBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#quick-actions-container')) {
                this.closeMenu();
            }
        });

        // Action handlers
        document.querySelectorAll('.action-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleAction(action);
                this.closeMenu();
            });
        });
    }

    toggleMenu() {
        this.isOpen = !this.isOpen;
        const menu = document.getElementById('quick-actions-menu');
        const btn = document.getElementById('quick-actions-btn');
        
        if (this.isOpen) {
            menu.classList.remove('hidden');
            btn.classList.add('active');
            menu.style.animation = 'slideInUp 0.3s ease';
        } else {
            this.closeMenu();
        }
    }

    closeMenu() {
        this.isOpen = false;
        const menu = document.getElementById('quick-actions-menu');
        const btn = document.getElementById('quick-actions-btn');
        
        menu.classList.add('hidden');
        btn.classList.remove('active');
    }

    handleAction(action) {
        switch(action) {
            case 'download-cv':
                this.downloadCV();
                break;
            case 'email-me':
                this.emailMe();
                break;
            case 'schedule-call':
                this.scheduleCall();
                break;
            case 'share-portfolio':
                this.sharePortfolio();
                break;
            case 'view-github':
                this.viewGitHub();
                break;
            case 'linkedin':
                this.openLinkedIn();
                break;
        }
    }

    downloadCV() {
        // Create a simple CV download or link to your actual CV
        if (window.notificationSystem) {
            window.notificationSystem.show(
                '📄 Download CV',
                'CV download started',
                'success'
            );
        }
        
        // Replace with your actual CV URL
        const cvUrl = '/assets/cv.pdf';
        const a = document.createElement('a');
        a.href = cvUrl;
        a.download = 'Sanim_Ahmed_CV.pdf';
        a.click();
    }

    emailMe() {
        const email = 'your.email@example.com'; // Replace with your email
        window.location.href = `mailto:${email}?subject=Portfolio Contact&body=Hi, I found your portfolio and would like to connect.`;
        
        if (window.notificationSystem) {
            window.notificationSystem.show(
                '✉️ Opening Email',
                'Your default email client will open',
                'info'
            );
        }
    }

    scheduleCall() {
        // Link to Calendly or similar booking tool
        const calendlyUrl = 'https://calendly.com/yourusername'; // Replace with your link
        window.open(calendlyUrl, '_blank');
        
        if (window.notificationSystem) {
            window.notificationSystem.show(
                '📞 Schedule Call',
                'Opening booking calendar',
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
                        '🔗 Link Copied!',
                        'Portfolio link copied to clipboard',
                        'success'
                    );
                }
            }).catch(() => {
                prompt('Copy this link:', url);
            });
        } else {
            prompt('Copy this link:', url);
        }
    }

    viewGitHub() {
        const githubUrl = 'https://github.com/yourusername'; // Replace with your GitHub
        window.open(githubUrl, '_blank');
    }

    openLinkedIn() {
        const linkedinUrl = 'https://linkedin.com/in/yourusername'; // Replace with your LinkedIn
        window.open(linkedinUrl, '_blank');
    }
}

// Add styles
const quickActionsStyle = document.createElement('style');
quickActionsStyle.textContent = `
    #quick-actions-container {
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 1000;
    }

    .quick-actions-main-btn {
        width: 70px;
        height: 70px;
        background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
        border: none;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
        color: white;
        font-weight: 600;
    }

    .quick-actions-main-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 12px 35px rgba(255, 137, 6, 0.5);
    }

    .quick-actions-main-btn.active {
        transform: scale(1.05) rotate(90deg);
    }

    .action-icon {
        font-size: 1.8rem;
        display: block;
    }

    .action-label {
        font-size: 0.7rem;
        margin-top: 2px;
    }

    .quick-actions-menu {
        position: absolute;
        bottom: 85px;
        right: 0;
        width: 320px;
        background: var(--bg-card);
        border-radius: 15px;
        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5);
        border: 2px solid var(--accent-secondary);
        overflow: hidden;
    }

    .quick-actions-menu.hidden {
        display: none;
    }

    .actions-header {
        padding: 15px 20px;
        background: var(--bg-secondary);
        border-bottom: 2px solid var(--accent-primary);
        font-weight: 600;
        color: var(--text-primary);
        font-size: 1.1rem;
    }

    .action-item {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px 20px;
        background: transparent;
        border: none;
        border-bottom: 1px solid var(--accent-secondary);
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: left;
    }

    .action-item:last-child {
        border-bottom: none;
    }

    .action-item:hover {
        background: var(--bg-secondary);
        padding-left: 25px;
    }

    .item-icon {
        font-size: 2rem;
        flex-shrink: 0;
    }

    .item-content {
        display: flex;
        flex-direction: column;
        gap: 3px;
        flex: 1;
    }

    .item-title {
        color: var(--text-primary);
        font-weight: 600;
        font-size: 1rem;
    }

    .item-desc {
        color: var(--text-secondary);
        font-size: 0.85rem;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: 768px) {
        .quick-actions-menu {
            width: 280px;
            right: -105px;
        }

        .quick-actions-main-btn {
            width: 60px;
            height: 60px;
        }

        .action-icon {
            font-size: 1.5rem;
        }

        .action-label {
            font-size: 0.65rem;
        }
    }
`;
document.head.appendChild(quickActionsStyle);

// Initialize
let quickActions;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        quickActions = new QuickActions();
    });
} else {
    quickActions = new QuickActions();
}

window.quickActions = quickActions;
