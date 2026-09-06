(() => {
    "use strict";

    const body = document.body;
    const panels = Array.from(document.querySelectorAll(".panel"));
    const navButtons = Array.from(document.querySelectorAll(".site-nav [data-target]"));
    const homeLink = document.querySelector(".home-mark");
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const menuBackdrop = document.getElementById("menu-backdrop");
    const mobileContactLink = document.querySelector(".mobile-contact-link");
    const nextButtons = Array.from(document.querySelectorAll("[data-next]"));
    const previousButton = document.querySelector("[data-previous]");
    const progressBar = document.querySelector(".section-progress span");
    const scrollCursor = document.querySelector(".scroll-cursor");
    const scrollCursorLabel = document.getElementById("scroll-cursor-label");
    const preloader = document.getElementById("preloader");
    const projectItems = Array.from(document.querySelectorAll(".project-item[data-url]"));

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobileMenuQuery = window.matchMedia("(max-width: 900px)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const sectionNames = ["Intro", "About", "Skills", "Projects", "Contact"];

    const state = {
        activeIndex: 0,
        heroWord: 0,
        transitioning: false,
        wordTransitioning: false,
        heroWordTimer: null,
        wheelLock: false,
        touchStartY: 0,
        touchScrollArea: null,
        touchStartedAtTop: false,
        touchStartedAtBottom: false,
        preloaderDone: false,
        menuOpen: false
    };


    // ===== ANIMATION HELPERS =====

    function animateElements(elements, keyframes, options = {}) {
        const els = (Array.isArray(elements) ? elements : [elements]).filter(Boolean);
        const animations = els.map((el, i) => {
            return el.animate(keyframes, {
                duration: options.duration || 600,
                delay: i * (options.stagger || 0) + (options.delay || 0),
                easing: options.easing || "cubic-bezier(.2,.75,.2,1)",
                fill: "forwards"
            });
        });
        return Promise.all(animations.map(a => a.finished.catch(() => null)));
    }

    function setStyles(elements, styles) {
        const els = (Array.isArray(elements) ? elements : [elements]).filter(Boolean);
        els.forEach(el => {
            Object.entries(styles).forEach(([prop, val]) => {
                el.style[prop] = typeof val === "number" && prop !== "opacity" ? `${val}px` : String(val);
            });
        });
    }


    // ===== MOBILE MENU =====

    function setMenu(open) {
        const shouldOpen = Boolean(open && mobileMenuQuery.matches);
        state.menuOpen = shouldOpen;
        body.classList.toggle("menu-open", shouldOpen);
        if (hamburgerBtn) hamburgerBtn.setAttribute("aria-expanded", String(shouldOpen));
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener("click", () => setMenu(!state.menuOpen));
    }
    if (menuBackdrop) {
        menuBackdrop.addEventListener("click", () => setMenu(false));
    }
    if (mobileContactLink) {
        mobileContactLink.addEventListener("click", () => setMenu(false));
    }

    const handleMenuBreakpoint = () => setMenu(false);
    if (typeof mobileMenuQuery.addEventListener === "function") {
        mobileMenuQuery.addEventListener("change", handleMenuBreakpoint);
    }


    // ===== CUSTOM CURSOR =====

    const cursorPos = { currentX: -120, currentY: -120, targetX: -120, targetY: -120 };

    function renderCursor() {
        if (!scrollCursor || !finePointer) return;
        const ease = reducedMotion ? 1 : 0.18;
        cursorPos.currentX += (cursorPos.targetX - cursorPos.currentX) * ease;
        cursorPos.currentY += (cursorPos.targetY - cursorPos.currentY) * ease;
        scrollCursor.style.setProperty("--cursor-x", `${cursorPos.currentX}px`);
        scrollCursor.style.setProperty("--cursor-y", `${cursorPos.currentY}px`);
        requestAnimationFrame(renderCursor);
    }

    if (scrollCursor && finePointer) {
        window.addEventListener("pointermove", (e) => {
            if (e.pointerType && e.pointerType !== "mouse") return;
            cursorPos.targetX = e.clientX;
            cursorPos.targetY = e.clientY;
            if (reducedMotion) {
                cursorPos.currentX = e.clientX;
                cursorPos.currentY = e.clientY;
            }
            body.classList.add("cursor-ready");
        }, { passive: true });

        document.documentElement.addEventListener("mouseleave", () => {
            body.classList.remove("cursor-ready", "cursor-link");
        });
        document.documentElement.addEventListener("mouseenter", () => body.classList.add("cursor-ready"));

        const interactiveSelector = 'a, button, [role="button"], input, select, textarea, label, summary';
        document.addEventListener("pointerover", (e) => {
            if (e.pointerType && e.pointerType !== "mouse") return;
            body.classList.toggle("cursor-link", Boolean(e.target.closest(interactiveSelector)));
        }, { passive: true });
        document.addEventListener("pointerout", (e) => {
            if (e.pointerType && e.pointerType !== "mouse") return;
            const next = e.relatedTarget;
            body.classList.toggle("cursor-link", next instanceof Element && Boolean(next.closest(interactiveSelector)));
        }, { passive: true });

        requestAnimationFrame(renderCursor);
    }


    // ===== HERO WORD ROTATION =====

    function setHeroWord(nextIndex, direction = 1) {
        const words = Array.from(document.querySelectorAll(".hero-word"));
        if (!words.length) return false;
        const target = ((nextIndex % words.length) + words.length) % words.length;
        if (target === state.heroWord || state.wordTransitioning) return false;

        state.wordTransitioning = true;
        const current = words[state.heroWord];
        const next = words[target];
        const inY = direction > 0 ? 115 : -115;
        const outY = direction > 0 ? -115 : 115;
        const dur = reducedMotion ? 10 : 1150;
        const ease = "cubic-bezier(0.16, 1, 0.3, 1)";

        next.classList.add("is-current");
        next.style.transform = `translateY(${inY}%)`;
        next.style.opacity = "0";

        current.animate([
            { transform: "translateY(0)", opacity: 1 },
            { transform: `translateY(${outY}%)`, opacity: 0 }
        ], { duration: dur, easing: ease, fill: "forwards" });

        const nextAnim = next.animate([
            { transform: `translateY(${inY}%)`, opacity: 0 },
            { transform: "translateY(0)", opacity: 1 }
        ], { duration: dur, easing: ease, fill: "forwards" });

        nextAnim.finished.then(() => {
            current.classList.remove("is-current");
            if (typeof current.getAnimations === "function") {
                current.getAnimations().forEach(a => a.cancel());
            }
            if (typeof next.getAnimations === "function") {
                next.getAnimations().forEach(a => a.cancel());
            }
            current.style.transform = "";
            current.style.opacity = "";
            next.style.transform = "";
            next.style.opacity = "";
            state.heroWord = target;
            state.wordTransitioning = false;
        }).catch(() => {
            state.wordTransitioning = false;
        });

        return true;
    }

    function startHeroWordAutoCycle() {
        stopHeroWordAutoCycle();
        if (reducedMotion) return;
        state.heroWordTimer = setInterval(() => {
            if (state.activeIndex === 0 && !document.hidden && state.preloaderDone) {
                setHeroWord(state.heroWord + 1, 1);
            }
        }, 3400);
    }

    function stopHeroWordAutoCycle() {
        if (state.heroWordTimer) {
            clearInterval(state.heroWordTimer);
            state.heroWordTimer = null;
        }
    }


    // ===== PANEL TRANSITIONS =====

    function panelChildren(panel) {
        return Array.from(panel.querySelectorAll(".panel-copy > *"));
    }

    function updateNavigation() {
        const activePanel = panels[state.activeIndex];
        const id = activePanel.id;
        body.dataset.section = id;

        navButtons.forEach(btn => {
            const active = btn.dataset.target === id;
            btn.classList.toggle("is-active", active);
            btn.setAttribute("aria-current", active ? "page" : "false");
        });

        if (scrollCursorLabel) {
            scrollCursorLabel.textContent = state.activeIndex === panels.length - 1 ? "Back to top" : "Scroll";
        }

        if (progressBar) {
            progressBar.style.transform = `scaleX(${state.activeIndex / (panels.length - 1)})`;
        }

        if (previousButton) {
            previousButton.disabled = state.activeIndex === 0;
        }

        document.querySelectorAll("[data-next]").forEach(btn => {
            btn.disabled = state.activeIndex === panels.length - 1;
        });
    }

    function updateHash(id) {
        const hash = `#${id}`;
        if (window.location.hash === hash) return;
        history.replaceState(null, "", hash);
    }

    function switchPanel(nextIndex, options = {}) {
        if (nextIndex < 0 || nextIndex >= panels.length || nextIndex === state.activeIndex || state.transitioning) return;
        state.transitioning = true;

        if (nextIndex === 0) {
            startHeroWordAutoCycle();
        } else {
            stopHeroWordAutoCycle();
        }

        const currentIndex = state.activeIndex;
        const direction = nextIndex > currentIndex ? 1 : -1;
        const currentPanel = panels[currentIndex];
        const nextPanel = panels[nextIndex];
        const currentItems = panelChildren(currentPanel);
        const nextItems = panelChildren(nextPanel);

        const dur = reducedMotion ? 10 : undefined;

        // Show next panel
        nextPanel.classList.add("is-active");
        nextPanel.setAttribute("aria-hidden", "false");

        // Hide next items initially
        setStyles(nextItems, { opacity: "0", transform: `translateY(${direction > 0 ? 42 : -42}px)` });

        // Update nav immediately
        navButtons.forEach(btn => {
            const active = btn.dataset.target === nextPanel.id;
            btn.classList.toggle("is-active", active);
            btn.setAttribute("aria-current", active ? "page" : "false");
        });

        // Animate out current items
        const outPromise = animateElements(currentItems, [
            { opacity: 1, transform: "translateY(0)" },
            { opacity: 0, transform: `translateY(${direction > 0 ? -24 : 24}px)` }
        ], { duration: dur || 300, stagger: reducedMotion ? 0 : 25, easing: "cubic-bezier(.4,0,1,1)" });

        // Animate in next items (with delay)
        const inDelay = reducedMotion ? 0 : 400;
        setTimeout(() => {
            animateElements(nextItems, [
                { opacity: 0, transform: `translateY(${direction > 0 ? 42 : -42}px)` },
                { opacity: 1, transform: "translateY(0)" }
            ], { duration: dur || 680, stagger: reducedMotion ? 0 : 65, easing: "cubic-bezier(.2,.75,.2,1)" });
        }, inDelay);

        // Complete transition
        outPromise.then(() => {
            setTimeout(() => {
                currentPanel.classList.remove("is-active");
                currentPanel.setAttribute("aria-hidden", "true");

                // Reset scroll position of content panels
                const contentPanel = nextPanel.querySelector(".content-panel");
                if (contentPanel) contentPanel.scrollTop = 0;

                state.activeIndex = nextIndex;
                state.transitioning = false;
                updateNavigation();
                updateHash(nextPanel.id);
            }, reducedMotion ? 10 : 500);
        });
    }


    // ===== STEP FUNCTION =====

    function step(direction) {
        if (!state.preloaderDone || state.transitioning) return;

        // Wrap: if at last panel and scrolling forward, go back to intro
        if (state.activeIndex === panels.length - 1 && direction > 0) {
            navigateToId("intro");
            return;
        }

        switchPanel(state.activeIndex + direction);
    }

    function navigateToId(id) {
        const nextIndex = panels.findIndex(p => p.id === id);
        if (nextIndex === -1) return;
        if (nextIndex === 0 && state.activeIndex === 0) {
            updateHash("intro");
            return;
        }
        switchPanel(nextIndex);
    }


    // ===== EVENT HANDLERS =====

    // Nav buttons
    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            setMenu(false);
            navigateToId(btn.dataset.target);
        });
    });

    // Home link
    if (homeLink) {
        homeLink.addEventListener("click", (e) => {
            e.preventDefault();
            setMenu(false);
            navigateToId("intro");
        });
    }

    // Prev / Next buttons
    nextButtons.forEach(btn => btn.addEventListener("click", () => step(1)));
    if (previousButton) previousButton.addEventListener("click", () => step(-1));

    // Project items
    projectItems.forEach(item => {
        item.addEventListener("click", () => {
            const url = item.dataset.url;
            if (url) window.open(url, "_blank");
        });
    });

    // Wheel navigation
    window.addEventListener("wheel", (e) => {
        if (state.menuOpen || !state.preloaderDone || state.wheelLock || Math.abs(e.deltaY) < 18) return;

        // Allow scrolling inside content panels
        const scrollArea = e.target.closest(".content-panel");
        if (scrollArea && scrollArea.scrollHeight > scrollArea.clientHeight) {
            const atTop = scrollArea.scrollTop <= 0;
            const atBottom = Math.ceil(scrollArea.scrollTop + scrollArea.clientHeight) >= scrollArea.scrollHeight;
            if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) return;
        }

        e.preventDefault();
        state.wheelLock = true;
        step(e.deltaY > 0 ? 1 : -1);
        setTimeout(() => { state.wheelLock = false; }, reducedMotion ? 80 : 760);
    }, { passive: false });

    // Touch navigation
    function resetTouchState() {
        state.touchScrollArea = null;
        state.touchStartedAtTop = false;
        state.touchStartedAtBottom = false;
    }

    window.addEventListener("touchstart", (e) => {
        state.touchStartY = e.changedTouches[0].clientY;
        const target = e.target instanceof Element ? e.target.closest(".content-panel") : null;
        const isScrollable = target && target.scrollHeight > target.clientHeight + 2;
        state.touchScrollArea = isScrollable ? target : null;

        if (state.touchScrollArea) {
            state.touchStartedAtTop = state.touchScrollArea.scrollTop <= 1;
            state.touchStartedAtBottom = Math.ceil(state.touchScrollArea.scrollTop + state.touchScrollArea.clientHeight) >= state.touchScrollArea.scrollHeight - 1;
        } else {
            state.touchStartedAtTop = false;
            state.touchStartedAtBottom = false;
        }
    }, { passive: true });

    window.addEventListener("touchend", (e) => {
        if (state.menuOpen || !state.preloaderDone) { resetTouchState(); return; }

        const delta = state.touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(delta) <= 55) { resetTouchState(); return; }

        const direction = delta > 0 ? 1 : -1;
        if (state.touchScrollArea) {
            const startedAtEdge = direction > 0 ? state.touchStartedAtBottom : state.touchStartedAtTop;
            resetTouchState();
            if (!startedAtEdge) return;
        } else {
            resetTouchState();
        }

        step(direction);
    }, { passive: true });

    window.addEventListener("touchcancel", resetTouchState, { passive: true });

    // Keyboard navigation
    window.addEventListener("keydown", (e) => {
        if (state.menuOpen) {
            if (e.key === "Escape") { e.preventDefault(); setMenu(false); }
            return;
        }

        if (["ArrowDown", "PageDown", " "].includes(e.key)) {
            e.preventDefault();
            step(1);
        } else if (["ArrowUp", "PageUp"].includes(e.key)) {
            e.preventDefault();
            step(-1);
        } else if (e.key === "Home") {
            e.preventDefault();
            navigateToId("intro");
        }
    });

    // Popstate (browser back/forward)
    window.addEventListener("popstate", () => {
        const id = window.location.hash.replace("#", "") || "intro";
        navigateToId(id);
    });


    // ===== PRELOADER =====

    function finishPreloader() {
        state.preloaderDone = true;
        body.classList.remove("is-loading");
        preloader.classList.add("is-hidden");

        setTimeout(() => {
            preloader.hidden = true;

            // Reveal intro content
            const introItems = Array.from(document.querySelectorAll(".intro-copy > *"));
            setStyles(introItems, { opacity: "0", transform: "translateY(36px)" });
            animateElements(introItems, [
                { opacity: 0, transform: "translateY(36px)" },
                { opacity: 1, transform: "translateY(0)" }
            ], {
                duration: reducedMotion ? 10 : 900,
                stagger: reducedMotion ? 0 : 110,
                easing: "cubic-bezier(.2,.75,.2,1)"
            });

            if (state.activeIndex === 0) {
                startHeroWordAutoCycle();
            }
        }, reducedMotion ? 10 : 700);
    }

    // Wait for image and fonts, then finish
    function runPreloader() {
        const bgImage = document.querySelector(".bg-image");
        let imageReady = bgImage ? bgImage.complete : true;
        let fontsReady = !document.fonts;

        if (bgImage && !imageReady) {
            bgImage.addEventListener("load", () => { imageReady = true; }, { once: true });
            bgImage.addEventListener("error", () => { imageReady = true; }, { once: true });
        }

        if (document.fonts) {
            document.fonts.ready.then(() => { fontsReady = true; }).catch(() => { fontsReady = true; });
        }

        const startTime = performance.now();
        const minDuration = reducedMotion ? 100 : 1200;
        const maxDuration = reducedMotion ? 250 : 4000;

        function tick() {
            const elapsed = performance.now() - startTime;
            const allReady = imageReady && fontsReady;

            if ((allReady && elapsed >= minDuration) || elapsed >= maxDuration) {
                finishPreloader();
                return;
            }
            requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }


    // ===== HANDLE INITIAL HASH =====

    const initialHash = window.location.hash.replace("#", "");
    if (initialHash && initialHash !== "intro") {
        const targetIndex = panels.findIndex(p => p.id === initialHash);
        if (targetIndex > 0) {
            state.activeIndex = targetIndex;
            panels.forEach((panel, i) => {
                panel.classList.toggle("is-active", i === targetIndex);
                panel.setAttribute("aria-hidden", i === targetIndex ? "false" : "true");
            });
            body.dataset.section = panels[targetIndex].id;
        }
    }


    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopHeroWordAutoCycle();
        } else if (state.activeIndex === 0 && state.preloaderDone) {
            startHeroWordAutoCycle();
        }
    });


    // ===== INIT =====

    document.getElementById("footer-year").textContent = new Date().getFullYear();
    setMenu(false);
    updateNavigation();
    runPreloader();

})();
