(() => {
    const section=document.getElementById('recognition');
    const content=section.querySelector('.recognition-grid');
    const rail=section.querySelector('.awards');
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const stage=document.createElement('div');stage.className='prizes-stage';
    const viewport=document.createElement('div');viewport.className='prizes-viewport';
    section.append(stage);stage.append(content);rail.before(viewport);viewport.append(rail);
    section.querySelectorAll('.reveal').forEach(el=>{el.classList.remove('reveal');el.classList.add('visible');});
    let enabled=false,travel=0,current=0,target=0,frame=0,last=0,layoutWidth=0,phoneExtraRows=0;
    const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
    const header=()=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header'));
    function paint(){rail.style.transform=`translate3d(${-current}px,0,0)`;}
    function tick(time){
        frame=0;if(!enabled)return;
        const dt=Math.min(time-(last||time-16),64);last=time;
        current+=(target-current)*(1-Math.exp(-dt/90));
        if(Math.abs(target-current)<.05)current=target;
        paint();if(current!==target)frame=requestAnimationFrame(tick);else last=0;
    }
    function read(immediate=false){
        if(!enabled)return;
        const distance=section.offsetHeight-stage.offsetHeight;
        const progress=clamp((header()-section.getBoundingClientRect().top)/distance,0,1);
        target=clamp((progress-.04)/.92,0,1)*travel;
        if(immediate){current=target;paint();}else if(!frame)frame=requestAnimationFrame(tick);
    }
    function configure(){
        cancelAnimationFrame(frame);frame=0;last=0;
        enabled=!reduced.matches;
        section.classList.toggle('prizes-pinned',enabled);
        rail.style.removeProperty('transform');rail.scrollLeft=0;
        if(enabled){
            const phone=innerWidth<1024;
            const lists=[...rail.querySelectorAll('.prize-list')];
            if(phone){
                const column=Math.max(220,viewport.clientWidth-34);
                section.style.setProperty('--prize-phone-width',viewport.clientWidth+'px');
                section.style.setProperty('--prize-list-column',column+'px');
                if(layoutWidth!==innerWidth||!phoneExtraRows)phoneExtraRows=viewport.clientHeight>=360?2:1;
                if(viewport.clientHeight<360)phoneExtraRows=1;
                section.style.setProperty('--prize-extra-rows',phoneExtraRows);
                lists.forEach(list=>{
                    let rows=layoutWidth===innerWidth?Number(list.style.getPropertyValue('--prize-rows')):0;
                    rows=rows||list.children.length;
                    const card=list.closest('.prize-card');
                    do{
                        list.style.setProperty('--prize-rows',rows);
                        const bottom=card.getBoundingClientRect().bottom-parseFloat(getComputedStyle(card).paddingBottom)-1;
                        if(list.getBoundingClientRect().bottom<=bottom+1)break;
                    }while(--rows>=1);
                });
            }else lists.forEach(list=>list.style.removeProperty('--prize-rows'));
            layoutWidth=innerWidth;
            // Never pin a layout that would crop any prize, including at browser zoom.
            const cards=[...rail.querySelectorAll('.prize-card')];
            const bounds=viewport.getBoundingClientRect();
            const fits=cards.every(card=>{
                const box=card.getBoundingClientRect();
                return box.top>=bounds.top-1&&box.bottom<=bounds.bottom+1&&card.scrollHeight<=card.clientHeight+1&&card.scrollWidth<=card.clientWidth+1;
            });
            if(!fits){enabled=false;section.classList.remove('prizes-pinned');}
            else{
                travel=Math.max(0,rail.scrollWidth-viewport.clientWidth);
                section.style.setProperty('--prizes-scroll-height',(stage.offsetHeight+Math.max(travel,innerHeight*2))+'px');
                read(true);
            }
        }
        if(!enabled){section.style.removeProperty('--prizes-scroll-height');rail.style.removeProperty('transform');current=target=0;}
    }
    function goTo(offset){
        const progress=.04+.92*clamp(offset/travel,0,1);
        scrollTo({top:scrollY+section.getBoundingClientRect().top-header()+progress*(section.offsetHeight-stage.offsetHeight),behavior:'instant'});
        read(true);
    }
    rail.addEventListener('keydown',event=>{
        if(!enabled||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
        event.preventDefault();
        goTo(event.key==='Home'?0:event.key==='End'?travel:target+(event.key==='ArrowRight'?1:-1)*viewport.clientWidth*.8);
    });
    rail.addEventListener('focusin',event=>{
        if(!enabled||event.target===rail)return;
        const card=event.target.closest('.prize-card');if(!card)return;
        const x=card.getBoundingClientRect().left-viewport.getBoundingClientRect().left+current;
        goTo(x);
    });
    addEventListener('scroll',()=>read(),{passive:true});
    addEventListener('resize',configure);reduced.addEventListener('change',configure);
    configure();document.fonts.ready.then(configure);
})();
