document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       1. ELEMENT REFERENCES
       ========================================= */

    const navigationLinks = document.querySelectorAll(
        'header nav a[href^="#"]'
    );

    const portfolioSection = document.querySelector("#portfolio");
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


    /* =========================================
       2. SMOOTH NAVIGATION
       ========================================= */

    navigationLinks.forEach((link) => {
        link.addEventListener("click", (event) => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const targetSection = document.querySelector(targetId);

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


    /* =========================================
       3. PORTFOLIO FILTER
       ========================================= */

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
                    card.style.transform = "translateY(10px)";

                    setTimeout(() => {
                        card.style.display = "none";
                    }, 250);

                }

            });

        });

    });


    /* =========================================
       4. ARTWORK LIGHTBOX
       ========================================= */

    const artworkImages = document.querySelectorAll(
        "#home > div:last-child img, #portfolio article img"
    );

    let lightbox = null;

    function createLightbox() {

        if (lightbox) {
            return;
        }

        lightbox = document.createElement("div");

        lightbox.className = "artwork-lightbox";

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

        document.body.appendChild(lightbox);

        const closeButton =
            lightbox.querySelector(".artwork-lightbox__close");

        closeButton.addEventListener("click", closeLightbox);

        lightbox.addEventListener("click", (event) => {

            if (event.target === lightbox) {
                closeLightbox();
            }

        });

        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {
                closeLightbox();
            }

        });

    }


    function openLightbox(image, title = "", category = "") {

        createLightbox();

        const lightboxImage =
            lightbox.querySelector(".artwork-lightbox__image");

        const lightboxTitle =
            lightbox.querySelector(".artwork-lightbox__caption h3");

        const lightboxCategory =
            lightbox.querySelector(".artwork-lightbox__caption p");

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;

        lightboxTitle.textContent = title;
        lightboxCategory.textContent = category;

        lightbox.classList.add("is-open");

        document.body.style.overflow = "hidden";

    }


    function closeLightbox() {

        if (!lightbox) {
            return;
        }

        lightbox.classList.remove("is-open");

        document.body.style.overflow = "";

    }


    artworkImages.forEach((image) => {

        image.style.cursor = "zoom-in";

        image.addEventListener("click", () => {

            const article = image.closest("article");

            let title = image.alt;
            let category = "";

            if (article) {

                const titleElement =
                    article.querySelector("h3");

                const categoryElement =
                    article.querySelector(":scope > p");

                if (titleElement) {
                    title = titleElement.textContent.trim();
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

        });

    });


    /* =========================================
   5. CONTACT FORM
   ========================================= */

if (contactForm) {

    contactForm.addEventListener("submit", (event) => {

        const nameInput =
            document.querySelector("#name");

        const emailInput =
            document.querySelector("#email");

        const messageInput =
            document.querySelector("#message");

        const name =
            nameInput.value.trim();

        const email =
            emailInput.value.trim();

        const message =
            messageInput.value.trim();


        if (!name || !email || !message) {

            event.preventDefault();

            showNotification(
                "Please complete all fields.",
                "error"
            );

            return;
        }


        if (!isValidEmail(email)) {

            event.preventDefault();

            showNotification(
                "Please enter a valid email address.",
                "error"
            );

            return;
        }

        // Allow the form to continue to Formspree.
        // Do not use event.preventDefault() here.

    });

}


    /* =========================================
       6. EMAIL VALIDATION
       ========================================= */

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    }


    /* =========================================
       7. NOTIFICATION SYSTEM
       ========================================= */

    let notificationTimeout = null;

    function showNotification(message, type = "success") {

        let notification =
            document.querySelector(".site-notification");

        if (!notification) {

            notification =
                document.createElement("div");

            notification.className =
                "site-notification";

            document.body.appendChild(notification);

        }


        notification.textContent = message;

        notification.classList.remove(
            "is-success",
            "is-error",
            "is-visible"
        );

        if (type === "error") {

            notification.classList.add(
                "is-error"
            );

        } else {

            notification.classList.add(
                "is-success"
            );

        }


        requestAnimationFrame(() => {

            notification.classList.add(
                "is-visible"
            );

        });


        clearTimeout(notificationTimeout);

        notificationTimeout =
            setTimeout(() => {

                notification.classList.remove(
                    "is-visible"
                );

            }, 3500);

    }


    /* =========================================
       8. ACTIVE NAVIGATION
       ========================================= */

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
                window.scrollY >= sectionTop
            ) {

                currentSection =
                    section.getAttribute("id");

            }

        });


        mainNavigationLinks.forEach((link) => {

            const linkTarget =
                link.getAttribute("href");

            if (
                linkTarget === `#${currentSection}`
            ) {

                link.classList.add(
                    "is-active"
                );

            } else {

                link.classList.remove(
                    "is-active"
                );

            }

        });

    }


    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        { passive: true }
    );

    updateActiveNavigation();


    /* =========================================
       9. SCROLL REVEAL ANIMATION
       ========================================= */

    const revealElements = document.querySelectorAll(
        "#about > div, " +
        "#portfolio > div, " +
        "#portfolio article, " +
        "#contact > div"
    );


    revealElements.forEach((element) => {

        element.classList.add(
            "scroll-reveal"
        );

    });


    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "is-visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach((element) => {

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach((element) => {

            element.classList.add(
                "is-visible"
            );

        });

    }


    /* =========================================
       10. CURRENT YEAR
       ========================================= */

    const footerYear =
        document.querySelector(
            "footer > div:last-child p"
        );

    if (footerYear) {

        footerYear.innerHTML =
            `&copy; ${new Date().getFullYear()} My Portfolio. All rights reserved.`;

    }


    /* =========================================
       11. PORTFOLIO CARD HOVER ACCESSIBILITY
       ========================================= */

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

        card.addEventListener("keydown", (event) => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                image.click();

            }

        });

    });


    /* =========================================
       12. INITIALIZATION
       ========================================= */

    updateActiveNavigation();

});