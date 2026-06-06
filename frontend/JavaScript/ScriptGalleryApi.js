const container = document.getElementById("artworkContainer");

const tagContainer = document.getElementById("tagContainer");

const modal = document.getElementById("artModal");

const modalImage = document.getElementById("modalImage");

const modalTitle =document.getElementById("modalTitle");

const modalAuthor = document.getElementById("modalAuthor");

const modalDesc = document.getElementById("modalDesc");

const modalProfile = document.getElementById("modalProfile");

const modalTags = document.getElementById("modalTags");

const modalLikeBtn = document.getElementById("modalLikeBtn");


async function loadTags() {
    try {
        const response = await fetch(`${API_BASE_URL}/artwork/random-tags`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const tags = await response.json();

        // Prepend the static "All" filter tag
        tagContainer.innerHTML = `
            <a href="#" data-tag="all">All</a>
        `;

        tags.forEach(tag => {
            tagContainer.innerHTML += `
                <a
                    href="#"
                    data-tag="${tag.name}">
                    #${tag.name}
                </a>
            `;
        });

        attachTagEvents();

        const firstTag = document.querySelector("#tagContainer a");
        if (firstTag) {
            firstTag.classList.add("active");
            firstTag.click();
        }
    } catch (error) {
        console.error("Error loading tags:", error);
    }
}

async function loadArtworks() {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id || 0;
        const sort = document.getElementById("sortGallery")?.value || "newest";
        const response = await fetch(`${API_BASE_URL}/artwork?userId=${userId}&sort=${sort}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const artworks = await response.json();
        renderArtworks(artworks);
    } catch(error) {
        console.error("Error loading artworks:", error);
    }
}

function renderArtworks(
    artworks
) {
    if (!artworks || artworks.length === 0) {
        container.innerHTML = '<div class="empty-state">Belum ada karya untuk tag ini.</div>';
        return;
    }

    let htmlContent = "";

    artworks.forEach(
        artwork => {

            const tagsHTML = artwork.tags
                .map(
                    t =>
                    `<span class="card-tag">#${t.name}</span>`
                )
                .join("");

            // Ensure the image URL is absolute by prepending the backend API base URL if relative
            const imageUrl = artwork.imageUrl 
                ? (artwork.imageUrl.startsWith('http') ? artwork.imageUrl : `${API_BASE_URL}${artwork.imageUrl}`)
                : 'https://placehold.co/600x400?text=No+Image';

            const DEFAULT_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23cccccc"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
            // Ensure the profile image URL is absolute if relative
            const profileImage = artwork.user.profilePicture 
                ? (artwork.user.profilePicture.startsWith('http') ? artwork.user.profilePicture : `${API_BASE_URL}${artwork.user.profilePicture}`)
                : DEFAULT_AVATAR;

            htmlContent += `
 
                <div class="artwork"
                    data-id="${artwork.id}"
                    data-liked="${artwork.liked}"
                    data-title="${artwork.title}"
                    data-image="${imageUrl}"
                    data-author="${artwork.user.name}"
                    data-description="${artwork.description}"
                    data-likes="${artwork.likes}"
                    data-profile="${profileImage}"
                    data-tags="${artwork.tags.map(t => t.name).join(",")}"
                    >
                    <div class="content-wrapper">
                        <img
                            src="${imageUrl}"
                            alt="${artwork.title}"
                            onerror="this.onerror=null; this.src='https://placehold.co/600x400?text=No+Image';"
                        >

                        <h3>
                            ${artwork.title}
                        </h3>

                        <div class="artist">

                            <span>
                                ${artwork.user.name}
                            </span>

                        </div>

                        <div class="card-tags">
                            ${tagsHTML}
                        </div>

                        <div class="likes">
                            <button class="like-btn ${artwork.liked ? 'liked' : ''}" data-id="${artwork.id}">
                                ❤
                            </button>
                            <div class="like-count">
                                ${artwork.likes}
                            </div>
                        </div>
                    </div>
                </div>

            `;

        }
    );

    container.innerHTML = htmlContent;

    const images = container.querySelectorAll('.artwork img');
    images.forEach(img => {
        img.addEventListener('load', applyMasonry);
        img.addEventListener('error', applyMasonry);
    });

    attachArtworkEvents();
    attachLikeEvents();
    applyMasonry();
}

