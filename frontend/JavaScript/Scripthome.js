document.getElementById("logo-nav").addEventListener("click", function () {
    window.scrollTo({
        top:0,
        behavior: "smooth"
    });
});

document.getElementById("logo").addEventListener("click", function () {
    window.scrollTo({
        top:0,
        behavior: "smooth"
    });
});

function initializeCarousel() {
    let index = 1;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const container = document.querySelector('.carousel-slides');

    if (!container || slides.length === 0) return;

    container.style.transform = `translateX(-${index * 100}%)`;

    function showSlide(i) {
        slides.forEach((slide, idx) => {
            slide.classList.remove('active');
            if (dots[idx]) dots[idx].classList.remove('active');
            const caption = slide.querySelector('.caption');
            if (caption) caption.classList.remove('animate');
        });
        slides[i].classList.add('active');
        if (dots[i]) dots[i].classList.add('active');
        container.style.transform = `translateX(${-i * 100}%)`;

        const activeCaption = slides[i].querySelector('.caption');
        if (activeCaption) {
            void activeCaption.offsetWidth;
            activeCaption.classList.add('animate');
        }
    }

    function nextSlide() {
        if (index >= slides.length - 1) return;
        index++;
        updateSlide();
    }

    function prevSlide() {
        if (index <= 0) return;
        index--;
        updateSlide();
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            index = i + 1;
            updateSlide();
            resetAutoSlide();
        });
    });

    function resetAutoSlide() {
        clearInterval(autoSlide);
        autoSlide = setInterval(nextSlide, 2000);
    }

    let autoSlide = setInterval(nextSlide, 2000);

    function updateSlide() {
        container.style.transition = 'transform 0.5s ease-in-out';
        container.style.transform = `translateX(-${index * 100}%)`;
        updateDots();
    }

    function updateDots() {
        dots.forEach(dot => dot.classList.remove('active'));
        let realIndex = index - 1;
        if (realIndex === -1) realIndex = dots.length - 1;
        if (realIndex === dots.length) realIndex = 0;
        if (dots[realIndex]) dots[realIndex].classList.add('active');
    }

    container.addEventListener('transitionend', () => {
        if (slides[index].style.backgroundImage === slides[0].style.backgroundImage) {
            container.style.transition = 'none';
            index = slides.length - 2;
            container.style.transform = `translateX(-${index * 100}%)`;
        }
        if (slides[index].style.backgroundImage === slides[slides.length - 1].style.backgroundImage) {
            container.style.transition = 'none';
            index = 1;
            container.style.transform = `translateX(-${index * 100}%)`;
        }
    });

    let startX = 0;
    let isDragging = false;
    let isTouch = false;

    container.addEventListener('touchstart', e => {
        isTouch = true;
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    container.addEventListener('touchmove', e => {
        if (!isDragging) return;
        const diff = e.touches[0].clientX - startX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) prevSlide();
            else nextSlide();
            isDragging = false;
            resetAutoSlide();
        }
    });
    container.addEventListener('touchend', () => {
        isDragging = false;
    });

    container.addEventListener('mousedown', (e) => {
        isTouch = false;
        startX = e.clientX;
        isDragging = true;
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDragging || isTouch) return;
        const diff = e.clientX - startX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) prevSlide();
            else nextSlide();
            isDragging = false;
            resetAutoSlide();
        }
    });
    container.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

