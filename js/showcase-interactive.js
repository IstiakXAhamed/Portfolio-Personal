// ============================================
// SHOWCASE INTERACTIVE FEATURES
// ============================================

// Theme Picker Functionality
function toggleThemePicker() {
    const picker = document.querySelector('.theme-picker');
    picker.classList.toggle('active');
}

// Apply theme on click
document.querySelectorAll('.theme-option').forEach(option => {
    option.addEventListener('click', function() {
        const theme = this.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Show toast notification
        showToast(`✨ ${theme.charAt(0).toUpperCase() + theme.slice(1)} theme activated!`);
    });
});

// Load saved theme
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
});

// ============================================
// 1. COLOR PALETTE GENERATOR
// ============================================

function generateColors() {
    const generator = document.getElementById('colorGenerator');
    generator.innerHTML = '';
    
    for (let i = 0; i < 6; i++) {
        const color = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        const box = document.createElement('div');
        box.className = 'color-box';
        box.style.background = color;
        box.textContent = color.toUpperCase();
        box.onclick = () => {
            navigator.clipboard.writeText(color);
            showToast(`📋 ${color} copied to clipboard!`);
        };
        generator.appendChild(box);
    }
}

// Generate initial colors
generateColors();

// ============================================
// 2. TYPING SPEED TEST
// ============================================

const sampleTexts = [
    "The quick brown fox jumps over the lazy dog. Practice makes perfect when learning to type faster and more accurately.",
    "JavaScript is a versatile programming language used for web development. It enables dynamic and interactive user experiences.",
    "Web development combines creativity with technical skills. Front-end developers craft beautiful user interfaces.",
    "React is a popular JavaScript library for building user interfaces. It uses components to create reusable code.",
    "Node.js allows developers to run JavaScript on the server. This enables full-stack JavaScript development."
];

let typingTimer;
let startTime;
let isTyping = false;
let currentText = '';

function startTypingTest() {
    const input = document.getElementById('typingInput');
    const textDisplay = document.getElementById('typingText');
    
    // Select random text
    currentText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    textDisplay.textContent = currentText;
    
    // Reset
    input.value = '';
    input.disabled = false;
    input.focus();
    isTyping = true;
    startTime = Date.now();
    
    // Start timer
    let timeLeft = 60;
    document.getElementById('timer').textContent = timeLeft;
    document.getElementById('wpm').textContent = '0';
    document.getElementById('accuracy').textContent = '100';
    
    typingTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        
        if (timeLeft === 0) {
            endTypingTest();
        }
    }, 1000);
}

document.getElementById('typingInput')?.addEventListener('input', function(e) {
    if (!isTyping) return;
    
    const typed = e.target.value;
    const elapsed = (Date.now() - startTime) / 1000 / 60; // minutes
    
    // Calculate WPM
    const words = typed.trim().split(/\s+/).length;
    const wpm = Math.round(words / elapsed);
    document.getElementById('wpm').textContent = wpm > 0 ? wpm : 0;
    
    // Calculate accuracy
    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
        if (typed[i] === currentText[i]) correct++;
    }
    const accuracy = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;
    document.getElementById('accuracy').textContent = accuracy;
    
    // Check if finished
    if (typed === currentText) {
        endTypingTest();
        showToast('🎉 Perfect! You completed the text!');
    }
});

function endTypingTest() {
    clearInterval(typingTimer);
    isTyping = false;
    document.getElementById('typingInput').disabled = true;
    const finalWPM = document.getElementById('wpm').textContent;
    const finalAccuracy = document.getElementById('accuracy').textContent;
    showToast(`⌨️ Test completed! ${finalWPM} WPM, ${finalAccuracy}% accuracy`);
}

// ============================================
// 3. INTERACTIVE PARTICLE SYSTEM
// ============================================

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.life = 100;
    }
    
    update(mouseX, mouseY) {
        // Move towards mouse
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
            this.vx += dx / dist * 0.5;
            this.vy += dy / dist * 0.5;
        }
        
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off walls
        if (this.x < 0 || this.x > window.innerWidth) this.vx *= -1;
        if (this.y < 0 || this.y > 400) this.vy *= -1;
        
        // Friction
        this.vx *= 0.98;
        this.vy *= 0.98;
        
        this.life--;
    }
}

