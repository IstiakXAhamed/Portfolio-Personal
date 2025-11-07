// ===================================
// VOICE & ACCESSIBILITY FEATURES
// ===================================

// Voice Command Recognition System
class VoiceCommandSystem {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.commands = this.loadCommands();
        this.init();
    }

    loadCommands() {
        return {
            'home': () => this.navigate('/'),
            'about': () => this.navigate('pages/about.html'),
            'projects': () => this.navigate('pages/projects.html'),
            'github': () => this.navigate('pages/github-stats.html'),
            'showcase': () => this.navigate('pages/showcase.html'),
            'terminal': () => this.navigate('pages/terminal.html'),
            'scroll up': () => window.scrollTo({ top: 0, behavior: 'smooth' }),
            'scroll down': () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }),
            'dark theme': () => this.changeTheme('dark'),
            'light theme': () => this.changeTheme('light'),
            'cyberpunk theme': () => this.changeTheme('cyberpunk'),
            'ocean theme': () => this.changeTheme('ocean'),
            'read page': () => textToSpeech.readPage(),
            'stop reading': () => textToSpeech.stop(),
            'open chatbot': () => this.openChatbot(),
            'close chatbot': () => this.closeChatbot(),
            'help': () => this.showHelp()
        };
    }

    init() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Speech recognition not supported');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event) => this.handleResult(event);
        this.recognition.onerror = (event) => console.error('Speech recognition error:', event.error);
        
        this.createVoiceButton();
    }

    createVoiceButton() {
        const button = document.createElement('div');
        button.id = 'voice-command-btn';
        button.innerHTML = '🎤';
        button.title = 'Voice Commands (Click to activate)';
        button.style.cssText = `
            position: fixed;
            bottom: 270px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: var(--bg-card);
            border: 3px solid var(--accent-primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;

        button.addEventListener('click', () => this.toggle());
        document.body.appendChild(button);
        this.button = button;
    }

    toggle() {
        if (this.isListening) {
            this.stop();
        } else {
            this.start();
        }
    }

    start() {
        if (!this.recognition) {
            alert('Voice commands not supported in your browser. Try Chrome or Edge.');
            return;
        }

        try {
            this.recognition.start();
            this.isListening = true;
            this.button.style.background = '#ff4444';
            this.button.style.animation = 'pulse 1.5s infinite';
            this.showNotification('🎤 Listening for commands...', 'info');
        } catch (error) {
            console.error('Failed to start recognition:', error);
        }
    }

    stop() {
        if (this.recognition) {
            this.recognition.stop();
            this.isListening = false;
            this.button.style.background = 'var(--bg-card)';
            this.button.style.animation = 'none';
        }
    }

    handleResult(event) {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        console.log('Voice command:', transcript);

        let commandExecuted = false;
        for (const [command, action] of Object.entries(this.commands)) {
            if (transcript.includes(command)) {
                action();
                this.showNotification(`✅ Executed: ${command}`, 'success');
                commandExecuted = true;
                break;
            }
        }

        if (!commandExecuted) {
            this.showNotification(`❌ Unknown command: "${transcript}"`, 'error');
        }
    }

    navigate(path) {
        if (path.startsWith('/')) {
            window.location.href = path;
        } else {
            window.location.href = path;
        }
    }

    changeTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('selectedTheme', theme);
    }

    openChatbot() {
        const fab = document.getElementById('chatbot-fab');
        if (fab) fab.click();
    }

    closeChatbot() {
        const closeBtn = document.getElementById('chatbot-close');
        if (closeBtn) closeBtn.click();
    }

    showHelp() {
        const commands = Object.keys(this.commands).join('\n• ');
        this.showNotification(`Available commands:\n• ${commands}`, 'info');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `voice-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#ff4444' : '#2196F3'};
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            z-index: 10001;
            font-weight: bold;
            animation: slideDown 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Keyboard Navigation Enhancement
class KeyboardNavigationEnhancement {
    constructor() {
        this.init();
    }

    init() {
        // Add skip to content link
        this.addSkipLink();
        
        // Enhance focus visibility
        this.enhanceFocusStyles();
        
        // Add keyboard shortcuts
        this.addKeyboardShortcuts();
        
        // Make all interactive elements keyboard accessible
        this.makeElementsAccessible();
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: var(--accent-primary);
            color: white;
            padding: 8px 16px;
            text-decoration: none;
            border-radius: 0 0 5px 0;
            z-index: 10000;
            transition: top 0.3s ease;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    enhanceFocusStyles() {
        const focusStyle = document.createElement('style');
        focusStyle.textContent = `
            *:focus {
                outline: 3px solid var(--accent-primary);
                outline-offset: 2px;
            }

            button:focus, a:focus, input:focus, textarea:focus {
                outline: 3px solid var(--accent-primary);
                outline-offset: 2px;
                box-shadow: 0 0 0 4px rgba(var(--accent-primary-rgb), 0.2);
            }

            .card:focus, .project-card:focus {
                transform: scale(1.05);
                outline: 3px solid var(--accent-primary);
            }
        `;
        document.head.appendChild(focusStyle);
    }

    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K: Open search/chatbot
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('chatbot-fab')?.click();
            }

            // Ctrl/Cmd + /: Show keyboard shortcuts
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.showKeyboardShortcuts();
            }

            // Arrow keys for navigation
            if (e.altKey) {
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }
            }
        });
    }

    showKeyboardShortcuts() {
        const shortcuts = [
            { keys: 'Ctrl/Cmd + K', action: 'Open Chatbot' },
            { keys: 'Ctrl/Cmd + /', action: 'Show Shortcuts' },
            { keys: 'Alt + ↑', action: 'Scroll to Top' },
            { keys: 'Alt + ↓', action: 'Scroll to Bottom' },
            { keys: 'Tab', action: 'Navigate Forward' },
            { keys: 'Shift + Tab', action: 'Navigate Backward' },
            { keys: 'Enter', action: 'Activate Element' },
            { keys: 'Esc', action: 'Close Modals' }
        ];

        const modal = document.createElement('div');
        modal.className = 'shortcuts-modal';
        modal.innerHTML = `
            <div class="shortcuts-content">
                <h2>⌨️ Keyboard Shortcuts</h2>
                <div class="shortcuts-list">
                    ${shortcuts.map(s => `
                        <div class="shortcut-item">
                            <kbd>${s.keys}</kbd>
                            <span>${s.action}</span>
                        </div>
                    `).join('')}
                </div>
                <button onclick="this.closest('.shortcuts-modal').remove()">Close</button>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10002;
        `;

        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    makeElementsAccessible() {
        // Add tabindex to cards
        document.querySelectorAll('.card, .project-card, .skill-card').forEach(card => {
            if (!card.hasAttribute('tabindex')) {
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'article');
            }
        });

        // Add ARIA labels to buttons without text
        document.querySelectorAll('button:not([aria-label])').forEach(btn => {
            if (!btn.textContent.trim() && !btn.getAttribute('aria-label')) {
                btn.setAttribute('aria-label', 'Button');
            }
        });

        // Add ARIA labels to links
        document.querySelectorAll('a:not([aria-label])').forEach(link => {
            if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
                const href = link.getAttribute('href');
                if (href) {
                    link.setAttribute('aria-label', `Link to ${href}`);
                }
            }
        });
    }
}

