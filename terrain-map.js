window.TerrainMap = (() => {
  const geo = window.TerrainGeo;
  const W = 480, H = 490;
  const frames = [geo.bounds, [127.5, 35.9, 132.4, 39.5], [129.8, 36.65, 132.55, 38.13]];
  const models = { a:'mountain', c:'river', e:'east', f:'west', g:'south', v:'dokdo' };
  const palette = geo.reliefColors;
  let sequence = 0;
  let elevation, coastline, actualRaster, offlineRaster, dataRequest;
  function projection(zoom) {
    const [w,s,e,n] = frames[zoom];
    const scale = Math.min((W-48)/((e-w)*.79),(H-30)/(n-s));
    return ([lon,lat]) => [W/2+(lon-(w+e)/2)*scale*.79,H/2-(lat-(s+n)/2)*scale];
  }
  const f = n => Math.round(n * 100) / 100;
  function path(points, xy, closed = false) {
    return points.map((p,i) => (i ? 'L' : 'M') + xy(p).map(f).join(',')).join(' ') + (closed ? 'Z' : '');
  }
  function raster(sample) {
    const width = 400, height = 535;
    const [w,s,e,n] = geo.bounds;
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');
    const pixels = ctx.createImageData(width,height);
    const values = new Float32Array(width*height);
    for (let y=0;y<height;y++) for (let x=0;x<width;x++) values[x+y*width] = sample(w+x/(width-1)*(e-w),n-y/(height-1)*(n-s));
    for (let y=0;y<height;y++) for (let x=0;x<width;x++) {
      const i = x+y*width, h = values[i];
      let band = geo.thresholds.findIndex(limit => h < limit);
      if (band < 0) band = palette.length-1;
      const dx = values[y*width+Math.min(width-1,x+1)] - values[y*width+Math.max(0,x-1)];
      const dy = values[Math.min(height-1,y+1)*width+x] - values[Math.max(0,y-1)*width+x];
      const shade = Math.max(.72,Math.min(1.13,1+(dx*.64+dy*.78)/1250));
      for (let c=0;c<3;c++) pixels.data[i*4+c] = palette[band][c]*shade;
      pixels.data[i*4+3] = 255;
    }
    ctx.putImageData(pixels,0,0);
    return canvas.toDataURL('image/png');
  }
  function shapes(outline, xy) {
    const land = coastline || [[outline], ...geo.islands.map(r => [r])];
    return land.map(poly => '<path fill-rule="evenodd" d="' + poly.map(ring => path(ring,xy,true)).join('') + '"/>').join('');
  }
  function compass() {
    return `<g class="atlas-compass" transform="translate(438 53)" aria-label="북쪽이 위">
      <circle r="26"/><path d="M0,-12 V14 M-14,0 H14 M-4,-7 L0,-14 L4,-7"/>
      <text y="-18">북</text><text x="20" y="3">동</text><text y="23">남</text><text x="-20" y="3">서</text>
    </g>`;
  }
  function render(codes, places, outline, options = {}) {
    const { zoom = 0, pick = false, arrows = false, guide = false, overview = false, worksheet = false, compact = false, marked = [] } = options;
    const xy = projection(zoom), token = ++sequence;
    const all = overview ? 'acefguv' : codes;
    const classes = `atlas-map ${compact ? 'compact-atlas' : ''}`;
    const drawDot = (code,i) => {
      const [x,y] = xy(places[code]).map(f);
      const label = places[code][2];
      const target = pick ? `data-map-choice="${code}"` : guide && models[code] ? `data-map-model="${models[code]}"` : worksheet ? `data-island="${code}"` : '';
      const normalOffsets = { a:[10,-7], c:[-12,18], e:[12,11], f:[-11,3], g:[10,17], u:[-7,-10], v:[8,15] };
      const [dx,dy] = normalOffsets[code] || [8,-8];
      const caption = overview && code === 'c' ? '한강 수계' : label;
      const labelLayer = overview ? `data-atlas-name-layer="${code==='a' ? 'mount' : code==='c' ? 'water' : 'place'}"` : '';
      const role = target ? 'role="button" tabindex="0"' : '';
      const numbered = pick || (worksheet && !marked.includes(code));
      return `<g class="atlas-dot ${target ? 'atlas-active' : ''} ${numbered ? 'atlas-number' : ''}" ${target} ${role}
        aria-label="${worksheet && numbered ? `지도 ${i+1}번 점` : label}" transform="translate(${x} ${y})">
        <circle r="${numbered ? 10 : 5}"/>
        ${numbered ? `<text y="4" text-anchor="middle">${i+1}</text>` :
          `<text ${labelLayer} x="${dx}" y="${dy}" text-anchor="${dx<0 ? 'end' : 'start'}">${caption}</text>`}
      </g>`;
    };
    const featureLabels = geo.features.filter(([,lon,lat,,,])=> {
      const [x,y] = xy([lon,lat]); return x>12 && x<W-12 && y>12 && y<H-12;
    }).filter(([, , , , code])=> !code || !all.includes(code)).map(([name,lon,lat,layer,,dx,dy])=> {
      const [x,y] = xy([lon,lat]).map(f);
      return `<g class="atlas-feature feat-${layer}" ${!overview ? 'hidden' : ''} transform="translate(${x} ${y})"><path d="M0 0L${dx*.73} ${dy*.73}"/><circle r="2.3"/><text x="${dx}" y="${dy}" text-anchor="${dx<0 ? 'end' : 'start'}">${name}</text></g>`;
    }).join('');
    const rangeLines = geo.ranges.map((line,i)=>`<path class="atlas-range" data-range-index="${i}" d="${path(line,xy)}"/>`).join('');
    const riverLines = geo.rivers.map(({line},i)=>`<path class="atlas-river" data-river-index="${i}" d="${path(line,xy)}"/>`).join('');
    const arrowLines = arrows ? geo.rivers.slice(0,arrows === 'han' ? 1 : 3).map(({line}) =>
      `<path class="atlas-arrow" marker-end="url(#flow-${token})" d="${path(arrows === 'han' ? line : line.slice(-4),xy)}"/>`).join('') : '';
    const seaNames = (zoom ? [['동해',130.37,37.04]] : geo.seas).map(([name,x,y])=>{
      const [X,Y]=xy([x,y]); return `<text x="${X}" y="${Y}" class="sea-name">${name}</text>`;
    }).join('');
    const [west,south,east,north] = geo.bounds;
    const [rx,ry] = xy([west,north]), [right,bottom] = xy([east,south]);
    const shore = shapes(outline,xy);
    const controls = compact ? '' : `<nav class="atlas-tools" aria-label="지도 조작">
      <button type="button" data-atlas-zoom="1" aria-label="지도 확대">＋</button><button type="button" data-atlas-zoom="-1" aria-label="지도 축소">−</button>
      <button type="button" data-atlas-zoom="0">처음 범위</button>
      <details><summary>이름표</summary><div class="atlas-layers">${[['mount','산지'],['water','하천'],['plain','평야'],['place','지명']].map(([key,label])=>
        `<label><input data-layer="${key}" type="checkbox" ${overview ? 'checked' : ''}> ${label}</label>`).join('')}</div></details>
      <button type="button" data-real-map>실제 지도 자료 불러오기</button>
    </nav>`;
    const legend = compact ? '' : `<div class="atlas-legend"><span data-elevation-legend>${elevation ? '고도(m)' : '높낮이'}</span>
      ${palette.map((color,i)=>`<span><i style="background:rgb(${color.join(',')})"></i><b data-band="${i}">${elevation ? ['100 미만','100~300','300~700','700~1,400','1,400 이상'][i] : ['낮음','','','','높음'][i]}</b></span>`).join('')}
      <span><i class="legend-river"></i>하천</span><span><i class="legend-ridge"></i>산맥</span></div>`;
    return `<div class="${classes}">${controls}
      <svg data-atlas-svg viewBox="0 0 ${W} ${H}" ${compact ? '' : 'tabindex="0"'} role="group" aria-label="우리나라 지형 지도. 북쪽이 위입니다.">
        <defs><clipPath id="land-${token}" data-atlas-clip>${shore}</clipPath>
          <marker id="flow-${token}" viewBox="0 0 9 9" refX="8" refY="4.5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L9 4.5L0 9Z" fill="#126586"/></marker></defs>
        <rect width="${W}" height="${H}" rx="12" fill="#d7eef3"/>
        <g data-atlas-view>
          <g class="atlas-land-fill" data-atlas-fill>${shore}</g>
          <image data-atlas-raster x="${rx}" y="${ry}" width="${right-rx}" height="${bottom-ry}" preserveAspectRatio="none" clip-path="url(#land-${token})"/>
          <g class="atlas-shore" data-atlas-shore>${shore}</g>
          ${zoom<2 ? rangeLines + riverLines + arrowLines : ''}
          ${seaNames}
          ${zoom ? `<path class="islands-line" d="${path([places.u,places.v],xy)}"/>` : ''}
          ${featureLabels}${[...all].map(drawDot).join('')}
        </g>${compass()}
      </svg>${legend}
      ${compact ? '' : `<p class="map-caption" data-atlas-status>${sourceText()}</p>
      <details class="map-sources"><summary>지형도 자료</summary>
        <a href="${geo.credits.atlas}" target="_blank" rel="noopener">대한민국 국가지도집</a> ·
        <a href="${geo.credits.rivers}" target="_blank" rel="noopener">하천 지형</a> ·
        <a href="${geo.credits.dem}" target="_blank" rel="noopener">Mapzen Terrain Tiles</a> ·
        <a href="${geo.credits.boundary}" target="_blank" rel="noopener">Natural Earth / World Atlas</a></details>`}</div>`;
  }
  function sourceText() {
    return `${elevation ? '표고: Mapzen Terrain Tiles.' : '높낮이: 산지 분포를 참고한 학습용 표현.'} ${coastline ? '해안선: Natural Earth.' : '해안선: 단순화한 학습용 경계.'} 물길과 산맥은 지도 축척에 맞춰 단순화했어요.`;
  }
  function bind(root, outline, { zoom = 0, onModel, onIsland, onPaint, automatic = false } = {}) {
    const map = root.querySelector?.('.atlas-map');
    if (!map) return;
    const svg = map.querySelector('[data-atlas-svg]');
    const view = map.querySelector('[data-atlas-view]');
    const status = map.querySelector('[data-atlas-status]');
    const realButton = map.querySelector('[data-real-map]');
    const xy = projection(zoom);
    let scale = 1, tx = 0, ty = 0, moved = false, start;
    const activePointers = new Map();
    function apply() {
      const min = scale > 1 ? 1-scale : -.12;
      const max = scale > 1 ? 0 : .12;
      tx = Math.min(max*W,Math.max(min*W,tx)); ty = Math.min(max*H,Math.max(min*H,ty));
      view.setAttribute('transform',`translate(${tx} ${ty}) scale(${scale})`);
    }
    function magnify(next,x=W/2,y=H/2) {
      next = Math.min(5,Math.max(1,next));
      const ratio = next/scale;
      tx = x-(x-tx)*ratio; ty = y-(y-ty)*ratio; scale = next;
      apply();
    }
    function coords(event) {
      const point = svg.createSVGPoint();
      point.x = event.clientX; point.y = event.clientY;
      return point.matrixTransform(svg.getScreenCTM().inverse());
    }
    svg.addEventListener('pointerdown',e=>{
      if (e.button!==0) return;
      const p=coords(e);
      activePointers.set(e.pointerId,p);
      if (activePointers.size===1) { start=p; moved=false; }
    });
    svg.addEventListener('pointermove',e=>{
      if (!activePointers.has(e.pointerId)) return;
      const p=coords(e), old=activePointers.get(e.pointerId);
      const other=[...activePointers.entries()].find(([key])=>key!==e.pointerId)?.[1];
      activePointers.set(e.pointerId,p);
      if (!moved && !other && Math.hypot(p.x-start.x,p.y-start.y)<4) return;
      if (!svg.hasPointerCapture(e.pointerId)) svg.setPointerCapture(e.pointerId);
      moved=true;
      if (other) {
        magnify(scale*Math.hypot(p.x-other.x,p.y-other.y)/Math.max(1,Math.hypot(old.x-other.x,old.y-other.y)),(p.x+other.x)/2,(p.y+other.y)/2);
      } else { tx+=p.x-old.x; ty+=p.y-old.y; apply(); }
    });
    for (const type of ['pointerup','pointercancel','pointerleave']) svg.addEventListener(type,e=>activePointers.delete(e.pointerId));
    svg.addEventListener('wheel',e=>{ e.preventDefault(); const p=coords(e); magnify(scale*Math.exp(-e.deltaY*.002),p.x,p.y); },{passive:false});
    svg.addEventListener('click',e=>{ if (moved && e.detail) { e.preventDefault(); e.stopImmediatePropagation(); } },true);
    svg.addEventListener('keydown',e=>{
      if (e.target!==svg) return;
      const shifts = { ArrowLeft:[24,0], ArrowRight:[-24,0], ArrowUp:[0,24], ArrowDown:[0,-24] };
      if (!shifts[e.key]) return;
      e.preventDefault(); tx+=shifts[e.key][0]; ty+=shifts[e.key][1]; apply();
    });
    map.querySelectorAll('[data-atlas-zoom]').forEach(b=>b.onclick=()=>{
      const d=Number(b.dataset.atlasZoom);
      if (d) magnify(scale*1.38**d);
      else { scale=1;tx=ty=0;apply(); }
    });
    map.querySelectorAll('[data-layer]').forEach(box=>box.onchange=()=>{
      const layer=box.dataset.layer;
      view.querySelectorAll(`.feat-${layer},[data-atlas-name-layer="${layer}"]`).forEach(el=>el.toggleAttribute('hidden',!box.checked));
    });
    const interaction = (query, fn, key) => {
      if (!fn) return;
      view.querySelectorAll(query).forEach(el=>{
        el.onclick=()=>fn(el.dataset[key]);
        el.onkeydown=e=>{ if (e.key==='Enter'||e.key===' ') {e.preventDefault();el.dispatchEvent(new MouseEvent('click',{bubbles:true}));} };
      });
    };
    interaction('[data-map-model]',onModel,'mapModel');
    interaction('[data-island]',onIsland,'island');
    interaction('[data-map-choice]',()=>{},'mapChoice');
    if (onPaint) {
      for (const [type,selector,key] of [['mount','[data-range-index]','rangeIndex'],['water','[data-river-index]','riverIndex']]) {
        view.querySelectorAll(selector).forEach(el=>{
          el.classList.add('atlas-paintable');
          el.onclick=()=>onPaint(type,Number(el.dataset[key]));
        });
      }
    }
    function refresh() {
      if (!map.isConnected) return;
      try {
        if (elevation && !actualRaster) actualRaster = raster(elevation);
        if (!elevation && !offlineRaster) offlineRaster = raster(geo.approximateHeight);
        const href = elevation ? actualRaster : offlineRaster;
        map.querySelector('[data-atlas-raster]').setAttribute('href',href);
      } catch { /* Land fill works without canvas. */ }
      if (coastline) {
        const shore = shapes(outline,xy);
        for (const name of ['clip','fill','shore']) map.querySelector('[data-atlas-'+name+']').innerHTML=shore;
      }
      if (status) status.textContent = sourceText();
      if (elevation && realButton) {
        map.querySelector('[data-elevation-legend]').textContent='고도(m)';
        const readings=['100 미만','100~300','300~700','700~1,400','1,400 이상'];
        map.querySelectorAll('[data-band]').forEach(el=>el.textContent=readings[Number(el.dataset.band)]);
      }
    }
    function load() {
      if (realButton) realButton.disabled=true;
      if (status) status.textContent='공개 지도 자료를 불러오는 중이에요. 지금 보이는 지도도 사용할 수 있어요.';
      dataRequest ??= Promise.allSettled([
        elevation || geo.loadHeight(geo.bounds,7).then(result=>{elevation=result;}),
        coastline || geo.loadCoast().then(result=>{coastline=result;})
      ]).then(results=>{ if (results.some(r=>r.status==='rejected')) dataRequest=null; });
      dataRequest.then(()=>{
        refresh();
        if (realButton) {
          realButton.disabled=Boolean(elevation&&coastline);
          realButton.textContent=elevation&&coastline ? '실제 지도 자료 적용' : '실제 지도 자료 다시 시도';
        }
        if (status && !(elevation&&coastline)) status.textContent += ' 연결되지 않은 자료는 학습용 표현을 유지해요.';
      });
    }
    refresh();
    if (realButton) realButton.onclick=load;
    if (automatic) load();
    return view;
  }
  return { render, bind, projection };
})();
