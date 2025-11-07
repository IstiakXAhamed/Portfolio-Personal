// ===================================
// ADVANCED PORTFOLIO ENHANCEMENTS
// Theme System, Animations, Interactions
// ===================================

// Theme Picker Functionality (Global)
function toggleThemePicker() {
  const picker = document.querySelector('.theme-picker');
  if (picker) {
    picker.classList.toggle('active');
  }
}

// Apply theme on click (Global)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.theme-option').forEach(option => {
    option.addEventListener('click', function() {
      const theme = this.getAttribute('data-theme');
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('portfolio-theme', theme);
      
      // Update Matter.js colors if function exists
      if (typeof updateMatterJsColors === 'function') {
        updateMatterJsColors();
      }
      
      // Show toast notification
      if (typeof portfolioEnhancer !== 'undefined' && portfolioEnhancer.showToast) {
        portfolioEnhancer.showToast(`✨ ${theme.charAt(0).toUpperCase() + theme.slice(1)} theme activated!`);
      }
    });
  });
  
  // Load saved theme
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
});

class PortfolioEnhancer {
  constructor() {
    this.currentTheme = this.getStoredTheme();
    this.sections = [];
    this.init();
  }

  // Initialize all features
  init() {
    this.initThemeSystem();
    this.initScrollProgress();
    this.initBackToTop();
    this.initSmoothScroll();
    this.initIntersectionObserver();
    this.initTypingAnimation();
    this.initCountUpAnimations();
    this.initMobileMenu();
    this.initFormValidation();
    this.initParticleSystem();
    this.initToastNotifications();
    this.initLoadingScreen();
  }

  // ============================================
  // THEME SYSTEM
  // ============================================
  
