(() => {
    const section = document.getElementById("process");
    const wrap = section.querySelector(".wrap");
    const stack = section.querySelector(".steps");
    const cards = [...stack.querySelectorAll(".step")];
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const stage = document.createElement("div");
    const scene = document.createElement("div");
    stage.className = "process-stage";
    scene.className = "timeline-stack-scene";
    section.append(stage);
    stage.append(wrap);
    stack.before(scene);
    scene.append(stack);
    section.querySelector(".timeline-dot")?.remove();
    section.querySelectorAll(".reveal").forEach((el) => {
        el.classList.remove("reveal");
        el.classList.add("visible");
    });

    let enabled = false;
    let target = 0;
    let current = 0;
    let entranceDistance = 600;
    let frame = 0;
    let lastTime = 0;
    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    function paint() {
        const active = Math.round(current);
        cards.forEach((card, index) => {
            const arrival = index === 0 ? 1 : clamp(current - index + 1, 0, 1);
            const depth = clamp(current - index, 0, 3);
            const lift = (1 - arrival) * entranceDistance - depth * 12;
            card.style.transform = `translate(-50%, -50%) translateY(${lift}px) scale(${1 - depth * 0.035})`;
            card.style.opacity = arrival === 0 ? 0 : 1;
            card.style.zIndex = index + 1;
            card.style.pointerEvents = index === active ? "auto" : "none";
            card.dataset.current = String(index === active);
        });
    }
    function tick(time) {
        frame = 0;
        if (!enabled) return;
        const dt = Math.min(time - (lastTime || time - 16), 64);
        lastTime = time;
        current += (target - current) * (1 - Math.exp(-dt / 85));
        if (Math.abs(target - current) < 0.001) current = target;
        paint();
        if (current !== target) frame = requestAnimationFrame(tick);
        else lastTime = 0;
    }
    function readScroll(immediate = false) {
        if (!enabled) return;
        const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header"));
        const distance = section.offsetHeight - stage.offsetHeight;
        const progress = clamp((header - section.getBoundingClientRect().top) / distance, 0, 1);
        target = clamp((progress - 0.05) / 0.9, 0, 1) * (cards.length - 1);
        if (immediate) { current = target; paint(); }
        else if (!frame) frame = requestAnimationFrame(tick);
    }
    function configure() {
        enabled = !motion.matches && innerHeight >= 600;
        section.classList.toggle("stack-enabled", enabled);
        section.style.setProperty("--timeline-items", cards.length);
        section.style.removeProperty("--stack-card-height");
        if (enabled) {
            const tallest = Math.max(...cards.map((card) => card.offsetHeight));
            section.style.setProperty("--stack-card-height", `${tallest}px`);
            entranceDistance = scene.offsetHeight / 2 + tallest / 2 + 40;
            readScroll(true);
        }
        else {
            cancelAnimationFrame(frame);
            frame = 0;
            stack.style.removeProperty("transform");
            cards.forEach((card) => {
                card.style.removeProperty("transform");
                card.style.removeProperty("opacity");
                card.style.removeProperty("z-index");
                card.style.removeProperty("pointer-events");
                delete card.dataset.current;
            });
        }
    }
    addEventListener("scroll", () => readScroll(), { passive: true });
    addEventListener("resize", configure);
    motion.addEventListener("change", configure);
    // Tabbing to the workshop must bring its card into view, too.
    stack.addEventListener("focusin", (event) => {
        if (!enabled) return;
        const index = cards.indexOf(event.target.closest(".step"));
        if (index < 0) return;
        const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header"));
        const progress = 0.05 + index / (cards.length - 1) * 0.9;
        const top = scrollY + section.getBoundingClientRect().top - header + progress * (section.offsetHeight - stage.offsetHeight);
        scrollTo({ top, behavior: "instant" });
        readScroll(true);
    });
    configure();
    document.fonts.ready.then(configure);
})();

