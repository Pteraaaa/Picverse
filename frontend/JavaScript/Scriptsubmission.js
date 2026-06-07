// Check for token on page load to protect this frontend route
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please login first to access the submission page.");
        window.location.href = "Login.html";
    }
});

const submissionForm = document.getElementById("submissionForm");
const selectedTags = new Set();
const tagsSelectionContainer = document.getElementById("tagsSelectionContainer");
const customTagInput = document.getElementById("customTagInput");
const addCustomTagBtn = document.getElementById("addCustomTagBtn");

submissionForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Check for token on form submission
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please login first to submit an artwork.");
        window.location.href = "Login.html";
        return;
    }

    document.getElementById('titleError').textContent = '';
    document.getElementById('descriptionError').textContent = '';
    document.getElementById('tagsError').textContent = '';
    document.getElementById('fileError').textContent = '';
    document.getElementById('aiError').textContent = '';
    
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    
    // Query selected tags directly from the DOM
    const tags = Array.from(document.querySelectorAll("#tagsSelectionContainer .tag-bubble.active, #tagsSelectionContainer .tag-bubble.selected"))
        .map(bubble => bubble.dataset.tag || bubble.textContent.replace('#', '').trim());

    const artwork = document.getElementById("artwork").files[0];
    const aiGenerated = document.querySelector('input[name="aiGenerated"]:checked');

    let isValid = true;



    if(title == ''){
        isValid = false;
        document.getElementById('titleError').textContent = "Title is required";
    }else if(title.length < 3){
        isValid = false;
        document.getElementById('titleError').textContent = "Title must be at least 3 characters";
    }else if(title.length > 50){
        isValid = false;
        document.getElementById('titleError').textContent = "Title must be at most 50 characters";
    }else if(!/^[A-Z]/.test(title)){
        isValid = false;
        document.getElementById('titleError').textContent = "Title must start with a capital letter";
    }

    if(description == ''){
        isValid = false;
        document.getElementById('descriptionError').textContent = "Description is required";
    }else if(description.length < 10){
        isValid = false;
        document.getElementById('descriptionError').textContent = "Description must be at least 10 characters";
    }

    if(tags.length === 0){
        isValid = false;
        document.getElementById('tagsError').textContent = "Tags are required";
    }

    if(!artwork){
        isValid = false;
        document.getElementById('fileError').textContent = "Please choose a file";
    }else if(!artwork.name.toLowerCase().endsWith(".jpg") && !artwork.name.toLowerCase().endsWith(".jpeg") && !artwork.name.toLowerCase().endsWith(".png")) {
        isValid = false;
        document.getElementById('fileError').textContent = "Invalid file type. Only .jpg, .jpeg, .png";
    }else if(artwork.size > 1073741824){
        isValid = false;
        document.getElementById('fileError').textContent = "File size must be 1 GB or less";
    }

    if(!aiGenerated){
        isValid = false;
        document.getElementById('aiError').textContent = "Please Select!";
    }

    if (!isValid){
        return;
    }

    // Confirmation dialog
    const confirmSubmit = confirm("Are you sure you want to submit the artwork?");
    if(!confirmSubmit){
        return;
    }

    // Submit to backend
    await submitToBackend(title, description, tags, artwork, aiGenerated.value);
});

