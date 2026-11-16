// Progressive enhancement: without JavaScript, both sections remain in normal flow.
(() => {
    const about = document.getElementById("about");
    const theme = document.getElementById("theme");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const story = document.createElement("div");
    const stage = document.createElement("div");
    story.className = "about-theme-story";
    stage.className = "about-theme-stage";
    about.before(story);
    story.append(stage);
    stage.append(about, theme);

    // The two visual halves share identical layout. Only the original is accessible.
    const rightHalf = about.cloneNode(true);
    rightHalf.removeAttribute("id");
    rightHalf.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
    rightHalf.classList.add("about-right-half");
    rightHalf.setAttribute("aria-hidden", "true");
    rightHalf.inert = true;
    stage.append(rightHalf);
    [about, theme, rightHalf].forEach((panel) => {
        panel.querySelectorAll(".reveal").forEach((el) => {
            el.classList.remove("reveal", "scale-in");
            el.classList.add("visible");
        });
    });

    let enabled = false;
    let travel = 0;
    let frame = 0;
    let lastProgress = -1;
    const halves = [about, rightHalf].map((panel, index) => {
        const animation = panel.animate(
            [{ transform: "translateX(0)" }, { transform: `translateX(${index ? 52 : -52}%)` }],
            { duration: 1000, fill: "both", easing: "linear" },
        );
        animation.pause();
        return animation;
    });

    function paint() {
        frame = 0;
        if (!enabled) return;
        const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header"));
        const progress = Math.max(0, Math.min(1, (header - story.getBoundingClientRect().top) / travel));
        // Give each slide reading time before and after the split.
        const split = Math.max(0, Math.min(1, (progress - 0.2) / 0.6));
        if (split === lastProgress) return;
        lastProgress = split;
        halves.forEach((animation) => { animation.currentTime = split * 1000; });
    }
    function schedulePaint() {
        if (enabled && !frame) frame = requestAnimationFrame(paint);
    }
    function configure() {
        const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header"));
        const available = innerHeight - header;
        // Short viewports get ordinary scrolling so no copy can be clipped.
        story.classList.add("story-active");
        const required = Math.max(about.firstElementChild.scrollHeight, theme.firstElementChild.scrollHeight) + 80;
        enabled = !motion.matches && available >= required;
        story.classList.toggle("story-active", enabled);
        travel = Math.max(available * 1.7, 1);
        story.style.setProperty("--story-height", `${available + travel}px`);
        stage.style.setProperty("--stage-height", `${available}px`);
        lastProgress = -1;
        if (enabled) {
            halves.forEach((animation) => { animation.pause(); });
            paint();
        } else {
            halves.forEach((animation) => animation.cancel());
        }
    }
    function goToSlide(id, behavior = "auto") {
        const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header"));
        const start = scrollY + story.getBoundingClientRect().top - header;
        scrollTo({ top: start + (id === "theme" ? travel * 0.82 : 0), behavior });
    }
    document.querySelectorAll('a[href="#about"], a[href="#theme"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            if (!enabled || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            const id = link.hash.slice(1);
            history.pushState(null, "", link.hash);
            goToSlide(id);
        });
    });
    addEventListener("scroll", schedulePaint, { passive: true });
    addEventListener("resize", configure);
    motion.addEventListener("change", configure);
    addEventListener("hashchange", () => {
        if (enabled && ["#about", "#theme"].includes(location.hash)) goToSlide(location.hash.slice(1));
    });
    configure();
    document.fonts.ready.then(() => {
        configure();
        if (enabled && ["#about", "#theme"].includes(location.hash)) goToSlide(location.hash.slice(1));
    });
})();

