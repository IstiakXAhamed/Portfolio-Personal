// ===================================
// ADVANCED NOTIFICATION SYSTEM
// ===================================

class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.notificationId = 0;
        this.maxNotifications = 50;
        this.init();
    }

    init() {
        this.loadNotifications();
        this.createNotificationCenter();
        this.requestPermission();
    }

    loadNotifications() {
        const stored = localStorage.getItem('notifications');
        if (stored) {
            try {
                this.notifications = JSON.parse(stored);
                this.notificationId = this.notifications.length;
            } catch (e) {
                console.warn('Failed to load notifications');
            }
        }
    }

    saveNotifications() {
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
    }

    requestPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    createNotificationCenter() {
        const button = document.createElement('button');
        button.id = 'notification-center-btn';
        button.innerHTML = `
            <span class="bell-icon">🔔</span>
            <span class="notification-badge">0</span>
        `;
        button.title = 'Notifications';
        button.style.cssText = `
            position: fixed;
            bottom: 670px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: var(--bg-card);
            border: 3px solid var(--accent-primary);
            border-radius: 50%;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        `;

        button.addEventListener('click', () => this.toggleCenter());
        document.body.appendChild(button);
        this.updateBadge();
    }

    updateBadge() {
        const badge = document.querySelector('.notification-badge');
        const unreadCount = this.notifications.filter(n => !n.read).length;
        
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    }

    toggleCenter() {
        const existing = document.getElementById('notification-center');
        if (existing) {
            existing.remove();
            return;
        }

        const center = document.createElement('div');
        center.id = 'notification-center';
        center.innerHTML = `
            <div class="notification-header">
                <h3>🔔 Notifications</h3>
                <div class="notification-actions">
                    <button id="mark-all-read" title="Mark all as read">✓</button>
                    <button id="clear-all-notifications" title="Clear all">🗑️</button>
                </div>
            </div>
            <div class="notification-filters">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="info">Info</button>
                <button class="filter-btn" data-filter="success">Success</button>
                <button class="filter-btn" data-filter="warning">Warning</button>
                <button class="filter-btn" data-filter="error">Error</button>
            </div>
            <div class="notification-list">
                ${this.renderNotifications()}
            </div>
        `;

        center.style.cssText = `
            position: fixed;
            top: 80px;
            right: 30px;
            width: 400px;
            max-height: 600px;
            background: var(--bg-card);
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.4);
            z-index: 10001;
            overflow: hidden;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(center);
        this.attachCenterListeners();
    }

    renderNotifications(filter = 'all') {
        const filtered = filter === 'all' 
            ? this.notifications 
            : this.notifications.filter(n => n.type === filter);

        if (filtered.length === 0) {
            return '<div class="no-notifications">No notifications</div>';
        }

        return filtered
            .sort((a, b) => b.timestamp - a.timestamp)
            .map(notif => `
                <div class="notification-item ${notif.read ? 'read' : 'unread'}" data-id="${notif.id}">
                    <div class="notification-icon ${notif.type}">${this.getIcon(notif.type)}</div>
                    <div class="notification-content">
                        <div class="notification-title">${notif.title}</div>
                        <div class="notification-message">${notif.message}</div>
                        <div class="notification-time">${this.formatTime(notif.timestamp)}</div>
                    </div>
                    <button class="notification-close" data-id="${notif.id}">✕</button>
                </div>
            `).join('');
    }

    attachCenterListeners() {
        document.getElementById('mark-all-read').addEventListener('click', () => {
            this.markAllAsRead();
        });

        document.getElementById('clear-all-notifications').addEventListener('click', () => {
            if (confirm('Clear all notifications?')) {
                this.clearAll();
            }
        });

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const filter = e.target.dataset.filter;
                document.querySelector('.notification-list').innerHTML = this.renderNotifications(filter);
                this.attachItemListeners();
            });
        });

        this.attachItemListeners();
    }

    attachItemListeners() {
        document.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('notification-close')) {
                    const id = parseInt(item.dataset.id);
                    this.markAsRead(id);
                }
            });
        });

        document.querySelectorAll('.notification-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                this.removeNotification(id);
            });
        });
    }

    show(title, message, type = 'info', actions = []) {
        const notification = {
            id: this.notificationId++,
            title,
            message,
            type,
            actions,
            read: false,
            timestamp: Date.now()
        };

        this.notifications.unshift(notification);
        
        // Limit stored notifications
        if (this.notifications.length > this.maxNotifications) {
            this.notifications = this.notifications.slice(0, this.maxNotifications);
        }

        this.saveNotifications();
        this.updateBadge();
        this.showToast(notification);

        // Browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/assets/icons/notification-icon.png',
                tag: notification.id.toString()
            });
        }

        return notification.id;
    }

    showToast(notification) {
        const toast = document.createElement('div');
        toast.className = `notification-toast ${notification.type}`;
        toast.innerHTML = `
            <div class="toast-icon">${this.getIcon(notification.type)}</div>
            <div class="toast-content">
                <div class="toast-title">${notification.title}</div>
                <div class="toast-message">${notification.message}</div>
            </div>
            <button class="toast-close">✕</button>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 5000);

        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        });
    }

    markAsRead(id) {
        const notif = this.notifications.find(n => n.id === id);
        if (notif) {
            notif.read = true;
            this.saveNotifications();
            this.updateBadge();
            
            const element = document.querySelector(`[data-id="${id}"]`);
            if (element) {
                element.classList.remove('unread');
                element.classList.add('read');
            }
        }
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.saveNotifications();
        this.updateBadge();
        
        document.querySelectorAll('.notification-item').forEach(item => {
            item.classList.remove('unread');
            item.classList.add('read');
        });
    }

    removeNotification(id) {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.saveNotifications();
        this.updateBadge();
        
        const element = document.querySelector(`[data-id="${id}"]`);
        if (element) {
            element.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                element.remove();
                if (document.querySelectorAll('.notification-item').length === 0) {
                    document.querySelector('.notification-list').innerHTML = 
                        '<div class="no-notifications">No notifications</div>';
                }
            }, 300);
        }
    }

    clearAll() {
        this.notifications = [];
        this.saveNotifications();
        this.updateBadge();
        document.querySelector('.notification-list').innerHTML = 
            '<div class="no-notifications">No notifications</div>';
    }

    getIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        return icons[type] || icons.info;
    }

    formatTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return new Date(timestamp).toLocaleDateString();
    }
}