  getStoredTheme() {
    const stored = localStorage.getItem('portfolio-theme');
    if (stored) return stored;
    
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  initThemeSystem() {
    // Apply stored theme
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    this.updateThemeIcons();

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('portfolio-theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });

    // Theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    this.showToast(`Switched to ${newTheme} mode`, 'info');
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    this.updateThemeIcons();
    this.updateMatterJsColors();
  }

  updateThemeIcons() {
    const sunIcon = document.querySelector('.theme-icon-sun');
    const moonIcon = document.querySelector('.theme-icon-moon');
    
    if (this.currentTheme === 'dark') {
      sunIcon?.classList.remove('hidden');
      moonIcon?.classList.add('hidden');
    } else {
      sunIcon?.classList.add('hidden');
      moonIcon?.classList.remove('hidden');
    }
  }

  // ============================================
  // SCROLL PROGRESS BAR
  // ============================================
  
  initScrollProgress() {
    let progressBar = document.getElementById('scroll-progress');
    
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'scroll-progress';
      document.body.appendChild(progressBar);
    }

    window.addEventListener('scroll', () => {
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      progressBar.style.width = `${scrolled}%`;
    });
  }

  // ============================================
  // BACK TO TOP BUTTON
  // ============================================
  
  initBackToTop() {
    let backToTop = document.getElementById('back-to-top');
    
    if (!backToTop) {
      backToTop = document.createElement('div');
      backToTop.id = 'back-to-top';
      backToTop.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      `;
      document.body.appendChild(backToTop);
    }

    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    // Scroll to top on click
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================
  
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#' || href === '') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ============================================
  // INTERSECTION OBSERVER (Scroll Animations)
  // ============================================
  
  initIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
      observer.observe(el);
    });
  }

  // ============================================
  // TYPING ANIMATION
  // ============================================
  
  initTypingAnimation() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const texts = [
      'MERN Stack Developer',
      'Full Stack Engineer',
      'React Specialist',
      'Node.js Expert',
      'UI/UX Enthusiast'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const type = () => {
      const currentText = texts[textIndex];
      
      if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentText.length) {
        typingSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingSpeed = 500; // Pause before starting new text
      }

      setTimeout(type, typingSpeed);
    };

    type();
  }

  // ============================================
  // COUNT UP ANIMATIONS
  // ============================================
  
  initCountUpAnimations() {
    const counters = document.querySelectorAll('.count-up');
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const updateCount = () => {
              current += increment;
              if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCount);
              } else {
                counter.textContent = target;
              }
            };
            updateCount();
            observer.unobserve(counter);
          }
        });
      });

      observer.observe(counter);
    });
  }

  // ============================================
  // MOBILE MENU
  // ============================================
  
  initMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    
    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      menuOverlay?.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    menuOverlay?.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      menuOverlay.classList.remove('active');
      document.body.classList.remove('menu-open');
    });

    // Close menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        menuOverlay?.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // ============================================
  // FORM VALIDATION
  // ============================================
  
  initFormValidation() {
    const form = document.querySelector('form[name="contactUS"]');
    if (!form) return;

    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const messageInput = form.querySelector('#message');

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Add real-time validation
    emailInput?.addEventListener('blur', () => {
      if (!emailRegex.test(emailInput.value)) {
        this.showInputError(emailInput, 'Please enter a valid email address');
      } else {
        this.clearInputError(emailInput);
      }
    });

    nameInput?.addEventListener('blur', () => {
      if (nameInput.value.trim().length < 2) {
        this.showInputError(nameInput, 'Name must be at least 2 characters');
      } else {
        this.clearInputError(nameInput);
      }
    });

    messageInput?.addEventListener('blur', () => {
      if (messageInput.value.trim().length < 10) {
        this.showInputError(messageInput, 'Message must be at least 10 characters');
      } else {
        this.clearInputError(messageInput);
      }
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;

      // Validate all fields
      if (nameInput.value.trim().length < 2) {
        this.showInputError(nameInput, 'Name must be at least 2 characters');
        isValid = false;
      }

      if (!emailRegex.test(emailInput.value)) {
        this.showInputError(emailInput, 'Please enter a valid email address');
        isValid = false;
      }

      if (messageInput.value.trim().length < 10) {
        this.showInputError(messageInput, 'Message must be at least 10 characters');
        isValid = false;
      }

      if (isValid) {
        this.submitForm(form);
      }
    });
  }

  showInputError(input, message) {
    input.classList.add('border-red-500');
    
    let errorDiv = input.parentElement.querySelector('.error-message');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'error-message text-red-500 text-sm mt-1';
      input.parentElement.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
  }

  clearInputError(input) {
    input.classList.remove('border-red-500');
    const errorDiv = input.parentElement.querySelector('.error-message');
    if (errorDiv) errorDiv.remove();
  }

  async submitForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    try {
      // Netlify form submission
      const formData = new FormData(form);
      
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });

      this.showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
      form.reset();
      
    } catch (error) {
      this.showToast('Failed to send message. Please try again.', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }

  // ============================================
  // PARTICLE SYSTEM
  // ============================================
  
  initParticleSystem() {
    // This will be used to add decorative particles
    // Implementation can be expanded based on needs
  }

  // ============================================
  // TOAST NOTIFICATIONS
  // ============================================
  
  initToastNotifications() {
    // Create toast container if it doesn't exist
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed top-4 right-4 z-[9999] space-y-2';
      document.body.appendChild(container);
    }
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
      warning: 'bg-yellow-500'
    };

    toast.className = `${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 max-w-sm`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Slide in
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ============================================
  // LOADING SCREEN
  // ============================================
  
  initLoadingScreen() {
    window.addEventListener('load', () => {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        setTimeout(() => {
          loadingScreen.classList.add('hidden');
        }, 500);
      }
    });
  }

  // ============================================
  // MATTER.JS THEME INTEGRATION
  // ============================================
  
  updateMatterJsColors() {
    // This function will be called to update Matter.js colors
    // based on the current theme
    if (typeof window.updateMatterColors === 'function') {
      window.updateMatterColors(this.currentTheme);
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.portfolioEnhancer = new PortfolioEnhancer();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortfolioEnhancer;
}
