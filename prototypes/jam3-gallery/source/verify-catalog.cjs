const {chromium}=require(process.env.TEMP+'/pixelforge-qa/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const root=path.resolve(__dirname,'..');
  const entries=JSON.parse(fs.readFileSync(path.join(root,'games.json'),'utf8'));
  const source=JSON.parse(fs.readFileSync(path.join(__dirname,'entries-api.json'),'utf8')).jam_games;
  assert.equal(entries.length,source.length);
  assert.equal(new Set(entries.map(e=>e.id)).size,68);
  for(const entry of entries){const original=source.find(row=>row.game.id===entry.id).game;assert.equal(entry.title,original.title);assert.equal(entry.url,original.url);assert.equal(entry.thumbnailUrl,original.cover||null);}
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const results={entries:entries.length,thumbnails:entries.filter(e=>e.image).length,viewports:[],errors};
  for(const width of [390,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1100});
   await page.goto(require('node:url').pathToFileURL(path.join(root,'index.html')).href);
   await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll('.game-tile img')].map(i=>i.decode()));});
   const state=await page.evaluate(()=>({width:innerWidth,cards:document.querySelectorAll('.game-tile').length,uniqueLinks:new Set([...document.querySelectorAll('.game-tile')].map(e=>e.href)).size,images:document.querySelectorAll('.game-tile img').length,loaded:[...document.querySelectorAll('.game-tile img')].filter(i=>i.naturalWidth>0).length,fallbacks:document.querySelectorAll('.game-tile .cover-fallback').length,catalog:document.querySelectorAll('.catalog-card').length,overflow:document.documentElement.scrollWidth>innerWidth}));
   assert.equal(state.cards,68);assert.equal(state.uniqueLinks,68);assert.equal(state.images,65);assert.equal(state.loaded,65);assert.equal(state.fallbacks,3);assert.equal(state.catalog,68);assert.equal(state.overflow,false);
   await page.locator('.game-index summary').click();
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   await page.locator('.game-index summary').click();
   await page.evaluate(()=>scrollTo(0,0));
   if(width===1440){
    await page.waitForTimeout(500);await page.screenshot({path:path.join(root,'source','gallery-real-games.png'),fullPage:true});
    const point=await page.locator('#gallery').evaluate(e=>{const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};});await page.mouse.move(point.x,point.y);await page.waitForSelector('[data-focused="true"]');
    const transform=await page.locator('[data-focused="true"]').evaluate(e=>e.style.transform);const phase=await page.locator('#gallery').getAttribute('data-phase');
    await page.waitForTimeout(900);assert.equal(await page.locator('[data-focused="true"]').evaluate(e=>e.style.transform),transform);assert.equal(await page.locator('#gallery').getAttribute('data-phase'),phase);
    await page.screenshot({path:path.join(root,'source','gallery-real-games-hover.png'),fullPage:true});await page.mouse.move(1,1);await page.waitForTimeout(250);assert.notEqual(await page.locator('#gallery').getAttribute('data-phase'),phase);
   }
   results.viewports.push(state);
  }
  const touch=await page.evaluate(()=>{
   const tile=document.querySelector('.game-tile');const prevented=[];const listener=e=>{prevented.push(e.defaultPrevented);e.preventDefault();};document.addEventListener('click',listener);
   for(let i=0;i<2;i++){tile.dispatchEvent(new PointerEvent('pointerdown',{pointerType:'touch',bubbles:true}));tile.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));}
   document.removeEventListener('click',listener);return prevented;
  });assert.deepEqual(touch,[true,false]);results.touchFirstTapFocusSecondTapLink=true;
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(500);const phase=await page.locator('#gallery').getAttribute('data-phase');await page.waitForTimeout(400);assert.equal(await page.locator('#gallery').getAttribute('data-phase'),phase);results.reducedMotionStatic=true;
  assert.equal(errors.length,0);
  fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
