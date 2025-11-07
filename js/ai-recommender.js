// ===================================
// AI-POWERED PROJECT RECOMMENDER
// ===================================

class ProjectRecommender {
    constructor() {
        this.userProfile = {
            interests: [],
            skillLevel: 'intermediate',
            viewHistory: [],
            interactions: []
        };
        this.projects = this.loadProjects();
        this.init();
    }

    init() {
        this.loadUserProfile();
        this.trackUserBehavior();
        this.createRecommenderWidget();
    }

    loadProjects() {
        return [
            {
                id: 1,
                name: 'E-Commerce Platform',
                tags: ['react', 'node', 'mongodb', 'stripe'],
                difficulty: 'advanced',
                category: 'full-stack',
                description: 'Full-featured e-commerce platform with payment integration'
            },
            {
                id: 2,
                name: 'Weather Dashboard',
                tags: ['javascript', 'api', 'css', 'html'],
                difficulty: 'beginner',
                category: 'frontend',
                description: 'Real-time weather data visualization'
            },
            {
                id: 3,
                name: 'Task Management App',
                tags: ['vue', 'firebase', 'tailwind'],
                difficulty: 'intermediate',
                category: 'frontend',
                description: 'Collaborative task management with real-time updates'
            },
            {
                id: 4,
                name: 'AI Chatbot',
                tags: ['python', 'machine-learning', 'nlp', 'tensorflow'],
                difficulty: 'advanced',
                category: 'ai-ml',
                description: 'Natural language processing chatbot'
            },
            {
                id: 5,
                name: 'Portfolio Builder',
                tags: ['react', 'typescript', 'tailwind'],
                difficulty: 'intermediate',
                category: 'frontend',
                description: 'Drag-and-drop portfolio website builder'
            },
            {
                id: 6,
                name: 'REST API',
                tags: ['node', 'express', 'mongodb', 'jwt'],
                difficulty: 'intermediate',
                category: 'backend',
                description: 'RESTful API with authentication'
            },
            {
                id: 7,
                name: 'Data Visualization Dashboard',
                tags: ['d3js', 'javascript', 'data-science'],
                difficulty: 'advanced',
                category: 'data-viz',
                description: 'Interactive data visualization with D3.js'
            },
            {
                id: 8,
                name: 'Social Media Clone',
                tags: ['react', 'graphql', 'postgresql', 'redis'],
                difficulty: 'advanced',
                category: 'full-stack',
                description: 'Full-stack social media application'
            },
            {
                id: 9,
                name: 'Chrome Extension',
                tags: ['javascript', 'chrome-api', 'html', 'css'],
                difficulty: 'beginner',
                category: 'tools',
                description: 'Productivity-enhancing browser extension'
            }
        ];
    }

    loadUserProfile() {
        const stored = localStorage.getItem('userProfile');
        if (stored) {
            try {
                this.userProfile = JSON.parse(stored);
            } catch (e) {
                console.warn('Failed to load user profile');
            }
        }
    }

    saveUserProfile() {
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
    }

