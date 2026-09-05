/* =========================================================
   COMPONENT CONFIGURATION
   ========================================================= */

const components = [

    {
        id: "navbar",
        file: "components/navbar.html"
    },

    {
        id: "hero",
        file: "components/hero.html"
    },

    {
        id: "about",
        file: "components/about.html"
    },

    {
        id: "who-i-teach",
        file: "components/who-i-teach.html"
    },

    {
        id: "skills",
        file: "components/skills.html"
    },

    {
        id: "learning-outcomes",
        file: "components/learning-outcomes.html"
    },

    {
        id: "teaching",
        file: "components/teaching.html"
    },

    {
        id: "proof",
        file: "components/proof.html"
    },

    {
        id: "testimonials",
        file: "components/testimonials.html"
    },

    {
        id: "pricing",
        file: "components/pricing.html"
    },

    {
        id: "faq",
        file: "components/faq.html"
    },

    {
        id: "contact",
        file: "components/contact.html"
    },

    {
        id: "footer",
        file: "components/footer.html"
    },

    {
        id: "whatsapp-float",
        file: "components/whatsapp-float.html"
    }

];


/* =========================================================
   LOAD COMPONENT
   ========================================================= */

async function loadComponent(component) {

    const element =
        document.getElementById(component.id);


    if (!element) {

        console.error(
            `Element #${component.id} not found`
        );

        return;
    }


    try {

        const response =
            await fetch(component.file);


        if (!response.ok) {

            throw new Error(
                `Failed to load ${component.file} - ${response.status}`
            );

        }


        const html =
            await response.text();


        element.innerHTML =
            html;


        console.log(
            `✓ Loaded: ${component.file}`
        );


    } catch (error) {

        console.error(
            `✗ Error loading ${component.file}:`,
            error
        );


        element.innerHTML = `

            <p
                style="
                    color:#ef4444;
                    padding:20px;
                    text-align:center;
                "
            >
                Failed to load ${component.id}
            </p>

        `;

    }

}


/* =========================================================
   LOAD ALL COMPONENTS
   ========================================================= */

async function loadAllComponents() {

    await Promise.all(

        components.map(
            component =>
                loadComponent(component)
        )

    );


    console.log(
        "✓ All components loaded"
    );


    /* =====================================================
       INITIALIZE DYNAMIC UI
       ===================================================== */

    initMobileNavigation();

    initContactForm();

    initProgramsCarousel();

    initTestimonials();

    initWhatsappLinks();

    initCtaTracking();


    trackEvent(
        "page_view",
        { page: "home" }
    );

}


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

function initMobileNavigation() {

    const navbar =
        document.querySelector(".navbar");


    const menuToggle =
        document.querySelector(".menu-toggle");


    const mobileMenu =
        document.querySelector(".mobile-menu");


    if (
        !navbar ||
        !menuToggle ||
        !mobileMenu
    ) {

        console.warn(
            "Mobile navigation elements not found."
        );

        return;
    }


    const mobileLinks =
        mobileMenu.querySelectorAll("a");


    function openMenu() {

        navbar.classList.add(
            "menu-open"
        );


        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );


        menuToggle.setAttribute(
            "aria-label",
            "Close navigation menu"
        );


        mobileMenu.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    function closeMenu() {

        navbar.classList.remove(
            "menu-open"
        );


        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );


        menuToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
        );


        mobileMenu.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    menuToggle.addEventListener(
        "click",
        function () {

            const isOpen =
                navbar.classList.contains(
                    "menu-open"
                );


            isOpen
                ? closeMenu()
                : openMenu();

        }
    );


    mobileLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                closeMenu
            );

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                navbar.classList.contains("menu-open")
            ) {

                closeMenu();

                menuToggle.focus();

            }

        }
    );


    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth > 768
            ) {

                closeMenu();

            }

        }
    );

}


/* =========================================================
   CONTACT FORM HANDLING
   ========================================================= */