let particles = [];
let mouseX = 0;
let mouseY = 0;

function createParticle(x, y) {
    particles.push(new Particle(x, y));
    
    const container = document.getElementById('particleCanvas');
    const particle = document.createElement('div');
    particle.className = 'demo-particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    container.appendChild(particle);
    
    return particle;
}

document.getElementById('particleCanvas')?.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    
    // Create particles on move
    if (Math.random() > 0.7) {
        createParticle(mouseX, mouseY);
    }
});

function animateParticles() {
    const container = document.getElementById('particleCanvas');
    if (!container) return;
    
    const particleElements = container.querySelectorAll('.demo-particle');
    
    particles = particles.filter((p, i) => {
        if (p.life <= 0) {
            particleElements[i]?.remove();
            return false;
        }
        
        p.update(mouseX, mouseY);
        
        if (particleElements[i]) {
            particleElements[i].style.left = p.x + 'px';
            particleElements[i].style.top = p.y + 'px';
            particleElements[i].style.opacity = p.life / 100;
        }
        
        return true;
    });
    
    requestAnimationFrame(animateParticles);
}

function resetParticles() {
    particles = [];
    const container = document.getElementById('particleCanvas');
    if (container) {
        container.innerHTML = '';
    }
    showToast('✨ Particles reset!');
}

// Start animation
animateParticles();

// ============================================
// 4. API TESTER
// ============================================

async function testAPI() {
    const url = document.getElementById('apiUrl').value;
    const method = document.getElementById('apiMethod').value;
    const responseDiv = document.getElementById('apiResponse');
    
    responseDiv.textContent = '⏳ Loading...';
    
    try {
        const response = await fetch(url, { method });
        const data = await response.json();
        
        responseDiv.textContent = JSON.stringify(data, null, 2);
        showToast('✅ API request successful!');
    } catch (error) {
        responseDiv.textContent = `❌ Error: ${error.message}`;
        showToast('❌ API request failed!');
    }
}

// ============================================
// 5. SNAKE GAME
// ============================================

const canvas = document.getElementById('snakeGame');
const ctx = canvas ? canvas.getContext('2d') : null;
const gridSize = 20;
const tileCount = 20;

let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 15};
let dx = 0;
let dy = 0;
let score = 0;
let gameLoop;
let isGameRunning = false;

function drawSnake() {
    if (!ctx) return;
    
    // Get current theme color
    const accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent-primary').trim();
    
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? accentColor : accentColor + '88';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function drawFood() {
    if (!ctx) return;
    
    const foodColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent-secondary').trim();
    
    ctx.fillStyle = foodColor;
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function updateSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    
    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }
    
    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }
    
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('snakeScore').textContent = score;
        spawnFood();
    } else {
        snake.pop();
    }
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function gameOver() {
    clearInterval(gameLoop);
    isGameRunning = false;
    showToast(`🎮 Game Over! Final Score: ${score}`);
}

function startSnakeGame() {
    if (isGameRunning) return;
    
    // Reset
    snake = [{x: 10, y: 10}];
    dx = 1;
    dy = 0;
    score = 0;
    document.getElementById('snakeScore').textContent = score;
    spawnFood();
    isGameRunning = true;
    
    gameLoop = setInterval(() => {
        if (!ctx) return;
        
        // Clear canvas
        ctx.fillStyle = getComputedStyle(document.documentElement)
            .getPropertyValue('--bg-primary').trim();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        updateSnake();
        drawFood();
        drawSnake();
    }, 150);
    
    showToast('🎮 Snake game started! Use arrow keys');
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!isGameRunning) return;
    
    switch(e.key) {
        case 'ArrowUp':
            if (dy === 0) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy === 0) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx === 0) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx === 0) { dx = 1; dy = 0; }
            break;
    }
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: var(--accent-primary);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: bold;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('🚀 Showcase Interactive Features Loaded!');
