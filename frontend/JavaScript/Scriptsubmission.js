const submissionForm = document.getElementById("submissionForm");

submissionForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    document.getElementById('emailError').textContent = '';
    document.getElementById('titleError').textContent = '';
    document.getElementById('descriptionError').textContent = '';
    document.getElementById('tagsError').textContent = '';
    document.getElementById('fileError').textContent = '';
    document.getElementById('aiError').textContent = '';
    
    const email = document.getElementById("email").value.trim();
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const tags = document.getElementById("tags").value.trim();
    const artwork = document.getElementById("artwork").files[0];
    const aiGenerated = document.querySelector('input[name="aiGenerated"]:checked');

    let isValid = true;

    if(email == ''){
        isValid = false;
        document.getElementById('emailError').textContent = "Email is required";
    } else if(!email.includes("@") || !email.includes(".")) {
        isValid = false;
        document.getElementById('emailError').textContent = "Please enter a valid email address";
    }

    if(title == ''){
        isValid = false;
        document.getElementById('titleError').textContent = "Title is required";
    }else{
        const words = title.trim().split(' ');
        let isTitleCase = true;
        
        for(let word of words){
            if(word.length === 0) continue;
            const firstChar = word[0];
            const rest = word.slice(1);

            if (firstChar !== firstChar.toUpperCase() || rest !== rest.toLowerCase()){
                isTitleCase = false;
                break;
            }
        }

        if(!isTitleCase){
            isValid = false;
            document.getElementById('titleError').textContent = "Each word must start with a capital letter";
        }
    }

    if(description == ''){
        isValid = false;
        document.getElementById('descriptionError'). textContent = "Description is required";
    }

    if(tags == ''){
        isValid = false;
        document.getElementById('tagsError'). textContent = "Tags is required";
    }

    if(!artwork){
        isValid = false;
        document.getElementById('fileError'). textContent = "Please choose a file";
    }else if(!artwork.name.endsWith(".jpg") && !artwork.name.endsWith(".jpeg") && !artwork.name.endsWith(".png")) {
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
    await submitToBackend(email, title, description, tags, artwork, aiGenerated.value);
});

async function submitToBackend(email, title, description, tags, artwork, aiGenerated) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    formData.append('isAiGenerated', aiGenerated === 'yes');
    formData.append('artwork', artwork);
    // Don't send userId - backend will handle it as optional

    try {
        console.log('Submitting to backend...', { email, title, tags, aiGenerated });
        
        const response = await fetch('http://localhost:3000/submission/create', {
            method: 'POST',
            body: formData,
        });

        console.log('Response received:', response.status, response.statusText);
        
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
        alert(`Error submitting artwork: ${error.message}. Make sure the backend is running on http://localhost:3000`);
    }
}

document.addEventListener('DOMContentLoaded', function (){
    const selectElement = document.querySelector('select');

    selectElement.addEventListener('change', function() {
        this.blur();
    });

    function updateColor(){
        if(selectElement.value !== ""){
            selectElement.style.color = "#000";
        }
        else{
            selectElement.style.color = "#777";
        }
    }

    updateColor()

    selectElement.addEventListener('change', updateColor);

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

