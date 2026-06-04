const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

function validateEmail(email) {

    const regex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
}

form.addEventListener("submit",async (e) => {
    e.preventDefault();

    let valid = true;

    emailError.textContent = "";
    passwordError.textContent = "";

    if (!emailInput.value.trim()) {

        emailError.textContent =
            "Email must be filled";

        valid = false;
    }
    else if (
        !validateEmail(
            emailInput.value
        )
    ) {

        emailError.textContent =
            "Invalid email format";

        valid = false;
    }

    if (!passwordInput.value.trim()) {

        passwordError.textContent =
            "Password must be filled";

        valid = false;
    }

    if (!valid) return;

    console.log(
        "Ready for backend login"
    );

    /*
    later:

    const response = await fetch(
        "http://localhost:3000/auth/login"
    );
    */

    const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: emailInput.value,
            password: passwordInput.value
        }),
    });

    console.log(response);

    const data = await response.json();

    console.log(data);

    if (response.ok) {
        localStorage.setItem("token", data.token);

        localStorage.setItem("user", JSON.stringify(data.user));

        window.location.href = "Home.html";
    }

    else {
        if (data.message === "Incorrect email or password") {
            emailError.textContent = "Incorrect email or password";
            passwordError.textContent = "Incorrect email or password";
        }

        return;
    }
        
    }
);