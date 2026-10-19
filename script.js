document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       MIKAZOART
       MAIN WEBSITE SCRIPT
       ========================================================= */


    /* =========================================================
       ELEMENTS
       ========================================================= */

    const navigationLinks = document.querySelectorAll(
        'header nav a[href^="#"]'
    );

    const portfolioFilters = document.querySelectorAll(
        "#portfolio > div:nth-child(2) a"
    );

    const portfolioCards = document.querySelectorAll(
        "#portfolio article"
    );

    const contactForm = document.querySelector("#contact form");

    const sections = document.querySelectorAll(
        "main > section"
    );


    /* =========================================================
       SMOOTH NAVIGATION
       ========================================================= */

    navigationLinks.forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId =
                link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const targetSection =
                document.querySelector(targetId);

            if (!targetSection) {
                return;
            }

            event.preventDefault();

            targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* =========================================================
       PORTFOLIO FILTER
       ========================================================= */

    portfolioFilters.forEach((filterButton) => {

        filterButton.addEventListener("click", (event) => {

            event.preventDefault();

            const selectedCategory =
                filterButton.textContent
                    .trim()
                    .toLowerCase();

            portfolioFilters.forEach((button) => {

                button.style.color = "";
                button.style.backgroundColor = "";
                button.style.borderColor = "";
                button.setAttribute("aria-pressed", "false");

            });

            filterButton.style.color = "#ffffff";
            filterButton.style.backgroundColor = "#d98ca4";
            filterButton.style.borderColor = "#d98ca4";
            filterButton.setAttribute("aria-pressed", "true");


            portfolioCards.forEach((card) => {

                const categoryElement =
                    card.querySelector(":scope > p");

                if (!categoryElement) {
                    return;
                }

                const cardCategory =
                    categoryElement.textContent
                        .trim()
                        .toLowerCase();

                if (
                    selectedCategory === "all" ||
                    cardCategory === selectedCategory
                ) {

                    card.style.display = "";

                    requestAnimationFrame(() => {

                        card.style.opacity = "1";
                        card.style.transform = "";

                    });

                } else {

                    card.style.opacity = "0";
                    card.style.transform =
                        "translateY(10px)";

                    setTimeout(() => {

                        card.style.display = "none";

                    }, 250);

                }

            });

        });

    });


    /* =========================================================
   HOME — CINEMATIC ARTWORK SHOWCASE
   ========================================================= */

const home = document.querySelector("#home");