function initContactForm() {

    const form =
        document.getElementById(
            "contact-form"
        );


    if (!form) {

        console.warn(
            "Contact form not found."
        );

        return;
    }


    const submitBtn =
        document.getElementById(
            "submit-btn"
        );


    const status =
        document.getElementById(
            "form-status"
        );


    const originalBtnHTML =
        submitBtn.innerHTML;


    form.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const cfg =
                window.SITE_CONFIG || {};


            const endpoint =
                cfg.FORM_ENDPOINT &&
                cfg.FORM_ENDPOINT.trim();


            submitBtn.disabled =
                true;


            submitBtn.innerHTML =
                `<span>Sending...</span> <span aria-hidden="true">↗</span>`;


            status.textContent =
                "";


            status.className =
                "contact-form-status";


            trackEvent(
                "form_start",
                { form: "contact" }
            );


            /* =================================================
               CASE 1 — a real form endpoint is configured
               (e.g. Formspree / Web3Forms). Submit via fetch.
               ================================================= */

            if (endpoint) {

                try {

                    const response =
                        await fetch(
                            endpoint,
                            {
                                method: "POST",

                                body:
                                    new FormData(form),

                                headers: {
                                    Accept:
                                        "application/json"
                                }
                            }
                        );


                    if (response.ok) {

                        status.textContent =
                            "✓ Message sent! I'll get back to you soon.";


                        status.classList.add(
                            "is-success"
                        );


                        form.reset();


                        trackEvent(
                            "form_submit",
                            { form: "contact" }
                        );


                    } else {

                        throw new Error(
                            "Form endpoint responded with an error."
                        );

                    }


                } catch (error) {

                    console.error(
                        "Contact form error:",
                        error
                    );


                    status.textContent =
                        "Something went wrong. Please try again, or message me on WhatsApp/email directly.";


                    status.classList.add(
                        "is-error"
                    );

                }


            } else {

                /* =================================================
                   CASE 2 — no form endpoint configured yet.
                   Fall back to a pre-filled email so no lead is
                   ever silently lost. Configure SITE_CONFIG.FORM_ENDPOINT
                   in index.html to switch to in-page submission.
                   ================================================= */

                const data =
                    new FormData(form);


                const bodyLines =
                    [
                        `Parent name: ${data.get("name") || ""}`,
                        `Email: ${data.get("email") || ""}`,
                        `WhatsApp/Phone: ${data.get("whatsapp") || ""}`,
                        `Child's age: ${data.get("child_age") || ""}`,
                        `Class type: ${data.get("class_type") || ""}`,
                        `Message: ${data.get("message") || ""}`
                    ];


                const mailBody =
                    encodeURIComponent(
                        bodyLines.join("\n")
                    );


                const mailSubject =
                    encodeURIComponent(
                        "Trial Class Inquiry"
                    );


                const mailTo =
                    (cfg.CONTACT_EMAIL &&
                        !cfg.CONTACT_EMAIL.includes("example.com"))
                        ? cfg.CONTACT_EMAIL
                        : "";


                if (mailTo) {

                    window.location.href =
                        `mailto:${mailTo}?subject=${mailSubject}&body=${mailBody}`;


                    status.textContent =
                        "Opening your email app to send this to me directly...";


                    status.classList.add(
                        "is-success"
                    );


                    trackEvent(
                        "form_submit",
                        { form: "contact", method: "mailto" }
                    );


                } else {

                    status.textContent =
                        "The contact form isn't fully set up yet — please reach out on WhatsApp instead using the button above.";


                    status.classList.add(
                        "is-error"
                    );

                }

            }


            submitBtn.disabled =
                false;


            submitBtn.innerHTML =
                originalBtnHTML;

        }
    );

}


/* =========================================================
   ANALYTICS EVENT TRACKING
   No-ops safely if GA4/Meta Pixel aren't configured.
   ========================================================= */

function trackEvent(
    eventName,
    params
) {

    try {

        if (window.gtag) {

            window.gtag(
                "event",
                eventName,
                params || {}
            );

        }


        if (window.fbq) {

            window.fbq(
                "trackCustom",
                eventName,
                params || {}
            );

        }


        console.log(
            `↗ tracked: ${eventName}`,
            params || {}
        );


    } catch (error) {

        console.warn(
            "trackEvent failed:",
            error
        );

    }

}


/* =========================================================
   CTA CLICK TRACKING
   Any element with data-track="cta_click" fires a tracked
   event using its data-track-label.
   ========================================================= */

function initCtaTracking() {

    document.addEventListener(
        "click",
        function (event) {

            const target =
                event.target.closest(
                    "[data-track]"
                );


            if (!target) {

                return;

            }


            trackEvent(
                target.dataset.track,
                {
                    label:
                        target.dataset.trackLabel ||
                        "unknown"
                }
            );

        }
    );

}


