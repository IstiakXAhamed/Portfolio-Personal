// ===================================
// ADVANCED SEARCH & FILTER SYSTEM
// ===================================

class AdvancedSearch {
    constructor() {
        this.searchIndex = [];
        this.searchHistory = [];
        this.maxHistory = 10;
        this.init();
    }

    init() {
        this.buildSearchIndex();
        this.loadSearchHistory();
        this.createSearchInterface();
        this.setupKeyboardShortcut();
    }

    buildSearchIndex() {
        // Index all text content from the page
        const elements = document.querySelectorAll('h1, h2, h3, h4, p, a, span, li');
        
        elements.forEach((el, index) => {
            const text = el.textContent.trim();
            if (text && text.length > 2) {
                this.searchIndex.push({
                    id: index,
                    text: text,
                    element: el,
                    type: el.tagName.toLowerCase(),
                    url: window.location.pathname,
                    keywords: this.extractKeywords(text)
                });
            }
        });
    }

    extractKeywords(text) {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3);
    }

    setupKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.toggleSearch();
            }
        });
    }

    createSearchInterface() {
        const button = document.createElement('button');
        button.id = 'search-btn';
        button.innerHTML = '🔍';
        button.title = 'Search (Ctrl+K)';
        button.style.cssText = `
            position: fixed;
            bottom: 750px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: var(--bg-card);
            border: 3px solid #3B82F6;
            border-radius: 50%;
            font-size: 1.8rem;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 5px 20px rgba(59, 130, 246, 0.4);
            transition: all 0.3s ease;
        `;
        button.addEventListener('click', () => this.toggleSearch());
        document.body.appendChild(button);
    }

    toggleSearch() {
        const existing = document.getElementById('search-modal');
        if (existing) {
            existing.remove();
            return;
        }
        this.showSearch();
    }

    showSearch() {
        const modal = document.createElement('div');
        modal.id = 'search-modal';
        modal.innerHTML = `
            <div class="search-container">
                <div class="search-header">
                    <input type="text" id="search-input" placeholder="Search anything... (Ctrl+K)" autofocus>
                    <button id="close-search">✕</button>
                </div>
                <div class="search-filters">
                    <button class="search-filter active" data-type="all">All</button>
                    <button class="search-filter" data-type="projects">Projects</button>
                    <button class="search-filter" data-type="skills">Skills</button>
                    <button class="search-filter" data-type="content">Content</button>
                </div>
                <div class="search-results" id="search-results">
                    ${this.renderSearchHistory()}
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
            z-index: 10003;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding-top: 100px;
            animation: fadeIn 0.3s ease;
        `;

        document.body.appendChild(modal);
        document.getElementById('search-input').focus();
        this.attachSearchListeners();
    }

    attachSearchListeners() {
        const searchInput = document.getElementById('search-input');
        const closeBtn = document.getElementById('close-search');
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            if (query.length >= 2) {
                this.performSearch(query);
            } else {
                document.getElementById('search-results').innerHTML = this.renderSearchHistory();
            }
        });

        closeBtn.addEventListener('click', () => {
            document.getElementById('search-modal').remove();
        });

        document.querySelectorAll('.search-filter').forEach(filter => {
            filter.addEventListener('click', (e) => {
                document.querySelectorAll('.search-filter').forEach(f => f.classList.remove('active'));
                e.target.classList.add('active');
                const query = searchInput.value;
                if (query.length >= 2) {
                    this.performSearch(query, e.target.dataset.type);
                }
            });
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('search-modal');
                if (modal) modal.remove();
            }
        });
    }

    performSearch(query, filterType = 'all') {
        const results = this.fuzzySearch(query, filterType);
        this.addToHistory(query);
        document.getElementById('search-results').innerHTML = this.renderResults(results, query);
    }

    fuzzySearch(query, filterType = 'all') {
        const searchTerms = query.toLowerCase().split(' ');
        
        return this.searchIndex
            .map(item => {
                let score = 0;
                const itemText = item.text.toLowerCase();
                
                searchTerms.forEach(term => {
                    if (itemText.includes(term)) {
                        score += 10;
                        if (itemText.startsWith(term)) score += 5;
                    }
                    
                    // Fuzzy matching
                    if (this.levenshteinDistance(term, itemText) < 3) {
                        score += 5;
                    }
                });

                return { ...item, score };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 20);
    }

    levenshteinDistance(str1, str2) {
        const matrix = [];
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[str2.length][str1.length];
    }

    renderResults(results, query) {
        if (results.length === 0) {
            return `
                <div class="no-results">
                    <span class="no-results-icon">🔍</span>
                    <p>No results found for "${query}"</p>
                    <small>Try different keywords or check your spelling</small>
                </div>
            `;
        }

        return `
            <div class="results-header">
                <span>Found ${results.length} results</span>
            </div>
            <div class="results-list">
                ${results.map(result => `
                    <div class="search-result-item" data-id="${result.id}">
                        <div class="result-type">${result.type}</div>
                        <div class="result-text">${this.highlightMatch(result.text, query)}</div>
                        <div class="result-score">Score: ${result.score}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    renderSearchHistory() {
        if (this.searchHistory.length === 0) {
            return `
                <div class="search-empty">
                    <span class="empty-icon">🔍</span>
                    <p>Start typing to search...</p>
                    <small>Search across all content, projects, and skills</small>
                </div>
            `;
        }

        return `
            <div class="search-history">
                <div class="history-header">
                    <span>Recent Searches</span>
                    <button id="clear-history">Clear</button>
                </div>
                <div class="history-list">
                    ${this.searchHistory.map(query => `
                        <div class="history-item" data-query="${query}">
                            <span class="history-icon">🕐</span>
                            <span class="history-query">${query}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    addToHistory(query) {
        if (!this.searchHistory.includes(query)) {
            this.searchHistory.unshift(query);
            if (this.searchHistory.length > this.maxHistory) {
                this.searchHistory.pop();
            }
            this.saveSearchHistory();
        }
    }

    loadSearchHistory() {
        const stored = localStorage.getItem('searchHistory');
        if (stored) {
            try {
                this.searchHistory = JSON.parse(stored);
            } catch (e) {
                console.warn('Failed to load search history');
            }
        }
    }

    saveSearchHistory() {
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }
}

// Add search styles
const searchStyle = document.createElement('style');
searchStyle.textContent = `
    .search-container {
        width: 90%;
        max-width: 700px;
        background: var(--bg-card);
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        overflow: hidden;
    }

    .search-header {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 20px;
        border-bottom: 2px solid var(--accent-secondary);
    }

    #search-input {
        flex: 1;
        background: var(--bg-secondary);
        border: 2px solid var(--accent-secondary);
        border-radius: 10px;
        padding: 15px;
        color: var(--text-primary);
        font-size: 1.1rem;
        outline: none;
    }

    #search-input:focus {
        border-color: var(--accent-primary);
    }

    #close-search {
        background: transparent;
        border: none;
        color: var(--text-primary);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 10px;
        transition: transform 0.3s ease;
    }

    #close-search:hover {
        transform: scale(1.2);
    }

    .search-filters {
        display: flex;
        gap: 10px;
        padding: 15px 20px;
        background: var(--bg-secondary);
        border-bottom: 1px solid var(--accent-secondary);
    }

    .search-filter {
        padding: 8px 16px;
        background: var(--bg-card);
        border: 1px solid var(--accent-secondary);
        border-radius: 20px;
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
    }

    .search-filter.active {
        background: var(--accent-primary);
        color: white;
        border-color: var(--accent-primary);
    }

    .search-results {
        max-height: 500px;
        overflow-y: auto;
        padding: 20px;
    }

    .results-header {
        color: var(--text-secondary);
        margin-bottom: 15px;
        font-size: 0.9rem;
    }

    .results-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .search-result-item {
        background: var(--bg-secondary);
        border-radius: 10px;
        padding: 15px;
        cursor: pointer;
        transition: all 0.3s ease;
        border-left: 4px solid transparent;
    }

    .search-result-item:hover {
        border-left-color: var(--accent-primary);
        transform: translateX(5px);
    }

    .result-type {
        color: var(--accent-primary);
        font-size: 0.75rem;
        text-transform: uppercase;
        font-weight: 600;
        margin-bottom: 5px;
    }

    .result-text {
        color: var(--text-primary);
        margin-bottom: 5px;
        line-height: 1.5;
    }

    .result-text mark {
        background: var(--accent-primary);
        color: white;
        padding: 2px 5px;
        border-radius: 3px;
    }

    .result-score {
        color: var(--text-secondary);
        font-size: 0.75rem;
    }

    .no-results, .search-empty {
        text-align: center;
        padding: 60px 20px;
        color: var(--text-secondary);
    }

    .no-results-icon, .empty-icon {
        font-size: 4rem;
        display: block;
        margin-bottom: 20px;
    }

    .no-results p, .search-empty p {
        color: var(--text-primary);
        font-size: 1.2rem;
        margin-bottom: 10px;
    }

    .search-history {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .history-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--text-primary);
        font-weight: 600;
    }

    .history-header button {
        background: transparent;
        border: 1px solid var(--accent-secondary);
        color: var(--text-secondary);
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.85rem;
    }

    .history-header button:hover {
        border-color: var(--accent-primary);
        color: var(--accent-primary);
    }

    .history-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .history-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px;
        background: var(--bg-secondary);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .history-item:hover {
        background: var(--accent-secondary);
        transform: translateX(5px);
    }

    .history-icon {
        font-size: 1.2rem;
    }

    .history-query {
        color: var(--text-primary);
    }
`;
document.head.appendChild(searchStyle);

// Initialize search
let advancedSearch;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        advancedSearch = new AdvancedSearch();
    });
} else {
    advancedSearch = new AdvancedSearch();
}
