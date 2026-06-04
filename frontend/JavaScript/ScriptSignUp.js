const form = document.getElementById("signupForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

function validateName(name) {
    return name.trim().length > 3;
}

function validateEmail(email) {
    const regex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
}

function validatePassword(password) {

    const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{7,}$/;

    return regex.test(password);
}

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    let valid = true;

    // Name
    if (!nameInput.value.trim()) {
        nameError.textContent = "Name must be filled";

        valid = false;
    } else if (!validateName(nameInput.value)) {
        nameError.textContent =
            "Name must be more than 3 characters";

        nameInput.classList.add("invalid");

        valid = false;
    } else {
        nameError.textContent = "";
        nameInput.classList.remove("invalid");
        nameInput.classList.add("valid");
    }

    // Email
    if (!emailInput.value.trim()) {
        emailError.textContent = "Email must be filled";

        valid = false;
    } else if (!validateEmail(emailInput.value)) {
        emailError.textContent =
            "Invalid email format";

        emailInput.classList.add("invalid");

        valid = false;
    } else {
        emailError.textContent = "";
        emailInput.classList.remove("invalid");
        emailInput.classList.add("valid");
    }

    // Password
    if (!passwordInput.value.trim()) {
        passwordError.textContent = "Password must be filled";

        valid = false;
    } else if (!validatePassword(passwordInput.value)) {
        passwordError.textContent =
            "Password must be 7+ chars with uppercase, lowercase and number";

        passwordInput.classList.add("invalid");

        valid = false;
    } else {
        passwordError.textContent = "";
        passwordInput.classList.remove("invalid");
        passwordInput.classList.add("valid");
    }

    if (!valid) return;

    const response = await fetch(
        "http://localhost:3000/auth/register",
        {
            method: "POST",
            headers: {
            "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
            name: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
            }),
        }
    );

    console.log(response);

    const data = await response.json();

    console.log(data);

    if (response.ok) {

        alert(data.message);

        window.location.href = "Home.html";
    }
    else {
        if (data.message === "Email already exists") {
            emailError.textContent = "Email is already taken";
        }

        return;
    }
});