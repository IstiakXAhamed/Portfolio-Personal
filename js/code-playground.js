// ===================================
// INTERACTIVE CODE PLAYGROUND
// ===================================

class CodePlayground {
    constructor() {
        this.editors = {
            html: '',
            css: '',
            js: ''
        };
        this.isOpen = false;
        this.autoRun = true;
        this.init();
    }

    init() {
        this.createPlaygroundButton();
    }

    createPlaygroundButton() {
        const button = document.createElement('button');
        button.innerHTML = '⚡';
        button.title = 'Code Playground';
        button.id = 'playground-btn';
        button.style.cssText = `
            position: fixed;
            bottom: 510px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: var(--bg-card);
            border: 3px solid #10B981;
            border-radius: 50%;
            font-size: 1.8rem;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 5px 20px rgba(16, 185, 129, 0.4);
            transition: all 0.3s ease;
        `;
        button.addEventListener('click', () => this.togglePlayground());
        document.body.appendChild(button);
    }

    togglePlayground() {
        if (this.isOpen) {
            this.closePlayground();
        } else {
            this.openPlayground();
        }
    }

    openPlayground() {
        this.isOpen = true;
        const playground = document.createElement('div');
        playground.id = 'code-playground-modal';
        playground.innerHTML = `
            <div class="playground-container">
                <div class="playground-header">
                    <h2>⚡ Code Playground</h2>
                    <div class="playground-controls">
                        <label class="auto-run-toggle">
                            <input type="checkbox" id="auto-run" ${this.autoRun ? 'checked' : ''}>
                            Auto Run
                        </label>
                        <button class="run-btn" id="run-code">▶️ Run</button>
                        <button class="clear-btn" id="clear-code">🗑️ Clear</button>
                        <button class="share-btn" id="share-code">🔗 Share</button>
                        <button class="close-btn" id="close-playground">✕</button>
                    </div>
                </div>
                
                <div class="playground-content">
                    <div class="editors-panel">
                        <div class="editor-tabs">
                            <button class="editor-tab active" data-lang="html">HTML</button>
                            <button class="editor-tab" data-lang="css">CSS</button>
                            <button class="editor-tab" data-lang="js">JavaScript</button>
                        </div>
                        
                        <div class="editor-container">
                            <div class="editor active" id="html-editor">
                                <textarea id="html-code" placeholder="<!-- Write your HTML here -->">${this.editors.html}</textarea>
                            </div>
                            <div class="editor" id="css-editor">
                                <textarea id="css-code" placeholder="/* Write your CSS here */">${this.editors.css}</textarea>
                            </div>
                            <div class="editor" id="js-editor">
                                <textarea id="js-code" placeholder="// Write your JavaScript here">${this.editors.js}</textarea>
                            </div>
                        </div>
                    </div>
                    
                    <div class="preview-panel">
                        <div class="preview-header">
                            <span>Preview</span>
                            <button id="refresh-preview" title="Refresh Preview">🔄</button>
                        </div>
                        <iframe id="preview-frame"></iframe>
                        <div class="console-output" id="console-output">
                            <div class="console-header">Console</div>
                            <div class="console-content"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        playground.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10001;
            animation: fadeIn 0.3s ease;
        `;

        document.body.appendChild(playground);
        this.attachEventListeners();
        this.loadSavedCode();
        this.runCode();
    }

    closePlayground() {
        this.isOpen = false;
        const playground = document.getElementById('code-playground-modal');
        if (playground) {
            playground.remove();
        }
    }

