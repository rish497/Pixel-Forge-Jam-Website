(() => {
    const games=window.JAM3_GAMES;
    const gallery=document.getElementById('judging');
    const title=document.getElementById('focus-title');
    const detail=document.getElementById('focus-detail');
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const fine=matchMedia('(hover: hover) and (pointer: fine)');
    const speed=52;
    let tiles=[],width=0,height=0,coverWidth=280,coverHeight=230,step=58,slope=.61,period=1,duration=1;
    let phase=0,startedAt=0,running=false,inView=false,selected=null,selectionType=null;
    let wrapTimer=0,resizeFrame=0,pointerX=null,pointerY=null,suppressTouchClick=false;
    const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
    const wrap=n=>((n+period/2)%period+period)%period-period/2;
    const clock=()=>document.timeline.currentTime||0;
    const currentPhase=()=>running?(phase+(clock()-startedAt)*speed/1000)%period:phase;
    const position=(index,p=currentPhase())=>wrap((index-tiles.length/2)*step-p);
    const animationTime=(index,p)=>(period/2-position(index,p))/period*duration;
    const transform=x=>`translate(-50%, -50%) translate3d(${x}px,${-x*slope}px,0) rotateY(-18deg) rotateZ(4deg)`;

    function updateOrder(){
        const p=currentPhase();
        tiles.forEach((tile,index)=>{
            const raw=(index-tiles.length/2)*step-p;
            const z=tiles.length*2-index+Math.floor((raw+period/2)/period)*tiles.length;
            if(tile.z!==z){tile.element.style.zIndex=z;tile.z=z;}
        });
    }
    function scheduleWrap(){
        clearTimeout(wrapTimer);
        if(!running)return;
        // Only recycle the offscreen card's ordering; travel stays on the compositor.
        const remaining=step-(currentPhase()%step);
        wrapTimer=setTimeout(()=>{updateOrder();scheduleWrap();},remaining/speed*1000+12);
    }
    function pause(){
        clearTimeout(wrapTimer);
        const p=currentPhase();running=false;phase=p;
        tiles.forEach((tile,index)=>{tile.motion.pause();tile.motion.currentTime=animationTime(index,p);});
        updateOrder();gallery.dataset.phase=p.toFixed(3);
    }
    function play(){
        startedAt=clock();running=true;
        tiles.forEach((tile,index)=>{const time=animationTime(index,phase);tile.motion.play();tile.motion.startTime=startedAt-time;});
        updateOrder();scheduleWrap();
    }
    function sync(){
        const shouldPlay=selected===null&&!reduced.matches&&inView&&!document.hidden;
        if(shouldPlay&&!running)play();
        else if(!shouldPlay&&running)pause();
    }
    function applyFocus(){
        const p=currentPhase();
        const anchor=selected===null?0:position(selected,p);
        const pinned=selected===null?0:parseFloat(getComputedStyle(tiles[selected].element).translate)||0;
        tiles.forEach((tile,index)=>{
            const focused=index===selected;
            const shift=selected===null?0:pinned+(!focused&&position(index,p)<anchor?-coverWidth*.9:0);
            tile.element.style.translate=`${shift}px ${-shift*slope}px`;
            tile.visual.style.opacity=selected===null||focused?1:.28;
            tile.element.dataset.focused=String(focused);
        });
        gallery.dataset.focusing=String(selected!==null);
        if(selected!==null){const game=games[tiles[selected].gameIndex];title.textContent=game.title;detail.textContent=(game.author?'by '+game.author+' · ':'')+'Open on itch.io';}
    }
    function select(index,type){
        if(selected===index&&selectionType===type)return;
        if(running)pause();
        selected=index;selectionType=index===null?null:type;
        if(index!==null&&(type==='keyboard'||type==='touch')){
            const x=position(index);
            if(Math.abs(x)>width/2-coverWidth*.6-20||Math.abs(x*slope)>height/2-coverHeight*.6-24){
                phase=((phase+x)%period+period)%period;
                tiles.forEach((tile,i)=>{tile.motion.currentTime=animationTime(i,phase);});
                updateOrder();
            }
        }
        applyFocus();sync();
    }
    function cover(game){
        if(game.image){const image=document.createElement('img');image.src=game.image;image.alt='';image.width=315;image.height=250;image.draggable=false;image.decoding='async';return image;}
        const fallback=document.createElement('span');fallback.className='cover-fallback';
        const name=document.createElement('span');name.className='cover-fallback-title';name.textContent=game.title;
        const note=document.createElement('span');note.className='cover-fallback-note';note.textContent='No thumbnail available';fallback.append(name,note);return fallback;
    }
    function build(){
        const nextWidth=gallery.clientWidth,nextHeight=gallery.clientHeight;
        if(tiles.length&&width===nextWidth&&height===nextHeight)return;
        const oldPeriod=period;if(running)pause();
        const fraction=phase/oldPeriod;width=nextWidth;height=nextHeight;
        coverWidth=width<600?220:clamp(width*.235,260,340);coverHeight=coverWidth*500/630;
        step=width<600?42:58;slope=width<600?1.05:.61;
        gallery.style.setProperty('--cover-width',coverWidth+'px');gallery.style.setProperty('--cover-height',coverHeight+'px');
        if(!tiles.length){
            games.forEach((game,index)=>{
                const element=document.createElement('a');element.className='game-tile';element.dataset.index=index;element.dataset.game=index;
                element.href=game.url;element.target='_blank';element.rel='noopener noreferrer';
                element.setAttribute('aria-label',game.title+(game.author?' by '+game.author:'')+' — Open game on itch.io');
                const visual=cover(game);element.append(visual);gallery.append(element);tiles.push({element,visual,gameIndex:index,motion:null,z:null});
            });
        }
        period=tiles.length*step;duration=period/speed*1000;phase=fraction*period;
        tiles.forEach((tile,index)=>{
            tile.motion?.cancel();
            tile.motion=tile.element.animate([{transform:transform(period/2)},{transform:transform(-period/2)}],{duration,iterations:Infinity,easing:'linear',fill:'both'});
            tile.motion.id='jam3-stream';tile.motion.pause();tile.motion.currentTime=animationTime(index,phase);
        });
        updateOrder();sync();
    }
    gallery.addEventListener('pointermove',event=>{
        if(event.pointerType!=='mouse'||!fine.matches||selectionType==='keyboard')return;
        if(pointerX!==null&&Math.hypot(event.clientX-pointerX,event.clientY-pointerY)<3)return;
        pointerX=event.clientX;pointerY=event.clientY;
        const tile=event.target.closest('.game-tile');select(tile?Number(tile.dataset.index):null,'mouse');
    });
    gallery.addEventListener('pointerleave',()=>{pointerX=null;pointerY=null;if(selectionType==='mouse')select(null,null);});
    gallery.addEventListener('pointerdown',event=>{
        const tile=event.target.closest('.game-tile');
        if(event.pointerType==='touch'&&tile){const index=Number(tile.dataset.index);suppressTouchClick=selected!==index;if(suppressTouchClick)select(index,'touch');}
    });
    gallery.addEventListener('click',event=>{if(suppressTouchClick&&event.target.closest('.game-tile')){event.preventDefault();suppressTouchClick=false;}});
    gallery.addEventListener('focusin',event=>{const tile=event.target.closest('.game-tile');if(tile&&tile.matches(':focus-visible'))select(Number(tile.dataset.index),'keyboard');});
    gallery.addEventListener('focusout',event=>{if(!gallery.contains(event.relatedTarget)&&selectionType==='keyboard')select(null,null);});
    gallery.addEventListener('keydown',event=>{
        if(event.key==='Escape'){select(null,null);gallery.focus({preventScroll:true});return;}
        if(!['ArrowLeft','ArrowRight'].includes(event.key)||selected===null)return;
        event.preventDefault();const index=(selected+(event.key==='ArrowRight'?1:-1)+tiles.length)%tiles.length;
        select(index,'keyboard');tiles[index].element.focus({preventScroll:true});
    });
    document.addEventListener('pointerdown',event=>{if(!gallery.contains(event.target)&&selectionType==='touch')select(null,null);});
    reduced.addEventListener('change',()=>{sync();applyFocus();});
    document.addEventListener('visibilitychange',sync);
    new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;sync();},{threshold:0}).observe(gallery);
    new ResizeObserver(()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(build);}).observe(gallery);
    build();
})();