// Add notification styles
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .notification-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #EF4444;
        color: white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.7rem;
        font-weight: bold;
        border: 2px solid var(--bg-card);
    }

    .bell-icon {
        font-size: 1.8rem;
    }

    .notification-header {
        padding: 20px;
        background: var(--bg-secondary);
        border-bottom: 2px solid var(--accent-primary);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .notification-header h3 {
        margin: 0;
        color: var(--text-primary);
        font-size: 1.3rem;
    }

    .notification-actions {
        display: flex;
        gap: 10px;
    }

    .notification-actions button {
        background: var(--bg-card);
        border: 1px solid var(--accent-secondary);
        border-radius: 8px;
        padding: 8px 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1.1rem;
    }

    .notification-actions button:hover {
        background: var(--accent-primary);
        transform: scale(1.1);
    }

    .notification-filters {
        display: flex;
        gap: 5px;
        padding: 15px;
        background: var(--bg-secondary);
        border-bottom: 1px solid var(--accent-secondary);
        flex-wrap: wrap;
    }

    .filter-btn {
        padding: 8px 15px;
        background: var(--bg-card);
        border: 1px solid var(--accent-secondary);
        border-radius: 20px;
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.85rem;
    }

    .filter-btn:hover {
        border-color: var(--accent-primary);
    }

    .filter-btn.active {
        background: var(--accent-primary);
        color: white;
        border-color: var(--accent-primary);
    }

    .notification-list {
        max-height: 450px;
        overflow-y: auto;
    }

    .notification-item {
        display: flex;
        gap: 15px;
        padding: 15px;
        border-bottom: 1px solid var(--accent-secondary);
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
    }

    .notification-item:hover {
        background: var(--bg-secondary);
    }

    .notification-item.unread {
        background: rgba(59, 130, 246, 0.1);
        border-left: 4px solid var(--accent-primary);
    }

    .notification-item.read {
        opacity: 0.7;
    }

    .notification-icon {
        font-size: 2rem;
        flex-shrink: 0;
    }

    .notification-content {
        flex: 1;
        min-width: 0;
    }

    .notification-title {
        color: var(--text-primary);
        font-weight: 600;
        margin-bottom: 5px;
    }

    .notification-message {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-bottom: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .notification-time {
        color: var(--text-secondary);
        font-size: 0.75rem;
        font-style: italic;
    }

    .notification-close {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 1.2rem;
        padding: 5px;
        flex-shrink: 0;
        transition: all 0.3s ease;
    }

    .notification-close:hover {
        color: #EF4444;
        transform: scale(1.2);
    }

    .no-notifications {
        padding: 40px;
        text-align: center;
        color: var(--text-secondary);
        font-style: italic;
    }

    .notification-toast {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 350px;
        background: var(--bg-card);
        border-radius: 12px;
        padding: 20px;
        display: flex;
        gap: 15px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        z-index: 10002;
        animation: slideInRight 0.3s ease;
        border-left: 4px solid var(--accent-primary);
    }

    .notification-toast.success {
        border-left-color: #10B981;
    }

    .notification-toast.warning {
        border-left-color: #F59E0B;
    }

    .notification-toast.error {
        border-left-color: #EF4444;
    }

    .toast-icon {
        font-size: 2rem;
        flex-shrink: 0;
    }

    .toast-content {
        flex: 1;
        min-width: 0;
    }

    .toast-title {
        color: var(--text-primary);
        font-weight: 600;
        margin-bottom: 5px;
    }

    .toast-message {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .toast-close {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 1.2rem;
        padding: 0;
        flex-shrink: 0;
    }

    .toast-close:hover {
        color: var(--text-primary);
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
`;
document.head.appendChild(notificationStyle);

// Initialize notification system
let notificationSystem;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        notificationSystem = new NotificationSystem();
        
        // Welcome notification
        setTimeout(() => {
            notificationSystem.show(
                'Welcome! 👋',
                'Check out the new features and improvements',
                'success'
            );
        }, 2000);
    });
} else {
    notificationSystem = new NotificationSystem();
}

window.notificationSystem = notificationSystem;