    trackUserBehavior() {
        // Track project card clicks
        document.addEventListener('click', (e) => {
            const projectCard = e.target.closest('[data-project-id]');
            if (projectCard) {
                const projectId = parseInt(projectCard.dataset.projectId);
                this.recordInteraction(projectId, 'click');
            }
        });

        // Track time spent on pages
        let pageStartTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - pageStartTime) / 1000);
            if (timeSpent > 30) { // Only track if spent more than 30 seconds
                this.userProfile.interactions.push({
                    type: 'time-spent',
                    duration: timeSpent,
                    timestamp: Date.now()
                });
                this.saveUserProfile();
            }
        });
    }

    recordInteraction(projectId, type) {
        this.userProfile.interactions.push({
            projectId,
            type,
            timestamp: Date.now()
        });

        // Update view history
        if (!this.userProfile.viewHistory.includes(projectId)) {
            this.userProfile.viewHistory.push(projectId);
        }

        // Extract interests from project tags
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            project.tags.forEach(tag => {
                if (!this.userProfile.interests.includes(tag)) {
                    this.userProfile.interests.push(tag);
                }
            });
        }

        this.saveUserProfile();
    }

    calculateRecommendations() {
        const scores = this.projects.map(project => {
            let score = 0;

            // Score based on matching interests (highest weight)
            const matchingInterests = project.tags.filter(tag => 
                this.userProfile.interests.includes(tag)
            ).length;
            score += matchingInterests * 10;

            // Score based on skill level match
            const skillLevels = { beginner: 1, intermediate: 2, advanced: 3 };
            const userLevel = skillLevels[this.userProfile.skillLevel];
            const projectLevel = skillLevels[project.difficulty];
            
            if (Math.abs(userLevel - projectLevel) <= 1) {
                score += 5;
            }

            // Penalize already viewed projects
            if (this.userProfile.viewHistory.includes(project.id)) {
                score -= 3;
            }

            // Boost popular categories
            const recentInteractions = this.userProfile.interactions
                .filter(i => Date.now() - i.timestamp < 7 * 24 * 60 * 60 * 1000) // Last 7 days
                .map(i => this.projects.find(p => p.id === i.projectId)?.category)
                .filter(Boolean);
            
            const categoryCount = recentInteractions.filter(c => c === project.category).length;
            score += categoryCount * 2;

            return { project, score };
        });

        return scores
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map(item => item.project);
    }

    createRecommenderWidget() {
        const widget = document.createElement('div');
        widget.id = 'recommender-widget';
        widget.innerHTML = `
            <button id="recommender-btn" title="Get Project Recommendations">
                🤖
            </button>
        `;

        widget.style.cssText = `
            position: fixed;
            bottom: 590px;
            right: 30px;
            z-index: 1000;
        `;

        const button = widget.querySelector('#recommender-btn');
        button.style.cssText = `
            width: 60px;
            height: 60px;
            background: var(--bg-card);
            border: 3px solid #8B5CF6;
            border-radius: 50%;
            font-size: 1.8rem;
            cursor: pointer;
            box-shadow: 0 5px 20px rgba(139, 92, 246, 0.4);
            transition: all 0.3s ease;
        `;

        button.addEventListener('click', () => this.showRecommendations());
        document.body.appendChild(widget);
    }

    showRecommendations() {
        const recommendations = this.calculateRecommendations();
        
        const modal = document.createElement('div');
        modal.id = 'recommender-modal';
        modal.innerHTML = `
            <div class="recommender-content">
                <div class="recommender-header">
                    <h2>🤖 AI Project Recommendations</h2>
                    <button class="close-btn" onclick="document.getElementById('recommender-modal').remove()">✕</button>
                </div>
                
                <div class="skill-level-selector">
                    <label>Your Skill Level:</label>
                    <select id="skill-level-select">
                        <option value="beginner" ${this.userProfile.skillLevel === 'beginner' ? 'selected' : ''}>Beginner</option>
                        <option value="intermediate" ${this.userProfile.skillLevel === 'intermediate' ? 'selected' : ''}>Intermediate</option>
                        <option value="advanced" ${this.userProfile.skillLevel === 'advanced' ? 'selected' : ''}>Advanced</option>
                    </select>
                </div>

                <div class="interests-display">
                    <strong>Your Interests:</strong>
                    <div class="interest-tags">
                        ${this.userProfile.interests.length > 0 
                            ? this.userProfile.interests.map(interest => 
                                `<span class="interest-tag">${interest}</span>`
                            ).join('')
                            : '<span class="no-interests">Browse projects to build your profile</span>'
                        }
                    </div>
                </div>

                <div class="recommendations-list">
                    ${recommendations.map(project => `
                        <div class="recommendation-card">
                            <div class="rec-header">
                                <h3>${project.name}</h3>
                                <span class="difficulty-badge ${project.difficulty}">${project.difficulty}</span>
                            </div>
                            <p class="rec-description">${project.description}</p>
                            <div class="rec-tags">
                                ${project.tags.map(tag => `
                                    <span class="rec-tag ${this.userProfile.interests.includes(tag) ? 'matched' : ''}">${tag}</span>
                                `).join('')}
                            </div>
                            <div class="rec-actions">
                                <button class="view-project-btn" data-project-id="${project.id}">
                                    View Project →
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="recommender-footer">
                    <p>💡 Recommendations improve as you browse and interact with projects</p>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            animation: fadeIn 0.3s ease;
        `;

        document.body.appendChild(modal);

        // Attach event listeners
        document.getElementById('skill-level-select').addEventListener('change', (e) => {
            this.userProfile.skillLevel = e.target.value;
            this.saveUserProfile();
            modal.remove();
            this.showRecommendations(); // Refresh recommendations
        });

        document.querySelectorAll('.view-project-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const projectId = parseInt(e.target.dataset.projectId);
                this.recordInteraction(projectId, 'recommendation-click');
                modal.remove();
                // Navigate to projects page (you can customize this)
                window.location.href = 'pages/projects.html';
            });
        });
    }
}

// Add recommender styles
const recommenderStyle = document.createElement('style');
recommenderStyle.textContent = `
    .recommender-content {
        background: var(--bg-card);
        border-radius: 20px;
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        padding: 30px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }

    .recommender-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        padding-bottom: 20px;
        border-bottom: 2px solid var(--accent-primary);
    }

    .recommender-header h2 {
        color: var(--text-primary);
        font-size: 2rem;
        margin: 0;
    }

    .skill-level-selector {
        margin-bottom: 25px;
        padding: 20px;
        background: var(--bg-secondary);
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .skill-level-selector label {
        color: var(--text-primary);
        font-weight: 600;
    }

    .skill-level-selector select {
        padding: 10px 15px;
        background: var(--bg-card);
        border: 2px solid var(--accent-secondary);
        border-radius: 8px;
        color: var(--text-primary);
        cursor: pointer;
        font-size: 1rem;
    }

    .interests-display {
        margin-bottom: 25px;
        padding: 20px;
        background: var(--bg-secondary);
        border-radius: 10px;
    }

    .interests-display strong {
        color: var(--text-primary);
        display: block;
        margin-bottom: 10px;
    }

    .interest-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }

    .interest-tag {
        padding: 8px 15px;
        background: var(--accent-primary);
        color: white;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 600;
    }

    .no-interests {
        color: var(--text-secondary);
        font-style: italic;
    }

    .recommendations-list {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-bottom: 25px;
    }

    .recommendation-card {
        background: var(--bg-secondary);
        border-radius: 15px;
        padding: 25px;
        border-left: 4px solid #8B5CF6;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .recommendation-card:hover {
        transform: translateX(5px);
        box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
    }

    .rec-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }

    .rec-header h3 {
        color: var(--text-primary);
        margin: 0;
        font-size: 1.3rem;
    }

    .difficulty-badge {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
    }

    .difficulty-badge.beginner {
        background: #10B981;
        color: white;
    }

    .difficulty-badge.intermediate {
        background: #F59E0B;
        color: white;
    }

    .difficulty-badge.advanced {
        background: #EF4444;
        color: white;
    }

    .rec-description {
        color: var(--text-secondary);
        margin-bottom: 15px;
        line-height: 1.6;
    }

    .rec-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 15px;
    }

    .rec-tag {
        padding: 6px 12px;
        background: var(--bg-card);
        border: 1px solid var(--accent-secondary);
        border-radius: 15px;
        font-size: 0.85rem;
        color: var(--text-secondary);
    }

    .rec-tag.matched {
        background: var(--accent-primary);
        color: white;
        border-color: var(--accent-primary);
        font-weight: 600;
    }

    .rec-actions {
        display: flex;
        justify-content: flex-end;
    }

    .view-project-btn {
        padding: 12px 24px;
        background: #8B5CF6;
        color: white;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .view-project-btn:hover {
        background: #7C3AED;
        transform: scale(1.05);
    }

    .recommender-footer {
        text-align: center;
        padding: 20px;
        background: var(--bg-secondary);
        border-radius: 10px;
        color: var(--text-secondary);
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(recommenderStyle);

// Initialize recommender
let projectRecommender;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        projectRecommender = new ProjectRecommender();
    });
} else {
    projectRecommender = new ProjectRecommender();
}

window.projectRecommender = projectRecommender;
