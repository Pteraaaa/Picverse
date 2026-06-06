document.getElementById('hamburger').addEventListener("click", function() {
    document.getElementById('nav-menu').classList.toggle('active');
    document.getElementById('hamburger').classList.toggle('active');
});

// Dynamic Navbar Login/Profile toggle
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
        authBtn.textContent = "Profile";
        authBtn.href = "Profile.html";
        
        // Remove active class from other links if we are on Profile.html
        if (window.location.pathname.includes("Profile.html")) {
            const navLinks = navMenu.querySelectorAll("a");
            navLinks.forEach(link => {
                if (link !== authBtn) {
                    link.classList.remove("selected");
                }
            });
            authBtn.classList.add("selected");
        }
    } else {
        authBtn.textContent = "Login";
        authBtn.href = "Login.html";
        
        // If on Profile.html and not logged in, make sure it is not selected
        if (window.location.pathname.includes("Profile.html")) {
            authBtn.classList.remove("selected");
        }
    }
});