async function submitToBackend(title, description, tags, artwork, aiGenerated) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please login first to submit an artwork.");
        window.location.href = "Login.html";
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags.join(','));
    formData.append('isAiGenerated', aiGenerated === 'yes');
    formData.append('artwork', artwork);

    // Retrieve user from localStorage to get userId
    const userStr = localStorage.getItem("user");
    let userId = 1; // Default to 1 if not found
    if (userStr) {
        try {
            const userObj = JSON.parse(userStr);
            if (userObj && userObj.id) {
                userId = userObj.id;
            }
        } catch (e) {
            console.error("Error parsing user from localStorage:", e);
        }
    }
    formData.append('userId', userId);

    try {
        console.log('Submitting to backend...', { title, tags, aiGenerated });
        
        const response = await fetch(`${API_BASE_URL}/artwork/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
        });

        console.log('Response received:', response.status, response.statusText);

        if (response.status === 401) {
            alert("Your session has expired or you are unauthorized. Please log in again.");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "Login.html";
            return;
        }
        
        const result = await response.json();
        console.log('Response data:', result);

        if (!response.ok) {
            console.error('Error response:', result);
            alert(`Error: ${result.message || 'Failed to submit artwork'}`);
            return;
        }

        alert("Artwork submitted successfully!");
        submissionForm.reset();
        document.getElementById("imagePreview").style.display = "none";

    } catch (error) {
        console.error('Error details:', error);
        alert(`Error submitting artwork: ${error.message}. Make sure the backend is running on ${API_BASE_URL}`);
    }
}

async function loadAvailableTags() {
    try {
        const response = await fetch(`${API_BASE_URL}/artwork/tags`);
        let tags = [];
        if (response.ok) {
            tags = await response.json();
        }
        
        if (tags.length === 0) {
            tags = [
                { name: 'Digitalart' },
                { name: 'Portrait' },
                { name: 'Anime' },
                { name: 'Fantasy' },
                { name: 'Cyberpunk' },
                { name: 'AIart' },
                { name: 'Nature' },
                { name: 'Photography' },
                { name: 'Abstract' },
                { name: 'Pixelart' },
                { name: 'Character' }
            ];
        }

        tagsSelectionContainer.innerHTML = "";
        tags.forEach(tag => {
            createTagBubble(tag.name);
        });
    } catch (error) {
        console.error("Error loading tags:", error);
        const defaultTags = ['Digitalart', 'Portrait', 'Anime', 'Fantasy', 'Cyberpunk', 'AIart', 'Nature', 'Photography', 'Abstract', 'Pixelart', 'Character'];
        tagsSelectionContainer.innerHTML = "";
        defaultTags.forEach(name => createTagBubble(name));
    }
}

function createTagBubble(name) {
    const existing = Array.from(tagsSelectionContainer.children).find(el => el.dataset.tag.toLowerCase() === name.toLowerCase());
    if (existing) return;

    const bubble = document.createElement("div");
    bubble.className = "tag-bubble";
    bubble.textContent = "#" + name;
    bubble.dataset.tag = name;

    bubble.addEventListener("click", () => {
        if (selectedTags.has(name)) {
            selectedTags.delete(name);
            bubble.classList.remove("active");
        } else {
            selectedTags.add(name);
            bubble.classList.add("active");
            document.getElementById('tagsError').textContent = '';
        }
    });

    tagsSelectionContainer.appendChild(bubble);
}

document.addEventListener('DOMContentLoaded', function (){
    loadAvailableTags();

    addCustomTagBtn.addEventListener("click", () => {
        const name = customTagInput.value.trim().replace(/#/g, '');
        if (name.length === 0) return;

        const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        createTagBubble(formattedName);

        selectedTags.add(formattedName);
        const bubble = Array.from(tagsSelectionContainer.children).find(el => el.dataset.tag === formattedName);
        if (bubble) {
            bubble.classList.add("active");
        }

        customTagInput.value = "";
        document.getElementById('tagsError').textContent = '';
    });

    customTagInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addCustomTagBtn.click();
        }
    });
});

document.addEventListener('DOMContentLoaded', function (){
    const artworkInput = document.getElementById("artwork");
    const imagePreview = document.getElementById("imagePreview");


    artworkInput.addEventListener("change", function(){
        const file = this.files[0];

        if(file){
            const validTypes = ["image/jpg", "image/jpeg", "image/png"];
            if (!validTypes.includes(file.type)){
                imagePreview.src = "";
                imagePreview.style.display = "none";
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = "block";
            };
            reader.readAsDataURL(file);
        }else{
            imagePreview.src = "";
            imagePreview.style.display = "none";
        }
    });
});