/* =========================================================
   WHATSAPP CTA WIRING
   Populates the floating button and the contact-section
   WhatsApp link from window.SITE_CONFIG.WHATSAPP_NUMBER.
   Hides the floating button if no real number is configured.
   ========================================================= */

function initWhatsappLinks() {

    const cfg =
        window.SITE_CONFIG || {};


    const number =
        cfg.WHATSAPP_NUMBER &&
        cfg.WHATSAPP_NUMBER.trim();


    const isConfigured =
        number &&
        number !== "YOUR_WHATSAPP_NUMBER";


    const message =
        encodeURIComponent(
            "Hi Zubair! I'd like to ask about coding classes."
        );


    const url =
        isConfigured
            ? `https://wa.me/${number}?text=${message}`
            : "";


    const floatLink =
        document.getElementById(
            "whatsapp-float-link"
        );


    if (floatLink) {

        if (isConfigured) {

            floatLink.href =
                url;

            floatLink.style.display =
                "";

        } else {

            floatLink.style.display =
                "none";

        }

    }


    const contactLink =
        document.getElementById(
            "contact-whatsapp-link"
        );


    if (contactLink) {

        if (isConfigured) {

            contactLink.href =
                url;

        } else {

            contactLink.href =
                "#contact";


            contactLink.title =
                "WhatsApp number not configured yet — use the form below.";

        }

    }

}


/* =========================================================
   WHAT I TEACH CAROUSEL
   ========================================================= */

