
/* =========================================================
   MIKAZOART ARTBOOK
   Stable version — artwork data + contents + page navigation
   ========================================================= */

(() => {
    "use strict";

    const COLLECTIONS = [
        {
            name: "Aurora",
            label: "Aurora (EP)",
            description:
                "A collection inspired by luminous colours, quiet emotions, and the beauty of the northern lights."
        },
        {
            name: "Blossom",
            label: "Blossom (Album)",
            description:
                "An artistic collection celebrating delicate beauty, gentle moments, and the feeling of new beginnings."
        },
        {
            name: "Fantasy",
            label: "Fantasy (Album)",
            description:
                "A collection exploring imaginative worlds, expressive characters, and stories beyond reality."
        },
        {
            name: "Colours World",
            label: "Colours World (Album)",
            description:
                "A colourful collection bringing together expressive illustrations, different moods, and visual storytelling."
        }
    ];

    const $ = (id) => document.getElementById(id);

    const elements = {
        toc: $("ab-toc"),
        tocList: $("ab-toc-list"),
        currentChapter: $("ab-current-chapter"),
        progressLabel: $("ab-progress-label"),
        bookStage: $("ab-book-stage"),
        spread: $("ab-spread"),
        artFrame: $("ab-art-frame"),
        artIndex: $("ab-art-index"),
        artCollection: $("ab-art-collection"),
        storyContent: $("ab-story-content"),
        pageNumber: $("ab-page-number"),
        leftPageNumber: $("ab-left-page-number"),
        clickPrev: $("ab-click-prev"),
        clickNext: $("ab-click-next"),
        versionBar: $("ab-version-bar"),
        versionPrev: $("ab-version-prev"),
        versionNext: $("ab-version-next"),
        versionCount: $("ab-version-count"),
        pageStatusNumber: $("ab-page-status-number"),
        totalPages: $("ab-total-pages"),
        readerMessage: $("ab-reader-message"),
        tocToggle: $("ab-toc-toggle"),
        year: $("ab-year")
    };

    let pages = [];
    let currentPage = 0;
    let currentVersion = 0;

    function showMessage(message, isError = false) {
        if (elements.readerMessage) {
            elements.readerMessage.textContent = message;
            elements.readerMessage.hidden = false;
            elements.readerMessage.style.color =
                isError ? "#a13d5b" : "";
        }

        if (elements.spread) {
            elements.spread.hidden = true;
        }

        if (elements.tocList && isError) {
            elements.tocList.innerHTML = "";
        }

        console[isError ? "error" : "info"](
            "[MIKAZOART Artbook]",
            message
        );
    }

    function hideMessage() {
        if (elements.readerMessage) {
            elements.readerMessage.hidden = true;
            elements.readerMessage.textContent = "";
        }

        if (elements.spread) {
            elements.spread.hidden = false;
        }
    }

    function normalizeCollection(value) {
        const text = String(value || "")
            .trim()
            .toLowerCase();

        return COLLECTIONS.find((collection) =>
            collection.name.toLowerCase() === text ||
            collection.label.toLowerCase() === text
        )?.name || "";
    }

    function getArtworkData() {
        /*
         * artworks.js must be loaded before artbook.js.
         * The first name matches the main MIKAZOART project.
         */
        let data = [];

        try {
            if (
                typeof MIKAZOART_ARTWORKS !== "undefined" &&
                Array.isArray(MIKAZOART_ARTWORKS)
            ) {
                data = MIKAZOART_ARTWORKS;
            }
        } catch (error) {
            console.warn(
                "Could not read MIKAZOART_ARTWORKS.",
                error
            );
        }

        if (!data.length && Array.isArray(window.MIKAZOART_ARTWORKS)) {
            data = window.MIKAZOART_ARTWORKS;
        }

        /*
         * Compatibility with projects that expose the array
         * using one of these common global names.
         */
        if (!data.length) {
            const possibleNames = [
                "artworks",
                "ARTWORKS",
                "artworkData",
                "mikazoArtworks"
            ];

            for (const name of possibleNames) {
                try {
                    if (
                        Array.isArray(window[name]) &&
                        window[name].length
                    ) {
                        data = window[name];
                        break;
                    }
                } catch (error) {
                    console.warn("Could not read", name, error);
                }
            }
        }

        return data;
    }

    function getImageVersions(artwork) {
        let versions = [];

        if (Array.isArray(artwork.images)) {
            versions = artwork.images
                .map((item) => {
                    if (typeof item === "string") {
                        return {
                            src: item,
                            label: ""
                        };
                    }

                    if (item && typeof item === "object") {
                        return {
                            src:
                                item.image ||
                                item.src ||
                                item.path ||
                                item.url ||
                                "",
                            label:
                                item.label ||
                                item.title ||
                                item.name ||
                                ""
                        };
                    }

                    return null;
                })
                .filter((item) => item && item.src);
        }

        if (!versions.length && artwork.image) {
            versions = [{
                src: artwork.image,
                label: ""
            }];
        }

        return versions;
    }

    function buildPages(artworks) {
        const result = [];

        for (const collection of COLLECTIONS) {
            const collectionArtworks = artworks.filter(
                (artwork) =>
                    normalizeCollection(artwork.collection) ===
                    collection.name &&
                    getImageVersions(artwork).length > 0
            );

            /*
             * Add one introductory page for each collection,
             * even if its artwork data is currently empty.
             */
            result.push({
                type: "chapter",
                collection: collection.name,
                label: collection.label,
                description: collection.description,
                artworks: collectionArtworks
            });

            for (const artwork of collectionArtworks) {
                result.push({
                    type: "artwork",
                    collection: collection.name,
                    label: collection.label,
                    artwork,
                    versions: getImageVersions(artwork)
                });
            }
        }

        return result;
    }

    function renderContents() {
        if (!elements.tocList) {
            console.error(
                'Missing HTML element: id="ab-toc-list".'
            );
            return;
        }

        elements.tocList.innerHTML = "";

        COLLECTIONS.forEach((collection) => {
            const chapterIndex = pages.findIndex(
                (page) =>
                    page.type === "chapter" &&
                    page.collection === collection.name
            );

            const artworkCount = pages.filter(
                (page) =>
                    page.type === "artwork" &&
                    page.collection === collection.name
            ).length;

            const button = document.createElement("button");
            button.type = "button";
            button.className = "ab-toc-item";
            button.dataset.page = String(chapterIndex);

            const title = document.createElement("span");
            title.className = "ab-toc-item-title";
            title.textContent = collection.label;

            const count = document.createElement("span");
            count.className = "ab-toc-item-count";
            count.textContent = `${artworkCount} artworks`;

            button.append(title, count);

            button.addEventListener("click", () => {
                goToPage(chapterIndex);
            });

            elements.tocList.appendChild(button);
        });
    }

    function updateContentsActiveState() {
        if (!elements.tocList) return;

        const page = pages[currentPage];
        if (!page) return;

        elements.tocList
            .querySelectorAll(".ab-toc-item")
            .forEach((button) => {
                const chapterPage = Number(button.dataset.page);

                let activeChapterPage = 0;

                for (let i = currentPage; i >= 0; i--) {
                    if (pages[i]?.type === "chapter") {
                        activeChapterPage = i;
                        break;
                    }
                }

                button.classList.toggle(
                    "is-active",
                    chapterPage === activeChapterPage
                );

                if (
                    chapterPage === activeChapterPage
                ) {
                    button.setAttribute("aria-current", "true");
                } else {
                    button.removeAttribute("aria-current");
                }
            });
    }

    function clearArtworkFrame() {
        if (elements.artFrame) {
            elements.artFrame.innerHTML = "";
        }
    }

    function renderChapter(page) {
        clearArtworkFrame();

        if (elements.artIndex) {
            elements.artIndex.textContent = "COLLECTION";
        }

        if (elements.artCollection) {
            elements.artCollection.textContent = page.label;
        }

        if (elements.storyContent) {
            elements.storyContent.innerHTML = "";

            const eyebrow = document.createElement("p");
            eyebrow.className = "ab-story-eyebrow";
            eyebrow.textContent = "CHAPTER";

            const title = document.createElement("h2");
            title.textContent = page.label;

            const description = document.createElement("p");
            description.textContent = page.description;

            const count = document.createElement("p");
            count.className = "ab-story-count";
            count.textContent =
                `${page.artworks.length} artwork` +
                (page.artworks.length === 1 ? "" : "s");

            elements.storyContent.append(
                eyebrow,
                title,
                description,
                count
            );
        }

        if (elements.versionBar) {
            elements.versionBar.hidden = true;
        }
    }

    function renderArtwork(page) {
        const artwork = page.artwork;
        const versions = page.versions;

        if (!artwork || !versions.length) {
            showMessage(
                "This artwork has no usable image path.",
                true
            );
            return;
        }

        currentVersion = Math.min(
            currentVersion,
            versions.length - 1
        );

        const version = versions[currentVersion];

        clearArtworkFrame();

        const image = document.createElement("img");
        image.className = "ab-artwork-image";
        image.src = version.src;
        image.alt = artwork.title || "MIKAZOART artwork";
        image.loading = "eager";
        image.decoding = "async";

        image.addEventListener("error", () => {
            image.alt = "Artwork image could not be loaded";
            image.classList.add("is-image-error");

            const notice = document.createElement("p");
            notice.className = "ab-image-error";
            notice.textContent =
                "Image could not be loaded. Check the image path in artworks.js.";

            if (elements.artFrame) {
                elements.artFrame
                    .querySelector(".ab-image-error")
                    ?.remove();

                elements.artFrame.appendChild(notice);
            }

            console.error(
                "[MIKAZOART Artbook] Image failed to load:",
                version.src
            );
        });

        if (elements.artFrame) {
            elements.artFrame.appendChild(image);
        }

        if (elements.artIndex) {
            const artworkId = artwork.id ?? "";
            elements.artIndex.textContent =
                artworkId !== "" ? `ARTWORK ${artworkId}` : "ARTWORK";
        }

        if (elements.artCollection) {
            elements.artCollection.textContent = page.label;
        }

        if (elements.storyContent) {
            elements.storyContent.innerHTML = "";

            const title = document.createElement("h2");
            title.textContent = artwork.title || "Untitled";

            const category = document.createElement("p");
            category.className = "ab-story-category";
            category.textContent = artwork.category || "Illustration";

            const description = document.createElement("p");
            description.textContent =
                artwork.description ||
                "A visual exploration of colour, mood, and artistic expression.";

            elements.storyContent.append(
                title,
                category,
                description
            );

            if (version.label) {
                const versionLabel = document.createElement("p");
                versionLabel.className = "ab-version-label";
                versionLabel.textContent = version.label;
                elements.storyContent.appendChild(versionLabel);
            }
        }

        if (elements.versionBar) {
            elements.versionBar.hidden = versions.length <= 1;
        }

        if (elements.versionCount) {
            elements.versionCount.textContent =
                `${currentVersion + 1} / ${versions.length}`;
        }

        if (elements.versionPrev) {
            elements.versionPrev.disabled = currentVersion <= 0;
        }

        if (elements.versionNext) {
            elements.versionNext.disabled =
                currentVersion >= versions.length - 1;
        }
    }

    function renderPage() {
        if (!pages.length) {
            showMessage(
                "No artwork pages were found. Check artworks.js and the collection names.",
                true
            );
            return;
        }

        currentPage = Math.max(
            0,
            Math.min(currentPage, pages.length - 1)
        );

        const page = pages[currentPage];

        hideMessage();

        if (page.type === "chapter") {
            currentVersion = 0;
            renderChapter(page);
        } else {
            renderArtwork(page);
        }

        if (elements.currentChapter) {
            elements.currentChapter.textContent = page.label;
        }

        if (elements.progressLabel) {
            elements.progressLabel.textContent =
                `Page ${currentPage + 1} of ${pages.length}`;
        }

        if (elements.pageNumber) {
            elements.pageNumber.textContent =
                String(currentPage + 1).padStart(2, "0");
        }

        if (elements.leftPageNumber) {
            elements.leftPageNumber.textContent =
                String(currentPage + 1).padStart(2, "0");
        }

        if (elements.pageStatusNumber) {
            elements.pageStatusNumber.textContent =
                String(currentPage + 1);
        }

        if (elements.totalPages) {
            elements.totalPages.textContent = String(pages.length);
        }

        if (elements.clickPrev) {
            elements.clickPrev.disabled = currentPage <= 0;
            elements.clickPrev.setAttribute(
                "aria-label",
                "Previous page"
            );
        }

        if (elements.clickNext) {
            elements.clickNext.disabled =
                currentPage >= pages.length - 1;
            elements.clickNext.setAttribute(
                "aria-label",
                "Next page"
            );
        }

        updateContentsActiveState();
    }

    function goToPage(index) {
        if (!Number.isFinite(index)) return;
        if (index < 0 || index >= pages.length) return;

        currentPage = index;
        currentVersion = 0;
        renderPage();
    }

    function previousPage() {
        goToPage(currentPage - 1);
    }

    function nextPage() {
        goToPage(currentPage + 1);
    }

    function previousVersion() {
        const page = pages[currentPage];

        if (
            page?.type !== "artwork" ||
            currentVersion <= 0
        ) {
            return;
        }

        currentVersion--;
        renderPage();
    }

    function nextVersion() {
        const page = pages[currentPage];

        if (
            page?.type !== "artwork" ||
            currentVersion >= page.versions.length - 1
        ) {
            return;
        }

        currentVersion++;
        renderPage();
    }

    function closeContents() {
        if (!elements.toc) return;

        elements.toc.classList.remove("is-open");

        if (elements.tocToggle) {
            elements.tocToggle.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    }

    function bindEvents() {
        elements.clickPrev?.addEventListener(
            "click",
            previousPage
        );

        elements.clickNext?.addEventListener(
            "click",
            nextPage
        );

        elements.versionPrev?.addEventListener(
            "click",
            previousVersion
        );

        elements.versionNext?.addEventListener(
            "click",
            nextVersion
        );

        if (elements.tocToggle && elements.toc) {
            elements.tocToggle.addEventListener("click", () => {
                const open =
                    elements.toc.classList.toggle("is-open");

                elements.tocToggle.setAttribute(
                    "aria-expanded",
                    String(open)
                );
            });
        }

        /*
         * Keyboard navigation.
         */
        document.addEventListener("keydown", (event) => {
            const target = event.target;

            if (
                target instanceof HTMLElement &&
                (
                    target.isContentEditable ||
                    ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"]
                        .includes(target.tagName)
                )
            ) {
                return;
            }

            if (event.key === "ArrowLeft") {
                event.preventDefault();
                previousPage();
            }

            if (event.key === "ArrowRight") {
                event.preventDefault();
                nextPage();
            }
        });

        if (elements.year) {
            elements.year.textContent =
                String(new Date().getFullYear());
        }
    }

    function init() {
        /*
         * Confirm the main HTML elements exist before rendering.
         */
        if (!elements.spread && !elements.bookStage) {
            console.error(
                "[MIKAZOART Artbook] Book HTML elements were not found. Check artbook.html."
            );
            return;
        }

        const artworks = getArtworkData();

        if (!Array.isArray(artworks) || artworks.length === 0) {
            showMessage(
                "Artwork data was not found. Check the variable name in artworks.js and ensure that artworks.js loads before artbook.js.",
                true
            );
            return;
        }

        const validArtworks = artworks.filter(
            (artwork) =>
                artwork &&
                typeof artwork === "object"
        );

        pages = buildPages(validArtworks);

        if (!pages.length) {
            showMessage(
                "No Artbook pages could be created. Check the artwork collection names.",
                true
            );
            return;
        }

        bindEvents();
        renderContents();
        renderPage();

        console.info(
            `[MIKAZOART Artbook] Ready: ${validArtworks.length} records, ${pages.length} pages.`
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            init,
            { once: true }
        );
    } else {
        init();
    }
})();