if (
    home &&
    typeof MIKAZOART_ARTWORKS !== "undefined" &&
    Array.isArray(MIKAZOART_ARTWORKS)
) {

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

    const artworks = shuffleArray(
    MIKAZOART_ARTWORKS.filter(
        artwork =>
            artwork &&
            artwork.image &&
            artwork.title
    )
);

    const background = home.querySelector(
        ".home-artwork-background"
    );

    const category = home.querySelector(
        ".home-artwork-category"
    );

    const title = home.querySelector(
        ".home-artwork-title"
    );

    const description = home.querySelector(
        ".home-artwork-description"
    );

    const clickArea = home.querySelector(
        ".home-artwork-click"
    );

    const lightbox = home.querySelector(
        ".home-artwork-lightbox"
    );

    const lightboxImage = home.querySelector(
        ".home-lightbox-image"
    );

    const lightboxCategory = home.querySelector(
        ".home-lightbox-category"
    );

    const lightboxTitle = home.querySelector(
        ".home-lightbox-title"
    );

    const lightboxDescription = home.querySelector(
        ".home-lightbox-description"
    );

    const lightboxClose = home.querySelector(
        ".home-lightbox-close"
    );


    if (
        background &&
        category &&
        title &&
        description &&
        clickArea &&
        lightbox &&
        lightboxImage &&
        lightboxCategory &&
        lightboxTitle &&
        lightboxDescription &&
        lightboxClose &&
        artworks.length > 0
    ) {

        let currentIndex = 0;
        let rotationTimer = null;
        let isChanging = false;

        const header = document.querySelector("header");

function updateNavbarContrast(imageSrc) {

    if (!header || !imageSrc) {
        return;
    }

    const image = new Image();

    image.onload = () => {

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
            return;
        }

        canvas.width = 40;
        canvas.height = 40;

        context.drawImage(
            image,
            0,
            0,
            40,
            40
        );

        const pixels = context.getImageData(
            0,
            0,
            40,
            40
        ).data;

        let totalBrightness = 0;
        let pixelCount = 0;

        for (let i = 0; i < pixels.length; i += 4) {

            const red = pixels[i];
            const green = pixels[i + 1];
            const blue = pixels[i + 2];

            const brightness =
                (red * 0.299) +
                (green * 0.587) +
                (blue * 0.114);

            totalBrightness += brightness;
            pixelCount++;
        }

        const averageBrightness =
            totalBrightness / pixelCount;

        if (averageBrightness < 135) {

            header.classList.add("nav-light");
            header.classList.remove("nav-dark");

        } else {

            header.classList.add("nav-dark");
            header.classList.remove("nav-light");

        }
    };

    image.src = imageSrc;
}

        /* =================================================
           PRELOAD NEXT ARTWORK
           ================================================= */

        function preloadArtwork(index) {

            const artwork =
                artworks[
                    (index + artworks.length) %
                    artworks.length
                ];

            if (!artwork || !artwork.image) {
                return;
            }

            const image = new Image();

            image.src = artwork.image;
        }

        
function updateArtworkTextContrast(imageSrc) {
    if (!imageSrc) return;

    const image = new Image();

    image.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", {
            willReadFrequently: true
        });

        if (!context) return;

        canvas.width = 50;
        canvas.height = 50;

        context.drawImage(image, 0, 0, 50, 50);

        const pixels = context.getImageData(
            0, 0, 50, 50
        ).data;

        let totalBrightness = 0;
        let count = 0;

        for (let i = 0; i < pixels.length; i += 4) {
            const brightness =
                pixels[i] * 0.299 +
                pixels[i + 1] * 0.587 +
                pixels[i + 2] * 0.114;

            totalBrightness += brightness;
            count++;
        }

        const averageBrightness = totalBrightness / count;

        home.classList.toggle(
            "artwork-text-dark",
            averageBrightness >= 145
        );

        home.classList.toggle(
            "artwork-text-light",
            averageBrightness < 145
        );
    };

    image.onerror = () => {
        home.classList.remove(
            "artwork-text-dark",
            "artwork-text-light"
        );
    };

    image.src = imageSrc;
}

        /* =================================================
           SHOW ARTWORK
           ================================================= */

        function showArtwork(index, animate = true) {

            if (isChanging && animate) {
                return;
            }

            const artwork =
                artworks[
                    (index + artworks.length) %
                    artworks.length
                ];

            if (!artwork) {
                return;
            }

            currentIndex =
                (index + artworks.length) %
                artworks.length;


            if (animate) {

                isChanging = true;

                home.classList.add("is-changing");

                setTimeout(() => {

                    background.style.backgroundImage =
                        `url("${artwork.image}")`;

                    updateNavbarContrast(artwork.image);

                    category.textContent =
                        artwork.category || "";

                    title.textContent =
                        artwork.title || "";

                    description.textContent =
                        artwork.description || "";

                    home.classList.remove(
                        "is-changing"
                    );

                    setTimeout(() => {

                        isChanging = false;

                    }, 800);

                }, 400);

            } else {

                background.style.backgroundImage =
                    `url("${artwork.image}")`;

                category.textContent =
                    artwork.category || "";

                title.textContent =
                    artwork.title || "";

                description.textContent =
                    artwork.description || "";
            }


            preloadArtwork(
                currentIndex + 1
            );
        }


        /* =================================================
           LIGHTBOX
           ================================================= */

        function openLightbox() {

            const artwork =
                artworks[currentIndex];

            if (!artwork) {
                return;
            }

            lightboxImage.src =
                artwork.image;

            lightboxImage.alt =
                artwork.title || "Artwork";

            lightboxCategory.textContent =
                artwork.category || "";

            lightboxTitle.textContent =
                artwork.title || "";

            lightboxDescription.textContent =
                artwork.description || "";

            lightbox.classList.add(
                "is-open"
            );

            lightbox.setAttribute(
                "aria-hidden",
                "false"
            );

            document.body.style.overflow =
                "hidden";

            stopRotation();
        }


        function closeLightbox() {

            lightbox.classList.remove(
                "is-open"
            );

            lightbox.setAttribute(
                "aria-hidden",
                "true"
            );

            document.body.style.overflow =
                "";

            startRotation();
        }


        /* =================================================
           ROTATION
           ================================================= */

        function startRotation() {

            if (
                rotationTimer ||
                artworks.length <= 1
            ) {
                return;
            }

            rotationTimer = setInterval(() => {

                showArtwork(
                    currentIndex + 1,
                    true
                );

            }, 7000);
        }


        function stopRotation() {

            if (rotationTimer) {

                clearInterval(
                    rotationTimer
                );

                rotationTimer = null;
            }
        }


        /* =================================================
           CLICK EVENTS
           ================================================= */

        clickArea.addEventListener(
            "click",
            openLightbox
        );


        lightboxClose.addEventListener(
            "click",
            closeLightbox
        );


        lightbox.addEventListener(
            "click",
            event => {

                if (
                    event.target === lightbox
                ) {
                    closeLightbox();
                }

            }
        );


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape" &&
                    lightbox.classList.contains(
                        "is-open"
                    )
                ) {
                    closeLightbox();
                }

            }
        );


        /* =================================================
           PAUSE WHEN TAB IS NOT ACTIVE
           ================================================= */

        document.addEventListener(
            "visibilitychange",
            () => {

                if (
                    document.hidden
                ) {
                    stopRotation();

                } else if (
                    !lightbox.classList.contains(
                        "is-open"
                    )
                ) {
                    startRotation();
                }

            }
        );


        /* =================================================
           INITIAL ARTWORK
           ================================================= */

        showArtwork(
            currentIndex,
            false
        );

        startRotation();

    }
}


    /* =========================================================
       LIGHTBOX
       ========================================================= */

    const artworkImages =
        document.querySelectorAll(
            "#portfolio article img"
        );


    let lightbox = null;


    function createLightbox() {

        if (lightbox) {
            return;
        }


        lightbox =
            document.createElement("div");

        lightbox.className =
            "artwork-lightbox";


        lightbox.innerHTML = `
            <button
                class="artwork-lightbox__close"
                type="button"
                aria-label="Close artwork"
            >
                &times;
            </button>

            <div class="artwork-lightbox__content">

                <img
                    class="artwork-lightbox__image"
                    src=""
                    alt=""
                >

                <div class="artwork-lightbox__caption">

                    <h3></h3>

                    <p></p>

                </div>

            </div>
        `;


        document.body.appendChild(
            lightbox
        );


        const closeButton =
            lightbox.querySelector(
                ".artwork-lightbox__close"
            );


        closeButton.addEventListener(
            "click",
            closeLightbox
        );


        lightbox.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    lightbox
                ) {

                    closeLightbox();

                }

            }
        );


        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Escape"
                ) {

                    closeLightbox();

                }

            }
        );

    }


    function openLightbox(
        image,
        title = "",
        category = ""
    ) {

        createLightbox();


        const lightboxImage =
            lightbox.querySelector(
                ".artwork-lightbox__image"
            );


        const lightboxTitle =
            lightbox.querySelector(
                ".artwork-lightbox__caption h3"
            );


        const lightboxCategory =
            lightbox.querySelector(
                ".artwork-lightbox__caption p"
            );


        lightboxImage.src =
            image.src;

        lightboxImage.alt =
            image.alt;

        lightboxTitle.textContent =
            title;

        lightboxCategory.textContent =
            category;


        lightbox.classList.add(
            "is-open"
        );


        document.body.style.overflow =
            "hidden";

    }


    function closeLightbox() {

        if (!lightbox) {
            return;
        }


        lightbox.classList.remove(
            "is-open"
        );


        document.body.style.overflow =
            "";

    }


    artworkImages.forEach((image) => {

        image.style.cursor =
            "zoom-in";


        image.addEventListener(
            "click",
            () => {

                const article =
                    image.closest("article");


                let title =
                    image.alt;

                let category = "";


                if (article) {

                    const titleElement =
                        article.querySelector(
                            "h3"
                        );


                    const categoryElement =
                        article.querySelector(
                            ":scope > p"
                        );


                    if (titleElement) {

                        title =
                            titleElement
                                .textContent
                                .trim();

                    }


                    if (categoryElement) {

                        category =
                            categoryElement
                                .textContent
                                .trim();

                    }

                }


                openLightbox(
                    image,
                    title,
                    category
                );

            }
        );

    });


    /* =========================================================
       CONTACT FORM
       ========================================================= */

    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            (event) => {

                const nameInput =
                    document.querySelector(
                        "#name"
                    );


                const emailInput =
                    document.querySelector(
                        "#email"
                    );


                const messageInput =
                    document.querySelector(
                        "#message"
                    );


                const name =
                    nameInput?.value.trim();

                const email =
                    emailInput?.value.trim();

                const message =
                    messageInput?.value.trim();


                if (
                    !name ||
                    !email ||
                    !message
                ) {

                    event.preventDefault();

                    showNotification(
                        "Please complete all fields.",
                        "error"
                    );

                    return;

                }


                if (
                    !isValidEmail(email)
                ) {

                    event.preventDefault();

                    showNotification(
                        "Please enter a valid email address.",
                        "error"
                    );

                    return;

                }

            }
        );

    }


    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);

    }


    /* =========================================================
       NOTIFICATION
       ========================================================= */

    let notificationTimeout = null;


    function showNotification(
        message,
        type = "success"
    ) {

        let notification =
            document.querySelector(
                ".site-notification"
            );


        if (!notification) {

            notification =
                document.createElement("div");

            notification.className =
                "site-notification";

            document.body.appendChild(
                notification
            );

        }


        notification.textContent =
            message;


        notification.classList.remove(
            "is-success",
            "is-error",
            "is-visible"
        );


        notification.classList.add(
            type === "error"
                ? "is-error"
                : "is-success"
        );


        requestAnimationFrame(() => {

            notification.classList.add(
                "is-visible"
            );

        });


        clearTimeout(
            notificationTimeout
        );


        notificationTimeout =
            setTimeout(() => {

                notification.classList.remove(
                    "is-visible"
                );

            }, 3500);

    }


    /* =========================================================
       ACTIVE NAVIGATION
       ========================================================= */

    const mainNavigationLinks =
        document.querySelectorAll(
            'header nav > div a[href^="#"]'
        );


    function updateActiveNavigation() {

        let currentSection = "";


        sections.forEach((section) => {

            const sectionTop =
                section.offsetTop - 180;


            if (
                window.scrollY >=
                sectionTop
            ) {

                currentSection =
                    section.getAttribute("id");

            }

        });


        mainNavigationLinks.forEach(
            (link) => {

                const linkTarget =
                    link.getAttribute("href");


                if (
                    linkTarget ===
                    `#${currentSection}`
                ) {

                    link.classList.add(
                        "is-active"
                    );

                } else {

                    link.classList.remove(
                        "is-active"
                    );

                }

            }
        );

    }


    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        { passive: true }
    );


    updateActiveNavigation();


    /* =========================================================
       SCROLL REVEAL
       ========================================================= */

    const revealElements =
        document.querySelectorAll(
            "#about > div, " +
            "#portfolio > div, " +
            "#portfolio article, " +
            "#contact > div"
        );


    revealElements.forEach(
        (element) => {

            element.classList.add(
                "scroll-reveal"
            );

        }
    );


    if (
        "IntersectionObserver" in window
    ) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                !entry.isIntersecting
                            ) {

                                return;

                            }


                            entry.target.classList.add(
                                "is-visible"
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(
            (element) => {

                revealObserver.observe(
                    element
                );

            }
        );

    } else {

        revealElements.forEach(
            (element) => {

                element.classList.add(
                    "is-visible"
                );

            }
        );

    }


    /* =========================================================
       FOOTER YEAR
       ========================================================= */

    const footerYear =
        document.querySelector(
            "footer > div:last-child p"
        );


    if (footerYear) {

        footerYear.innerHTML =
            `&copy; ${new Date().getFullYear()} MIKAZOART. All rights reserved.`;

    }


    /* =========================================================
       ACCESSIBLE PORTFOLIO CARDS
       ========================================================= */

    portfolioCards.forEach((card) => {

        const image =
            card.querySelector("img");


        if (!image) {
            return;
        }


        card.setAttribute(
            "tabindex",
            "0"
        );


        card.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    image.click();

                }

            }
        );

    });


    updateActiveNavigation();

});