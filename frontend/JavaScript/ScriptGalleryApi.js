const container = document.getElementById("artworkContainer");

const tagContainer = document.getElementById("tagContainer");

const modal = document.getElementById("artModal");

const modalImage = document.getElementById("modalImage");

const modalTitle =document.getElementById("modalTitle");

const modalAuthor = document.getElementById("modalAuthor");

const modalDesc = document.getElementById("modalDesc");

const modalLikes =document.getElementById("modalLikes");

const modalProfile = document.getElementById("modalProfile");


async function loadTags() {
    try {
        const response = await fetch(`${API_BASE_URL}/artwork/random-tags`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const tags = await response.json();

        tagContainer.innerHTML = "";

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
        const response = await fetch(`${API_BASE_URL}/artwork`);
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

    container.innerHTML = "";

    artworks.forEach(
        artwork => {

            const tags =
                artwork.tags
                    .map(
                        t =>
                        "#" +
                        t.tag.name
                    )
                    .join(" ");

            container.innerHTML += `

                <div class="artwork"
                    data-title="${artwork.title}"
                    data-image="${artwork.imageUrl}"
                    data-author="${artwork.user.name}"
                    data-description="${artwork.description}"
                    data-likes="${artwork.likes}"
                    data-profile="${artwork.user.profileImage || '../Asset/default-user.png'}"
                    >

                    <img
                        src="${artwork.imageUrl}"
                        alt="${artwork.title}"
                    >

                    <h3>
                        ${artwork.title}
                    </h3>

                    <div class="artist">

                        <span>
                            ${artwork.user.name}
                        </span>

                    </div>

                    <p>
                        ${tags}
                    </p>

                    <div class="likes">
                        <button class="like-btn ${artwork.liked ? 'liked' : ''}" data-id="${artwork.id}">
                            ❤
                        </button>
                        <div class="like-count">
                            ${artwork.likes}
                        </div>
                    </div>

                </div>

            `;

        }
    );

    attachArtworkEvents();
    attachLikeEvents();

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

                        const response = await fetch(`${API_BASE_URL}/artwork/tag/${tag}?userId=${userId}`);
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


loadTags();
loadArtworks();