function initProgramsCarousel() {

    const carousel =
        document.querySelector(
            ".program-carousel"
        );


    if (!carousel) {

        console.warn(
            "Carousel element .program-carousel not found in DOM."
        );

        return;
    }


    const viewport =
        carousel.querySelector(
            ".program-carousel-viewport"
        );


    const track =
        carousel.querySelector(
            ".programs-track"
        );


    const prevButton =
        carousel.querySelector(
            ".program-carousel-prev"
        );


    const nextButton =
        carousel.querySelector(
            ".program-carousel-next"
        );


    const dots =
        carousel.querySelectorAll(
            ".program-dot"
        );


    if (
        !viewport ||
        !track ||
        !prevButton ||
        !nextButton
    ) {

        return;
    }


    const originalCards =
        Array.from(
            track.querySelectorAll(
                ".program-card"
            )
        );


    const totalSlides =
        originalCards.length;


    if (totalSlides <= 1) {

        return;
    }


    const clonesBefore =
        originalCards.map(
            card =>
                card.cloneNode(true)
        );


    const clonesAfter =
        originalCards.map(
            card =>
                card.cloneNode(true)
        );


    clonesBefore
        .reverse()
        .forEach(
            card =>
                track.prepend(card)
        );


    clonesAfter.forEach(
        card =>
            track.appendChild(card)
    );


    let currentIndex =
        totalSlides;


    let visibleCards =
        getVisibleCards();


    let autoSlideTimer =
        null;


    let isAnimating =
        false;


    let isPaused =
        false;


    function getVisibleCards() {

        if (
            window.innerWidth <= 768
        ) {

            return 1;

        }


        if (
            window.innerWidth <= 1000
        ) {

            return 2;

        }


        return 3;

    }


    function getStep() {

        const firstCard =
            track.querySelector(
                ".program-card"
            );


        if (!firstCard) {

            return 0;

        }


        const cardWidth =
            firstCard.getBoundingClientRect().width;


        const trackStyle =
            window.getComputedStyle(
                track
            );


        const gap =
            parseFloat(
                trackStyle.columnGap ||
                trackStyle.gap ||
                0
            );


        return cardWidth + gap;

    }


    function moveTo(
        index,
        animate = true
    ) {

        const step =
            getStep();


        if (!step) {

            return;

        }


        track.style.transition =
            animate

                ? "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)"

                : "none";


        track.style.transform =
            `translate3d(${-index * step}px, 0, 0)`;


        currentIndex =
            index;


        updateDots();

    }


    function updateDots() {

        let realIndex =
            currentIndex - totalSlides;


        realIndex =
            (
                (realIndex % totalSlides) +
                totalSlides
            ) % totalSlides;


        dots.forEach(
            (dot, index) => {

                dot.classList.toggle(
                    "active",
                    index === realIndex
                );

            }
        );

    }


    function nextSlide() {

        if (isAnimating) {

            return;

        }


        isAnimating =
            true;


        moveTo(
            currentIndex + 1
        );

    }


    function previousSlide() {

        if (isAnimating) {

            return;

        }


        isAnimating =
            true;


        moveTo(
            currentIndex - 1
        );

    }


    track.addEventListener(
        "transitionend",
        () => {

            isAnimating =
                false;


            if (
                currentIndex >=
                totalSlides * 2
            ) {

                moveTo(
                    currentIndex -
                    totalSlides,
                    false
                );

            }


            if (
                currentIndex <
                totalSlides
            ) {

                moveTo(
                    currentIndex +
                    totalSlides,
                    false
                );

            }

        }
    );


    nextButton.addEventListener(
        "click",
        () => {

            nextSlide();

            restartAutoSlide();

        }
    );


    prevButton.addEventListener(
        "click",
        () => {

            previousSlide();

            restartAutoSlide();

        }
    );


    dots.forEach(
        dot => {

            dot.addEventListener(
                "click",
                () => {

                    const target =
                        Number(
                            dot.dataset.slide
                        );


                    const realCurrent =
                        (
                            currentIndex -
                            totalSlides
                        ) % totalSlides;


                    let difference =
                        target -
                        realCurrent;


                    if (
                        difference <
                        -totalSlides / 2
                    ) {

                        difference +=
                            totalSlides;

                    }


                    if (
                        difference >
                        totalSlides / 2
                    ) {

                        difference -=
                            totalSlides;

                    }


                    moveTo(
                        currentIndex +
                        difference
                    );


                    restartAutoSlide();

                }
            );

        }
    );


    function startAutoSlide() {

        stopAutoSlide();


        autoSlideTimer =
            setInterval(
                () => {

                    if (!isPaused) {

                        nextSlide();

                    }

                },
                4200
            );

    }


    function stopAutoSlide() {

        if (autoSlideTimer) {

            clearInterval(
                autoSlideTimer
            );


            autoSlideTimer =
                null;

        }

    }


    function restartAutoSlide() {

        stopAutoSlide();

        startAutoSlide();

    }


    carousel.addEventListener(
        "mouseenter",
        () => {

            isPaused =
                true;

        }
    );


    carousel.addEventListener(
        "mouseleave",
        () => {

            isPaused =
                false;

        }
    );


    let touchStartX = 0;

    let touchEndX = 0;

    let isTouching = false;


    viewport.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.touches[0].clientX;


            isTouching =
                true;


            isPaused =
                true;

        },
        {
            passive: true
        }
    );


    viewport.addEventListener(
        "touchmove",
        event => {

            if (!isTouching) {

                return;

            }


            touchEndX =
                event.touches[0].clientX;

        },
        {
            passive: true
        }
    );


    viewport.addEventListener(
        "touchend",
        () => {

            if (!isTouching) {

                return;

            }


            const distance =
                touchStartX -
                touchEndX;


            if (
                Math.abs(distance) >= 45
            ) {

                distance > 0
                    ? nextSlide()
                    : previousSlide();

            }


            touchStartX =
                0;


            touchEndX =
                0;


            isTouching =
                false;


            isPaused =
                false;


            restartAutoSlide();

        }
    );


    let mouseStartX = 0;

    let mouseEndX = 0;

    let isDragging = false;


    viewport.addEventListener(
        "mousedown",
        event => {

            mouseStartX =
                event.clientX;


            isDragging =
                true;


            track.classList.add(
                "is-dragging"
            );


            isPaused =
                true;

        }
    );


    window.addEventListener(
        "mousemove",
        event => {

            if (!isDragging) {

                return;

            }


            mouseEndX =
                event.clientX;

        }
    );


    window.addEventListener(
        "mouseup",
        () => {

            if (!isDragging) {

                return;

            }


            const distance =
                mouseStartX -
                mouseEndX;


            if (
                Math.abs(distance) >= 45
            ) {

                distance > 0
                    ? nextSlide()
                    : previousSlide();

            }


            isDragging =
                false;


            track.classList.remove(
                "is-dragging"
            );


            isPaused =
                false;


            restartAutoSlide();

        }
    );


    let resizeTimer;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    () => {

                        visibleCards =
                            getVisibleCards();


                        moveTo(
                            currentIndex,
                            false
                        );

                    },
                    150
                );

        }
    );


    requestAnimationFrame(
        () => {

            moveTo(
                currentIndex,
                false
            );


            startAutoSlide();

        }
    );

}


