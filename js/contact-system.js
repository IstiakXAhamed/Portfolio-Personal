// ===================================
// INTERACTIVE CONTACT SYSTEM
// ===================================

// Chatbot System
class Chatbot {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isOpen = false;
        this.messages = [];
        this.faq = this.loadFAQ();
        this.init();
    }

    loadFAQ() {
        return {
            "hello": "Hi there! 👋 I'm here to help. How can I assist you today?",
            "hi": "Hello! 👋 Nice to meet you. What would you like to know?",
            "hey": "Hey! 🙌 How can I help you?",
            "services": "I offer full-stack development services including:\n• Web Application Development (MERN Stack)\n• Mobile App Development (React Native)\n• UI/UX Design\n• API Development\n• Database Design\n• Consulting & Code Review",
            "what do you do": "I'm a Full Stack MERN Developer specializing in building scalable web applications. I work with React, Node.js, Express, MongoDB, and modern web technologies.",
            "skills": "My main skills include:\n• Frontend: React, Next.js, TypeScript, Tailwind CSS\n• Backend: Node.js, Express, REST APIs, GraphQL\n• Database: MongoDB, PostgreSQL, Redis\n• DevOps: Docker, AWS, CI/CD\n• Tools: Git, VS Code, Postman",
            "portfolio": "You can explore my work through:\n• Projects Gallery (3D flip cards)\n• Interactive Showcase (live demos)\n• GitHub Stats (real-time data)\n• About Page (my journey & skills)",
            "contact": "You can reach me through:\n📧 Email: sanimahmedshowrov@gmail.com\n📱 Phone: +880 1991523289\n🔗 LinkedIn: linkedin.com/in/sanimahmed\n💻 GitHub: github.com/sanimahmed\nOr fill out the contact form below!",
            "price": "Project pricing varies based on complexity and requirements. Let's discuss your specific needs! Feel free to contact me for a free consultation and quote.",
            "availability": "I'm currently available for freelance projects and collaborations. Typical response time is within 24 hours.",
            "experience": "I have 3+ years of professional experience in web development, completed 50+ projects, and worked with 30+ clients worldwide.",
            "technologies": "I work with modern technologies including React, Node.js, Express, MongoDB, Next.js, TypeScript, Tailwind CSS, Docker, AWS, and more!",
            "timeline": "Project timelines depend on scope:\n• Small projects: 1-2 weeks\n• Medium projects: 3-6 weeks\n• Large projects: 2-3 months\nLet's discuss your specific needs!",
            "github": "Check out my GitHub profile for open-source contributions and projects. Click on 'GitHub Stats' in the navigation to see live data!",
            "help": "I can answer questions about:\n• My services & skills\n• Portfolio & projects\n• Availability & pricing\n• Technologies I use\n• Contact information\n\nJust type your question!",
            "thanks": "You're welcome! 😊 Feel free to ask if you have more questions!",
            "thank you": "Happy to help! 🎉 Don't hesitate to reach out if you need anything else.",
            "bye": "Goodbye! 👋 Feel free to come back anytime. Have a great day!",
            "default": "I'm not sure about that. 🤔 Try asking about:\n• My services\n• Skills & experience\n• Portfolio & projects\n• Contact information\n• Availability & pricing\n\nOr type 'help' for more options!"
        };
    }

    init() {
        this.createChatbot();
        this.addEventListeners();
    }

    createChatbot() {
        const chatbotHTML = `
            <div class="chatbot-fab" id="chatbot-fab">
                💬
                <span class="chatbot-badge">1</span>
            </div>
            <div class="chatbot-window" id="chatbot-window">
                <div class="chatbot-header">
                    <div>
                        <h3>💬 Chat Assistant</h3>
                        <p class="chatbot-status">Online</p>
                    </div>
                    <button class="chatbot-close" id="chatbot-close">✕</button>
                </div>
                <div class="chatbot-messages" id="chatbot-messages">
                    <div class="bot-message">
                        <div class="message-avatar">🤖</div>
                        <div class="message-content">
                            <p>Hi! I'm your virtual assistant. 👋</p>
                            <p>Ask me about services, skills, portfolio, or anything else!</p>
                            <p style="font-size: 0.85em; margin-top: 10px;">Try: "What do you do?" or "How can I contact you?"</p>
                        </div>
                    </div>
                </div>
                <div class="chatbot-quick-replies">
                    <button class="quick-reply" data-message="What are your services?">Services</button>
                    <button class="quick-reply" data-message="What are your skills?">Skills</button>
                    <button class="quick-reply" data-message="How can I contact you?">Contact</button>
                    <button class="quick-reply" data-message="What's your pricing?">Pricing</button>
                </div>
                <div class="chatbot-input-area">
                    <input type="text" id="chatbot-input" placeholder="Type your message..." />
                    <button id="chatbot-send">➤</button>
                </div>
            </div>
        `;
        
        if (this.container) {
            this.container.innerHTML = chatbotHTML;
        }
    }

    addEventListeners() {
        const fab = document.getElementById('chatbot-fab');
        const closeBtn = document.getElementById('chatbot-close');
        const sendBtn = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');
        const quickReplies = document.querySelectorAll('.quick-reply');

        fab?.addEventListener('click', () => this.toggle());
        closeBtn?.addEventListener('click', () => this.toggle());
        sendBtn?.addEventListener('click', () => this.sendMessage());
        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        quickReplies.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                this.sendMessage(message);
            });
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        const window = document.getElementById('chatbot-window');
        const fab = document.getElementById('chatbot-fab');
        
        if (this.isOpen) {
            window.style.display = 'flex';
            fab.style.display = 'none';
        } else {
            window.style.display = 'none';
            fab.style.display = 'flex';
        }
    }

    sendMessage(text = null) {
        const input = document.getElementById('chatbot-input');
        const message = text || input.value.trim();
        
        if (!message) return;

        this.addMessage('user', message);
        input.value = '';

        setTimeout(() => {
            const response = this.getResponse(message);
            this.addMessage('bot', response);
        }, 500);
    }

    addMessage(type, text) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'user' ? 'user-message' : 'bot-message';
        
        const timestamp = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        messageDiv.innerHTML = `
            ${type === 'bot' ? '<div class="message-avatar">🤖</div>' : ''}
            <div class="message-content">
                <p>${text.replace(/\n/g, '<br>')}</p>
                <span class="message-time">${timestamp}</span>
            </div>
            ${type === 'user' ? '<div class="message-avatar user-avatar">👤</div>' : ''}
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    getResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for exact matches first
        for (const [key, response] of Object.entries(this.faq)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }

        return this.faq.default;
    }
}

// Enhanced Contact Form with Validation
class EnhancedContactForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.init();
    }

    init() {
        if (!this.form) return;

        this.setupValidation();
        this.setupEmailJS();
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    setupValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                errorMessage = 'Please enter a valid email address';
                break;
            case 'tel':
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                isValid = !value || phoneRegex.test(value);
                errorMessage = 'Please enter a valid phone number';
                break;
            default:
                isValid = value.length >= 2;
                errorMessage = 'This field is required';
        }

        if (!isValid) {
            this.showError(field, errorMessage);
        } else {
            this.clearError(field);
        }

        return isValid;
    }

    showError(field, message) {
        this.clearError(field);
        
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    clearError(field) {
        field.classList.remove('error');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    setupEmailJS() {
        // Initialize EmailJS (replace with your keys)
        // emailjs.init("YOUR_PUBLIC_KEY");
        console.log('EmailJS ready (add your keys to activate)');
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showNotification('Please fix the errors before submitting', 'error');
            return;
        }

        // Show loading
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate sending (replace with actual EmailJS call)
            await this.sendEmail();
            
            this.showNotification('Message sent successfully! I\'ll get back to you soon. 🎉', 'success');
            this.form.reset();
        } catch (error) {
            this.showNotification('Failed to send message. Please try again. 😞', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async sendEmail() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Email sent!');
                resolve();
            }, 1500);
        });

        // Actual EmailJS implementation:
        /*
        const formData = new FormData(this.form);
        return emailjs.send(
            'YOUR_SERVICE_ID',
            'YOUR_TEMPLATE_ID',
            {
                from_name: formData.get('name'),
                from_email: formData.get('email'),
                phone: formData.get('phone'),
                message: formData.get('message')
            }
        );
        */
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `form-notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">✕</button>
        `;
        
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease';
        }, 10);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Social Media Quick Links Widget
class SocialMediaWidget {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.init();
    }

    init() {
        if (!this.container) return;

        const socialLinks = [
            { name: 'GitHub', icon: '💻', url: 'https://github.com/sanimahmed', color: '#333' },
            { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com/in/sanimahmed', color: '#0077B5' },
            { name: 'Twitter', icon: '🐦', url: 'https://twitter.com/sanimahmed', color: '#1DA1F2' },
            { name: 'Email', icon: '📧', url: 'mailto:sanimahmedshowrov@gmail.com', color: '#EA4335' },
            { name: 'WhatsApp', icon: '💬', url: 'https://wa.me/8801991523289', color: '#25D366' },
            { name: 'Telegram', icon: '✈️', url: 'https://t.me/sanimahmed', color: '#0088cc' }
        ];

        this.container.innerHTML = `
            <div class="social-widget">
                <h3 class="social-title">Connect With Me</h3>
                <div class="social-links-grid">
                    ${socialLinks.map(link => `
                        <a href="${link.url}" target="_blank" class="social-link" style="--social-color: ${link.color}">
                            <span class="social-icon">${link.icon}</span>
                            <span class="social-name">${link.name}</span>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

// Styles
const contactSystemStyle = document.createElement('style');
contactSystemStyle.textContent = `
    /* Chatbot Styles */
    .chatbot-fab {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 70px;
        height: 70px;
        background: var(--gradient-primary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        cursor: pointer;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 1000;
        transition: all 0.3s ease;
    }

    .chatbot-fab:hover {
        transform: scale(1.1) rotate(15deg);
    }

    .chatbot-badge {
        position: absolute;
        top: 5px;
        right: 5px;
        background: #ff4444;
        color: white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        font-weight: bold;
    }

    .chatbot-window {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 400px;
        height: 600px;
        background: var(--bg-card);
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        display: none;
        flex-direction: column;
        z-index: 1000;
        border: 2px solid var(--accent-tertiary);
    }

    .chatbot-header {
        background: var(--gradient-primary);
        color: white;
        padding: 20px;
        border-radius: 18px 18px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .chatbot-header h3 {
        margin: 0;
        font-size: 1.3rem;
    }

    .chatbot-status {
        font-size: 0.85rem;
        opacity: 0.9;
        margin-top: 3px;
    }

    .chatbot-close {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.5rem;
        transition: all 0.3s ease;
    }

    .chatbot-close:hover {
        background: rgba(255,255,255,0.3);
        transform: rotate(90deg);
    }

    .chatbot-messages {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .bot-message, .user-message {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        animation: messageSlide 0.3s ease;
    }

    .user-message {
        flex-direction: row-reverse;
    }

    .message-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--accent-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        flex-shrink: 0;
    }

    .user-avatar {
        background: var(--accent-secondary);
    }

    .message-content {
        background: var(--bg-secondary);
        padding: 12px 16px;
        border-radius: 15px;
        max-width: 70%;
    }

    .user-message .message-content {
        background: var(--accent-primary);
        color: white;
    }

    .message-content p {
        margin: 5px 0;
        line-height: 1.5;
    }

    .message-time {
        font-size: 0.75rem;
        opacity: 0.6;
        margin-top: 5px;
        display: block;
    }

    .chatbot-quick-replies {
        display: flex;
        gap: 8px;
        padding: 10px 20px;
        overflow-x: auto;
        border-top: 1px solid var(--accent-tertiary);
    }

    .quick-reply {
        background: var(--bg-secondary);
        border: 2px solid var(--accent-tertiary);
        color: var(--text-primary);
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        white-space: nowrap;
        font-size: 0.9rem;
        transition: all 0.3s ease;
    }

    .quick-reply:hover {
        background: var(--accent-primary);
        color: white;
        border-color: var(--accent-primary);
    }

    .chatbot-input-area {
        display: flex;
        gap: 10px;
        padding: 20px;
        border-top: 1px solid var(--accent-tertiary);
    }

    #chatbot-input {
        flex: 1;
        padding: 12px 16px;
        border: 2px solid var(--accent-tertiary);
        border-radius: 25px;
        background: var(--bg-secondary);
        color: var(--text-primary);
        outline: none;
    }

    #chatbot-input:focus {
        border-color: var(--accent-primary);
    }

    #chatbot-send {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background: var(--gradient-primary);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1.3rem;
        transition: all 0.3s ease;
    }

    #chatbot-send:hover {
        transform: scale(1.1);
    }

    /* Form Validation */
    input.error, textarea.error {
        border-color: #ff4444 !important;
        animation: shake 0.3s ease;
    }

    .field-error {
        color: #ff4444;
        font-size: 0.85rem;
        margin-top: 5px;
    }

    .form-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 20px 30px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 15px;
        max-width: 400px;
    }

    .form-notification.success {
        background: #4CAF50;
        color: white;
    }

    .form-notification.error {
        background: #ff4444;
        color: white;
    }

    .form-notification button {
        background: transparent;
        border: none;
        color: inherit;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0.7;
    }

    /* Social Widget */
    .social-widget {
        background: var(--bg-card);
        padding: 30px;
        border-radius: 15px;
        border: 2px solid var(--accent-tertiary);
    }

    .social-title {
        font-size: 1.8rem;
        font-weight: bold;
        margin-bottom: 20px;
        color: var(--accent-primary);
    }

    .social-links-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
    }

    .social-link {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 15px;
        background: var(--bg-secondary);
        border: 2px solid var(--accent-tertiary);
        border-radius: 12px;
        text-decoration: none;
        color: var(--text-primary);
        transition: all 0.3s ease;
    }

    .social-link:hover {
        background: var(--social-color);
        color: white;
        border-color: var(--social-color);
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }

    .social-icon {
        font-size: 1.8rem;
    }

    .social-name {
        font-weight: 600;
    }

    @keyframes messageSlide {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }

    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }

    @keyframes slideOut {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }

    @media (max-width: 768px) {
        .chatbot-window {
            width: 100%;
            height: 100%;
            bottom: 0;
            right: 0;
            border-radius: 0;
        }

        .social-links-grid {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(contactSystemStyle);

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot('chatbot-container');
    new EnhancedContactForm('contact-form');
    new SocialMediaWidget('social-widget');
});

console.log('💬 Interactive Contact System Loaded!');
