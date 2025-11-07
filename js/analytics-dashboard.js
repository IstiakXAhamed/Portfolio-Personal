// ===================================
// ADVANCED ANALYTICS DASHBOARD
// ===================================

class AnalyticsDashboard {
    constructor() {
        this.analytics = {
            pageViews: {},
            sessions: [],
            events: [],
            heatmapData: [],
            userFlow: [],
            performance: {}
        };
        this.sessionId = this.generateSessionId();
        this.init();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    init() {
        this.loadStoredData();
        this.trackPageView();
        this.trackSession();
        this.trackClicks();
        this.trackScrollDepth();
        this.trackTimeOnPage();
        this.trackPerformance();
        this.createDashboardButton();
    }

    loadStoredData() {
        const stored = localStorage.getItem('portfolioAnalytics');
        if (stored) {
            try {
                this.analytics = JSON.parse(stored);
            } catch (e) {
                console.warn('Failed to load analytics:', e);
            }
        }
    }

    saveData() {
        try {
            localStorage.setItem('portfolioAnalytics', JSON.stringify(this.analytics));
        } catch (e) {
            console.warn('Failed to save analytics:', e);
        }
    }

    trackPageView() {
        const page = window.location.pathname;
        if (!this.analytics.pageViews[page]) {
            this.analytics.pageViews[page] = 0;
        }
        this.analytics.pageViews[page]++;
        this.saveData();
    }

    trackSession() {
        const session = {
            id: this.sessionId,
            startTime: Date.now(),
            pages: [window.location.pathname],
            device: this.getDeviceInfo(),
            referrer: document.referrer
        };
        this.analytics.sessions.push(session);
        this.saveData();
    }

    trackClicks() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button, [role="button"]');
            if (target) {
                const event = {
                    type: 'click',
                    element: target.tagName,
                    text: target.textContent.trim().substring(0, 50),
                    x: e.clientX,
                    y: e.clientY,
                    timestamp: Date.now(),
                    page: window.location.pathname
                };
                this.analytics.events.push(event);
                this.analytics.heatmapData.push({ x: e.clientX, y: e.clientY });
                this.saveData();
            }
        });
    }

    trackScrollDepth() {
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent > maxScroll) {
                maxScroll = Math.round(scrollPercent);
                if (maxScroll % 25 === 0) {
                    this.analytics.events.push({
                        type: 'scroll',
                        depth: maxScroll,
                        timestamp: Date.now(),
                        page: window.location.pathname
                    });
                    this.saveData();
                }
            }
        });
    }

    trackTimeOnPage() {
        const startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            this.analytics.events.push({
                type: 'timeOnPage',
                duration: timeSpent,
                timestamp: Date.now(),
                page: window.location.pathname
            });
            this.saveData();
        });
    }

    trackPerformance() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            this.analytics.performance[window.location.pathname] = {
                loadTime: loadTime,
                domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
                firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
            };
            this.saveData();
        }
    }

    getDeviceInfo() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
        };
    }

    createDashboardButton() {
        const button = document.createElement('button');
        button.innerHTML = '📊';
        button.title = 'Analytics Dashboard';
        button.id = 'analytics-dashboard-btn';
        button.style.cssText = `
            position: fixed;
            bottom: 430px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: var(--bg-card);
            border: 3px solid var(--accent-primary);
            border-radius: 50%;
            font-size: 1.8rem;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;
        button.addEventListener('click', () => this.showDashboard());
        document.body.appendChild(button);
    }

    showDashboard() {
        const modal = document.createElement('div');
        modal.id = 'analytics-modal';
        modal.innerHTML = `
            <div class="analytics-modal-content">
                <div class="analytics-header">
                    <h2>📊 Analytics Dashboard</h2>
                    <button class="close-btn" onclick="document.getElementById('analytics-modal').remove()">✕</button>
                </div>
                <div class="analytics-tabs">
                    <button class="tab-btn active" data-tab="overview">Overview</button>
                    <button class="tab-btn" data-tab="pageviews">Page Views</button>
                    <button class="tab-btn" data-tab="heatmap">Heatmap</button>
                    <button class="tab-btn" data-tab="performance">Performance</button>
                </div>
                <div class="analytics-content">
                    ${this.renderOverview()}
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        document.body.appendChild(modal);
        this.attachTabListeners();
        this.renderHeatmap();
    }

    renderOverview() {
        const totalPageViews = Object.values(this.analytics.pageViews).reduce((a, b) => a + b, 0);
        const totalSessions = this.analytics.sessions.length;
        const avgTimePerSession = this.calculateAverageSessionTime();
        const topPages = this.getTopPages();

        return `
            <div class="tab-content active" id="overview">
                <div class="analytics-grid">
                    <div class="analytics-card">
                        <div class="card-icon">👁️</div>
                        <div class="card-value">${totalPageViews}</div>
                        <div class="card-label">Total Page Views</div>
                    </div>
                    <div class="analytics-card">
                        <div class="card-icon">📱</div>
                        <div class="card-value">${totalSessions}</div>
                        <div class="card-label">Total Sessions</div>
                    </div>
                    <div class="analytics-card">
                        <div class="card-icon">⏱️</div>
                        <div class="card-value">${avgTimePerSession}s</div>
                        <div class="card-label">Avg. Session Time</div>
                    </div>
                    <div class="analytics-card">
                        <div class="card-icon">🖱️</div>
                        <div class="card-value">${this.analytics.events.filter(e => e.type === 'click').length}</div>
                        <div class="card-label">Total Clicks</div>
                    </div>
                </div>
                <div class="top-pages">
                    <h3>🏆 Top Pages</h3>
                    <ul>
                        ${topPages.map(page => `
                            <li>
                                <span class="page-path">${page.path || 'Homepage'}</span>
                                <span class="page-views">${page.views} views</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    calculateAverageSessionTime() {
        const times = this.analytics.events
            .filter(e => e.type === 'timeOnPage')
            .map(e => e.duration);
        if (times.length === 0) return 0;
        return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    }

    getTopPages() {
        return Object.entries(this.analytics.pageViews)
            .map(([path, views]) => ({ path, views }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 5);
    }

    attachTabListeners() {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const tabName = tab.dataset.tab;
                const content = document.querySelector('.analytics-content');
                
                switch(tabName) {
                    case 'overview':
                        content.innerHTML = this.renderOverview();
                        break;
                    case 'pageviews':
                        content.innerHTML = this.renderPageViews();
                        break;
                    case 'heatmap':
                        content.innerHTML = this.renderHeatmapView();
                        setTimeout(() => this.renderHeatmap(), 100);
                        break;
                    case 'performance':
                        content.innerHTML = this.renderPerformance();
                        break;
                }
            });
        });
    }

    renderPageViews() {
        return `
            <div class="tab-content active" id="pageviews">
                <div class="page-views-chart">
                    <h3>📄 Page Views Breakdown</h3>
                    <canvas id="pageviews-chart" width="600" height="300"></canvas>
                </div>
            </div>
        `;
    }

    renderHeatmapView() {
        return `
            <div class="tab-content active" id="heatmap">
                <h3>🔥 Click Heatmap</h3>
                <div class="heatmap-container">
                    <canvas id="heatmap-canvas" width="800" height="600"></canvas>
                </div>
                <p class="heatmap-info">Red areas indicate more clicks. Total clicks: ${this.analytics.heatmapData.length}</p>
            </div>
        `;
    }

    renderHeatmap() {
        const canvas = document.getElementById('heatmap-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.analytics.heatmapData.forEach(point => {
            const x = (point.x / window.innerWidth) * canvas.width;
            const y = (point.y / window.innerHeight) * canvas.height;
            
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
            gradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x - 30, y - 30, 60, 60);
        });
    }

    renderPerformance() {
        const perfData = Object.entries(this.analytics.performance);
        return `
            <div class="tab-content active" id="performance">
                <h3>⚡ Performance Metrics</h3>
                <div class="performance-list">
                    ${perfData.map(([page, metrics]) => `
                        <div class="performance-item">
                            <div class="perf-page">${page || 'Homepage'}</div>
                            <div class="perf-metrics">
                                <span>Load Time: <strong>${metrics.loadTime}ms</strong></span>
                                <span>DOM Ready: <strong>${metrics.domReady}ms</strong></span>
                                <span>First Paint: <strong>${Math.round(metrics.firstPaint)}ms</strong></span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

// Add analytics styles
const analyticsStyle = document.createElement('style');
analyticsStyle.textContent = `
    .analytics-modal-content {
        background: var(--bg-card);
        border-radius: 20px;
        width: 90%;
        max-width: 1000px;
        max-height: 80vh;
        overflow: auto;
        padding: 30px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }

    .analytics-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid var(--accent-primary);
    }

    .analytics-header h2 {
        color: var(--text-primary);
        font-size: 2rem;
        margin: 0;
    }

    .close-btn {
        background: transparent;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: var(--text-primary);
        transition: transform 0.2s;
    }

    .close-btn:hover {
        transform: scale(1.2);
    }

    .analytics-tabs {
        display: flex;
        gap: 10px;
        margin-bottom: 30px;
        flex-wrap: wrap;
    }

    .tab-btn {
        padding: 12px 24px;
        background: var(--bg-secondary);
        border: 2px solid transparent;
        border-radius: 10px;
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 600;
    }

    .tab-btn:hover {
        border-color: var(--accent-primary);
    }

    .tab-btn.active {
        background: var(--accent-primary);
        color: white;
    }

    .analytics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    }

    .analytics-card {
        background: var(--bg-secondary);
        border-radius: 15px;
        padding: 25px;
        text-align: center;
        border: 2px solid var(--accent-secondary);
        transition: transform 0.3s ease;
    }

    .analytics-card:hover {
        transform: translateY(-5px);
    }

    .card-icon {
        font-size: 3rem;
        margin-bottom: 10px;
    }

    .card-value {
        font-size: 2.5rem;
        font-weight: bold;
        color: var(--accent-primary);
        margin-bottom: 5px;
    }

    .card-label {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .top-pages {
        background: var(--bg-secondary);
        border-radius: 15px;
        padding: 25px;
    }

    .top-pages h3 {
        color: var(--text-primary);
        margin-bottom: 20px;
    }

    .top-pages ul {
        list-style: none;
        padding: 0;
    }

    .top-pages li {
        display: flex;
        justify-content: space-between;
        padding: 15px;
        margin-bottom: 10px;
        background: var(--bg-card);
        border-radius: 10px;
        border-left: 4px solid var(--accent-primary);
    }

    .page-path {
        color: var(--text-primary);
        font-weight: 600;
    }

    .page-views {
        color: var(--accent-secondary);
        font-weight: bold;
    }

    .heatmap-container {
        background: #1a1a2e;
        border-radius: 15px;
        padding: 20px;
        margin: 20px 0;
        display: flex;
        justify-content: center;
    }

    .heatmap-info {
        text-align: center;
        color: var(--text-secondary);
        font-style: italic;
    }

    .performance-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .performance-item {
        background: var(--bg-secondary);
        border-radius: 15px;
        padding: 20px;
        border-left: 4px solid var(--accent-primary);
    }

    .perf-page {
        color: var(--text-primary);
        font-weight: bold;
        margin-bottom: 10px;
        font-size: 1.1rem;
    }

    .perf-metrics {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
        color: var(--text-secondary);
    }

    .perf-metrics strong {
        color: var(--accent-secondary);
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(analyticsStyle);

// Initialize analytics
let analyticsDashboard;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        analyticsDashboard = new AnalyticsDashboard();
    });
} else {
    analyticsDashboard = new AnalyticsDashboard();
}
