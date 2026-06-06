// Script for Profile Page (Account Settings)

const DEFAULT_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23cccccc"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    const unauthContainer = document.getElementById("unauth-container");
    const profileContainer = document.getElementById("profile-container");

    const profileForm = document.getElementById("profileForm");
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    
    const usernameError = document.getElementById("usernameError");
    const emailError = document.getElementById("emailError");
    
    const profilePicPreview = document.getElementById("profile-pic-preview");
    const profilePictureInput = document.getElementById("profilePictureInput");
    const profilePicTrigger = document.getElementById("profile-pic-trigger");
    const uploadBtn = document.getElementById("upload-btn");
    const logoutBtn = document.getElementById("logout-btn");

    // Check authentication
    if (!token) {
        unauthContainer.style.display = "flex";
        profileContainer.style.display = "none";
        return;
    } else {
        unauthContainer.style.display = "none";
        profileContainer.style.display = "flex";
        fetchUserProfile();
    }

    // Trigger file selection on clicking container or choose button
    profilePicTrigger.addEventListener("click", () => profilePictureInput.click());
    uploadBtn.addEventListener("click", () => profilePictureInput.click());

    // File input selection preview
    profilePictureInput.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("Please select an image file.");
                profilePictureInput.value = "";
                return;
            }
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePicPreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Fetch user details from backend
    async function fetchUserProfile() {
        try {
            const response = await fetch(`${window.API_BASE_URL}/users/profile`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Unauthorized token (expired or invalid)
                    handleLogoutSilent();
                } else {
                    throw new Error("Failed to fetch profile");
                }
                return;
            }

            const user = await response.json();
            
            // Populate form fields
            usernameInput.value = user.name || "";
            emailInput.value = user.email || "";

            // Handle Profile Picture image path
            if (user.profilePicture) {
                // Prepend base URL if path is relative
                const imgPath = user.profilePicture.startsWith("http") 
                    ? user.profilePicture 
                    : `${window.API_BASE_URL}${user.profilePicture}`;
                profilePicPreview.src = imgPath;
            } else {
                profilePicPreview.src = DEFAULT_AVATAR;
            }
        } catch (error) {
            console.error("Fetch profile error:", error);
            alert("Error loading profile details. Please try logging in again.");
            handleLogoutSilent();
        }
    }

    // Handle Form submission and validation
    profileForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        
        // Reset errors
        usernameError.textContent = "";
        emailError.textContent = "";

        let isValid = true;
        const nameVal = usernameInput.value.trim();
        const emailVal = emailInput.value.trim();

        // Front-end validations
        if (!nameVal) {
            usernameError.textContent = "Username must be filled.";
            isValid = false;
        } else if (nameVal.length < 4) {
            usernameError.textContent = "Username must be at least 4 characters.";
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailVal) {
            emailError.textContent = "Email must be filled.";
            isValid = false;
        } else if (!emailRegex.test(emailVal)) {
            emailError.textContent = "Invalid email format.";
            isValid = false;
        }

        if (!isValid) return;

        // Build Multi-part Form Data
        const formData = new FormData();
        formData.append("name", nameVal);
        formData.append("email", emailVal);

        if (profilePictureInput.files[0]) {
            formData.append("profilePicture", profilePictureInput.files[0]);
        }

        try {
            const response = await fetch(`${window.API_BASE_URL}/users/profile`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                alert("Profile updated successfully!");
                // Update local storage user information
                const updatedUser = {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    profilePicture: data.profilePicture
                };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                
                // Refresh profile data page
                fetchUserProfile();
            } else {
                // Backend validations or email uniqueness errors
                if (data.message === "Email already in use") {
                    emailError.textContent = "Email is already in use by another account.";
                } else if (Array.isArray(data.message)) {
                    alert(`Update failed: ${data.message.join(", ")}`);
                } else {
                    alert(`Update failed: ${data.message || "Unknown error"}`);
                }
            }
        } catch (error) {
            console.error("Update profile error:", error);
            alert("Error sending update request to server.");
        }
    });

    // Handle Logout button click
    logoutBtn.addEventListener("click", function () {
        const confirmLogout = confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            alert("Logged out successfully.");
            window.location.href = "Home.html";
        }
    });

    function handleLogoutSilent() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        unauthContainer.style.display = "flex";
        profileContainer.style.display = "none";
    }
});
