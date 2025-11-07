# 🚀 Sanim Ahmed - MERN Stack Developer Portfolio

A modern, interactive portfolio website featuring advanced themes, interactive demos, and professional organization.

## 📁 Project Structure

```
portfolio/
│
├── index.html              # Main portfolio page (START HERE)
├── package.json            # Node.js dependencies
├── tailwind.config.js      # Tailwind CSS configuration
│
├── css/                    # All stylesheets
│   ├── font.css           # Font definitions
│   ├── style.css          # Custom styles
│   ├── theme.css          # Theme system & animations
│   ├── advanced-themes.css # 8 theme variants
│   ├── input.css          # Tailwind input file
│   └── output.css         # Compiled Tailwind CSS
│
├── js/                     # All JavaScript files
│   ├── matter.js          # Physics engine for particles
│   ├── enhancements.js    # Core interactive features
│   └── showcase-interactive.js # Showcase page features
│
├── pages/                  # Additional pages
│   ├── showcase.html      # Interactive demos & games
│   ├── test-features.html # Feature testing page
│   ├── skills-section.html # Skills section template
│   └── demo.html          # Feature demonstration
│
├── docs/                   # Documentation
│   ├── ENHANCEMENTS-README.md # Feature documentation
│   ├── CHECKLIST.md       # Testing checklist
│   ├── SUMMARY.md         # Project summary
│   └── QUICK-START.html   # Visual setup guide
│
├── assets/                 # Media files
│   ├── icons/             # Icon assets
│   └── images/            # Image assets
│
└── node_modules/           # Dependencies (auto-generated)
```

## ✨ Features

### 🎨 Multi-Theme System (8 Themes)
- **Dark** - Elegant dark mode (default)
- **Light** - Clean bright theme
- **Cyberpunk** - Neon pink/cyan with glitch effects
- **Ocean** - Deep blue underwater vibes
- **Forest** - Nature-inspired green tones
- **Sunset** - Warm orange/purple gradients
- **Neon** - Electric purple/green glow
- **Dracula** - Purple vampire aesthetic

### 🎮 Interactive Showcase Page
1. **Color Palette Generator** - Generate and copy random color schemes
2. **Typing Speed Test** - Test WPM and accuracy
3. **Particle System** - Interactive mouse-following particles
4. **API Tester** - Test any REST API endpoint
5. **Code Preview** - Syntax-highlighted code display
6. **Snake Game** - Classic game with theme-aware colors

### 🎯 Core Features
- ⚡ Lightning-fast performance
- 📱 Fully responsive design
- 🎭 Smooth animations & transitions
- 🌊 Matter.js physics engine
- 📊 Animated skill progress bars
- 📈 Count-up statistics
- 📝 Form validation
- 🔔 Toast notifications
- 📜 Scroll progress indicator
- ⬆️ Back-to-top button
- 💾 Theme persistence (localStorage)

## 🚀 Quick Start

### 1. Open the Portfolio
Simply open `index.html` in your browser to view the main portfolio.

### 2. Try Different Themes
Click the 🎨 icon in the top-right corner and select from 8 different themes!

### 3. Explore Interactive Demos
Click "✨ Interactive Showcase" to access the interactive features page.

## 🛠️ Development Setup

### Prerequisites
- Node.js installed
- Basic command line knowledge

### Installation
```bash
# Install dependencies
npm install

# Compile Tailwind CSS (if you make changes to input.css)
npx tailwindcss -i ./css/input.css -o ./css/output.css --watch
```

### Making Changes

#### To modify styles:
1. Edit `css/input.css` for Tailwind utilities
2. Edit `css/theme.css` for theme variables
3. Edit `css/advanced-themes.css` for theme-specific styles
4. Run: `npx tailwindcss -i ./css/input.css -o ./css/output.css`

#### To add features:
1. Edit `js/enhancements.js` for main portfolio features
2. Edit `js/showcase-interactive.js` for showcase page features
3. Refresh browser to see changes

## 📋 File Descriptions

### HTML Files
- **index.html** - Main portfolio with hero, projects, testimonials, contact
- **pages/showcase.html** - Interactive demos and games
- **pages/test-features.html** - Feature testing and verification
- **pages/demo.html** - Feature demonstrations

### CSS Files
- **css/font.css** - Custom font imports
- **css/style.css** - Original custom styles
- **css/theme.css** - Theme system with CSS variables (380+ lines)
- **css/advanced-themes.css** - 8 theme definitions with effects (360+ lines)
- **css/output.css** - Compiled Tailwind CSS (35KB)
- **css/input.css** - Tailwind source file

### JavaScript Files
- **js/matter.js** - Physics engine for animated particle background
- **js/enhancements.js** - Core features (500+ lines)
  - Theme system
  - Scroll animations
  - Form validation
  - Count-up animations
  - Toast notifications
  - Loading screen
- **js/showcase-interactive.js** - Showcase features (450+ lines)
  - Color generator
  - Typing test
  - Particle system
  - API tester
  - Snake game

