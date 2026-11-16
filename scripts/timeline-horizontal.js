(() => {
    const section=document.getElementById('process');
    const wrap=section.querySelector('.wrap');
    const rail=section.querySelector('.steps');
    const cards=[...rail.querySelectorAll('.step')];
    const reduce=matchMedia('(prefers-reduced-motion: reduce)');
    const stage=document.createElement('div');
    const viewport=document.createElement('div');
    stage.className='timeline-stage';viewport.className='timeline-viewport';
    section.append(stage);stage.append(wrap);rail.before(viewport);viewport.append(rail);
    rail.classList.add('timeline-rail');
    section.querySelector('.timeline-dot')?.remove();
    section.querySelectorAll('.reveal').forEach(el=>{el.classList.remove('reveal');el.classList.add('visible');});
    const stops=cards.map((card,index)=>{
        const stop=document.createElement('div');stop.className='timeline-stop';stop.dataset.side=index%2?'below':'above';
        const node=document.createElement('span');node.className='timeline-node';node.setAttribute('aria-hidden','true');
        const stem=document.createElement('span');stem.className='timeline-stem';stem.setAttribute('aria-hidden','true');
        card.before(stop);stop.append(node,stem,card);return stop;
    });
    const axis=document.createElement('div');axis.className='timeline-axis';axis.setAttribute('aria-hidden','true');
    const fill=document.createElement('div');fill.className='timeline-axis-fill';axis.append(fill);rail.prepend(axis);
    let enabled=false,travel=0,current=0,target=0,frame=0,lastTime=0;
    const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
    const headerHeight=()=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header'));

    function paint(){
        rail.style.transform=`translate3d(${-current}px,0,0)`;
        fill.style.transform=`scaleX(${travel?current/travel:0})`;
        const center=viewport.clientWidth/2;
        let active=0,closest=Infinity;
        stops.forEach((stop,index)=>{
            const x=stop.offsetLeft+stop.offsetWidth/2-current;
            if(Math.abs(x-center)<closest){closest=Math.abs(x-center);active=index;}
            stop.dataset.reached=String(x<=center+1);
        });
        cards.forEach((card,index)=>card.dataset.current=String(index===active));
    }
    function tick(time){
        frame=0;if(!enabled)return;
        const dt=Math.min(time-(lastTime||time-16),64);lastTime=time;
        current+=(target-current)*(1-Math.exp(-dt/90));
        if(Math.abs(target-current)<.05)current=target;
        paint();
        if(current!==target)frame=requestAnimationFrame(tick);else lastTime=0;
    }
    function readScroll(immediate=false){
        if(!enabled)return;
        const progress=clamp((headerHeight()-section.getBoundingClientRect().top)/(section.offsetHeight-stage.offsetHeight),0,1);
        target=clamp((progress-.06)/.88,0,1)*travel;
        if(immediate){current=target;paint();}else if(!frame)frame=requestAnimationFrame(tick);
    }
    function configure(){
        enabled=!reduce.matches&&innerWidth>=768;
        section.classList.toggle('horizontal-enabled',enabled);
        if(enabled){
            const above=Math.max(...cards.filter((_,i)=>i%2===0).map(c=>c.offsetHeight));
            const below=Math.max(...cards.filter((_,i)=>i%2===1).map(c=>c.offsetHeight));
            const required=above+below+80;
            if(viewport.clientHeight<required){enabled=false;section.classList.remove('horizontal-enabled');}
            else{
                const axisY=above+32+(viewport.clientHeight-above-below-64)/2;
                rail.style.setProperty('--timeline-axis-y',axisY+'px');
                travel=Math.max(0,rail.scrollWidth-viewport.clientWidth);
                section.style.setProperty('--timeline-scroll-height',(innerHeight-headerHeight()+Math.max(travel,innerHeight*1.5))+'px');
                readScroll(true);
            }
        }
        if(!enabled){
            cancelAnimationFrame(frame);frame=0;lastTime=0;
            section.style.removeProperty('--timeline-scroll-height');
            rail.style.removeProperty('transform');rail.style.removeProperty('--timeline-axis-y');fill.style.removeProperty('transform');
            cards.forEach(card=>delete card.dataset.current);stops.forEach(stop=>delete stop.dataset.reached);
        }
    }
    addEventListener('scroll',()=>readScroll(),{passive:true});
    addEventListener('resize',configure);reduce.addEventListener('change',configure);
    // Keep the workshop reachable by Tab even when its card is initially offscreen.
    rail.addEventListener('focusin',event=>{
        if(!enabled)return;
        const index=cards.indexOf(event.target.closest('.step'));if(index<0)return;
        const offset=clamp(stops[index].offsetLeft+stops[index].offsetWidth/2-viewport.clientWidth/2,0,travel);
        const progress=.06+(travel?offset/travel:0)*.88;
        scrollTo({top:scrollY+section.getBoundingClientRect().top-headerHeight()+progress*(section.offsetHeight-stage.offsetHeight),behavior:'instant'});
        readScroll(true);
    });
    configure();document.fonts.ready.then(configure);
})();
