(() => {
    const games=window.JAM3_GAMES;
    const gallery=document.getElementById('gallery');
    const stream=document.getElementById('stream');
    const toggle=document.getElementById('motion-toggle');
    const status=document.getElementById('motion-status');
    const title=document.getElementById('focus-title');
    const detail=document.getElementById('focus-detail');
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const fine=matchMedia('(hover: hover) and (pointer: fine)');
    const speed=32; // CSS pixels per second down the diagonal, never resets in view.
    let tiles=[],width=0,height=0,coverWidth=280,coverHeight=230,step=54,slope=.6,period=0;
    let phase=0,selected=null,selectionType=null,paused=false,inView=true,raf=0,lastTime=0,focusAmount=0;
    let lastReduced=reduced.matches;
    let lastSelectedIndex=null;
    let suppressTouchClick=false;
    const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
    const wrap=n=>((n+period/2)%period+period)%period-period/2;
    const basePosition=index=>wrap((index-tiles.length/2)*step-phase);

    function updateStatus() {
        toggle.disabled=reduced.matches;
        toggle.setAttribute('aria-pressed',String(paused));
        toggle.querySelector('span').textContent=reduced.matches?'Motion off':paused?'Resume motion':'Pause motion';
        toggle.querySelector('path').setAttribute('d',paused?'M9 5l10 7-10 7z':'M9 6v12M15 6v12');
        status.textContent=reduced.matches?'Reduced motion · Select a cover to focus':selected!==null?'Paused · '+games[tiles[selected].gameIndex].title:paused?'Paused · Select a cover to focus':fine.matches?'Moving down-left · Hover to pause':'Moving down-left · Tap a cover to focus';
        gallery.dataset.focusing=String(selected!==null);
        if(selected!==null){const game=games[tiles[selected].gameIndex];title.textContent=game.title;detail.textContent=(game.author?'by '+game.author+' · ':'')+'Open on itch.io';}
    }
    function select(index,type) {
        if(selected===index&&selectionType===type)return;
        selected=index;selectionType=index===null?null:type;
        if(index!==null)lastSelectedIndex=index;
        if(index!==null&&(type==='keyboard'||type==='touch')){
            const position=basePosition(index);
            if(Math.abs(position)>width/2-coverWidth*.6-20||Math.abs(position*slope)>height/2-coverHeight*.6-24){
                // Bring the entire row along its own axis; never lift a selected cover out of it.
                phase=((phase+position)%period+period)%period;
            }
        }
        updateStatus();wake();
    }
    function paint() {
        const anchor=selected===null?lastSelectedIndex:selected;
        const selectedPosition=anchor===null?0:basePosition(anchor);
        const nearest=new Map();
        tiles.forEach((tile,index)=>{const distance=Math.abs(basePosition(index));if(!nearest.has(tile.gameIndex)||distance<nearest.get(tile.gameIndex).distance)nearest.set(tile.gameIndex,{index,distance});});
        tiles.forEach((tile,index)=>{
            const position=basePosition(index);
            const isSelected=index===selected;
            // Open only the leading (down-left) side. The selected cover never moves,
            // changes angle, scales, or leaves the plane of the row.
            const spread=position<selectedPosition?-coverWidth*.9*focusAmount:0;
            const x=position+spread,y=-(position+spread)*slope;
            tile.element.style.transform=`translate(-50%, -50%) translate3d(${x}px,${y}px,0) rotateY(-34deg) rotateZ(10deg)`;
            tile.visual.style.opacity=selected===null||isSelected?1:1-focusAmount*.72;
            tile.element.style.zIndex=Math.round(period-position);
            tile.element.dataset.focused=String(isSelected);
            tile.element.tabIndex=nearest.get(tile.gameIndex).index===index?0:-1;
        });
        gallery.dataset.phase=phase.toFixed(3);
    }
    function tick(time) {
        raf=0;
        if(!inView||document.hidden){lastTime=0;return;}
        if(lastReduced!==reduced.matches){lastReduced=reduced.matches;updateStatus();}
        const dt=Math.min(time-(lastTime||time-16),48);lastTime=time;
        const moving=!paused&&selected===null&&!reduced.matches;
        if(moving)phase=(phase+speed*dt/1000)%period;
        const focusTarget=selected===null?0:1;
        focusAmount=reduced.matches?focusTarget:focusAmount+(focusTarget-focusAmount)*(1-Math.exp(-dt/155));
        if(Math.abs(focusTarget-focusAmount)<.001)focusAmount=focusTarget;
        paint();
        if(moving||focusAmount!==focusTarget)raf=requestAnimationFrame(tick);
        else lastTime=0;
    }
    function wake() {if(!raf&&inView&&!document.hidden)raf=requestAnimationFrame(tick);}
    function cover(game,lazy=false) {
        if(game.image){const image=document.createElement('img');image.src=game.image;image.alt='';image.width=315;image.height=250;image.draggable=false;image.decoding='async';if(lazy)image.loading='lazy';return image;}
        const fallback=document.createElement('span');fallback.className='cover-fallback';
        const name=document.createElement('span');name.className='cover-fallback-title';name.textContent=game.title;
        const note=document.createElement('span');note.className='cover-fallback-note';note.textContent='No thumbnail available';
        fallback.append(name,note);return fallback;
    }
    function build() {
        const oldGame=selected===null?null:tiles[selected]?.gameIndex;
        width=gallery.clientWidth;height=gallery.clientHeight;
        coverWidth=width<600?220:clamp(width*.235,260,340);coverHeight=coverWidth*500/630;
        step=width<600?42:58;slope=width<600?1.05:.61;
        const count=Math.max(24,Math.ceil((width+coverWidth*4)/step/games.length)*games.length);
        period=count*step;
        stream.style.setProperty('--cover-width',coverWidth+'px');stream.style.setProperty('--cover-height',coverHeight+'px');
        stream.replaceChildren();tiles=[];
        for(let index=0;index<count;index++){
            const gameIndex=index%games.length,game=games[gameIndex];
            const element=document.createElement(game.url?'a':'button');
            element.className='game-tile';element.dataset.index=index;element.dataset.game=gameIndex;
            element.setAttribute('aria-label',game.title+(game.author?' by '+game.author:'')+' — Open game on itch.io');
            if(game.url){element.href=game.url;element.target='_blank';element.rel='noopener noreferrer';}else element.type='button';
            const visual=cover(game);
            element.append(visual);stream.append(element);tiles.push({element,visual,gameIndex});
        }
        selected=oldGame===null?null:tiles.findIndex(tile=>tile.gameIndex===oldGame);
        lastSelectedIndex=selected;
        updateStatus();paint();wake();
    }
    gallery.addEventListener('pointermove',event=>{
        if(event.pointerType!=='mouse'||!fine.matches||selectionType==='keyboard')return;
        const tile=event.target.closest('.game-tile');
        select(tile?Number(tile.dataset.index):null,'mouse');
    });
    gallery.addEventListener('pointerleave',()=>{if(selectionType==='mouse')select(null,null);});
    gallery.addEventListener('pointerdown',event=>{
        const tile=event.target.closest('.game-tile');
        if(event.pointerType==='touch'&&tile){const index=Number(tile.dataset.index);suppressTouchClick=selected!==index;if(suppressTouchClick)select(index,'touch');else if(!games[tiles[index].gameIndex].url)select(null,null);}
    });
    gallery.addEventListener('click',event=>{if(suppressTouchClick&&event.target.closest('.game-tile')){event.preventDefault();suppressTouchClick=false;}});
    gallery.addEventListener('focusin',event=>{
        const tile=event.target.closest('.game-tile');
        if(tile&&tile.matches(':focus-visible'))select(Number(tile.dataset.index),'keyboard');
    });
    gallery.addEventListener('focusout',event=>{if(!gallery.contains(event.relatedTarget)&&selectionType==='keyboard')select(null,null);});
    gallery.addEventListener('keydown',event=>{
        if(event.key==='Escape'){select(null,null);gallery.focus({preventScroll:true});return;}
        if(!['ArrowLeft','ArrowRight'].includes(event.key)||selected===null)return;
        event.preventDefault();
        const gameIndex=(tiles[selected].gameIndex+(event.key==='ArrowRight'?1:-1)+games.length)%games.length;
        const next=tiles.map((tile,index)=>({tile,index})).filter(({tile})=>tile.gameIndex===gameIndex).sort((a,b)=>Math.abs(basePosition(a.index))-Math.abs(basePosition(b.index)))[0];
        select(next.index,'keyboard');next.tile.element.focus({preventScroll:true});
    });
    document.addEventListener('pointerdown',event=>{if(!gallery.contains(event.target)&&selectionType==='touch')select(null,null);});
    toggle.addEventListener('click',()=>{paused=!paused;updateStatus();wake();});
    reduced.addEventListener('change',()=>{updateStatus();paint();wake();});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)wake();});
    new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;if(inView)wake();},{threshold:0}).observe(gallery);
    let resizeFrame=0;
    new ResizeObserver(()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(build);}).observe(gallery);
    document.getElementById('entries-summary').textContent=`${games.length} games · ${games.filter(game=>game.image).length} thumbnails`;
    document.getElementById('index-heading').textContent=`Browse all ${games.length} games`;
    const grid=document.getElementById('game-grid');
    games.forEach(game=>{
        const link=document.createElement('a');link.className='catalog-card';link.href=game.url;link.target='_blank';link.rel='noopener noreferrer';
        link.append(cover(game,true));
        const info=document.createElement('div');info.className='catalog-info';
        const name=document.createElement('h2');name.textContent=game.title;const author=document.createElement('p');author.textContent=game.author;
        info.append(name,author);link.append(info);grid.append(link);
    });
    build();
})();
