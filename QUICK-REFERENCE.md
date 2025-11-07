# 🚀 QUICK REFERENCE CARD

## 📂 File Locations (Quick Find)

### Main Files
```
index.html           → Main portfolio (START HERE!)
README.md            → Complete guide
PROJECT-STRUCTURE.md → Structure details
VERIFICATION.md      → Testing report
```

### Stylesheets (css/)
```
css/theme.css            → Core theme system
css/advanced-themes.css  → 8 theme variants
css/output.css           → Compiled Tailwind
css/font.css             → Fonts
css/style.css            → Custom styles
css/input.css            → Tailwind source
```

### JavaScript (js/)
```
js/enhancements.js          → Core features (540 lines)
js/showcase-interactive.js  → Showcase demos (450 lines)
js/matter.js                → Particle engine (240 lines)
```

### Pages (pages/)
```
pages/showcase.html      → Interactive demos ⭐
pages/test-features.html → Feature testing
pages/demo.html          → Feature showcase
pages/skills-section.html → Skills template
```

### Documentation (docs/)
```
docs/ENHANCEMENTS-README.md → Feature docs (470 lines)
docs/CHECKLIST.md           → Testing checklist
docs/SUMMARY.md             → Project summary
docs/QUICK-START.html       → Visual guide
```

---

## 🎨 Theme System Quick Access

### Switch Themes
1. Click **🎨** icon (top-right corner)
2. Select from 8 themes:
   - Dark (default)
   - Light
   - Cyberpunk
   - Ocean
   - Forest
   - Sunset
   - Neon
   - Dracula

### Theme Files
- **Core:** `css/theme.css`
- **Variants:** `css/advanced-themes.css`
- **Logic:** `js/enhancements.js` (lines 1-80)

---

## 🎮 Interactive Features Access

### Main Portfolio (index.html)
- Theme Picker → Top-right 🎨 icon
- Showcase Link → Header "✨ Interactive Showcase"
- Scroll Progress → Top blue bar
- Back to Top → Bottom-right arrow
- Skills Section → Scroll down
- Contact Form → Bottom section

### Showcase Page (pages/showcase.html)
- Color Generator → Top section
- Typing Test → Second section
- Particles → Third section (move mouse!)
- API Tester → Fourth section
- Code Preview → Fifth section
- Snake Game → Last section (arrow keys)

---

## 🛠️ Development Commands

### Compile Tailwind CSS
```bash
npx tailwindcss -i ./css/input.css -o ./css/output.css
```

### Watch Mode (Auto-compile)
```bash
npx tailwindcss -i ./css/input.css -o ./css/output.css --watch
```

### Install Dependencies
```bash
npm install
```

### Update Dependencies
```bash
npm update
```

---

## 🔍 Quick Search

### Find Feature Code
| Feature | File | Lines |
|---------|------|-------|
| Theme Switching | js/enhancements.js | 1-80 |
| Scroll Progress | js/enhancements.js | 150-180 |
| Color Generator | js/showcase-interactive.js | 50-80 |
| Typing Test | js/showcase-interactive.js | 100-200 |
| Particle System | js/showcase-interactive.js | 220-320 |
| Snake Game | js/showcase-interactive.js | 380-450 |

### Find Styles
| Element | File | Section |
|---------|------|---------|
| Theme Variables | css/theme.css | Top :root |
| 8 Theme Defs | css/advanced-themes.css | [data-theme] |
| Animations | css/theme.css | @keyframes |
| Button Styles | css/theme.css | .btn-primary |
| Card Styles | css/theme.css | .card |

---

## 📱 Pages Map

```
User Flow:
index.html (Main)
    ↓
    Click "✨ Interactive Showcase"
    ↓
pages/showcase.html (Demos)
    ↓
    Try 6 interactive features
    ↓
    Click "← Back to Main Portfolio"
    ↓
index.html (Return)
```

---

## 🎯 Common Tasks

### Add New Theme
1. Edit `css/advanced-themes.css`
2. Add `[data-theme="newtheme"]` section
3. Define all CSS variables
4. Add theme option to HTML:
   ```html
   <div class="theme-option theme-newtheme" 
        data-theme="newtheme" title="New Theme"></div>
   ```

