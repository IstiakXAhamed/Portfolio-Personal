// ===================================
// ADVANCED UI/UX ANIMATIONS SYSTEM
// ===================================

// Page Transition System
class PageTransitions {
    constructor() {
        this.transitionOverlay = this.createOverlay();
        this.loadingIndicator = this.createLoadingIndicator();
        this.init();
    }

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'page-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            z-index: 10000;
            display: none;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    createLoadingIndicator() {
        const container = document.createElement('div');
        container.id = 'loading-indicator';
        container.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10001;
            display: none;
            text-align: center;
        `;

        container.innerHTML = `
            <div class="spinner" style="
                width: 60px;
                height: 60px;
                border: 5px solid rgba(255,255,255,0.3);
                border-top-color: white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
            <p style="color: white; margin-top: 20px; font-size: 1.2rem; font-weight: bold;">Loading...</p>
        `;

        document.body.appendChild(container);
        return container;
    }

    init() {
        // Intercept all internal links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && !link.target && this.isInternalLink(link.href)) {
                e.preventDefault();
                this.transition(link.href);
            }
        });

        // Add page load animation
        window.addEventListener('load', () => {
            this.pageLoadAnimation();
        });
    }

    isInternalLink(url) {
        return url.startsWith(window.location.origin) || url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
    }

    transition(url) {
        // Show transition overlay
        this.transitionOverlay.style.display = 'block';
        this.loadingIndicator.style.display = 'block';
        
        setTimeout(() => {
            this.transitionOverlay.style.opacity = '1';
        }, 10);

        // Navigate after animation
        setTimeout(() => {
            window.location.href = url;
        }, 600);
    }

    pageLoadAnimation() {
        const elements = document.querySelectorAll('section, .card, .project-card, .skill-item');
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }
}

// Particle Background System
class ParticleBackground {
    constructor() {
        this.canvas = this.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        this.scrollY = 0;
        this.init();
    }

    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = 'particle-background';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
        `;
        document.body.insertBefore(canvas, document.body.firstChild);
        return canvas;
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;
        });

        // Create particles
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Get theme color
        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim();

        this.particles.forEach((particle) => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY + this.scrollY * 0.01;

            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `${accentColor}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
            this.ctx.fill();

            // Draw connections
            this.particles.forEach((otherParticle) => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `${accentColor}${Math.floor((1 - distance / 150) * 0.2 * 255).toString(16).padStart(2, '0')}`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Floating Action Buttons
class FloatingActionButtons {
    constructor() {
        this.createScrollToTop();
        this.createThemeQuickPicker();
        this.init();
    }

    createScrollToTop() {
        const button = document.createElement('div');
        button.id = 'fab-scroll-top';
        button.innerHTML = '↑';
        button.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: var(--gradient-primary);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            font-weight: bold;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            opacity: 0;
            transform: scale(0);
            transition: all 0.3s ease;
        `;

        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        document.body.appendChild(button);
        return button;
    }

    createThemeQuickPicker() {
        const button = document.createElement('div');
        button.id = 'fab-theme-picker';
        button.innerHTML = '🎨';
        button.style.cssText = `
            position: fixed;
            bottom: 110px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: var(--bg-card);
            border: 3px solid var(--accent-primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;

        button.addEventListener('click', () => {
            if (typeof toggleThemePicker === 'function') {
                toggleThemePicker();
            }
        });

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'rotate(360deg) scale(1.1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'rotate(0deg) scale(1)';
        });

        document.body.appendChild(button);
        return button;
    }

    init() {
        window.addEventListener('scroll', () => {
            const scrollTop = document.getElementById('fab-scroll-top');
            if (window.scrollY > 300) {
                scrollTop.style.opacity = '1';
                scrollTop.style.transform = 'scale(1)';
            } else {
                scrollTop.style.opacity = '0';
                scrollTop.style.transform = 'scale(0)';
            }
        });
    }
}

// Progress Indicator
class ProgressIndicator {
    constructor() {
        this.bar = this.createBar();
        this.init();
    }

    createBar() {
        const bar = document.createElement('div');
        bar.id = 'progress-indicator';
        bar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: var(--gradient-primary);
            z-index: 10000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(bar);
        return bar;
    }

    init() {
        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
            
            this.bar.style.width = `${Math.min(scrollPercent, 100)}%`;
        });
    }
}

// Smooth Scroll Enhancement
class SmoothScrollEnhancement {
    constructor() {
        this.init();
    }

    init() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Hover Tilt Effect
class HoverTiltEffect {
    constructor() {
        this.init();
    }

    init() {
        const tiltElements = document.querySelectorAll('.project-card, .card, .skill-card');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }
}

// Text Animation on Scroll
class TextAnimationOnScroll {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateText(entry.target);
                }
            });
        }, options);

        // Observe all headings and paragraphs
        document.querySelectorAll('h1, h2, h3, p.animate-text').forEach(element => {
            element.classList.add('text-animate-ready');
            this.observer.observe(element);
        });
    }

    animateText(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.opacity = '1';
        
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.opacity = '0';
            span.style.display = 'inline-block';
            span.style.animation = `fadeInChar 0.5s ease forwards ${index * 0.03}s`;
            element.appendChild(span);
        });
    }
}

// Sound Effects System (Optional)
class SoundEffects {
    constructor() {
        this.sounds = this.createSounds();
        this.enabled = localStorage.getItem('soundEffectsEnabled') === 'true';
        this.createToggle();
        if (this.enabled) this.init();
    }

    createSounds() {
        return {
            click: this.createBeep(800, 0.1, 'sine'),
            hover: this.createBeep(400, 0.05, 'sine'),
            success: this.createBeep(1000, 0.2, 'square'),
            error: this.createBeep(200, 0.2, 'sawtooth')
        };
    }

    createBeep(frequency, duration, type = 'sine') {
        return () => {
            if (!this.enabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        };
    }

    createToggle() {
        const toggle = document.createElement('div');
        toggle.id = 'sound-toggle';
        toggle.innerHTML = this.enabled ? '🔊' : '🔇';
        toggle.style.cssText = `
            position: fixed;
            bottom: 190px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: var(--bg-card);
            border: 3px solid var(--accent-tertiary);
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

        toggle.addEventListener('click', () => {
            this.enabled = !this.enabled;
            localStorage.setItem('soundEffectsEnabled', this.enabled);
            toggle.innerHTML = this.enabled ? '🔊' : '🔇';
            
            if (this.enabled) {
                this.init();
                this.sounds.success();
            }
        });

        document.body.appendChild(toggle);
    }

    init() {
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
                this.sounds.click();
            }
        });

        document.querySelectorAll('button, a, .card').forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.sounds.hover();
            });
        });
    }
}

// CSS Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    @keyframes fadeInChar {
        to {
            opacity: 1;
            transform: translateY(0);
        }
        from {
            opacity: 0;
            transform: translateY(20px);
        }
    }
    
    .text-animate-ready {
        opacity: 0;
    }
`;
document.head.appendChild(style);

// Initialize All Systems
document.addEventListener('DOMContentLoaded', () => {
    new PageTransitions();
    new ParticleBackground();
    new FloatingActionButtons();
    new ProgressIndicator();
    new SmoothScrollEnhancement();
    
    // Wait for DOM to be fully loaded
    setTimeout(() => {
        new HoverTiltEffect();
        new TextAnimationOnScroll();
        new SoundEffects();
    }, 500);
});

console.log('🎨 Advanced UI/UX Animations System Loaded!');
