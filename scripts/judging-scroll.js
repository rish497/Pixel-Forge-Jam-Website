(() => {
    const section = document.getElementById("judging");
    const wrap = section.querySelector(".wrap");
    const rail = section.querySelector(".criteria");
    const cards = [...rail.children];
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const stage = document.createElement("div");
    const scene = document.createElement("div");
    stage.className = "judging-stage";
    scene.className = "judging-scene";
    section.append(stage);
    stage.append(wrap);
    rail.before(scene);
    scene.append(rail);
    section.querySelectorAll(".reveal, .stagger").forEach((el) => {
        el.classList.remove("reveal", "stagger");
        el.classList.add("visible");
    });
    let enabled = false;
    let target = -1;
    let current = -1;
    let spacing = 600;
    let frame = 0;
    let lastTime = 0;
    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    function paint() {
        const active = Math.round(current);
        cards.forEach((card, index) => {
            const distance = index - current;
            card.style.transform = `translate(-50%, -50%) translateX(${distance * spacing}px)`;
            card.style.opacity = clamp(1.4 - Math.abs(distance) * 0.6, 0, 1);
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
        const progress = clamp((header - section.getBoundingClientRect().top) / (section.offsetHeight - stage.offsetHeight), 0, 1);
        target = clamp((progress - 0.03) / 0.92, 0, 1) * cards.length - 1;
        if (immediate) { current = target; paint(); }
        else if (!frame) frame = requestAnimationFrame(tick);
    }
    function configure() {
        enabled = !motion.matches && innerHeight >= 650;
        section.classList.toggle("judging-scroll-enabled", enabled);
        section.style.setProperty("--judging-slides", cards.length + 1);
        if (enabled) {
            spacing = scene.clientWidth + 48;
            readScroll(true);
        } else {
            cancelAnimationFrame(frame);
            frame = 0;
            cards.forEach((card) => {
                card.style.removeProperty("transform");
                card.style.removeProperty("opacity");
                delete card.dataset.current;
            });
        }
    }
    addEventListener("scroll", () => readScroll(), { passive: true });
    addEventListener("resize", configure);
    motion.addEventListener("change", configure);
    configure();
    document.fonts.ready.then(configure);
})();
