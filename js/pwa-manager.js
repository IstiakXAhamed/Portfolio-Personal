// ===================================
// PWA REGISTRATION & INSTALL PROMPT
// ===================================

class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.setupInstallPrompt();
        this.checkForUpdates();
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('✅ Service Worker registered:', registration);

                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });

            } catch (error) {
                console.log('❌ Service Worker registration failed:', error);
            }
        }
    }

    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        window.addEventListener('appinstalled', () => {
            console.log('✅ PWA installed');
            this.deferredPrompt = null;
            if (window.notificationSystem) {
                window.notificationSystem.show(
                    '🎉 App Installed!',
                    'Portfolio has been installed on your device',
                    'success'
                );
            }
        });
    }

    showInstallButton() {
        const button = document.createElement('button');
        button.id = 'pwa-install-btn';
        button.innerHTML = '📱';
        button.title = 'Install App';
        button.style.cssText = `
            position: fixed;
            bottom: 830px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: var(--bg-card);
            border: 3px solid #10B981;
            border-radius: 50%;
            font-size: 1.8rem;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 5px 20px rgba(16, 185, 129, 0.4);
            animation: pulse 2s infinite;
        `;

        button.addEventListener('click', () => this.promptInstall());
        document.body.appendChild(button);
    }

    async promptInstall() {
        if (!this.deferredPrompt) {
            alert('App is already installed or cannot be installed on this device');
            return;
        }

        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        
        console.log(`User response to install prompt: ${outcome}`);
        
        if (outcome === 'accepted') {
            console.log('✅ User accepted install');
        } else {
            console.log('❌ User dismissed install');
        }

        this.deferredPrompt = null;
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) installBtn.remove();
    }

    showUpdateNotification() {
        if (window.notificationSystem) {
            window.notificationSystem.show(
                '🔄 Update Available',
                'A new version is ready. Refresh to update.',
                'info'
            );
        }
    }

    checkForUpdates() {
        if ('serviceWorker' in navigator) {
            setInterval(async () => {
                const registration = await navigator.serviceWorker.getRegistration();
                if (registration) {
                    registration.update();
                }
            }, 60000); // Check every minute
        }
    }

    // Enable offline mode
    enableOfflineMode() {
        window.addEventListener('online', () => {
            if (window.notificationSystem) {
                window.notificationSystem.show(
                    '✅ Back Online',
                    'Your connection has been restored',
                    'success'
                );
            }
        });

        window.addEventListener('offline', () => {
            if (window.notificationSystem) {
                window.notificationSystem.show(
                    '⚠️ You\'re Offline',
                    'Some features may be limited',
                    'warning'
                );
            }
        });
    }
}

// Initialize PWA
let pwaManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        pwaManager = new PWAManager();
        pwaManager.enableOfflineMode();
    });
} else {
    pwaManager = new PWAManager();
    pwaManager.enableOfflineMode();
}

window.pwaManager = pwaManager;