/* =========================================================
   STUDENT TESTIMONIAL SLIDER
   ========================================================= */

function initTestimonials() {

    const slider =
        document.querySelector(
            ".testimonial-slider"
        );


    if (!slider) {

        console.warn(
            "Testimonials slider not found."
        );

        return;
    }


    const viewport =
        slider.querySelector(
            ".testimonial-viewport"
        );


    const track =
        slider.querySelector(
            ".testimonial-track"
        );


    const cards =
        Array.from(
            slider.querySelectorAll(
                ".testimonial-card"
            )
        );


    const prevButton =
        slider.querySelector(
            ".testimonial-prev"
        );


    const nextButton =
        slider.querySelector(
            ".testimonial-next"
        );


    const dotsContainer =
        document.querySelector(
            ".testimonial-dots"
        );


    if (
        !viewport ||
        !track ||
        !cards.length ||
        !prevButton ||
        !nextButton
    ) {

        console.warn(
            "Testimonials slider elements missing."
        );

        return;
    }


    /* =====================================================
       STATE
       ===================================================== */

    let currentIndex =
        0;


    let autoSlideTimer =
        null;


    let isPaused =
        false;


    let isAnimating =
        false;


    /* =====================================================
       VISIBLE CARDS
       ===================================================== */

    function getVisibleCards() {

        if (
            window.innerWidth <= 650
        ) {

            return 1;

        }


        if (
            window.innerWidth <= 1000
        ) {

            return 2;

        }


        return 3;

    }


    /* =====================================================
       MAX INDEX
       ===================================================== */

    function getMaxIndex() {

        return Math.max(
            0,
            cards.length -
            getVisibleCards()
        );

    }


    /* =====================================================
       STEP
       ===================================================== */

    function getStep() {

        const card =
            cards[0];


        if (!card) {

            return 0;

        }


        const cardWidth =
            card.getBoundingClientRect().width;


        const style =
            window.getComputedStyle(
                track
            );


        const gap =
            parseFloat(
                style.columnGap ||
                style.gap ||
                0
            );


        return cardWidth + gap;

    }


    /* =====================================================
       CREATE DOTS
       ===================================================== */

    function createDots() {

        if (!dotsContainer) {

            return;

        }


        dotsContainer.innerHTML =
            "";


        const totalDots =
            getMaxIndex() + 1;


        for (
            let i = 0;
            i < totalDots;
            i++
        ) {

            const dot =
                document.createElement(
                    "button"
                );


            dot.type =
                "button";


            dot.className =
                "testimonial-dot";


            dot.setAttribute(
                "aria-label",
                `Go to testimonial position ${i + 1}`
            );


            dot.addEventListener(
                "click",
                () => {

                    goTo(
                        i
                    );


                    restartAutoSlide();

                }
            );


            dotsContainer.appendChild(
                dot
            );

        }

    }


    /* =====================================================
       UPDATE DOTS
       ===================================================== */

    function updateDots() {

        if (!dotsContainer) {

            return;

        }


        const dots =
            dotsContainer.querySelectorAll(
                ".testimonial-dot"
            );


        dots.forEach(
            (dot, index) => {

                dot.classList.toggle(
                    "active",
                    index === currentIndex
                );

            }
        );

    }


    /* =====================================================
       UPDATE BUTTONS
       ===================================================== */

    function updateButtons() {

        const maxIndex =
            getMaxIndex();


        prevButton.disabled =
            currentIndex === 0;


        nextButton.disabled =
            currentIndex >= maxIndex;


        prevButton.style.opacity =
            currentIndex === 0
                ? "0.35"
                : "1";


        nextButton.style.opacity =
            currentIndex >= maxIndex
                ? "0.35"
                : "1";

    }


    /* =====================================================
       MOVE
       ===================================================== */

    function moveTo(
        index,
        animate = true
    ) {

        const step =
            getStep();


        if (!step) {

            return;

        }


        const maxIndex =
            getMaxIndex();


        currentIndex =
            Math.max(
                0,
                Math.min(
                    index,
                    maxIndex
                )
            );


        track.style.transition =
            animate

                ? "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)"

                : "none";


        track.style.transform =
            `translate3d(${-currentIndex * step
            }px, 0, 0)`;


        updateDots();

        updateButtons();

    }


    /* =====================================================
       GO TO
       ===================================================== */

    function goTo(index) {

        if (isAnimating) {

            return;

        }


        isAnimating =
            true;


        moveTo(
            index,
            true
        );


        setTimeout(
            () => {

                isAnimating =
                    false;

            },
            700
        );

    }


    /* =====================================================
       NEXT
       ===================================================== */

    function nextSlide() {

        const maxIndex =
            getMaxIndex();


        if (
            currentIndex >= maxIndex
        ) {

            goTo(0);

        } else {

            goTo(
                currentIndex + 1
            );

        }

    }


    /* =====================================================
       PREVIOUS
       ===================================================== */

    function previousSlide() {

        const maxIndex =
            getMaxIndex();


        if (
            currentIndex <= 0
        ) {

            goTo(maxIndex);

        } else {

            goTo(
                currentIndex - 1
            );

        }

    }


    /* =====================================================
       BUTTONS
       ===================================================== */

    nextButton.addEventListener(
        "click",
        () => {

            nextSlide();

            restartAutoSlide();

        }
    );


    prevButton.addEventListener(
        "click",
        () => {

            previousSlide();

            restartAutoSlide();

        }
    );


    /* =====================================================
       AUTO SLIDE
       ===================================================== */

    function startAutoSlide() {

        stopAutoSlide();


        autoSlideTimer =
            setInterval(
                () => {

                    if (!isPaused) {

                        nextSlide();

                    }

                },
                4500
            );

    }


    function stopAutoSlide() {

        if (autoSlideTimer) {

            clearInterval(
                autoSlideTimer
            );


            autoSlideTimer =
                null;

        }

    }


    function restartAutoSlide() {

        stopAutoSlide();

        startAutoSlide();

    }


    /* =====================================================
       PAUSE ON HOVER
       ===================================================== */

    slider.addEventListener(
        "mouseenter",
        () => {

            isPaused =
                true;

        }
    );


    slider.addEventListener(
        "mouseleave",
        () => {

            isPaused =
                false;

        }
    );


    /* =====================================================
       TOUCH SWIPE
       ===================================================== */

    let touchStartX = 0;

    let touchEndX = 0;


    viewport.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.touches[0].clientX;


            isPaused =
                true;

        },
        {
            passive: true
        }
    );


    viewport.addEventListener(
        "touchmove",
        event => {

            touchEndX =
                event.touches[0].clientX;

        },
        {
            passive: true
        }
    );


    viewport.addEventListener(
        "touchend",
        () => {

            const distance =
                touchStartX -
                touchEndX;


            if (
                Math.abs(distance) >= 45
            ) {

                distance > 0
                    ? nextSlide()
                    : previousSlide();

            }


            touchStartX =
                0;


            touchEndX =
                0;


            isPaused =
                false;


            restartAutoSlide();

        }
    );


    /* =====================================================
       MOUSE DRAG
       ===================================================== */

    let mouseStartX = 0;

    let mouseEndX = 0;

    let isDragging =
        false;


    viewport.addEventListener(
        "mousedown",
        event => {

            mouseStartX =
                event.clientX;


            isDragging =
                true;


            isPaused =
                true;


            track.classList.add(
                "is-dragging"
            );

        }
    );


    window.addEventListener(
        "mousemove",
        event => {

            if (!isDragging) {

                return;

            }


            mouseEndX =
                event.clientX;

        }
    );


    window.addEventListener(
        "mouseup",
        () => {

            if (!isDragging) {

                return;

            }


            const distance =
                mouseStartX -
                mouseEndX;


            if (
                Math.abs(distance) >= 45
            ) {

                distance > 0
                    ? nextSlide()
                    : previousSlide();

            }


            isDragging =
                false;


            track.classList.remove(
                "is-dragging"
            );


            isPaused =
                false;


            restartAutoSlide();

        }
    );


    /* =====================================================
       RESIZE
       ===================================================== */

    let resizeTimer;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    () => {

                        currentIndex =
                            Math.min(
                                currentIndex,
                                getMaxIndex()
                            );


                        createDots();


                        moveTo(
                            currentIndex,
                            false
                        );

                    },
                    150
                );

        }
    );


    /* =====================================================
       INITIALIZE
       ===================================================== */

    createDots();


    requestAnimationFrame(
        () => {

            moveTo(
                0,
                false
            );


            startAutoSlide();

        }
    );

}


/* =========================================================
   INITIALIZE APPLICATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadAllComponents();

    }
);