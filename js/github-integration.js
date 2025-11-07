// ===================================
// LIVE GITHUB INTEGRATION SYSTEM
// ===================================

class GitHubIntegration {
    constructor(username = 'sanimahmed') {
        this.username = username;
        this.apiBase = 'https://api.github.com';
        this.cache = {};
        this.cacheExpiry = 10 * 60 * 1000; // 10 minutes
    }

    // Fetch with caching
    async fetchWithCache(url, key) {
        const now = Date.now();
        if (this.cache[key] && (now - this.cache[key].timestamp < this.cacheExpiry)) {
            return this.cache[key].data;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            this.cache[key] = { data, timestamp: now };
            return data;
        } catch (error) {
            console.error('GitHub API Error:', error);
            return null;
        }
    }

    // Get user profile data
    async getUserData() {
        return await this.fetchWithCache(
            `${this.apiBase}/users/${this.username}`,
            'userData'
        );
    }

    // Get user repositories
    async getRepositories() {
        return await this.fetchWithCache(
            `${this.apiBase}/users/${this.username}/repos?sort=updated&per_page=100`,
            'repositories'
        );
    }

    // Get repository languages
    async getRepoLanguages(repoName) {
        return await this.fetchWithCache(
            `${this.apiBase}/repos/${this.username}/${repoName}/languages`,
            `languages_${repoName}`
        );
    }

    // Get user events (commits, PRs, etc.)
    async getUserEvents() {
        return await this.fetchWithCache(
            `${this.apiBase}/users/${this.username}/events?per_page=100`,
            'userEvents'
        );
    }

    // Calculate contribution data
    async getContributionData() {
        const events = await this.getUserEvents();
        if (!events) return null;

        const contributions = {};
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

        events.forEach(event => {
            const date = new Date(event.created_at);
            if (date >= oneYearAgo) {
                const dateKey = date.toISOString().split('T')[0];
                contributions[dateKey] = (contributions[dateKey] || 0) + 1;
            }
        });

        return contributions;
    }

    // Get all languages across repos
    async getAllLanguages() {
        const repos = await this.getRepositories();
        if (!repos) return null;

        const languageStats = {};
        
        for (const repo of repos.slice(0, 20)) { // Limit to avoid rate limits
            const languages = await this.getRepoLanguages(repo.name);
            if (languages) {
                Object.entries(languages).forEach(([lang, bytes]) => {
                    languageStats[lang] = (languageStats[lang] || 0) + bytes;
                });
            }
        }

        return languageStats;
    }

    // Get pinned repositories (top starred)
    async getPinnedRepos() {
        const repos = await this.getRepositories();
        if (!repos) return [];

        return repos
            .filter(repo => !repo.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 6);
    }
}

// GitHub Stats Display Component
class GitHubStatsDisplay {
    constructor(containerId, username = 'sanimahmed') {
        this.container = document.getElementById(containerId);
        this.github = new GitHubIntegration(username);
        this.init();
    }

    async init() {
        if (!this.container) {
            console.warn('GitHub stats container not found');
            return;
        }

        this.showLoading();
        await this.render();
    }

    showLoading() {
        this.container.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <div style="
                    width: 60px;
                    height: 60px;
                    border: 5px solid var(--accent-secondary);
                    border-top-color: var(--accent-primary);
                    border-radius: 50%;
                    margin: 0 auto 20px;
                    animation: spin 1s linear infinite;
                "></div>
                <p style="color: var(--text-primary); font-size: 1.2rem;">Loading GitHub Data...</p>
            </div>
        `;
    }

    async render() {
        const userData = await this.github.getUserData();
        const repos = await this.github.getRepositories();
        const languages = await this.github.getAllLanguages();
        const contributions = await this.github.getContributionData();
        const pinnedRepos = await this.github.getPinnedRepos();

        if (!userData || !repos) {
            this.container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-primary);">
                    <h3>⚠️ Unable to load GitHub data</h3>
                    <p>Using demo data instead</p>
                </div>
            `;
            this.renderDemoData();
            return;
        }

