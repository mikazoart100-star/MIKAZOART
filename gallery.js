document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       PROJECT / ALBUM / EP
       ========================================================= */

    const projects = [
        {
            type: "ALBUM",
            title: "Blossom",
            tagline: "A collection of visual stories.",
            artworks: [
                "assets/images/art 41 (yacho no shiawase).png"
            ]
        },

        {
            type: "ALBUM",
            title: "Fantasy",
            tagline: "A journey through imagination.",
            artworks: []
        },

        {
            type: "ALBUM",
            title: "Colours World",
            tagline: "A world painted through colours.",
            artworks: [
                "assets/images/art 767 (flying dream's).png",
                "assets/images/art 776 (worth for a living).png",
                "assets/images/art 891 (life's is colors).png",
                "assets/images/art 892 (the sky we left behind).png"
            ]
        },

        {
            type: "EP",
            title: "Aurora",
            tagline: "A smaller collection of visual ideas.",
            artworks: []
        }
    ];


    /* =========================================================
       ALL ARTWORKS
       ========================================================= */

    const artworks = [
        {
            image: "assets/images/art 41 (yacho no shiawase).png",
            title: "Yacho No Shiawase",
            category: "illustration"
        },

        {
            image: "assets/images/art 767 (flying dream's).png",
            title: "Flying Dream's",
            category: "illustration"
        },

        {
            image: "assets/images/art 776 (worth for a living).png",
            title: "Worth For A Living",
            category: "character-art"
        },

        {
            image: "assets/images/art 891 (life's is colors).png",
            title: "Life's Is Colors",
            category: "concept-art"
        },

        {
            image: "assets/images/art 892 (the sky we left behind).png",
            title: "The Sky We Left Behind",
            category: "illustration"
        }
    ];


    /* =========================================================
       DOM ELEMENTS
       ========================================================= */

    const projectList =
        document.querySelector("#project-list");

    const artworkGrid =
        document.querySelector("#artwork-grid");

    const artworkCount =
        document.querySelector("#artwork-count");

    const loadMoreButton =
        document.querySelector("#load-more");

    const filterButtons =
        document.querySelectorAll(".gallery-filter");

    const lightbox =
        document.querySelector("#gallery-lightbox");

    const lightboxImage =
        document.querySelector("#lightbox-image");

    const lightboxTitle =
        document.querySelector("#lightbox-title");

    const lightboxCategory =
        document.querySelector("#lightbox-category");

    const lightboxClose =
        document.querySelector("#lightbox-close");

    const lightboxBackdrop =
        document.querySelector(".gallery-lightbox-backdrop");

    const footerYear =
        document.querySelector("#gallery-year");


    /* =========================================================
       STATE
       ========================================================= */

    let currentFilter = "all";

    let currentProject = null;

    let visibleArtworkCount = 9;

    const artworkLoadAmount = 9;


    /* =========================================================
       CATEGORY LABELS
       ========================================================= */

    const categoryLabels = {
        illustration: "Illustration",
        "digital-artwork": "Digital Artwork",
        "character-art": "Character Art",
        anime: "Anime",
        "concept-art": "Concept Art",
        wallpaper: "Wallpaper"
    };


    function getCategoryLabel(category) {
        return categoryLabels[category] || category;
    }


    /* =========================================================
       FILTER ACTIVE STATE
       ========================================================= */

    function clearFilterButtons() {

        filterButtons.forEach((button) => {
            button.classList.remove("active");
        });

    }


    function activateFilterButton(filter) {

        filterButtons.forEach((button) => {

            button.classList.toggle(
                "active",
                button.dataset.filter === filter
            );

        });

    }


    /* =========================================================
       PROJECT BACKGROUND
       ========================================================= */

    function initializeProjectBackground(card, images) {

        if (!card) return;

        const background =
            card.querySelector(".project-background");

        if (!background) return;

        background.innerHTML = "";


        /* No artwork */

        if (!images || images.length === 0) {

            card.classList.add("no-artwork");

            return;
        }


        card.classList.remove("no-artwork");


        /* First image */

        const imageOne =
            document.createElement("img");

        imageOne.className =
            "project-background-image is-active";

        imageOne.src =
            images[0];

        imageOne.alt = "";

        imageOne.setAttribute(
            "aria-hidden",
            "true"
        );

        background.appendChild(imageOne);


        /* Only one artwork */

        if (images.length === 1) {
            return;
        }


        /* Second image */

        const imageTwo =
            document.createElement("img");

        imageTwo.className =
            "project-background-image";

        imageTwo.src =
            images[1];

        imageTwo.alt = "";

        imageTwo.setAttribute(
            "aria-hidden",
            "true"
        );

        background.appendChild(imageTwo);


        let currentImageIndex = 0;

        let activeLayer = 0;


        /* Rotate project artwork */

        setInterval(() => {

            currentImageIndex =
                (currentImageIndex + 1) %
                images.length;


            const nextLayer =
                activeLayer === 0 ? 1 : 0;


            const nextImage =
                nextLayer === 0
                    ? imageOne
                    : imageTwo;


            const currentImage =
                activeLayer === 0
                    ? imageOne
                    : imageTwo;


            nextImage.src =
                images[currentImageIndex];


            nextImage.classList.add(
                "is-active"
            );


            currentImage.classList.remove(
                "is-active"
            );


            activeLayer =
                nextLayer;

        }, 4000);
    }


    /* =========================================================
       RENDER PROJECTS
       ========================================================= */

    function renderProjects() {

        if (!projectList) return;

        projectList.innerHTML = "";


        projects.forEach((project, index) => {

            const card =
                document.createElement("article");

            card.className =
                "project-card";

            card.dataset.projectIndex =
                index;


            card.innerHTML = `
                <div class="project-background"></div>

                <div class="project-overlay"></div>

                <div class="project-content">

                    <span class="project-type">
                        ${project.type}
                    </span>

                    <h3>
                        ${project.title}
                    </h3>

                    <p>
                        ${project.tagline}
                    </p>

                </div>
            `;


            projectList.appendChild(card);


            initializeProjectBackground(
                card,
                project.artworks
            );


            /* Only projects with artwork are clickable */

            if (project.artworks.length > 0) {

                card.addEventListener(
                    "click",
                    () => {

                        openProjectCollection(index);

                    }
                );

            }

        });
    }


    /* =========================================================
       SELECT PROJECT CARD
       ========================================================= */

    function selectProjectCard(projectIndex) {

        const cards =
            projectList.querySelectorAll(
                ".project-card"
            );


        cards.forEach((card, index) => {

            card.classList.toggle(
                "is-selected",
                index === projectIndex
            );

        });

    }


    /* =========================================================
       OPEN PROJECT COLLECTION
       ========================================================= */

    function openProjectCollection(projectIndex) {

        const project =
            projects[projectIndex];

        if (!project) return;


        /* Projects without artwork do nothing */

        if (
            !project.artworks ||
            project.artworks.length === 0
        ) {
            return;
        }


        currentProject =
            projectIndex;

        currentFilter =
            "project";

        visibleArtworkCount =
            project.artworks.length;


        /* Remove category filter highlight */

        clearFilterButtons();


        /* Highlight selected project */

        selectProjectCard(
            projectIndex
        );


        const projectArtworkObjects =
            artworks.filter((artwork) =>
                project.artworks.includes(
                    artwork.image
                )
            );


        renderProjectArtworks(
            projectArtworkObjects
        );


        const artworkPanel =
            document.querySelector(
                ".gallery-artwork-panel"
            );


        if (artworkPanel) {

            artworkPanel.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }


    /* =========================================================
       RENDER PROJECT ARTWORKS
       ========================================================= */

    function renderProjectArtworks(
        projectArtworkObjects
    ) {

        if (!artworkGrid) return;


        artworkGrid.innerHTML = "";


        projectArtworkObjects.forEach(
            (artwork) => {

                const card =
                    createArtworkCard(
                        artwork
                    );

                artworkGrid.appendChild(
                    card
                );

            }
        );


        if (artworkCount) {

            artworkCount.textContent =
                `${projectArtworkObjects.length} artwork`;

        }


        if (loadMoreButton) {

            loadMoreButton.style.display =
                "none";

        }

    }


    /* =========================================================
       CREATE ARTWORK CARD
       ========================================================= */

    function createArtworkCard(artwork) {

        const card =
            document.createElement("article");

        card.className =
            "artwork-card";


        card.innerHTML = `
            <button
                class="artwork-image-button"
                type="button"
                aria-label="Open ${artwork.title}"
            >

                <img
                    src="${artwork.image}"
                    alt="${artwork.title}"
                    loading="lazy"
                >

            </button>

            <div class="artwork-card-info">

                <h3>
                    ${artwork.title}
                </h3>

                <span>
                    ${getCategoryLabel(
                        artwork.category
                    )}
                </span>

            </div>
        `;


        const imageButton =
            card.querySelector(
                ".artwork-image-button"
            );


        if (imageButton) {

            imageButton.addEventListener(
                "click",
                () => {

                    openLightbox(
                        artwork
                    );

                }
            );

        }


        return card;
    }


    /* =========================================================
       FILTER ARTWORKS
       ========================================================= */

    function getFilteredArtworks() {

        if (
            currentFilter === "all"
        ) {
            return artworks;
        }


        return artworks.filter(
            (artwork) =>
                artwork.category ===
                currentFilter
        );
    }


    /* =========================================================
       RENDER NORMAL ARTWORK COLLECTION
       ========================================================= */

    function renderArtworks() {

        if (!artworkGrid) return;


        const filteredArtworks =
            getFilteredArtworks();


        const visibleArtworks =
            filteredArtworks.slice(
                0,
                visibleArtworkCount
            );


        artworkGrid.innerHTML = "";


        visibleArtworks.forEach(
            (artwork) => {

                const card =
                    createArtworkCard(
                        artwork
                    );

                artworkGrid.appendChild(
                    card
                );

            }
        );


        if (artworkCount) {

            artworkCount.textContent =
                `${filteredArtworks.length} artwork`;

        }


        if (loadMoreButton) {

            if (
                visibleArtworkCount <
                filteredArtworks.length
            ) {

                loadMoreButton.style.display =
                    "inline-flex";

            } else {

                loadMoreButton.style.display =
                    "none";

            }

        }

    }


    /* =========================================================
       FILTER BUTTONS
       ========================================================= */

    filterButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    currentProject =
                        null;

                    currentFilter =
                        button.dataset.filter ||
                        "all";


                    visibleArtworkCount =
                        artworkLoadAmount;


                    activateFilterButton(
                        currentFilter
                    );


                    selectProjectCard(
                        -1
                    );


                    renderArtworks();

                }
            );

        }
    );


    /* =========================================================
       LOAD MORE
       ========================================================= */

    if (loadMoreButton) {

        loadMoreButton.addEventListener(
            "click",
            () => {

                visibleArtworkCount +=
                    artworkLoadAmount;


                renderArtworks();

            }
        );

    }


    /* =========================================================
       LIGHTBOX
       ========================================================= */

    function openLightbox(artwork) {

        if (!lightbox) return;


        if (lightboxImage) {

            lightboxImage.src =
                artwork.image;

            lightboxImage.alt =
                artwork.title;

        }


        if (lightboxTitle) {

            lightboxTitle.textContent =
                artwork.title;

        }


        if (lightboxCategory) {

            lightboxCategory.textContent =
                getCategoryLabel(
                    artwork.category
                );

        }


        lightbox.classList.add(
            "is-open"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "lightbox-open"
        );

    }


    function closeLightbox() {

        if (!lightbox) return;


        lightbox.classList.remove(
            "is-open"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "lightbox-open"
        );


        if (lightboxImage) {

            lightboxImage.src = "";

            lightboxImage.alt = "";

        }

    }


    /* Close with X */

    if (lightboxClose) {

        lightboxClose.addEventListener(
            "click",
            closeLightbox
        );

    }


    /* Close by clicking backdrop */

    if (lightboxBackdrop) {

        lightboxBackdrop.addEventListener(
            "click",
            closeLightbox
        );

    }


    /* Close with Escape */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                lightbox &&
                lightbox.classList.contains(
                    "is-open"
                )
            ) {

                closeLightbox();

            }

        }
    );


    /* =========================================================
       FOOTER YEAR
       ========================================================= */

    if (footerYear) {

        footerYear.textContent =
            new Date().getFullYear();

    }


    /* =========================================================
       INITIALIZE
       ========================================================= */

    renderProjects();

    renderArtworks();

});