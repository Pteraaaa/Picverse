document.getElementById('hamburger').addEventListener("click", function() {
    document.getElementById('nav-menu').classList.toggle('active');
    document.getElementById('hamburger').classList.toggle('active');
});

// Dynamic Navbar Login/Logout toggle
document.addEventListener("DOMContentLoaded", function () {
    const navMenu = document.getElementById("nav-menu");
    if (!navMenu) return;

    // Locate or create the auth button dynamically
    let authBtn = document.getElementById("auth-btn");
    if (!authBtn) {
        authBtn = document.createElement("a");
        authBtn.id = "auth-btn";
        navMenu.appendChild(authBtn);
    }

    const token = localStorage.getItem("token");
    if (token) {
        authBtn.textContent = "Logout";
        authBtn.href = "#";
        authBtn.addEventListener("click", function (e) {
            e.preventDefault();
            const confirmLogout = confirm("Are you sure you want to log out?");
            if (confirmLogout) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                alert("Logged out successfully.");
                window.location.reload();
            }
        });
    } else {
        authBtn.textContent = "Login";
        authBtn.href = "Login.html";
    }
});
