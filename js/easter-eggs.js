// ============================================
// EASTER EGGS & SPECIAL EFFECTS
// ============================================

class EasterEggs {
    constructor() {
        this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        this.konamiIndex = 0;
        this.secretUnlocked = false;
        this.init();
    }

    init() {
        this.initKonamiCode();
        this.initInteractiveCursor();
        this.initMatrixRain();
        this.initConfetti();
        this.initSecretCommands();
        this.initClickEffects();
    }

    // ============================================
    // KONAMI CODE
    // ============================================
    initKonamiCode() {
        document.addEventListener('keydown', (e) => {
            if (e.key === this.konamiCode[this.konamiIndex]) {
                this.konamiIndex++;
                
                if (this.konamiIndex === this.konamiCode.length) {
                    this.unlockSecret();
                    this.konamiIndex = 0;
                }
            } else {
                this.konamiIndex = 0;
            }
        });
    }

    unlockSecret() {
        if (this.secretUnlocked) return;
        
        this.secretUnlocked = true;
        this.triggerConfetti();
        this.showSecretMessage();
        
        // Add secret terminal access
        const secretLink = document.createElement('a');
        secretLink.href = 'pages/terminal.html';
        secretLink.className = 'secret-terminal-link';
        secretLink.innerHTML = '🔓 Secret Terminal Unlocked! Click here';
        secretLink.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(45deg, #ff00ff, #00ffff);
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: bold;
            z-index: 10000;
            animation: pulse 2s infinite, glow 2s infinite;
            box-shadow: 0 0 20px rgba(255, 0, 255, 0.8);
        `;
        document.body.appendChild(secretLink);

        // Add glow animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes glow {
                0%, 100% { box-shadow: 0 0 20px rgba(255, 0, 255, 0.8); }
                50% { box-shadow: 0 0 40px rgba(0, 255, 255, 0.8); }
            }
        `;
        document.head.appendChild(style);
    }

    showSecretMessage() {
        const message = document.createElement('div');
        message.className = 'secret-message';
        message.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.95);
                color: #00ff00;
                padding: 50px;
                border-radius: 20px;
                border: 3px solid #00ff00;
                z-index: 9999;
                text-align: center;
                font-family: 'Courier New', monospace;
                box-shadow: 0 0 50px rgba(0, 255, 0, 0.5);
            ">
                <h2 style="font-size: 3rem; margin-bottom: 20px;">🎉 KONAMI CODE ACTIVATED! 🎉</h2>
                <p style="font-size: 1.5rem; margin: 20px 0;">You've discovered the secret!</p>
                <p style="font-size: 1.2rem; opacity: 0.8;">Secret terminal access granted...</p>
            </div>
        `;
        document.body.appendChild(message);

        setTimeout(() => {
            message.style.animation = 'fadeOut 1s forwards';
            setTimeout(() => message.remove(), 1000);
        }, 3000);
    }

    // ============================================
    // CONFETTI EFFECT
    // ============================================
    initConfetti() {
        // Confetti will be triggered by konami code or other events
        this.confettiColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    }

    triggerConfetti() {
        const confettiCount = 100;
        const confettiPieces = [];

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                opacity: 1;
                transform: rotate(${Math.random() * 360}deg);
                pointer-events: none;
                z-index: 99999;
            `;
            document.body.appendChild(confetti);
            confettiPieces.push(confetti);

            // Animate confetti
            const animationDuration = 3000 + Math.random() * 2000;
            const horizontalMovement = (Math.random() - 0.5) * 200;
            
            confetti.animate([
                { 
                    transform: `translateY(0) translateX(0) rotate(0deg)`,
                    opacity: 1 
                },
                { 
                    transform: `translateY(${window.innerHeight + 50}px) translateX(${horizontalMovement}px) rotate(${720 + Math.random() * 360}deg)`,
                    opacity: 0 
                }
            ], {
                duration: animationDuration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });

            setTimeout(() => confetti.remove(), animationDuration);
        }
    }

    // ============================================
    // INTERACTIVE CURSOR
    // ============================================
    initInteractiveCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid var(--accent-primary);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(cursor);

        const cursorTrail = [];
        const trailLength = 10;

        // Create trail elements
        for (let i = 0; i < trailLength; i++) {
            const trail = document.createElement('div');
            trail.style.cssText = `
                position: fixed;
                width: ${15 - i}px;
                height: ${15 - i}px;
                background: var(--accent-primary);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                opacity: ${(trailLength - i) / trailLength * 0.5};
            `;
            document.body.appendChild(trail);
            cursorTrail.push(trail);
        }

        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';

            // Update trail
            cursorTrail.forEach((trail, index) => {
                setTimeout(() => {
                    trail.style.left = mouseX + 'px';
                    trail.style.top = mouseY + 'px';
                }, index * 20);
            });
        });

        // Expand cursor on click
        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'scale(1.5)';
        });

        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'scale(1)';
        });

        // Change cursor on hover over links
        document.querySelectorAll('a, button, .clickable').forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.background = 'var(--accent-primary)';
                cursor.style.opacity = '0.3';
            });

            element.addEventListener('mouseleave', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.background = 'transparent';
                cursor.style.opacity = '1';
            });
        });
    }

    // ============================================
    // MATRIX RAIN EFFECT (for cyberpunk theme)
    // ============================================
    initMatrixRain() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        // Observer for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    const theme = document.documentElement.getAttribute('data-theme');
                    if (theme === 'cyberpunk') {
                        this.startMatrixRain();
                    } else {
                        this.stopMatrixRain();
                    }
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        // Start if already on cyberpunk theme
        if (currentTheme === 'cyberpunk') {
            this.startMatrixRain();
        }
    }

    startMatrixRain() {
        if (this.matrixCanvas) return; // Already running

        this.matrixCanvas = document.createElement('canvas');
        this.matrixCanvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            opacity: 0.15;
        `;
        document.body.prepend(this.matrixCanvas);

        const ctx = this.matrixCanvas.getContext('2d');
        this.matrixCanvas.width = window.innerWidth;
        this.matrixCanvas.height = window.innerHeight;

        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
        const fontSize = 16;
        const columns = this.matrixCanvas.width / fontSize;
        const drops = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        this.matrixInterval = setInterval(() => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, this.matrixCanvas.width, this.matrixCanvas.height);
            
            ctx.fillStyle = '#ff00ff';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = matrix[Math.floor(Math.random() * matrix.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > this.matrixCanvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }, 35);
    }

    stopMatrixRain() {
        if (this.matrixInterval) {
            clearInterval(this.matrixInterval);
            this.matrixInterval = null;
        }
        if (this.matrixCanvas) {
            this.matrixCanvas.remove();
            this.matrixCanvas = null;
        }
    }

    // ============================================
    // SECRET COMMANDS
    // ============================================
    initSecretCommands() {
        let commandBuffer = '';
        const secretWords = ['hack', 'matrix', 'secret', 'admin', 'god'];

        document.addEventListener('keypress', (e) => {
            commandBuffer += e.key;
            
            // Keep buffer reasonable length
            if (commandBuffer.length > 10) {
                commandBuffer = commandBuffer.slice(-10);
            }

            // Check for secret words
            secretWords.forEach(word => {
                if (commandBuffer.toLowerCase().includes(word)) {
                    this.triggerSecretCommand(word);
                    commandBuffer = '';
                }
            });
        });
    }

    triggerSecretCommand(command) {
        switch(command) {
            case 'hack':
                this.hackAnimation();
                break;
            case 'matrix':
                this.startMatrixRain();
                setTimeout(() => this.stopMatrixRain(), 5000);
                break;
            case 'secret':
                this.triggerConfetti();
                break;
            case 'admin':
            case 'god':
                window.location.href = 'pages/terminal.html';
                break;
        }
    }

    hackAnimation() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Courier New', monospace;
            color: #00ff00;
            font-size: 2rem;
        `;
        overlay.innerHTML = '<div>ACCESS GRANTED</div>';
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.style.animation = 'fadeOut 1s forwards';
            setTimeout(() => overlay.remove(), 1000);
        }, 2000);
    }

    // ============================================
    // CLICK EFFECTS
    // ============================================
    initClickEffects() {
        document.addEventListener('click', (e) => {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 2px solid var(--accent-primary);
                left: ${e.clientX - 10}px;
                top: ${e.clientY - 10}px;
                pointer-events: none;
                z-index: 9999;
            `;
            document.body.appendChild(ripple);

            ripple.animate([
                { transform: 'scale(1)', opacity: 1 },
                { transform: 'scale(5)', opacity: 0 }
            ], {
                duration: 600,
                easing: 'ease-out'
            });

            setTimeout(() => ripple.remove(), 600);

            // Create particle burst
            for (let i = 0; i < 8; i++) {
                const particle = document.createElement('div');
                const angle = (Math.PI * 2 * i) / 8;
                const velocity = 50;
                
                particle.style.cssText = `
                    position: fixed;
                    width: 5px;
                    height: 5px;
                    background: var(--accent-primary);
                    border-radius: 50%;
                    left: ${e.clientX}px;
                    top: ${e.clientY}px;
                    pointer-events: none;
                    z-index: 9999;
                `;
                document.body.appendChild(particle);

                particle.animate([
                    { 
                        transform: 'translate(0, 0)',
                        opacity: 1 
                    },
                    { 
                        transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px)`,
                        opacity: 0 
                    }
                ], {
                    duration: 500,
                    easing: 'ease-out'
                });

                setTimeout(() => particle.remove(), 500);
            }
        });
    }
}

// Add fadeOut animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
`;
document.head.appendChild(styleSheet);

// Initialize Easter Eggs when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new EasterEggs();
    });
} else {
    new EasterEggs();
}

console.log('🥚 Easter eggs loaded! Try the Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A');