// Screen Reader Optimizations
class ScreenReaderOptimizations {
    constructor() {
        this.init();
    }

    init() {
        this.addLandmarks();
        this.addARIALabels();
        this.addLiveRegions();
        this.improveSemantics();
    }

    addLandmarks() {
        // Add main landmark if not exists
        if (!document.querySelector('main')) {
            const mainContent = document.querySelector('.container, .max-w-7xl');
            if (mainContent && !mainContent.closest('header') && !mainContent.closest('footer')) {
                mainContent.setAttribute('role', 'main');
                mainContent.id = 'main-content';
            }
        }

        // Add navigation landmarks
        document.querySelectorAll('nav:not([role])').forEach(nav => {
            nav.setAttribute('role', 'navigation');
        });
    }

    addARIALabels() {
        // Theme picker
        const themePicker = document.querySelector('.theme-picker');
        if (themePicker) {
            themePicker.setAttribute('role', 'menu');
            themePicker.setAttribute('aria-label', 'Theme selector');
        }

        // Forms
        document.querySelectorAll('form').forEach(form => {
            if (!form.getAttribute('aria-label')) {
                form.setAttribute('aria-label', 'Contact form');
            }
        });

        // Images without alt
        document.querySelectorAll('img:not([alt])').forEach(img => {
            img.setAttribute('alt', 'Decorative image');
        });
    }

    addLiveRegions() {
        // Add aria-live region for notifications
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    }

    improveSemantics() {
        // Ensure proper heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        console.log(`Found ${headings.length} headings for accessibility`);

        // Add semantic HTML5 elements
        const sections = document.querySelectorAll('section:not([role])');
        sections.forEach(section => {
            section.setAttribute('role', 'region');
        });
    }

    announce(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
        }
    }
}

// Styles
const accessibilityStyle = document.createElement('style');
accessibilityStyle.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.8; }
    }

    @keyframes slideDown {
        from { transform: translate(-50%, -100%); }
        to { transform: translate(-50%, 0); }
    }

    @keyframes slideUp {
        from { transform: translate(-50%, 0); }
        to { transform: translate(-50%, -100%); }
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }

    .shortcuts-content {
        background: var(--bg-card);
        padding: 40px;
        border-radius: 20px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
    }

    .shortcuts-content h2 {
        margin-bottom: 30px;
        color: var(--accent-primary);
        font-size: 2rem;
    }

    .shortcuts-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-bottom: 30px;
    }

    .shortcut-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        background: var(--bg-secondary);
        border-radius: 10px;
    }

    .shortcut-item kbd {
        background: var(--accent-primary);
        color: white;
        padding: 5px 12px;
        border-radius: 5px;
        font-family: monospace;
        font-weight: bold;
        font-size: 0.9rem;
    }

    .shortcuts-content button {
        width: 100%;
        padding: 15px;
        background: var(--gradient-primary);
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .shortcuts-content button:hover {
        transform: scale(1.05);
    }

    #tts-controls button:hover,
    #voice-command-btn:hover {
        transform: scale(1.1);
        border-color: var(--accent-primary);
    }
`;
document.head.appendChild(accessibilityStyle);

// Initialize all systems
let voiceCommands, keyboardNav, screenReader;

document.addEventListener('DOMContentLoaded', () => {
    voiceCommands = new VoiceCommandSystem();
    keyboardNav = new KeyboardNavigationEnhancement();
    screenReader = new ScreenReaderOptimizations();
    
    console.log('♿ Voice & Accessibility Features Loaded!');
});

// Export for global access
window.voiceCommands = voiceCommands;