    attachEventListeners() {
        // Tab switching
        document.querySelectorAll('.editor-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.editor').forEach(e => e.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(`${tab.dataset.lang}-editor`).classList.add('active');
            });
        });

        // Code input
        ['html', 'css', 'js'].forEach(lang => {
            const textarea = document.getElementById(`${lang}-code`);
            textarea.addEventListener('input', (e) => {
                this.editors[lang] = e.target.value;
                this.saveCode();
                if (this.autoRun) {
                    this.runCode();
                }
            });

            // Add tab support
            textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
                    textarea.selectionStart = textarea.selectionEnd = start + 2;
                }
            });
        });

        // Control buttons
        document.getElementById('run-code').addEventListener('click', () => this.runCode());
        document.getElementById('clear-code').addEventListener('click', () => this.clearCode());
        document.getElementById('share-code').addEventListener('click', () => this.shareCode());
        document.getElementById('close-playground').addEventListener('click', () => this.closePlayground());
        document.getElementById('refresh-preview').addEventListener('click', () => this.runCode());
        
        document.getElementById('auto-run').addEventListener('change', (e) => {
            this.autoRun = e.target.checked;
        });
    }

    runCode() {
        const htmlCode = document.getElementById('html-code')?.value || this.editors.html;
        const cssCode = document.getElementById('css-code')?.value || this.editors.css;
        const jsCode = document.getElementById('js-code')?.value || this.editors.js;

        const iframe = document.getElementById('preview-frame');
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        // Clear console
        const consoleContent = document.querySelector('.console-content');
        if (consoleContent) consoleContent.innerHTML = '';

        const fullCode = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>${cssCode}</style>
            </head>
            <body>
                ${htmlCode}
                <script>
                    // Override console methods to capture output
                    (function() {
                        const originalLog = console.log;
                        const originalError = console.error;
                        const originalWarn = console.warn;
                        
                        function sendToParent(type, args) {
                            window.parent.postMessage({
                                type: 'console',
                                level: type,
                                message: Array.from(args).map(arg => 
                                    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                                ).join(' ')
                            }, '*');
                        }
                        
                        console.log = function() {
                            originalLog.apply(console, arguments);
                            sendToParent('log', arguments);
                        };
                        
                        console.error = function() {
                            originalError.apply(console, arguments);
                            sendToParent('error', arguments);
                        };
                        
                        console.warn = function() {
                            originalWarn.apply(console, arguments);
                            sendToParent('warn', arguments);
                        };
                        
                        // Catch runtime errors
                        window.onerror = function(msg, url, line, col, error) {
                            sendToParent('error', ['Error: ' + msg + ' (Line ' + line + ')']);
                            return false;
                        };
                    })();
                    
                    try {
                        ${jsCode}
                    } catch(error) {
                        console.error('Runtime Error: ' + error.message);
                    }
                <\/script>
            </body>
            </html>
        `;

        iframeDoc.open();
        iframeDoc.write(fullCode);
        iframeDoc.close();

        // Listen for console messages from iframe
        window.addEventListener('message', (e) => {
            if (e.data.type === 'console') {
                this.addConsoleMessage(e.data.level, e.data.message);
            }
        });
    }

    addConsoleMessage(level, message) {
        const consoleContent = document.querySelector('.console-content');
        if (!consoleContent) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `console-message console-${level}`;
        
        const icon = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : 'ℹ️';
        messageDiv.innerHTML = `<span class="console-icon">${icon}</span><span>${message}</span>`;
        
        consoleContent.appendChild(messageDiv);
        consoleContent.scrollTop = consoleContent.scrollHeight;
    }

    clearCode() {
        if (confirm('Clear all code?')) {
            this.editors = { html: '', css: '', js: '' };
            document.getElementById('html-code').value = '';
            document.getElementById('css-code').value = '';
            document.getElementById('js-code').value = '';
            this.saveCode();
            this.runCode();
        }
    }

    shareCode() {
        const code = btoa(JSON.stringify(this.editors));
        const url = `${window.location.origin}${window.location.pathname}?code=${code}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('✅ Share link copied to clipboard!');
            });
        } else {
            prompt('Copy this link to share:', url);
        }
    }

    saveCode() {
        localStorage.setItem('playgroundCode', JSON.stringify(this.editors));
    }

    loadSavedCode() {
        // Check URL for shared code
        const urlParams = new URLSearchParams(window.location.search);
        const sharedCode = urlParams.get('code');
        
        if (sharedCode) {
            try {
                this.editors = JSON.parse(atob(sharedCode));
            } catch (e) {
                console.warn('Failed to load shared code');
            }
        } else {
            // Load from localStorage
            const saved = localStorage.getItem('playgroundCode');
            if (saved) {
                try {
                    this.editors = JSON.parse(saved);
                } catch (e) {
                    console.warn('Failed to load saved code');
                }
            }
        }

        // Update textareas if they exist
        if (document.getElementById('html-code')) {
            document.getElementById('html-code').value = this.editors.html;
            document.getElementById('css-code').value = this.editors.css;
            document.getElementById('js-code').value = this.editors.js;
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'playground-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10B981;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 10002;
            animation: slideInRight 0.3s ease;
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add playground styles
const playgroundStyle = document.createElement('style');
playgroundStyle.textContent = `
    .playground-container {
        width: 95%;
        height: 95%;
        margin: 2.5%;
        background: var(--bg-primary);
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        box-shadow: 0 25px 100px rgba(0,0,0,0.8);
    }

    .playground-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 30px;
        background: var(--bg-card);
        border-radius: 15px 15px 0 0;
        border-bottom: 2px solid var(--accent-primary);
    }

    .playground-header h2 {
        color: var(--text-primary);
        margin: 0;
        font-size: 1.8rem;
    }

    .playground-controls {
        display: flex;
        gap: 15px;
        align-items: center;
    }

    .auto-run-toggle {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text-primary);
        cursor: pointer;
    }

    .run-btn, .clear-btn, .share-btn {
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .run-btn {
        background: #10B981;
        color: white;
    }

    .run-btn:hover {
        background: #059669;
        transform: scale(1.05);
    }

    .clear-btn {
        background: #EF4444;
        color: white;
    }

    .clear-btn:hover {
        background: #DC2626;
    }

    .share-btn {
        background: #3B82F6;
        color: white;
    }

    .share-btn:hover {
        background: #2563EB;
    }

    .playground-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        flex: 1;
        gap: 2px;
        background: var(--accent-secondary);
        overflow: hidden;
    }

    .editors-panel {
        background: var(--bg-secondary);
        display: flex;
        flex-direction: column;
    }

    .editor-tabs {
        display: flex;
        background: var(--bg-card);
        border-bottom: 2px solid var(--accent-secondary);
    }

    .editor-tab {
        flex: 1;
        padding: 15px;
        background: transparent;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        border-bottom: 3px solid transparent;
    }

    .editor-tab:hover {
        background: var(--bg-secondary);
    }

    .editor-tab.active {
        color: var(--accent-primary);
        border-bottom-color: var(--accent-primary);
        background: var(--bg-secondary);
    }

    .editor-container {
        flex: 1;
        position: relative;
    }

    .editor {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: none;
    }

    .editor.active {
        display: block;
    }

    .editor textarea {
        width: 100%;
        height: 100%;
        background: #1e1e1e;
        color: #d4d4d4;
        border: none;
        padding: 20px;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 14px;
        line-height: 1.6;
        resize: none;
        outline: none;
    }

    .preview-panel {
        background: var(--bg-secondary);
        display: flex;
        flex-direction: column;
    }

    .preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        background: var(--bg-card);
        border-bottom: 2px solid var(--accent-secondary);
        color: var(--text-primary);
        font-weight: 600;
    }

    .preview-header button {
        background: transparent;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        transition: transform 0.3s ease;
    }

    .preview-header button:hover {
        transform: rotate(180deg);
    }

    #preview-frame {
        flex: 1;
        border: none;
        background: white;
    }

    .console-output {
        height: 150px;
        background: #1e1e1e;
        border-top: 2px solid var(--accent-secondary);
        display: flex;
        flex-direction: column;
    }

    .console-header {
        padding: 10px 15px;
        background: #252526;
        color: #cccccc;
        font-weight: 600;
        border-bottom: 1px solid #3e3e42;
    }

    .console-content {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 13px;
    }

    .console-message {
        padding: 5px 10px;
        margin-bottom: 5px;
        border-radius: 3px;
        display: flex;
        gap: 10px;
    }

    .console-log {
        color: #cccccc;
    }

    .console-error {
        color: #f48771;
        background: rgba(244, 135, 113, 0.1);
    }

    .console-warn {
        color: #cca700;
        background: rgba(204, 167, 0, 0.1);
    }

    .console-icon {
        flex-shrink: 0;
    }

    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @media (max-width: 768px) {
        .playground-content {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 1fr;
        }
    }
`;
document.head.appendChild(playgroundStyle);

// Initialize playground
let codePlayground;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        codePlayground = new CodePlayground();
    });
} else {
    codePlayground = new CodePlayground();
}

window.codePlayground = codePlayground;