## 🎨 Theme System Usage

### In HTML:
```html
<!-- Add theme picker -->
<div class="theme-picker">
    <div class="theme-picker-toggle" onclick="toggleThemePicker()">🎨</div>
    <div class="theme-option theme-dark" data-theme="dark"></div>
    <div class="theme-option theme-light" data-theme="light"></div>
    <!-- ... more themes ... -->
</div>
```

### In JavaScript:
```javascript
// Change theme programmatically
document.documentElement.setAttribute('data-theme', 'cyberpunk');
localStorage.setItem('portfolio-theme', 'cyberpunk');
```

### In CSS:
```css
/* Use theme variables */
.my-element {
    background: var(--bg-primary);
    color: var(--text-primary);
    border: 2px solid var(--accent-primary);
}
```

## 🎯 Available CSS Variables

Each theme defines these variables:
- `--bg-primary` - Main background color
- `--bg-secondary` - Secondary background
- `--bg-card` - Card backgrounds
- `--text-primary` - Main text color
- `--text-secondary` - Secondary text
- `--accent-primary` - Primary accent
- `--accent-secondary` - Secondary accent
- `--accent-tertiary` - Tertiary accent
- `--gradient-primary` - Main gradient
- `--shadow-glow` - Glow effect shadow
- `--shadow-xl` - Extra large shadow

## 📱 Pages Overview

### Main Portfolio (index.html)
- Hero section with typing animation
- Matter.js particle background
- Projects timeline
- Skills section with progress bars
- Testimonials carousel (Swiper.js)
- Contact form (Netlify)
- Achievement counters

### Interactive Showcase (pages/showcase.html)
- Color palette generator
- Typing speed test
- Interactive particle system
- API testing tool
- Live code preview
- Snake game

## 🔧 Configuration Files

### tailwind.config.js
Tailwind CSS configuration with:
- Custom timing functions
- Extended color palette
- Dark mode support

### package.json
Project dependencies:
- Tailwind CSS v3.4.6

## 📚 Documentation

Detailed documentation available in `/docs`:
- **ENHANCEMENTS-README.md** - Complete feature documentation
- **CHECKLIST.md** - Testing and verification checklist
- **SUMMARY.md** - Before/after comparison
- **QUICK-START.html** - Visual setup guide

## 🎮 Interactive Features

### Typing Test
- 60-second timer
- Real-time WPM calculation
- Accuracy tracking
- Multiple sample texts

### Snake Game
- Arrow key controls
- Score tracking
- Theme-aware colors
- Collision detection

### Particle System
- Mouse interaction
- Physics-based movement
- Auto-spawning particles
- Smooth animations

### Color Generator
- Random color creation
- Click to copy
- Hex color codes
- Responsive grid

### API Tester
- Support for GET/POST/PUT/DELETE
- JSON response viewer
- Error handling
- Pre-loaded examples

## 🌟 Special Effects

Available effects (theme-dependent):
- Glitch animation
- Holographic gradients
- Matrix rain
- Cyberpunk grid
- Scan lines
- 3D card tilt
- Particle backgrounds
- Smooth transitions

## 🔍 Browser Compatibility

Tested and working on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## 📈 Performance

- Lighthouse Score: 95+
- Fast page load times
- Optimized animations
- Efficient JavaScript
- Minimal dependencies

## 🤝 Contact

- **Name:** Sanim Ahmed
- **Role:** MERN Stack Developer
- **Phone:** +8801991523289
- **Location:** Dhaka, Bangladesh

## 📄 License

This is a personal portfolio project. Feel free to use as inspiration for your own portfolio!

## 🚧 Future Enhancements

Planned features (see `/docs/CHECKLIST.md`):
- [ ] Terminal/command interface
- [ ] Advanced about page
- [ ] Projects gallery with filters
- [ ] More mini-games
- [ ] Easter eggs
- [ ] GitHub stats integration
- [ ] Blog section
- [ ] Dark mode toggle animation

## 💡 Tips

1. **Theme Persistence:** Your theme choice is saved in localStorage
2. **Mobile Navigation:** Tap the hamburger menu on mobile
3. **Keyboard Shortcuts:** Arrow keys for Snake game
4. **Copy Colors:** Click any generated color to copy hex code
5. **API Testing:** Try different endpoints in the API tester

## 🆘 Troubleshooting

**Issue:** Themes not switching
- **Solution:** Clear browser cache and reload

**Issue:** Tailwind styles not applying
- **Solution:** Run `npx tailwindcss -i ./css/input.css -o ./css/output.css`

**Issue:** JavaScript features not working
- **Solution:** Check browser console for errors, ensure scripts are loaded

**Issue:** Images not displaying
- **Solution:** Check file paths in `/assets` folder

## 📞 Support

For issues or questions:
1. Check `/docs/ENHANCEMENTS-README.md`
2. Review `/docs/CHECKLIST.md`
3. Contact via portfolio contact form

---

**Built with ❤️ by Sanim Ahmed**

Last Updated: November 7, 2025
