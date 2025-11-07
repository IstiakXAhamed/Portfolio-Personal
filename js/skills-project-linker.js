// ===================================
// SKILLS-TO-PROJECTS LINKING SYSTEM
// Click any skill to see related projects
// ===================================

class SkillsProjectLinker {
    constructor() {
        this.projectsData = this.loadProjectsData();
        this.init();
    }

    init() {
        this.makeSkillsClickable();
    }

    loadProjectsData() {
        // Map skills to projects - customize with your actual projects
        return {
            'react': [
                { name: 'E-Commerce Platform', url: 'pages/projects.html#project-1', description: 'Full-stack shopping platform' },
                { name: 'Dashboard App', url: 'pages/projects.html#project-2', description: 'Admin dashboard with charts' }
            ],
            'node': [
                { name: 'REST API', url: 'pages/projects.html#project-3', description: 'RESTful backend service' },
                { name: 'E-Commerce Platform', url: 'pages/projects.html#project-1', description: 'Full-stack shopping platform' }
            ],
            'javascript': [
                { name: 'Portfolio Website', url: 'index.html', description: 'This portfolio!' },
                { name: 'Weather App', url: 'pages/projects.html#project-4', description: 'Real-time weather data' }
            ],
            'python': [
                { name: 'Data Analysis Tool', url: 'pages/projects.html#project-5', description: 'Data processing scripts' },
                { name: 'ML Model', url: 'pages/projects.html#project-6', description: 'Machine learning classifier' }
            ],
            'mongodb': [
                { name: 'E-Commerce Platform', url: 'pages/projects.html#project-1', description: 'Database design' },
                { name: 'Blog System', url: 'pages/projects.html#project-7', description: 'Content management' }
            ],
            'css': [
                { name: 'Portfolio Website', url: 'index.html', description: 'Advanced CSS animations' },
                { name: 'UI Components', url: 'pages/projects.html#project-8', description: 'Reusable components' }
            ],
            'tailwind': [
                { name: 'Portfolio Website', url: 'index.html', description: 'Utility-first styling' },
                { name: 'Landing Page', url: 'pages/projects.html#project-9', description: 'Marketing site' }
            ],
            'typescript': [
                { name: 'Type-safe App', url: 'pages/projects.html#project-10', description: 'Strongly typed codebase' }
            ]
        };
    }

    makeSkillsClickable() {
        // Find all skill badges/tags on the page
        const skillSelectors = [
            '.skill-badge',
            '.skill-tag',
            '.tech-tag',
            '[data-skill]',
            '.technology-item',
            '.skill-item'
        ];

        skillSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(skill => {
                const skillName = this.extractSkillName(skill);
                if (skillName && this.projectsData[skillName]) {
                    this.makeClickable(skill, skillName);
                }
            });
        });
    }

    extractSkillName(element) {
        // Get skill name from element
        let skillName = element.dataset.skill || 
                       element.textContent.trim().toLowerCase();
        
        // Clean up the skill name
        skillName = skillName.replace(/[^a-z0-9]/g, '');
        return skillName;
    }

    makeClickable(element, skillName) {
        element.style.cursor = 'pointer';
        element.style.transition = 'all 0.3s ease';
        element.title = `Click to see projects using ${skillName}`;
        
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.1)';
            element.style.boxShadow = '0 5px 15px rgba(255, 137, 6, 0.4)';
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
            element.style.boxShadow = 'none';
        });

        element.addEventListener('click', (e) => {
            e.preventDefault();
            this.showProjectsForSkill(skillName);
        });
    }

    showProjectsForSkill(skillName) {
        const projects = this.projectsData[skillName];
        if (!projects || projects.length === 0) return;

        const modal = document.createElement('div');
        modal.id = 'skill-projects-modal';
        modal.innerHTML = `
            <div class="skill-projects-content">
                <div class="skill-projects-header">
                    <h2>Projects using <span class="skill-highlight">${skillName}</span></h2>
                    <button class="close-modal-btn" onclick="document.getElementById('skill-projects-modal').remove()">✕</button>
                </div>
                
                <div class="projects-count">
                    ${projects.length} project${projects.length > 1 ? 's' : ''} found
                </div>

                <div class="projects-grid">
                    ${projects.map(project => `
                        <a href="${project.url}" class="project-card-link">
                            <div class="skill-project-card">
                                <h3>${project.name}</h3>
                                <p>${project.description}</p>
                                <div class="view-project">
                                    View Project →
                                </div>
                            </div>
                        </a>
                    `).join('')}
                </div>

                <div class="modal-footer">
                    <button class="view-all-projects-btn" onclick="window.location.href='pages/projects.html'">
                        View All Projects
                    </button>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        document.body.appendChild(modal);

        // Close on escape
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeOnEscape);
            }
        });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// Add styles
const skillLinkerStyle = document.createElement('style');
skillLinkerStyle.textContent = `
    .skill-projects-content {
        background: var(--bg-card);
        border-radius: 20px;
        width: 90%;
        max-width: 900px;
        max-height: 85vh;
        overflow-y: auto;
        padding: 30px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }

    .skill-projects-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 2px solid var(--accent-primary);
    }

    .skill-projects-header h2 {
        color: var(--text-primary);
        font-size: 1.8rem;
        margin: 0;
    }

    .skill-highlight {
        color: var(--accent-primary);
        text-transform: uppercase;
        font-weight: bold;
    }

    .close-modal-btn {
        background: transparent;
        border: none;
        font-size: 2rem;
        color: var(--text-primary);
        cursor: pointer;
        transition: transform 0.2s;
        padding: 5px 10px;
    }

    .close-modal-btn:hover {
        transform: scale(1.2);
        color: var(--accent-primary);
    }

    .projects-count {
        color: var(--text-secondary);
        margin-bottom: 25px;
        font-size: 1rem;
    }

    .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
        margin-bottom: 25px;
    }

    .project-card-link {
        text-decoration: none;
        display: block;
    }

    .skill-project-card {
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 25px;
        border: 2px solid var(--accent-secondary);
        transition: all 0.3s ease;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .skill-project-card:hover {
        border-color: var(--accent-primary);
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(255, 137, 6, 0.3);
    }

    .skill-project-card h3 {
        color: var(--text-primary);
        margin: 0 0 10px 0;
        font-size: 1.2rem;
    }

    .skill-project-card p {
        color: var(--text-secondary);
        margin: 0 0 15px 0;
        flex: 1;
        line-height: 1.6;
    }

    .view-project {
        color: var(--accent-primary);
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .modal-footer {
        text-align: center;
        padding-top: 20px;
        border-top: 1px solid var(--accent-secondary);
    }

    .view-all-projects-btn {
        padding: 12px 30px;
        background: var(--accent-primary);
        color: white;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 600;
        font-size: 1rem;
        transition: all 0.3s ease;
    }

    .view-all-projects-btn:hover {
        background: var(--accent-secondary);
        transform: scale(1.05);
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @media (max-width: 768px) {
        .skill-projects-content {
            width: 95%;
            padding: 20px;
        }

        .projects-grid {
            grid-template-columns: 1fr;
        }

        .skill-projects-header h2 {
            font-size: 1.4rem;
        }
    }
`;
document.head.appendChild(skillLinkerStyle);

// Initialize when DOM is ready
let skillsProjectLinker;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        skillsProjectLinker = new SkillsProjectLinker();
    });
} else {
    skillsProjectLinker = new SkillsProjectLinker();
}

window.skillsProjectLinker = skillsProjectLinker;
