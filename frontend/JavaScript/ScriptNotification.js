const API_BASE_URL = 'http://localhost:3000';

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please login first to access the submission page.");
        window.location.href = "Login.html";
    }
});

async function fetchNotifications() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/notification`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        console.error('Failed to load notifications', response.status);
        return;
    }

    const notifications = await response.json();

    renderNotifications(notifications);
    loadNotificationCount();
}

async function loadNotificationCount() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const res = await fetch(`${API_BASE_URL}/notification`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) return;

        const items = await res.json();

        const unread = items.filter(n => !n.isRead).length;

        const badge = document.getElementById('notificationBadge');

        if (badge) {
            badge.textContent = unread;
            badge.style.display = unread > 0 ? 'inline-flex' : 'none';
        }
    } catch (err) {
        console.error(err);
    }
}

function renderNotifications(notifications) {

    const list = document.getElementById('notificationList');
    const count = document.getElementById('notificationCount');

    const unread = notifications.filter(n => !n.isRead).length;

    count.textContent = `You have ${unread} unread notification${unread !== 1 ? 's' : ''}`;

    if (notifications.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                No notifications yet.
            </div>
        `;
        return;
    }

    list.innerHTML = notifications
        .map(n => `
            <div class="notification-card ${n.isRead ? 'read' : 'unread'}">

                <div class="notification-content">

                    <div class="notification-avatar">
                        ${n.message.charAt(0).toUpperCase()}
                    </div>

                    <div class="notification-info">
                        <p>${n.message}</p>
                        <small>${new Date(n.createdAt).toLocaleString()}</small>

                        ${!n.isRead
                            ? `<button onclick="markNotificationRead(${n.id})">
                                Mark as read
                               </button>`
                            : ''}
                    </div>

                </div>

                ${!n.isRead
                    ? `<span class="unread-dot"></span>`
                    : ''}

            </div>
        `)
        .join('');
}

async function markNotificationRead(id) {

    const token = localStorage.getItem('token');

    await fetch(`${API_BASE_URL}/notification/${id}/read`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    fetchNotifications();
}

document.addEventListener('DOMContentLoaded', () => {
    fetchNotifications();
    loadNotificationCount();
});