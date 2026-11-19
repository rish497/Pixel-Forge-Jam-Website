(() => {
    const section=document.getElementById('recognition');
    const cards=[...section.querySelectorAll('.prize-stack-card')];
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const phone=matchMedia('(max-width:767px)');
    let frame=0;
    function measure(){
        frame=0;
        const active=phone.matches&&!reduced.matches;
        section.classList.toggle('prize-stack-ready',active);
        if(!active){cards.forEach(card=>card.style.removeProperty('--pin-top'));return;}
        const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header'));
        const viewport=document.documentElement.clientHeight;
        cards.forEach(card=>{
            // Read long cards in normal flow before pinning; short cards meet the nav.
            card.style.setProperty('--pin-top',Math.min(header,viewport-card.offsetHeight-20)+'px');
        });
    }
    function schedule(){if(!frame)frame=requestAnimationFrame(measure);}
    new ResizeObserver(schedule).observe(section.querySelector('.recognition-grid'));
    addEventListener('resize',schedule);
    reduced.addEventListener('change',schedule);
    phone.addEventListener('change',schedule);
    measure();document.fonts.ready.then(measure);
})();
