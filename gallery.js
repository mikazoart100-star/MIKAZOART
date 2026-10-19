document.addEventListener("DOMContentLoaded", () => {

        /* =========================================================
       SHUFFLE ARTWORKS
       ========================================================= */

    function shuffleArray(array) {
        const shuffled = [...array];

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [shuffled[i], shuffled[j]] = [
                shuffled[j],
                shuffled[i]
            ];
        }

        return shuffled;
    }

    /* =========================================================
       PROJECT DEFINITIONS
       ========================================================= */

    const projectDefinitions = [
        {
            type: "ALBUM",
            title: "Blossom",
            tagline: "A collection of visual stories."
        },
        {
            type: "ALBUM",
            title: "Fantasy",
            tagline: "A journey through imagination."
        },
        {
            type: "ALBUM",
            title: "Colours World",
            tagline: "A world painted through colours."
        },
        {
            type: "EP",
            title: "Aurora",
            tagline: "A smaller collection of visual ideas."
        }
    ];


    /* =========================================================
       ARTWORK DATA
       ========================================================= */

    const rawArtworks =
        typeof MIKAZOART_ARTWORKS !== "undefined" &&
        Array.isArray(MIKAZOART_ARTWORKS)
            ? MIKAZOART_ARTWORKS
            : [];


    const artworks = rawArtworks
        .filter((artwork) => {

            if (!artwork || !artwork.title) {
                return false;
            }

            const hasImage =
                typeof artwork.image === "string" &&
                artwork.image.trim() !== "";

            const hasImages =
                Array.isArray(artwork.images) &&
                artwork.images.length > 0;

            return hasImage || hasImages;
        })
        .map((artwork) => {

            let imageList = [];

            if (
                Array.isArray(artwork.images) &&
                artwork.images.length > 0
            ) {
                imageList = artwork.images.filter(
                    (image) =>
                        typeof image === "string" &&
                        image.trim() !== ""
                );
            }

            if (
                imageList.length === 0 &&
                typeof artwork.image === "string" &&
                artwork.image.trim() !== ""
            ) {
                imageList = [artwork.image];
            }

            return {
                id: artwork.id,
                title: artwork.title,
                category: artwork.category || "Illustration",
                type: artwork.type || "artwork",
                image: imageList[0] || "",
                images: imageList,
                description: artwork.description || "",
                collection: artwork.collection || null
            };
        });


    /* =========================================================
       PROJECTS
       ========================================================= */

    const projects = projectDefinitions.map((definition) => {

        return {
            type: definition.type,
            title: definition.title,
            tagline: definition.tagline,

            artworks: artworks.filter(
                (artwork) =>
                    artwork.collection === definition.title
            )
        };
    });


    /* =========================================================
       DOM
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


    /* =========================================================
       LIGHTBOX DOM
       ========================================================= */

    const lightbox =
        document.querySelector("#gallery-lightbox");

    const lightboxImage =
        document.querySelector("#lightbox-image");

    const lightboxTitle =
        document.querySelector("#lightbox-title");

    const lightboxCategory =
        document.querySelector("#lightbox-category");

    const lightboxCollection =
        document.querySelector("#lightbox-collection");

    const lightboxClose =
        document.querySelector("#lightbox-close");

    const lightboxBackdrop =
        document.querySelector(".gallery-lightbox-backdrop");


    /* =========================================================
       GENERAL STATE
       ========================================================= */

    let currentFilter = "all";

    let currentProject = null;

    let visibleArtworkCount = 9;

    const artworkLoadAmount = 9;


    /* =========================================================
       LIGHTBOX STATE
       ========================================================= */

    let currentLightboxArtwork = null;

    let currentLightboxImages = [];

    let currentLightboxIndex = 0;

    let lightboxPreviousButton = null;

    let lightboxNextButton = null;

    let lightboxCounter = null;

    let lightboxVersionLabel = null;

    let lightboxFullscreenButton = null;

    let lightboxUiHideTimer = null;

    let lightboxTouchStartX = 0;

    let lightboxTouchStartY = 0;


    /* =========================================================
       CATEGORY
       ========================================================= */

    function getCategoryLabel(category) {

        if (!category) {
            return "Artwork";
        }

        return category;
    }


    /* =========================================================
       VERSION LABEL
       ========================================================= */

    function getVersionLabel(index) {

        if (index === 0) {
            return "Original";
        }

        return `${index + 1}nd version`;
    }


    /* =========================================================
       FULLSCREEN DETECTION
       ========================================================= */

    function isLightboxFullscreen() {

        return (
            document.fullscreenElement === lightbox ||
            document.webkitFullscreenElement === lightbox
        );
    }


    /* =========================================================
       CLEAR UI TIMER
       ========================================================= */

    function clearLightboxUiTimer() {

        if (lightboxUiHideTimer) {

            clearTimeout(lightboxUiHideTimer);

            lightboxUiHideTimer = null;
        }
    }


    /* =========================================================
       SHOW LIGHTBOX UI
       ========================================================= */

    function showLightboxUI() {

        if (!lightbox) {
            return;
        }

        lightbox.classList.remove(
            "lightbox-ui-hidden"
        );

        clearLightboxUiTimer();


        /*
         * UI auto-hide is ONLY used
         * in real fullscreen mode.
         */

        if (!isLightboxFullscreen()) {
            return;
        }


        lightboxUiHideTimer = setTimeout(() => {

            if (
                isLightboxFullscreen() &&
                lightbox.classList.contains("is-open")
            ) {

                lightbox.classList.add(
                    "lightbox-ui-hidden"
                );
            }

        }, 3000);
    }


    /* =========================================================
       UPDATE FULLSCREEN BUTTON
       ========================================================= */

    function updateFullscreenButton() {

        if (!lightboxFullscreenButton) {
            return;
        }


        if (isLightboxFullscreen()) {

            lightboxFullscreenButton.innerHTML =
                '<i class="fa-solid fa-compress"></i>';

            lightboxFullscreenButton.setAttribute(
                "aria-label",
                "Exit fullscreen"
            );

            lightboxFullscreenButton.setAttribute(
                "title",
                "Exit fullscreen"
            );

        } else {

            lightboxFullscreenButton.innerHTML =
                '<i class="fa-solid fa-expand"></i>';

            lightboxFullscreenButton.setAttribute(
                "aria-label",
                "Enter fullscreen"
            );

            lightboxFullscreenButton.setAttribute(
                "title",
                "Fullscreen"
            );
        }
    }


    /* =========================================================
       ENTER / EXIT FULLSCREEN
       ========================================================= */

    function toggleFullscreen() {

        if (!lightbox) {
            return;
        }


        /*
         * EXIT
         */

        if (isLightboxFullscreen()) {

            const exitFullscreen =
                document.exitFullscreen ||
                document.webkitExitFullscreen ||
                document.msExitFullscreen;


            if (exitFullscreen) {

                try {

                    const result =
                        exitFullscreen.call(document);

                    if (
                        result &&
                        typeof result.catch === "function"
                    ) {
                        result.catch(() => {});
                    }

                } catch (error) {
                    /* Ignore browser fullscreen errors. */
                }
            }

            return;
        }


        /*
         * ENTER
         */

        const requestFullscreen =
            lightbox.requestFullscreen ||
            lightbox.webkitRequestFullscreen ||
            lightbox.msRequestFullscreen;


        if (!requestFullscreen) {
            return;
        }


        try {

            const result =
                requestFullscreen.call(lightbox);


            if (
                result &&
                typeof result.then === "function"
            ) {

                result
                    .then(() => {

                        updateFullscreenButton();

                        showLightboxUI();

                    })
                    .catch(() => {

                        updateFullscreenButton();
                    });

            } else {

                updateFullscreenButton();

                showLightboxUI();
            }

        } catch (error) {

            updateFullscreenButton();
        }
    }


    /* =========================================================
       CREATE LIGHTBOX CONTROLS
       ========================================================= */

    function createLightboxControls() {

        if (!lightbox) {
            return;
        }


        const content =
            lightbox.querySelector(
                ".gallery-lightbox-content"
            );


        if (!content) {
            return;
        }


        /*
         * PREVIOUS
         */

        lightboxPreviousButton =
            document.createElement("button");

        lightboxPreviousButton.type =
            "button";

        lightboxPreviousButton.className =
            "gallery-lightbox-nav gallery-lightbox-prev";

        lightboxPreviousButton.setAttribute(
            "aria-label",
            "Previous artwork version"
        );

        lightboxPreviousButton.innerHTML =
            '<i class="fa-solid fa-chevron-left"></i>';


        /*
         * NEXT
         */

        lightboxNextButton =
            document.createElement("button");

        lightboxNextButton.type =
            "button";

        lightboxNextButton.className =
            "gallery-lightbox-nav gallery-lightbox-next";

        lightboxNextButton.setAttribute(
            "aria-label",
            "Next artwork version"
        );

        lightboxNextButton.innerHTML =
            '<i class="fa-solid fa-chevron-right"></i>';


        /*
         * COUNTER
         */

        lightboxCounter =
            document.createElement("div");

        lightboxCounter.className =
            "gallery-lightbox-counter";


        /*
         * VERSION
         */

        lightboxVersionLabel =
            document.createElement("div");

        lightboxVersionLabel.className =
            "gallery-lightbox-version";


        /*
         * FULLSCREEN
         */

        lightboxFullscreenButton =
            document.createElement("button");

        lightboxFullscreenButton.type =
            "button";

        lightboxFullscreenButton.className =
            "gallery-lightbox-fullscreen";

        lightboxFullscreenButton.innerHTML =
            '<i class="fa-solid fa-expand"></i>';

        lightboxFullscreenButton.setAttribute(
            "aria-label",
            "Enter fullscreen"
        );

        lightboxFullscreenButton.setAttribute(
            "title",
            "Fullscreen"
        );


        /*
         * ADD TO LIGHTBOX
         */

        content.appendChild(
            lightboxPreviousButton
        );

        content.appendChild(
            lightboxNextButton
        );

        content.appendChild(
            lightboxCounter
        );

        content.appendChild(
            lightboxVersionLabel
        );

        content.appendChild(
            lightboxFullscreenButton
        );


        /*
         * PREVIOUS CLICK
         */

        lightboxPreviousButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                showPreviousImage();

                showLightboxUI();
            }
        );


        /*
         * NEXT CLICK
         */

        lightboxNextButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                showNextImage();

                showLightboxUI();
            }
        );


        /*
         * FULLSCREEN CLICK
         */

        lightboxFullscreenButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                toggleFullscreen();
            }
        );


        updateFullscreenButton();
    }


    /* =========================================================
       UPDATE LIGHTBOX CONTROLS
       ========================================================= */

    function updateLightboxControls() {

        if (
            !lightboxPreviousButton ||
            !lightboxNextButton ||
            !lightboxCounter ||
            !lightboxVersionLabel
        ) {
            return;
        }


        const total =
            currentLightboxImages.length;


        if (total <= 1) {

            lightboxPreviousButton.style.display =
                "none";

            lightboxNextButton.style.display =
                "none";

            lightboxCounter.style.display =
                "none";

            lightboxVersionLabel.style.display =
                "none";

            return;
        }


        lightboxPreviousButton.style.display =
            "flex";

        lightboxNextButton.style.display =
            "flex";

        lightboxCounter.style.display =
            "block";

        lightboxVersionLabel.style.display =
            "block";


        lightboxCounter.textContent =
            `Version ${currentLightboxIndex + 1} / ${total}`;


        lightboxVersionLabel.textContent =
            getVersionLabel(
                currentLightboxIndex
            );
    }


    /* =========================================================
       SHOW IMAGE
       ========================================================= */

    function showLightboxImage(index) {

        if (
            !currentLightboxImages.length
        ) {
            return;
        }


        const total =
            currentLightboxImages.length;


        currentLightboxIndex =
            (index + total) % total;


        const image =
            currentLightboxImages[
                currentLightboxIndex
            ];


        if (lightboxImage) {

            lightboxImage.src =
                image;

            lightboxImage.alt =
                currentLightboxArtwork
                    ? currentLightboxArtwork.title
                    : "Artwork";
        }


        updateLightboxControls();
    }


    /* =========================================================
       NEXT
       ========================================================= */

    function showNextImage() {

        if (
            currentLightboxImages.length <= 1
        ) {
            return;
        }


        showLightboxImage(
            currentLightboxIndex + 1
        );
    }


    /* =========================================================
       PREVIOUS
       ========================================================= */

    function showPreviousImage() {

        if (
            currentLightboxImages.length <= 1
        ) {
            return;
        }


        showLightboxImage(
            currentLightboxIndex - 1
        );
    }


    /* =========================================================
       OPEN LIGHTBOX
       ========================================================= */

    function openLightbox(artwork) {

        if (
            !lightbox ||
            !artwork
        ) {
            return;
        }


        currentLightboxArtwork =
            artwork;


        /*
         * MULTI-VERSION
         */

        if (
            Array.isArray(artwork.images) &&
            artwork.images.length
        ) {

            currentLightboxImages =
                artwork.images.filter(
                    (image) =>
                        typeof image === "string" &&
                        image.trim() !== ""
                );

        } else {

            /*
             * NORMAL ARTWORK
             */

            currentLightboxImages =
                artwork.image
                    ? [artwork.image]
                    : [];
        }


        if (!currentLightboxImages.length) {
            return;
        }


        currentLightboxIndex = 0;


        /*
         * TITLE
         */

        if (lightboxTitle) {

            lightboxTitle.textContent =
                artwork.title || "Artwork";
        }


        /*
         * CATEGORY
         */

        if (lightboxCategory) {

            lightboxCategory.textContent =
                getCategoryLabel(
                    artwork.category
                );
        }


        /*
         * COLLECTION
         */

        if (lightboxCollection) {

            if (artwork.collection) {

                lightboxCollection.textContent =
                    artwork.collection;

                lightboxCollection.style.display =
                    "block";

            } else {

                lightboxCollection.textContent =
                    "";

                lightboxCollection.style.display =
                    "none";
            }
        }


        /*
         * IMPORTANT:
         * Every time a new artwork is opened,
         * it starts outside fullscreen.
         */

        clearLightboxUiTimer();

        lightbox.classList.remove(
            "lightbox-ui-hidden"
        );


        showLightboxImage(0);


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


        document.body.style.overflow =
            "hidden";


        updateFullscreenButton();
    }


    /* =========================================================
       CLOSE LIGHTBOX
       ========================================================= */

    function closeLightbox() {

        if (!lightbox) {
            return;
        }


        clearLightboxUiTimer();


        /*
         * If fullscreen is active,
         * leave fullscreen first.
         */

        if (isLightboxFullscreen()) {

            const exitFullscreen =
                document.exitFullscreen ||
                document.webkitExitFullscreen ||
                document.msExitFullscreen;


            if (exitFullscreen) {

                try {

                    const result =
                        exitFullscreen.call(document);

                    if (
                        result &&
                        typeof result.catch === "function"
                    ) {
                        result.catch(() => {});
                    }

                } catch (error) {
                    /* Ignore fullscreen errors. */
                }
            }
        }


        lightbox.classList.remove(
            "is-open"
        );

        lightbox.classList.remove(
            "lightbox-ui-hidden"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "lightbox-open"
        );


        document.body.style.overflow =
            "";


        currentLightboxArtwork =
            null;

        currentLightboxImages =
            [];

        currentLightboxIndex =
            0;


        updateFullscreenButton();
    }


    /* =========================================================
       FULLSCREEN CHANGE
       ========================================================= */

    function handleFullscreenChange() {

        updateFullscreenButton();


        if (!lightbox) {
            return;
        }


        if (
            !lightbox.classList.contains("is-open")
        ) {
            return;
        }


        if (isLightboxFullscreen()) {

            showLightboxUI();

        } else {

            clearLightboxUiTimer();

            lightbox.classList.remove(
                "lightbox-ui-hidden"
            );
        }
    }


    document.addEventListener(
        "fullscreenchange",
        handleFullscreenChange
    );


    document.addEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
    );


    /* =========================================================
       LIGHTBOX MOUSE ACTIVITY
       ========================================================= */

    if (lightbox) {

        lightbox.addEventListener(
            "mousemove",
            () => {

                if (isLightboxFullscreen()) {
                    showLightboxUI();
                }
            }
        );


        lightbox.addEventListener(
            "pointermove",
            () => {

                if (isLightboxFullscreen()) {
                    showLightboxUI();
                }
            }
        );


        /*
         * TOUCH START
         *
         * Also stores the starting point
         * for swipe navigation.
         */

        lightbox.addEventListener(
            "touchstart",
            (event) => {

                showLightboxUI();


                if (
                    event.touches.length !== 1
                ) {
                    return;
                }


                lightboxTouchStartX =
                    event.touches[0].clientX;

                lightboxTouchStartY =
                    event.touches[0].clientY;
            },
            {
                passive: true
            }
        );


        /*
         * TOUCH END
         */

        lightbox.addEventListener(
            "touchend",
            (event) => {

                if (
                    event.changedTouches.length !== 1
                ) {
                    return;
                }


                const endX =
                    event.changedTouches[0].clientX;

                const endY =
                    event.changedTouches[0].clientY;


                const deltaX =
                    endX - lightboxTouchStartX;

                const deltaY =
                    endY - lightboxTouchStartY;


                /*
                 * Only horizontal swipes.
                 */

                if (
                    Math.abs(deltaX) <=
                    Math.abs(deltaY)
                ) {
                    return;
                }


                /*
                 * Minimum swipe distance.
                 */

                if (
                    Math.abs(deltaX) < 50
                ) {
                    return;
                }


                if (deltaX < 0) {

                    showNextImage();

                } else {

                    showPreviousImage();
                }


                showLightboxUI();
            },
            {
                passive: true
            }
        );
    }


    /* =========================================================
       CLOSE BUTTON
       ========================================================= */

    if (lightboxClose) {

        lightboxClose.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                closeLightbox();
            }
        );
    }


    /* =========================================================
       BACKDROP
       ========================================================= */

    if (lightboxBackdrop) {

        lightboxBackdrop.addEventListener(
            "click",
            () => {

                closeLightbox();
            }
        );
    }


    /* =========================================================
       KEYBOARD
       ========================================================= */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                !lightbox ||
                !lightbox.classList.contains("is-open")
            ) {
                return;
            }


            /*
             * ESC
             */

            if (event.key === "Escape") {

                /*
                 * Browser exits fullscreen itself.
                 * fullscreenchange will handle the UI.
                 */

                if (isLightboxFullscreen()) {
                    return;
                }


                closeLightbox();

                return;
            }


            /*
             * LEFT
             */

            if (event.key === "ArrowLeft") {

                showPreviousImage();

                showLightboxUI();

                return;
            }


            /*
             * RIGHT
             */

            if (event.key === "ArrowRight") {

                showNextImage();

                showLightboxUI();

                return;
            }


            /*
             * F
             */

            if (
                event.key.toLowerCase() === "f"
            ) {

                event.preventDefault();

                toggleFullscreen();
            }
        }
    );


    /* =========================================================
       CREATE ARTWORK CARD
       ========================================================= */

    function createArtworkCard(artwork) {

        const card =
            document.createElement("article");


        card.className =
            "artwork-card";


        const hasCarousel =
            Array.isArray(artwork.images) &&
            artwork.images.length > 1;


        card.innerHTML = `
            <button
                type="button"
                class="artwork-image-button"
                aria-label="Open ${artwork.title}"
            >
                <img
                    src="${artwork.image}"
                    alt="${artwork.title}"
                    loading="lazy"
                >

                ${
                    hasCarousel
                        ? `
                            <span class="artwork-carousel-indicator">
                                <i class="fa-solid fa-images"></i>
                                ${artwork.images.length} Versions
                            </span>
                        `
                        : ""
                }
            </button>

            <div class="artwork-card-info">
                <h3>${artwork.title}</h3>
                <span>
                    ${getCategoryLabel(artwork.category)}
                </span>
            </div>
        `;


        const button =
            card.querySelector(
                ".artwork-image-button"
            );


        if (button) {

            button.addEventListener(
                "click",
                () => {

                    openLightbox(artwork);
                }
            );
        }


        return card;
    }


    /* =========================================================
       FILTER
       ========================================================= */

    function getFilteredArtworks() {

        if (currentFilter === "all") {
            return artworks;
        }


        return artworks.filter(
            (artwork) => {

                const category =
                    String(
                        artwork.category || ""
                    )
                        .toLowerCase()
                        .replace(/\s+/g, "-");


                return (
                    category === currentFilter
                );
            }
        );
    }


    /* =========================================================
       RENDER ARTWORKS
       ========================================================= */

    function renderArtworks() {

        if (!artworkGrid) {
            return;
        }


        const filtered =
            getFilteredArtworks();


        const visible =
            filtered.slice(
                0,
                visibleArtworkCount
            );


        artworkGrid.innerHTML = "";


        visible.forEach(
            (artwork) => {

                artworkGrid.appendChild(
                    createArtworkCard(artwork)
                );
            }
        );


        if (artworkCount) {

            artworkCount.textContent =
                `${filtered.length} ${
                    filtered.length === 1
                        ? "artwork"
                        : "artworks"
                }`;
        }


        if (loadMoreButton) {

            loadMoreButton.style.display =
                visibleArtworkCount <
                filtered.length
                    ? "inline-flex"
                    : "none";
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

                    filterButtons.forEach(
                        (item) => {

                            item.classList.remove(
                                "active"
                            );
                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    currentProject = null;

                    currentFilter =
                        button.dataset.filter ||
                        "all";


                    visibleArtworkCount =
                        artworkLoadAmount;


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
       PROJECT BACKGROUND
       ========================================================= */

    function initializeProjectBackground(
        card,
        artworkObjects
    ) {

        const background =
            card.querySelector(
                ".project-background"
            );


        if (!background) {
            return;
        }


        if (
            !artworkObjects ||
            artworkObjects.length === 0
        ) {
            return;
        }


        const images =
            artworkObjects
                .map(
                    (artwork) =>
                        artwork.image
                )
                .filter(Boolean);


        if (!images.length) {
            return;
        }


        background.innerHTML = "";


        const first =
            document.createElement("img");


        first.className =
            "project-background-image is-active";

        first.src =
            images[0];

        first.alt = "";


        background.appendChild(first);


        if (images.length === 1) {
            return;
        }


        const second =
            document.createElement("img");


        second.className =
            "project-background-image";

        second.src =
            images[1];

        second.alt = "";


        background.appendChild(second);


        let index = 0;

        let activeLayer = 0;


        setInterval(
            () => {

                index =
                    (
                        index + 1
                    ) % images.length;


                const nextLayer =
                    activeLayer === 0
                        ? 1
                        : 0;


                const current =
                    activeLayer === 0
                        ? first
                        : second;


                const next =
                    nextLayer === 0
                        ? first
                        : second;


                next.src =
                    images[index];

                next.classList.add(
                    "is-active"
                );

                current.classList.remove(
                    "is-active"
                );


                activeLayer =
                    nextLayer;

            },
            4000
        );
    }


    /* =========================================================
       RENDER PROJECTS
       ========================================================= */

    function renderProjects() {

        if (!projectList) {
            return;
        }


        projectList.innerHTML = "";


        projects.forEach(
            (project, index) => {

                const card =
                    document.createElement("article");


                card.className =
                    "project-card";


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


                card.addEventListener(
                    "click",
                    () => {

                        openProjectCollection(
                            index
                        );
                    }
                );
            }
        );
    }


    /* =========================================================
       PROJECT COLLECTION
       ========================================================= */

    function openProjectCollection(index) {

    const project =
        projects[index];


    if (!project) {
        return;
    }


    currentProject =
        index;


    currentFilter =
        "project";


    if (artworkGrid) {

        artworkGrid.innerHTML = "";


        project.artworks.forEach(
            (artwork) => {

                artworkGrid.appendChild(
                    createArtworkCard(artwork)
                );
            }
        );
    }


    if (artworkCount) {

        artworkCount.textContent =
            `${project.artworks.length} ${
                project.artworks.length === 1
                    ? "artwork"
                    : "artworks"
            }`;
    }


    if (loadMoreButton) {

        loadMoreButton.style.display =
            "none";
    }


    /*
     * Automatically scroll to the artwork section
     * after the selected collection has been rendered.
     */
    if (artworkGrid) {

        requestAnimationFrame(() => {

            artworkGrid.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });
    }
}


    /* =========================================================
       GALLERY SHOWCASE
       ========================================================= */

    function initializeGalleryShowcase() {

        const showcase =
            document.querySelector(
                ".gallery-art-showcase"
            );


        if (!showcase) {
            return;
        }


        const background =
            showcase.querySelector(
                ".gallery-art-background"
            );

        const category =
            showcase.querySelector(
                ".gallery-art-category"
            );

        const title =
            showcase.querySelector(
                ".gallery-art-title"
            );

        const description =
            showcase.querySelector(
                ".gallery-art-description p"
            );

        const clickArea =
            showcase.querySelector(
                ".gallery-art-click"
            );


        if (
            !background ||
            !category ||
            !title ||
            !description ||
            !clickArea
        ) {
            return;
        }


       const showcaseArtworks = shuffleArray(
    artworks.filter(
        artwork => artwork.image
    )
);


        if (!showcaseArtworks.length) {
            return;
        }


       
let currentIndex = 0;


function updateShowcaseTextContrast(imageSrc) {

    const image = new Image();

    image.onload = () => {

        const canvas = document.createElement("canvas");
        canvas.width = 40;
        canvas.height = 40;

        const context = canvas.getContext("2d");

        if (!context) return;

        try {

            context.drawImage(image, 0, 0, 40, 40);

            const pixels = context.getImageData(
                0, 0, 40, 40
            ).data;

            let totalBrightness = 0;
            let count = 0;

            for (let i = 0; i < pixels.length; i += 4) {

                totalBrightness +=
                    pixels[i] * 0.299 +
                    pixels[i + 1] * 0.587 +
                    pixels[i + 2] * 0.114;

                count++;
            }

            const averageBrightness =
                totalBrightness / count;

            const isBright = averageBrightness >= 145;

            showcase.classList.toggle(
                "artwork-text-dark",
                isBright
            );

            showcase.classList.toggle(
                "artwork-text-light",
                !isBright
            );

        } catch (error) {

            showcase.classList.remove(
                "artwork-text-dark",
                "artwork-text-light"
            );
        }
    };

    image.onerror = () => {

        showcase.classList.remove(
            "artwork-text-dark",
            "artwork-text-light"
        );
    };

    image.src = imageSrc;
}


function showArtwork(index) {

    currentIndex =
        (
            index +
            showcaseArtworks.length
        ) %
        showcaseArtworks.length;

    const artwork =
        showcaseArtworks[currentIndex];

    background.style.backgroundImage =
        `url("${artwork.image}")`;

    category.textContent =
        getCategoryLabel(artwork.category);

    title.textContent =
        artwork.title;

    description.textContent =
        artwork.description || "";

    updateShowcaseTextContrast(artwork.image);
}



        clickArea.addEventListener(
            "click",
            () => {

                openLightbox(
                    showcaseArtworks[currentIndex]
                );
            }
        );


        showArtwork(0);


        if (showcaseArtworks.length > 1) {

            setInterval(
                () => {

                    showArtwork(
                        currentIndex + 1
                    );

                },
                7000
            );
        }
    }


    /* =========================================================
       INITIALIZE
       ========================================================= */

    createLightboxControls();

    renderProjects();

    renderArtworks();

    initializeGalleryShowcase();

});