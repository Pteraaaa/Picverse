const modal = document.getElementById("artModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalProfile = document.getElementById("modalProfile")
const modalAuthor = document.getElementById("modalAuthor");
const modalDesc = document.getElementById("modalDesc");
const modalLikes = document.getElementById("modalLikes");
const closeBtn = document.querySelector(".close");

const modalLikeBtn = modal.querySelector(".like-btn");

const likeCounts = {};
const likedStatus = {};

function loadFromLocalStorage(id){
    const likes = localStorage.getItem(`likes-${id}`);
    const liked = localStorage.getItem(`liked-${id}`);
    return {
        likes: likes ? parseInt(likes) : null,
        liked: liked === "true"
    };
}

function saveToLocalStorage(id){
    localStorage.setItem(`likes-${id}`, likeCounts[id]);
    localStorage.setItem(`liked-${id}`, likedStatus[id]);
}

document.querySelectorAll(".artwork").forEach((artwork, index) => {
    const id = index.toString();
    artwork.dataset.id = id;

    const likeBtn = artwork.querySelector(".like-btn");
    const likeCount = artwork.querySelector(".like-count");
    const img = artwork.querySelector("img");
    const title = artwork.querySelector("h3").textContent;
    const profile = artwork.querySelector(".artist img"). src;
    const author = artwork.querySelector(".artist span").textContent;
    const desc = artwork.querySelector(".modal-desc")?.textContent.trim() || "";

    const saved = loadFromLocalStorage(id);
    likeCounts[id] = saved.likes !== null ? saved.likes : parseInt(likeCount.textContent);
    likedStatus[id] = saved.liked;

    likeCount.textContent = likeCounts[id];
    updateLikeVisual(likeBtn, likedStatus[id]);

    img.addEventListener("click", () => {
        modal.dataset.id = id;
        openModal(img.src, title, profile, author, desc, likeCounts[id], id);
    });

    likeBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        likedStatus[id] = !likedStatus[id];

        if(likedStatus[id]){
           likeCounts[id]++; 
        }
        else{
            likeCounts[id]--;
        }
        
        likeCount.textContent = likeCounts[id];
        saveToLocalStorage(id);

        if(modal.style.display === "block" && modal.dataset.id === id){
        modalLikes.textContent = likeCounts[id];
        updateLikeVisual(modalLikeBtn, likedStatus[id]);
        
        }
        updateLikeVisual(likeBtn, likedStatus[id]);
    });
});

function openModal(imageSrc, title, imageProfile, author, description, likes, id){
    modal.style.display = "block";
    modalImage.src = imageSrc;
    modalTitle.textContent = title;
    modalProfile.src = imageProfile;
    modalAuthor.textContent = author;
    modalDesc.textContent = description;
    modalLikes.textContent = likes;
    modal.dataset.id = id;

    modalLikes.textContent = likeCounts[id] || likes;
    const isLiked = likedStatus[id] || false;
    updateLikeVisual(modalLikeBtn, isLiked)
}

modalLikeBtn.addEventListener("click", () => {
    const id = modal.dataset.id;
    likedStatus[id] = !likedStatus[id];

    if(likedStatus[id]){
        likeCounts[id]++; 
    }
    else{
        likeCounts[id]--;
    }

    modalLikes.textContent = likeCounts[id];
    saveToLocalStorage(id);

    const gridLike = document.querySelector(`.artwork[data-id="${id}"] .like-count`);
    const gridLikeBtn = document.querySelector(`.artwork[data-id="${id}"] .like-btn`);
    
    if (gridLike){
        gridLike.textContent = likeCounts[id];
        updateLikeVisual(gridLikeBtn, likedStatus[id]);
    }

    updateLikeVisual(modalLikeBtn, likedStatus[id]);
});

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { 
    if (e.target === modal) modal.style.display = "none";
}

document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});

function updateLikeVisual(button, isLiked){
    if (isLiked){
        button.classList.add("liked");
    }
    else{
        button.classList.remove("liked");
    }
}