### Add New Page
1. Create `pages/newpage.html`
2. Link CSS: `../css/output.css`, etc.
3. Link JS: `../js/enhancements.js`
4. Add link in `index.html`:
   ```html
   <a href="pages/newpage.html">New Page</a>
   ```

### Edit Colors
1. Open `css/theme.css` or `css/advanced-themes.css`
2. Find theme section: `[data-theme="dark"]`
3. Modify variables: `--accent-primary: #new-color;`
4. Save and refresh browser

### Add JavaScript Feature
1. Open `js/enhancements.js`
2. Add function to PortfolioEnhancer class
3. Call from `init()` method
4. Test in browser

---

## 🚨 Troubleshooting

### Styles Not Loading
```bash
# Recompile CSS
npx tailwindcss -i ./css/input.css -o ./css/output.css

# Clear browser cache
Ctrl + Shift + R (Chrome)
Ctrl + F5 (Firefox)
```

### Theme Not Switching
```javascript
// Open browser console (F12)
// Check for errors
// Verify localStorage:
localStorage.getItem('portfolio-theme')

// Clear if needed:
localStorage.clear()
```

### JavaScript Not Working
```
1. Open browser console (F12)
2. Check for errors
3. Verify script paths in HTML
4. Ensure defer attribute is present
```

### Page Not Found
```
1. Check file path (case-sensitive on some servers)
2. Use relative paths: ../css/style.css
3. Verify file exists in folder
```

---

## 📊 File Size Reference

| Category | Count | Total Size |
|----------|-------|------------|
| CSS Files | 6 | ~56 KB |
| JS Files | 3 | ~37 KB |
| HTML Files | 5 | ~116 KB |
| Documentation | 8 | ~90 KB |
| **Total** | **22** | **~300 KB** |

---

## 🎨 Color Variables Reference

### Core Variables (All Themes)
```css
--bg-primary        → Main background
--bg-secondary      → Secondary background
--bg-card           → Card backgrounds
--text-primary      → Main text
--text-secondary    → Secondary text
--accent-primary    → Primary accent
--accent-secondary  → Secondary accent
--accent-tertiary   → Tertiary accent
--gradient-primary  → Main gradient
--shadow-glow       → Glow effect
--shadow-xl         → Large shadow
```

---

## ⌨️ Keyboard Shortcuts

### Snake Game
```
↑ Arrow Up    → Move Up
↓ Arrow Down  → Move Down
← Arrow Left  → Move Left
→ Arrow Right → Move Right
```

### Browser
```
F5           → Refresh page
F12          → Open DevTools
Ctrl + U     → View page source
Ctrl + +/-   → Zoom in/out
```

---

## 🔗 Important Links

### External Libraries (CDN)
- Swiper.js: `cdn.jsdelivr.net/npm/swiper@11`
- Matter.js: `cdnjs.cloudflare.com/ajax/libs/matter-js/0.12.0`
- Tailwind Play: `play.tailwindcss.com`

### Documentation
- Tailwind Docs: `tailwindcss.com/docs`
- Matter.js Docs: `brm.io/matter-js/docs`
- Swiper Docs: `swiperjs.com/get-started`

---

## 💡 Pro Tips

1. **Always compile CSS** after editing `input.css`
2. **Use theme variables** instead of hardcoded colors
3. **Test all themes** when adding new features
4. **Clear browser cache** if styles don't update
5. **Check console** (F12) for JavaScript errors
6. **Use relative paths** for pages in subfolders
7. **Backup before** making major changes
8. **Test mobile** view with DevTools (F12 → Toggle Device)

---

## 📞 Quick Help

### Need Documentation?
→ See `README.md` or `docs/ENHANCEMENTS-README.md`

### Need Structure Info?
→ See `PROJECT-STRUCTURE.md`

### Need Testing Info?
→ See `VERIFICATION.md` or `docs/CHECKLIST.md`

### Need Before/After?
→ See `ORGANIZATION-REPORT.md`

### Need This Quick Ref?
→ You're already here! 📍

---

## ✅ Quick Status Check

**Portfolio Status:** ✅ Fully Functional  
**Organization:** ✅ Professional  
**Features:** ✅ All Working  
**Themes:** ✅ 8 Available  
**Documentation:** ✅ Complete  
**Ready for:** ✅ Production

---

**Last Updated:** November 7, 2025  
**Quick Ref Version:** 1.0  
**Status:** ✅ CURRENT
