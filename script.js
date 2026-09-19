document.addEventListener("DOMContentLoaded", () => {
    /* =========================================================
       MIKAZOART
       MAIN WEBSITE SCRIPT
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
            const targetId = link.getAttribute("href");

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
            });

            filterButton.style.color = "#ffffff";
            filterButton.style.backgroundColor = "#d98ca4";
            filterButton.style.borderColor = "#d98ca4";

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
       CINEMATIC HOME SHOWCASE
       ========================================================= */

    function createCinematicShowcase(home) {
    /* =====================================================
       MIKAZOART CINEMATIC ARTWORK ENGINE
       ===================================================== */

    if (
        typeof MIKAZOART_ARTWORKS === "undefined" ||
        !Array.isArray(MIKAZOART_ARTWORKS) ||
        MIKAZOART_ARTWORKS.length === 0
    ) {
        return;
    }

    const featuredImage =
        home.querySelector("img");

    if (!featuredImage) {
        return;
    }

    /*
     * Seluruh artwork berasal dari master collection.
     *
     * Tidak ada batas 5 / 6 / 10 artwork.
     */

    const artworkCollection =
        MIKAZOART_ARTWORKS.filter(
            (artwork) =>
                artwork &&
                artwork.image
        );

    if (artworkCollection.length < 2) {
        return;
    }

    /* =====================================================
       INITIAL ARTWORK
       ===================================================== */

    let currentIndex = 0;

    /*
     * Kalau gambar Featured yang ada di HTML
     * ditemukan dalam collection, gunakan index-nya.
     */

    const featuredIndex =
        artworkCollection.findIndex(
            (artwork) =>
                featuredImage.src.endsWith(
                    artwork.image
                )
        );

    if (featuredIndex >= 0) {
        currentIndex = featuredIndex;
    }

    const firstArtwork =
        artworkCollection[currentIndex];

    featuredImage.src =
        firstArtwork.image;

    featuredImage.alt =
        firstArtwork.title || "MIKAZOART Artwork";

    /* =====================================================
       CINEMATIC WRAPPER
       ===================================================== */

    const imageWrapper =
        featuredImage.parentElement;

    if (!imageWrapper) {
        return;
    }

    imageWrapper.classList.add(
        "cinematic-showcase"
    );

    featuredImage.classList.add(
        "cinematic-showcase__image"
    );

    /* =====================================================
       ATMOSPHERE
       ===================================================== */

    const atmosphere =
        document.createElement("div");

    atmosphere.className =
        "cinematic-showcase__atmosphere";

    imageWrapper.appendChild(
        atmosphere
    );

    const light =
        document.createElement("div");

    light.className =
        "cinematic-showcase__light";

    imageWrapper.appendChild(
        light
    );

    /* =====================================================
       PROGRESS
       ===================================================== */

    const progress =
        document.createElement("div");

    progress.className =
        "cinematic-showcase__progress";

    imageWrapper.appendChild(
        progress
    );

    /* =====================================================
       TIMING
       ===================================================== */

    let isAnimating = false;

    const DISPLAY_TIME = 6500;
    const TRANSITION_TIME = 1500;

    /* =====================================================
       PROGRESS BAR
       ===================================================== */

    function updateProgress() {
        progress.style.setProperty(
            "--progress-duration",
            `${DISPLAY_TIME}ms`
        );

        progress.classList.remove(
            "is-running"
        );

        void progress.offsetWidth;

        progress.classList.add(
            "is-running"
        );
    }

    /* =====================================================
       PRELOAD
       ===================================================== */

    function preloadArtwork(artwork) {
        const image =
            new Image();

        image.src =
            artwork.image;
    }

    /*
     * Preload artwork berikutnya supaya
     * perpindahan tidak terasa patah.
     */

    function preloadNextArtwork() {
        const nextIndex =
            (currentIndex + 1) %
            artworkCollection.length;

        preloadArtwork(
            artworkCollection[nextIndex]
        );
    }

    /* =====================================================
       CREATE NEXT IMAGE
       ===================================================== */

    function createNextImage(
        artwork
    ) {
        const nextImage =
            document.createElement("img");

        nextImage.src =
            artwork.image;

        nextImage.alt =
            artwork.title || "Artwork";

        nextImage.className =
            "cinematic-showcase__image " +
            "cinematic-showcase__image--next";

        return nextImage;
    }

    /* =====================================================
       CINEMATIC TRANSITION
       ===================================================== */

    function transitionToNext() {
        if (isAnimating) {
            return;
        }

        isAnimating = true;

        const nextIndex =
            (currentIndex + 1) %
            artworkCollection.length;

        const nextArtwork =
            artworkCollection[nextIndex];

        const nextImage =
            createNextImage(
                nextArtwork
            );

        imageWrapper.appendChild(
            nextImage
        );

        /*
         * Pastikan browser sudah
         * mengenali image baru.
         */

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                nextImage.classList.add(
                    "is-entering"
                );
            });
        });

        /*
         * Artwork lama bergerak keluar.
         */

        featuredImage.classList.add(
            "is-leaving"
        );

        /*
         * Atmosphere ikut berubah.
         */

        atmosphere.classList.add(
            "is-transitioning"
        );

        light.classList.add(
            "is-sweeping"
        );

        setTimeout(() => {
            featuredImage.src =
                nextArtwork.image;

            featuredImage.alt =
                nextArtwork.title ||
                "MIKAZOART Artwork";

            featuredImage.classList.remove(
                "is-leaving"
            );

            nextImage.remove();

            currentIndex =
                nextIndex;

            atmosphere.classList.remove(
                "is-transitioning"
            );

            light.classList.remove(
                "is-sweeping"
            );

            isAnimating = false;

            updateProgress();

            /*
             * Langsung preload artwork
             * berikutnya.
             */

            preloadNextArtwork();

        }, TRANSITION_TIME);
    }

    /* =====================================================
       MOUSE PARALLAX
       ===================================================== */

    imageWrapper.addEventListener(
        "mousemove",
        (event) => {
            const rect =
                imageWrapper.getBoundingClientRect();

            const x =
                (event.clientX -
                    rect.left) /
                rect.width;

            const y =
                (event.clientY -
                    rect.top) /
                rect.height;

            const moveX =
                (x - 0.5) * 16;

            const moveY =
                (y - 0.5) * 16;

            featuredImage.style.setProperty(
                "--parallax-x",
                `${moveX}px`
            );

            featuredImage.style.setProperty(
                "--parallax-y",
                `${moveY}px`
            );
        }
    );

    imageWrapper.addEventListener(
        "mouseleave",
        () => {
            featuredImage.style.setProperty(
                "--parallax-x",
                "0px"
            );

            featuredImage.style.setProperty(
                "--parallax-y",
                "0px"
            );
        }
    );

    /* =====================================================
       START
       ===================================================== */

    preloadNextArtwork();

    updateProgress();

    setInterval(
        transitionToNext,
        DISPLAY_TIME
    );
}

    /* =========================================================
       LIGHTBOX
       ========================================================= */

    const artworkImages = document.querySelectorAll(
        "#home > div:last-child img, #portfolio article img"
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
                    event.target === lightbox
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
                        article.querySelector("h3");

                    const categoryElement =
                        article.querySelector(
                            ":scope > p"
                        );

                    if (titleElement) {
                        title =
                            titleElement.textContent.trim();
                    }

                    if (categoryElement) {
                        category =
                            categoryElement.textContent.trim();
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
                    document.querySelector("#name");

                const emailInput =
                    document.querySelector("#email");

                const messageInput =
                    document.querySelector("#message");

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

                /*
                 * Formspree continues normally.
                 */
            }
        );
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email
        );
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