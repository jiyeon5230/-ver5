/* Geographic coordinates are [longitude, latitude] in WGS84. */
window.TerrainGeo = (() => {
  const credits = {
    dem: 'https://registry.opendata.aws/terrain-tiles/',
    boundary: 'https://github.com/topojson/world-atlas',
    atlas: 'https://nationalatlas.ngii.go.kr/pages/page_3982.php',
    rivers: 'https://nationalatlas.ngii.go.kr/pages/page_3806.php'
  };
  const bounds = [123.55, 32.85, 132.55, 43.18];
  const taebaek = [[128.20,38.70],[128.46,38.12],[128.64,37.82],[128.74,37.52],[128.94,37.23],[129.02,36.94],[128.99,36.56],[129.02,36.12],[129.04,35.64]];
  const sobaek = [[128.91,37.23],[128.64,37.09],[128.48,36.95],[128.29,36.82],[127.96,36.55],[127.84,36.14],[127.74,35.86],[127.67,35.42],[127.47,35.31]];
  const northern = [[128.02,42.01],[128.54,41.63],[127.71,41.10],[127.36,40.57],[127.07,39.9],[126.81,39.35]];
  const hamgyeong = [[128.05,41.99],[128.95,41.71],[129.35,41.53],[129.75,41.85],[130.14,42.26]];
  const ranges = [taebaek, sobaek, northern, hamgyeong];
  const rivers = [
    { name: '한강 수계', label: [126.97,37.45], code: 'c', line: [[128.916,37.23],[128.72,37.25],[128.47,37.17],[128.27,37.01],[128.08,36.99],[127.91,37.08],[127.78,37.15],[127.63,37.26],[127.46,37.33],[127.43,37.49],[127.312,37.532],[127.19,37.55],[127.05,37.52],[126.92,37.53],[126.8,37.59],[126.67,37.65],[126.59,37.74],[126.54,37.776],[126.28,37.75]] },
    { name: '금강', label: [127.34,36.38], line: [[127.52,35.65],[127.57,36.01],[127.58,36.28],[127.39,36.52],[127.14,36.46],[126.91,36.28],[126.80,36.13],[126.68,36.0]] },
    { name: '낙동강', label: [128.52,35.68], line: [[128.98,37.18],[128.88,36.98],[128.72,36.60],[128.25,36.53],[128.25,36.28],[128.4,35.87],[128.46,35.54],[128.72,35.39],[128.95,35.11],[128.93,34.99]] },
    { name: '영산강', label: [126.62,35.08], line: [[126.99,35.36],[126.89,35.14],[126.72,35.03],[126.57,34.91],[126.43,34.81]] },
    { name: '대동강', label: [125.80,39.0], line: [[126.79,39.98],[126.39,39.63],[126.14,39.43],[125.95,39.23],[125.76,39.02],[125.62,38.93],[125.39,38.79],[125.13,38.71],[124.99,38.69]] }
  ];
  const reliefColors = [[204,223,172],[224,225,164],[238,218,158],[214,176,124],[173,136,112]];
  const thresholds = [100,300,700,1400];
  const features = [
    ['백두산',128.058,42.006,'mount','',-12,-11], ['설악산',128.465,38.119,'mount','a',10,-7],
    ['태백산맥',128.83,37.45,'mount','',43,1], ['소백산맥',127.95,36.41,'mount','',-20,-10],
    ['대동강',125.78,39.02,'water','',-11,-7], ['금강',127.34,36.38,'water','',-43,-4],
    ['낙동강',128.52,35.68,'water','',39,-4], ['한강 수계',127.03,37.52,'water','c',-35,13],
    ['나주평야',126.72,35.04,'plain','',-34,-10], ['김해평야',128.91,35.17,'plain','',40,5],
    ['강릉 정동진',129.036,37.684,'place','e',30,-7], ['태안 신두리',126.189,36.836,'place','f',-17,-3],
    ['여수 금오도',127.767,34.515,'place','g',21,20], ['울릉도',130.90,37.48,'place','u',-6,-9],
    ['독도',131.87,37.24,'place','v',8,14], ['제주도',126.55,33.38,'place','',15,9]
  ];
  const seas = [['황해',124.88,36.5],['동해',130.43,39.65],['남해',129.18,34.10]];
  const region = (name, lon, lat, km, zoom, exaggeration) => {
    const d = km / 222;
    const spread = d / Math.cos(lat * Math.PI / 180);
    return { name, km, zoom, exaggeration, bounds: [lon-spread, lat-d, lon+spread, lat+d] };
  };
  const regions = {
    mountain: region('설악산 대청봉 일대',128.446,38.127,14,12,2.4),
    river: region('한강 양평·팔당 일대',127.43,37.535,25,11,3),
    east: region('강릉 정동진 일대',129.035,37.683,22,12,3),
    west: region('태안 신두리 일대',126.183,36.828,22,12,3),
    south: region('여수 금오도 일대',127.763,34.559,22,12,3)
  };
  function mercator(lon, lat, zoom) {
    const n = 256 * 2 ** zoom;
    return [(lon + 180) / 360 * n, (1 - Math.asinh(Math.tan(lat * Math.PI / 180)) / Math.PI) / 2 * n];
  }
  const tileCache = new Map();
  function tile(zoom, x, y) {
    const key = `${zoom}/${x}/${y}`;
    if (tileCache.has(key)) return tileCache.get(key);
    const request = new Promise((resolve, reject) => {
      const image = new Image();
      const timer = setTimeout(() => reject(Error('DEM timeout')), 8500);
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        clearTimeout(timer);
        try {
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = 256;
          const context = canvas.getContext('2d', { willReadFrequently: true });
          context.drawImage(image, 0, 0);
          resolve(context.getImageData(0, 0, 256, 256).data);
        } catch (error) { reject(error); }
      };
      image.onerror = () => { clearTimeout(timer); reject(Error('DEM unavailable')); };
      image.src = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${key}.png`;
    }).catch(error => { tileCache.delete(key); throw error; });
    tileCache.set(key, request);
    return request;
  }
  async function loadHeight([west,south,east,north], zoom) {
    const [x0,y0] = mercator(west,north,zoom);
    const [x1,y1] = mercator(east,south,zoom);
    const tiles = new Map(), jobs = [];
    for (let y = y0 >> 8; y <= (Math.ceil(y1) >> 8); y++) for (let x = x0 >> 8; x <= (Math.ceil(x1) >> 8); x++)
      jobs.push(tile(zoom,x,y).then(bytes => tiles.set(x + '/' + y,bytes)));
    await Promise.all(jobs);
    const heightAt = (x,y) => {
      const bytes = tiles.get((x >> 8) + '/' + (y >> 8));
      const i = ((y & 255) * 256 + (x & 255)) * 4;
      return bytes[i] * 256 + bytes[i+1] + bytes[i+2] / 256 - 32768;
    };
    return (lon,lat) => {
      const [px,py] = mercator(Math.max(west,Math.min(east,lon)),Math.max(south,Math.min(north,lat)),zoom);
      const x = Math.floor(px), y = Math.floor(py), dx = px - x, dy = py - y;
      return (heightAt(x,y) * (1-dx) + heightAt(Math.ceil(px),y) * dx) * (1-dy)
        + (heightAt(x,Math.ceil(py)) * (1-dx) + heightAt(Math.ceil(px),Math.ceil(py)) * dx) * dy;
    };
  }
  let coastlineRequest;
  function loadCoast() {
    coastlineRequest ??= (async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8500);
      try {
        const response = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json', { signal: controller.signal });
        if (!response.ok) throw Error('Coast unavailable');
        return decodeCoast(await response.json());
      } finally { clearTimeout(timer); }
    })().catch(error => { coastlineRequest = null; throw error; });
    return coastlineRequest;
  }
  function decodeCoast(data) {
    const { scale, translate } = data.transform;
    const decode = id => {
      let x = 0, y = 0;
      const arc = data.arcs[id < 0 ? ~id : id].map(([dx,dy]) => {
        x += dx; y += dy;
        return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
      });
      return id < 0 ? arc.reverse() : arc;
    };
    const polygons = data.objects.countries.geometries.filter(g => ['408','410'].includes(g.id))
      .flatMap(g => g.type === 'Polygon' ? [g.arcs] : g.arcs);
    if (polygons.length < 2) throw Error('Missing Korean geometry');
    return polygons.map(polygon => polygon.map(ring => ring.flatMap((id,i) => decode(id).slice(i ? 1 : 0))));
  }
  // Generalized islands for offline use. Real coast vectors replace these when available.
  const islands = [
    [[126.14,33.32],[126.22,33.44],[126.47,33.53],[126.72,33.55],[126.94,33.48],[126.93,33.33],[126.69,33.25],[126.43,33.21],[126.24,33.26]],
    [[126.08,34.54],[126.19,34.57],[126.37,34.52],[126.33,34.40],[126.17,34.37],[126.08,34.44]],
    [[126.66,34.38],[126.79,34.41],[126.87,34.31],[126.77,34.24],[126.70,34.28]],
    [[127.82,34.89],[127.96,34.92],[128.06,34.83],[128.00,34.74],[127.86,34.74],[127.80,34.81]],
    [[128.51,34.96],[128.67,34.98],[128.76,34.85],[128.69,34.72],[128.55,34.74],[128.46,34.85]],
    [[126.31,37.81],[126.47,37.82],[126.54,37.69],[126.45,37.59],[126.34,37.63]],
    [[125.96,34.71],[126.11,34.79],[126.16,34.64],[126.02,34.61]],
    [[125.89,34.85],[125.99,34.90],[126.07,34.82],[125.94,34.77]],
    [[124.61,37.99],[124.71,38.00],[124.75,37.92],[124.63,37.91]],
    [[126.25,36.55],[126.37,36.55],[126.41,36.39],[126.35,36.39],[126.27,36.45]],
    [[130.79,37.49],[130.84,37.55],[130.94,37.55],[130.99,37.47],[130.91,37.42],[130.82,37.44]]
  ];
  const gaussian = n => Math.exp(-n*n);
  function approximateHeight(x,y) {
    let height = 45;
    for (const [i, points] of ranges.entries()) {
      let distance = Infinity;
      for (let j=1; j<points.length; j++) {
        const [a,b] = points[j-1], [c,d] = points[j], dx = (c-a)*.79, dy = d-b;
        const ax = (x-a)*.79, ay = y-b;
        const t = Math.max(0,Math.min(1,(ax*dx+ay*dy)/(dx*dx+dy*dy)));
        distance = Math.min(distance, Math.hypot(ax-dx*t, ay-dy*t));
      }
      height += (i < 2 ? 840 : 1020) * gaussian(distance/(i < 2 ? .37 : .57));
    }
    height += 1160 * gaussian(Math.hypot((x-128.06)*.79,y-42)/.30);
    height += 1500 * gaussian(Math.hypot((x-126.53)*.79,y-33.38)/.13);
    return Math.max(0, height + (Math.cos(x*19+y*7)*Math.sin(y*21-x*8)*.16 + Math.cos(x*56-y*35)*.065)*height);
  }
  return { credits, bounds, ranges, rivers, features, seas, reliefColors, thresholds, regions, loadHeight, loadCoast, decodeCoast, approximateHeight, islands };
})();