function attachTagEvents() {

    document
        .querySelectorAll(
            "#tagContainer a"
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                async (e) => {
                    try {
                        e.preventDefault();

                        document.querySelectorAll("#tagContainer a").forEach(tag => {
                            tag.classList.remove(
                                "active"
                            );
                        });

                        e.target.classList.add("active");

                        const tag = e.target.dataset.tag;

                        const user =
                            JSON.parse(
                                localStorage.getItem(
                                    "user"
                                )
                            );

                        const userId =
                            user?.id || 0;

                        // Check if the "All" tag was clicked
                        if (tag === 'all') {
                            await loadArtworks();
                            return;
                        }
 
                        const sort = document.getElementById("sortGallery")?.value || "newest";
                        const response = await fetch(`${API_BASE_URL}/artwork/tag/${tag}?userId=${userId}&sort=${sort}`);
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }

                        const artworks =
                            await response.json();

                        renderArtworks(
                            artworks
                        );
                    } catch (error) {
                        console.error("Error loading tag artworks:", error);
                    }
                }
            );
        });
}

function attachArtworkEvents() {

    document
        .querySelectorAll(
            ".artwork img"
        )
        .forEach(img => {

            img.addEventListener(
                "click",
                () => {

                    const card =
                        img.closest(
                            ".artwork"
                        );

                    modalImage.src =
                        card.dataset.image;

                    modalTitle.textContent =
                        card.dataset.title;

                    modalAuthor.textContent =
                        card.dataset.author;

                    modalDesc.textContent =
                        card.dataset.description;

                    modalLikes.textContent =
                        card.dataset.likes;

                    modalProfile.src =
                        card.dataset.profile;

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
 
                    modal.style.display =
                        "block";
                }
            );
        });
}

function attachLikeEvents() {

    document
        .querySelectorAll(
            ".like-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",

                async (e) => {

                    e.stopPropagation();

                    const artworkId =
                        button.dataset.id;

                    const user =
                        JSON.parse(

                            localStorage.getItem(
                                "user"
                            )

                        );

                    if (!user) {

                        alert(
                            "Please login first."
                        );

                        return;
                    }

                    try {
                        const response =
                            await fetch(
                                `${API_BASE_URL}/artwork/${artworkId}/like`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type":
                                            "application/json",
                                    },
                                    body: JSON.stringify({
                                        userId:
                                            user.id,
                                    }),
                                }
                            );
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }

                        const data =
                            await response.json();

                        
                        const count =
                            button.nextElementSibling;

                        count.textContent =
                            data.likes;

                        if (data.liked) {
 
                            button.classList.add(
                                "liked"
                            );
                        }
 
                        else {
 
                            button.classList.remove(
                                "liked"
                            );
                        }

                        // Sync dataset attributes on the card
                        const card = button.closest(".artwork");
                        if (card) {
                            card.dataset.likes = data.likes;
                            card.dataset.liked = data.liked;
                        }
                    } catch (error) {
                        console.error("Error liking artwork:", error);
                    }
                }
            );
        });
}

document.querySelector(".close").addEventListener("click", () => {
            modal.style.display =
                "none";
        }
);

// Modal Like Button click logic
modalLikeBtn.addEventListener("click", async () => {
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

// Dropdown Sort change logic
document.getElementById("sortGallery").addEventListener("change", async () => {
    const activeTagLink = document.querySelector("#tagContainer a.active");
    const tag = activeTagLink ? activeTagLink.dataset.tag : "all";
    
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id || 0;
    const sort = document.getElementById("sortGallery").value;
    
    if (tag === 'all') {
        await loadArtworks();
    } else {
        try {
            const response = await fetch(`${API_BASE_URL}/artwork/tag/${tag}?userId=${userId}&sort=${sort}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const artworks = await response.json();
            renderArtworks(artworks);
        } catch (error) {
            console.error("Error sorting tag artworks:", error);
        }
    }
});

async function initializeGallery() {
    await loadTags();
    const hasActiveTag = document.querySelector("#tagContainer a.active") !== null;
    if (!hasActiveTag) {
        await loadArtworks();
    }
}

function resizeMasonryItem(item) {
    const grid = document.querySelector('.list-of-artworks');
    if (!grid) return;
    const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows')) || 10;
    const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('column-gap')) || 20;
    
    const contentWrapper = item.querySelector('.content-wrapper');
    if (!contentWrapper) return;
    
    const rowSpan = Math.ceil((contentWrapper.getBoundingClientRect().height + rowGap) / rowHeight);
    item.style.gridRowEnd = 'span ' + rowSpan;
}

function applyMasonry() {
    const allItems = document.querySelectorAll('.artwork');
    allItems.forEach(resizeMasonryItem);
}

window.addEventListener('resize', applyMasonry);
window.addEventListener('load', applyMasonry);

initializeGallery();