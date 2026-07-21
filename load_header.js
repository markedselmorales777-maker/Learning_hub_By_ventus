document.addEventListener("DOMContentLoaded", function () {
    const placeholder = document.getElementById('header-placeholder');
    if (!placeholder) return;

    // Direct HTML template para gumana kahit file:// (walang CORS error)
    const headerHTML = `
    <header class="main-header">
        <div class="header-left">
            <div class="logo" onclick="window.location.href='home.html'">Ventus Learning Hub</div>
            <nav class="nav-links">
                <a href="home.html" class="nav-tab">Main</a>
                <a href="course.html" class="nav-tab">Course</a>
                <a href="activities.html" class="nav-tab">Activities</a>
                <a href="community.html" class="nav-tab">Community</a>
            </nav>
        </div>
        
        <div class="header-right">
            <div class="profile-badge">
                <span class="user-avatar">👤</span>
                <span class="profile-name">Mark Edsel Morales</span>
            </div>
            <a href="index.html" class="logout-btn">Logout</a>
        </div>
    </header>
    `;

    placeholder.innerHTML = headerHTML;

    // Automatic Active Tab Indicator
    let currentPage = window.location.pathname.split('/').pop();
    if (!currentPage || currentPage === '') {
        currentPage = 'home.html';
    }

    const navLinks = placeholder.querySelectorAll('.nav-links .nav-tab');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});