// Dynamic Trending Tags logic
async function loadTrendingTags() {
    const API_BASE_URL = window.API_BASE_URL || "http://localhost:3000";
    try {
        const response = await fetch(`${API_BASE_URL}/artwork/tags/trending`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const tags = await response.json();
        const tagsContainer = document.querySelector('.tags-container');
        if (tagsContainer) {
            tagsContainer.innerHTML = tags.map(tag => 
                `<a href="Gallery.html?tag=${encodeURIComponent(tag.name)}">#${tag.name}</a>`
            ).join('');
        }
    } catch (error) {
        console.error("Error loading trending tags:", error);
    }
}

// Dynamic Featured Artworks logic
// Modal Element references
const modal = document.getElementById("artModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalAuthor = document.getElementById("modalAuthor");
const modalDesc = document.getElementById("modalDesc");
const modalProfile = document.getElementById("modalProfile");
const modalTags = document.getElementById("modalTags");
const modalLikeBtn = document.getElementById("modalLikeBtn");
const modalLikes = document.getElementById("modalLikes");

// Modal close behavior
if (modal) {
    const closeBtn = modal.querySelector(".close");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}

// Modal Like Button click logic
if (modalLikeBtn) {
    modalLikeBtn.addEventListener("click", async () => {
        const API_BASE_URL = window.API_BASE_URL || "http://localhost:3000";
        const artworkId = modalLikeBtn.dataset.id;
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            alert("Please login first.");
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/artwork/${artworkId}/like`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user.id,
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Update modal UI
            modalLikes.textContent = data.likes;
            modalLikeBtn.dataset.liked = data.liked;
            if (data.liked) {
                modalLikeBtn.classList.add("liked");
            } else {
                modalLikeBtn.classList.remove("liked");
            }
            
            // Sync the background card UI
            const card = document.querySelector(`.artwork[data-id="${artworkId}"]`);
            if (card) {
                card.dataset.likes = data.likes;
                card.dataset.liked = data.liked;
                
                // Update the card's like counter
                const likeCounter = card.querySelector(".like-count");
                if (likeCounter) {
                    likeCounter.textContent = data.likes;
                }
                
                // Update the card's like button class
                const likeBtn = card.querySelector(".like-btn");
                if (likeBtn) {
                    if (data.liked) {
                        likeBtn.classList.add("liked");
                    } else {
                        likeBtn.classList.remove("liked");
                    }
                }
            }
        } catch (error) {
            console.error("Error liking artwork inside modal:", error);
        }
    });
}

// Dynamic Featured Artworks logic
async function loadFeaturedArtworks() {
    const API_BASE_URL = window.API_BASE_URL || "http://localhost:3000";
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id || 0;
        const response = await fetch(`${API_BASE_URL}/artwork/featured?userId=${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const artworks = await response.json();
        const artworksContainer = document.querySelector('.home-artworks-list');
        if (artworksContainer) {
            artworksContainer.innerHTML = artworks.map(art => {
                const imageUrl = art.imageUrl.startsWith('http') ? art.imageUrl : `${API_BASE_URL}${art.imageUrl}`;
                const profileImage = art.user && art.user.profilePicture 
                    ? (art.user.profilePicture.startsWith('http') ? art.user.profilePicture : `${API_BASE_URL}${art.user.profilePicture}`)
                    : `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23cccccc"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
                const artistName = art.user ? art.user.name : "Unknown Artist";
                const tagsStr = art.tags ? art.tags.map(t => t.name).join(",") : "";
                
                return `
                    <div class="artwork" 
                        data-id="${art.id}"
                        data-liked="${art.liked}"
                        data-title="${art.title}"
                        data-image="${imageUrl}"
                        data-author="${artistName}"
                        data-description="${art.description || ''}"
                        data-likes="${art.likes}"
                        data-profile="${profileImage}"
                        data-tags="${tagsStr}"
                        >
                        <img src="${imageUrl}" alt="${art.title}" onerror="this.onerror=null; this.src='https://placehold.co/600x400?text=No+Image';">
                        <h3>${art.title}</h3>
                        <div class="artist">
                            <img src="${profileImage}" alt="${artistName}">
                            <span>${artistName}</span>
                        </div>
                        <div class="likes">
                            <button class="like-btn ${art.liked ? 'liked' : ''}" data-id="${art.id}">&#10084;</button>
                            <div class="like-count">${art.likes}</div>
                        </div>
                    </div>
                `;
            }).join('');

            // Attach artwork card click listeners for the modal
            artworksContainer.querySelectorAll('.artwork').forEach(card => {
                card.addEventListener('click', (e) => {
                    if (e.target.closest('.likes')) {
                        return;
                    }

                    modalImage.src = card.dataset.image;
                    modalTitle.textContent = card.dataset.title;
                    modalAuthor.textContent = card.dataset.author;
                    modalDesc.textContent = card.dataset.description;
                    modalLikes.textContent = card.dataset.likes;
                    modalProfile.src = card.dataset.profile;
                    
                    const tagsStr = card.dataset.tags || "";
                    const tags = tagsStr ? tagsStr.split(",") : [];
                    modalTags.innerHTML = tags.map(tag => `<span class="card-tag">#${tag}</span>`).join("");

                    // Set up modal like button state
                    const activeId = card.dataset.id;
                    const liked = card.dataset.liked === "true";
                    modalLikeBtn.dataset.id = activeId;
                    modalLikeBtn.dataset.liked = liked;
                    if (liked) {
                        modalLikeBtn.classList.add("liked");
                    } else {
                        modalLikeBtn.classList.remove("liked");
                    }
                    
                    modal.style.display = "block";
                });
            });

            // Attach like button event listeners dynamically
            artworksContainer.querySelectorAll('.like-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const artworkId = btn.dataset.id;
                    const user = JSON.parse(localStorage.getItem("user"));
                    if (!user) {
                        alert("Please login first.");
                        return;
                    }

                    try {
                        const response = await fetch(`${API_BASE_URL}/artwork/${artworkId}/like`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                userId: user.id,
                            }),
                        });
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        const data = await response.json();
                        
                        const countSpan = btn.nextElementSibling;
                        if (countSpan) {
                            countSpan.textContent = data.likes;
                        }

                        if (data.liked) {
                            btn.classList.add("liked");
                        } else {
                            btn.classList.remove("liked");
                        }

                        // Sync dataset attributes on the card
                        const card = btn.closest(".artwork");
                        if (card) {
                            card.dataset.likes = data.likes;
                            card.dataset.liked = data.liked;
                        }
                    } catch (error) {
                        console.error("Error liking artwork from card:", error);
                    }
                });
            });
        }
    } catch (error) {
        console.error("Error loading featured artworks:", error);
    }
}

