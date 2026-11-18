(() => {
    const cards=[...document.querySelectorAll('.stack-card')];
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0;
    function measure(){
        frame=0;
        const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header'));
        const viewport=document.documentElement.clientHeight;
        cards.forEach(card=>{
            // A tall phone card scrolls through completely before its bottom pins.
            // Shorter cards pin beneath the navigation. All cards share one stack.
            const top=Math.min(header,viewport-card.offsetHeight-20);
            card.style.setProperty('--pin-top',top+'px');
        });
        document.documentElement.classList.toggle('stack-ready',!reduced.matches);
    }
    function schedule(){if(!frame)frame=requestAnimationFrame(measure);}
    new ResizeObserver(schedule).observe(document.querySelector('.wrap'));
    addEventListener('resize',schedule);
    reduced.addEventListener('change',schedule);
    measure();document.fonts.ready.then(measure);
})();