        this.container.innerHTML = `
            <div class="github-stats-wrapper">
                ${this.renderOverview(userData, repos)}
                ${this.renderLanguageChart(languages)}
                ${this.renderContributionHeatmap(contributions)}
                ${this.renderPinnedRepos(pinnedRepos)}
            </div>
        `;

        this.initializeCharts(languages);
    }

    renderOverview(userData, repos) {
        const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

        return `
            <div class="github-overview">
                <div class="github-profile">
                    <img src="${userData.avatar_url}" alt="${userData.name}" class="github-avatar">
                    <div class="github-profile-info">
                        <h2>${userData.name || userData.login}</h2>
                        <p class="github-bio">${userData.bio || 'Full Stack Developer'}</p>
                        <div class="github-stats-row">
                            <div class="stat-box">
                                <div class="stat-number">${userData.public_repos}</div>
                                <div class="stat-label">Repositories</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-number">${totalStars}</div>
                                <div class="stat-label">Total Stars</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-number">${totalForks}</div>
                                <div class="stat-label">Total Forks</div>
                            </div>
                            <div class="stat-box">
                                <div class="stat-number">${userData.followers}</div>
                                <div class="stat-label">Followers</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderLanguageChart(languages) {
        if (!languages) return '';

        const total = Object.values(languages).reduce((sum, val) => sum + val, 0);
        const sortedLanguages = Object.entries(languages)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8);

        const colors = {
            'JavaScript': '#f1e05a',
            'TypeScript': '#2b7489',
            'Python': '#3572A5',
            'Java': '#b07219',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'React': '#61dafb',
            'Node': '#68a063',
            'Vue': '#42b883',
            'PHP': '#4F5D95'
        };

        return `
            <div class="github-section">
                <h3 class="section-title">💻 Language Breakdown</h3>
                <div class="language-chart-container">
                    <canvas id="languagePieChart" width="400" height="400"></canvas>
                    <div class="language-list">
                        ${sortedLanguages.map(([lang, bytes]) => {
                            const percentage = ((bytes / total) * 100).toFixed(1);
                            return `
                                <div class="language-item">
                                    <div class="language-info">
                                        <span class="language-dot" style="background: ${colors[lang] || '#888'}"></span>
                                        <span class="language-name">${lang}</span>
                                    </div>
                                    <div class="language-bar-container">
                                        <div class="language-bar" style="width: ${percentage}%; background: ${colors[lang] || '#888'}"></div>
                                    </div>
                                    <span class="language-percentage">${percentage}%</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderContributionHeatmap(contributions) {
        if (!contributions) return '';

        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        const weeks = [];
        let currentWeek = [];

        for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
            const dateKey = d.toISOString().split('T')[0];
            const count = contributions[dateKey] || 0;
            
            currentWeek.push({
                date: new Date(d),
                count: count,
                level: this.getContributionLevel(count)
            });

            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        }

        if (currentWeek.length > 0) {
            weeks.push(currentWeek);
        }

        return `
            <div class="github-section">
                <h3 class="section-title">📊 Contribution Activity (Last 12 Months)</h3>
                <div class="contribution-heatmap">
                    ${weeks.map(week => `
                        <div class="heatmap-week">
                            ${week.map(day => `
                                <div class="heatmap-day level-${day.level}" 
                                     title="${day.date.toDateString()}: ${day.count} contributions"
                                     data-count="${day.count}">
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
                <div class="heatmap-legend">
                    <span>Less</span>
                    <div class="legend-box level-0"></div>
                    <div class="legend-box level-1"></div>
                    <div class="legend-box level-2"></div>
                    <div class="legend-box level-3"></div>
                    <div class="legend-box level-4"></div>
                    <span>More</span>
                </div>
            </div>
        `;
    }

    getContributionLevel(count) {
        if (count === 0) return 0;
        if (count <= 2) return 1;
        if (count <= 4) return 2;
        if (count <= 6) return 3;
        return 4;
    }

    renderPinnedRepos(repos) {
        if (!repos || repos.length === 0) return '';

        return `
            <div class="github-section">
                <h3 class="section-title">⭐ Top Repositories</h3>
                <div class="pinned-repos-grid">
                    ${repos.map(repo => `
                        <a href="${repo.html_url}" target="_blank" class="repo-card">
                            <div class="repo-header">
                                <h4 class="repo-name">📦 ${repo.name}</h4>
                                <div class="repo-stats-inline">
                                    <span title="Stars">⭐ ${repo.stargazers_count}</span>
                                    <span title="Forks">🔱 ${repo.forks_count}</span>
                                </div>
                            </div>
                            <p class="repo-description">${repo.description || 'No description available'}</p>
                            <div class="repo-footer">
                                ${repo.language ? `
                                    <span class="repo-language">
                                        <span class="lang-dot"></span>
                                        ${repo.language}
                                    </span>
                                ` : ''}
                                <span class="repo-updated">Updated ${this.getRelativeTime(repo.updated_at)}</span>
                            </div>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getRelativeTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
        return `${Math.floor(diffInSeconds / 31536000)}y ago`;
    }

    async initializeCharts(languages) {
        if (!languages) return;

        const canvas = document.getElementById('languagePieChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const sortedLanguages = Object.entries(languages)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8);

        const total = sortedLanguages.reduce((sum, [, bytes]) => sum + bytes, 0);
        
        const colors = {
            'JavaScript': '#f1e05a',
            'TypeScript': '#2b7489',
            'Python': '#3572A5',
            'Java': '#b07219',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'React': '#61dafb',
            'Node': '#68a063',
            'Vue': '#42b883',
            'PHP': '#4F5D95'
        };

        // Draw pie chart
        let currentAngle = -Math.PI / 2;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;

        sortedLanguages.forEach(([lang, bytes]) => {
            const sliceAngle = (bytes / total) * 2 * Math.PI;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.lineTo(centerX, centerY);
            ctx.fillStyle = colors[lang] || '#888';
            ctx.fill();
            
            ctx.strokeStyle = 'var(--bg-primary)';
            ctx.lineWidth = 3;
            ctx.stroke();

            currentAngle += sliceAngle;
        });

        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
        ctx.fillStyle = 'var(--bg-card)';
        ctx.fill();
    }

    renderDemoData() {
        // Fallback demo data if API fails
        this.container.innerHTML = `
            <div class="github-stats-wrapper">
                <div class="github-overview">
                    <div class="github-stats-row">
                        <div class="stat-box">
                            <div class="stat-number">45+</div>
                            <div class="stat-label">Repositories</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-number">350+</div>
                            <div class="stat-label">Total Stars</div>
                        </div>
                        <div class="stat-box">
                            <div class="stat-number">120+</div>
                            <div class="stat-label">Contributions</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Styles
const style = document.createElement('style');
style.textContent = `
    .github-stats-wrapper {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
    }

    .github-section {
        background: var(--bg-card);
        border-radius: 15px;
        padding: 30px;
        margin: 20px 0;
        border: 2px solid var(--accent-tertiary);
    }

    .section-title {
        font-size: 1.8rem;
        font-weight: bold;
        margin-bottom: 25px;
        color: var(--accent-primary);
    }

    .github-overview {
        background: var(--bg-card);
        border-radius: 15px;
        padding: 30px;
        margin: 20px 0;
        border: 2px solid var(--accent-tertiary);
    }

    .github-profile {
        display: flex;
        gap: 30px;
        align-items: center;
    }

    .github-avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 4px solid var(--accent-primary);
    }

    .github-profile-info h2 {
        font-size: 2rem;
        margin-bottom: 10px;
        color: var(--accent-primary);
    }

    .github-bio {
        opacity: 0.8;
        margin-bottom: 20px;
    }

    .github-stats-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }

    .stat-box {
        text-align: center;
        padding: 15px;
        background: var(--bg-secondary);
        border-radius: 10px;
    }

    .stat-number {
        font-size: 2rem;
        font-weight: bold;
        background: var(--gradient-primary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .stat-label {
        margin-top: 5px;
        opacity: 0.8;
        font-size: 0.9rem;
    }

    .language-chart-container {
        display: grid;
        grid-template-columns: 400px 1fr;
        gap: 40px;
        align-items: center;
    }

    .language-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .language-item {
        display: grid;
        grid-template-columns: 150px 1fr 60px;
        gap: 15px;
        align-items: center;
    }

    .language-info {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .language-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
    }

    .language-bar-container {
        height: 8px;
        background: var(--bg-secondary);
        border-radius: 4px;
        overflow: hidden;
    }

    .language-bar {
        height: 100%;
        border-radius: 4px;
        transition: width 0.5s ease;
    }

    .contribution-heatmap {
        display: flex;
        gap: 3px;
        overflow-x: auto;
        padding: 10px 0;
    }

    .heatmap-week {
        display: flex;
        flex-direction: column;
        gap: 3px;
    }

    .heatmap-day {
        width: 12px;
        height: 12px;
        border-radius: 2px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .heatmap-day:hover {
        transform: scale(1.5);
        border: 2px solid var(--accent-primary);
    }

    .heatmap-day.level-0 { background: var(--bg-secondary); }
    .heatmap-day.level-1 { background: rgba(var(--accent-primary-rgb), 0.2); }
    .heatmap-day.level-2 { background: rgba(var(--accent-primary-rgb), 0.4); }
    .heatmap-day.level-3 { background: rgba(var(--accent-primary-rgb), 0.7); }
    .heatmap-day.level-4 { background: var(--accent-primary); }

    .heatmap-legend {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-top: 15px;
        font-size: 0.85rem;
        opacity: 0.8;
    }

    .legend-box {
        width: 12px;
        height: 12px;
        border-radius: 2px;
    }

    .pinned-repos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 20px;
    }

    .repo-card {
        background: var(--bg-secondary);
        border: 2px solid var(--accent-tertiary);
        border-radius: 12px;
        padding: 20px;
        text-decoration: none;
        color: var(--text-primary);
        transition: all 0.3s ease;
    }

    .repo-card:hover {
        transform: translateY(-5px);
        border-color: var(--accent-primary);
        box-shadow: var(--shadow-glow);
    }

    .repo-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        margin-bottom: 10px;
    }

    .repo-name {
        font-size: 1.2rem;
        font-weight: bold;
        color: var(--accent-primary);
    }

    .repo-stats-inline {
        display: flex;
        gap: 10px;
        font-size: 0.9rem;
    }

    .repo-description {
        opacity: 0.8;
        margin: 15px 0;
        line-height: 1.6;
    }

    .repo-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 15px;
        font-size: 0.85rem;
        opacity: 0.7;
    }

    .repo-language {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .lang-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--accent-primary);
    }

    @media (max-width: 768px) {
        .github-profile {
            flex-direction: column;
            text-align: center;
        }

        .language-chart-container {
            grid-template-columns: 1fr;
        }

        .contribution-heatmap {
            font-size: 0.8rem;
        }

        .heatmap-day {
            width: 8px;
            height: 8px;
        }

        .pinned-repos-grid {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);

// Auto-initialize if github-stats container exists
document.addEventListener('DOMContentLoaded', () => {
    const githubContainer = document.getElementById('github-stats');
    if (githubContainer) {
        const username = githubContainer.getAttribute('data-username') || 'sanimahmed';
        new GitHubStatsDisplay('github-stats', username);
    }
});

console.log('🔥 GitHub Integration System Loaded!');