// Dynamic Banner Artworks logic
async function loadBannerArtworks() {
    const API_BASE_URL = window.API_BASE_URL || "http://localhost:3000";
    try {
        const response = await fetch(`${API_BASE_URL}/artwork/banner`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const artworks = await response.json();
        
        const slidesContainer = document.querySelector('.carousel-slides');
        const indicatorsContainer = document.querySelector('.carousel-indicators');

        if (slidesContainer && indicatorsContainer && artworks.length > 0) {
            // Re-order to have [Last, First, Second, Third, First] for infinite looping
            const slidesToRender = [
                artworks[artworks.length - 1], // buffer last
                ...artworks,
                artworks[0]                    // buffer first
            ];

            // Render slides
            slidesContainer.innerHTML = slidesToRender.map(art => {
                const imageUrl = art.imageUrl.startsWith('http') ? art.imageUrl : `${API_BASE_URL}${art.imageUrl}`;
                const profileImage = art.user && art.user.profilePicture 
                    ? (art.user.profilePicture.startsWith('http') ? art.user.profilePicture : `${API_BASE_URL}${art.user.profilePicture}`)
                    : `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23cccccc"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
                const artistName = art.user ? art.user.name : "Unknown Artist";

                return `
                    <div class="slide" style="background-image: url('${imageUrl}');">
                        <div class="overlay"></div>
                        <div class="caption">
                            <span>Artwork by ${artistName}</span>
                            <img src="${profileImage}" alt="">
                        </div>
                    </div>
                `;
            }).join('');

            // Render indicators (dots)
            indicatorsContainer.innerHTML = artworks.map((_, i) => 
                `<span class="dot${i === 0 ? ' active' : ''}"></span>`
            ).join('');

            // Initialize carousel controls now that DOM elements exist
            initializeCarousel();
        }
    } catch (error) {
        console.error("Error loading banner artworks:", error);
    }
}

// Initial fetch on page load
loadTrendingTags();
loadFeaturedArtworks();
loadBannerArtworks();

