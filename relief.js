/* Offline relief models. Coordinates are in model units, north is −z. */
window.createLearningRelief = function (T, World, textSprite) {
  const clamp = T.MathUtils.clamp;
  const smooth = (x, a, b) => T.MathUtils.smoothstep(x, a, b);
  const bell = x => Math.exp(-x * x);
  const texture = (x, z) => Math.sin(x * .8 + z * .39) * Math.cos(z * .61 - x * .21);
  const ridge = (x, z, position, width, height) =>
    bell((x - position) / width) * height * smooth(z, -24, -18) * (1 - smooth(z, 16, 24));

  const ridgeEast = z => 7 + 2.2 * Math.sin(z * .17);
  const ridgeWest = z => -11 + 2 * Math.sin(z * .15 + 1.1);
  const mountain = (x, z) => .65
    + ridge(x, z, ridgeEast(z), 5.4, 4.8 + 7 * bell((z + 10) / 4.5) + 5.3 * bell((z - 8) / 5))
    + ridge(x, z, ridgeWest(z), 5.7, 3.9 + 5.8 * bell((z + 4) / 5) + 4 * bell((z - 12) / 4.7))
    + .29 * texture(x, z);

  const center = z => 3.9 * Math.sin((z + 4) * .18) + 1.7 * Math.sin(z * .31);
  const waterLevel = z => 3.0 - (z + 24) * .048;
  const channel = z => 1.05 + 1.65 * smooth(z, -11, 20);
  function river(x, z) {
    const distance = Math.abs(x - center(z));
    const width = channel(z);
    const up = 1 - smooth(z, -12, 14);
    const bank = smooth(distance, width * .55, width * 1.37);
    const valleyWall = smooth(distance, width * 1.4 + (1 - up) * 5, 13 + (1 - up) * 5);
    return waterLevel(z) - .84 + bank * (1.48 + texture(x, z) * .14)
      + valleyWall * (up * (8.2 + 1.5 * texture(x * .48, z)) + (1 - up) * .72);
  }

  const islands = {
    east: [],
    west: [[-16, 12, 3.2, 2.1], [7, 14, 3.1, 2.9], [16, 16, 2.7, 1.7]],
    south: [[-18, 12, 4, 2.6], [-10, 19, 3.2, 2.4], [-3, 11, 3.1, 2.4], [4, 18, 4.4, 3.6], [12, 12, 3.8, 3], [20, 17, 2.7, 2.2], [-18, 21, 2.5, 1.5]]
  };
  function island(u, v, a, b, width, depth, height, slope = 4) {
    const r = Math.hypot((u - a) / width, (v - b) / depth);
    const shore = smooth(1 - r + .09 * texture(u, v), 0, 1 / slope);
    return -1.65 + shore * (2.1 + height * (1 - Math.min(r, 1)));
  }
  function coast(type, x, z) {
    const [u, v] = type === 'east' ? [z, x] : type === 'west' ? [z, -x] : [x, z];
    const shore = type === 'east' ? 2 + 1.05 * Math.sin(u * .24)
      : 2 + 4.6 * Math.sin(u * .26) + 2.3 * Math.sin(u * .55 + 1.4);
    const inland = shore - v;
    const cliff = type === 'east' ? smooth(u, -16, -8) * (1 - smooth(u, 1, 7))
      : type === 'south' ? .75 * smooth(u, 4, 10) : 0;
    const slope = -1.65 + 6.1 * smooth(inland, -3, 11) + 1.5 * smooth(inland, 9, 22);
    const steeper = -1.65 + 8.1 * smooth(inland, -.7, 1.1) + 1.15 * smooth(inland, 4, 14);
    const mainland = T.MathUtils.lerp(slope, steeper, cliff)
      + .27 * texture(u, v) * smooth(inland, 0, 6);
    return Math.max(mainland, ...islands[type].map(shape => island(u, v, ...shape, type === 'south' ? 4.6 : 2.4)));
  }
  function dokdo(x, z) {
    return Math.max(
      island(x, z, -9, -2, 8.8, 7, 11.6, 5.1),
      island(x, z, 8, 2.8, 7.8, 6.6, 6.4, 5),
      island(x, z, -1.9, -8, 1.65, 1.8, 2.1),
      island(x, z, 14.6, 9.2, 1.45, 1.05, 1.6));
  }
  const models = {
    mountain: { height: mountain, yaw: -.33, side: 0, labels: [
      ['높은 봉우리', ridgeEast(-10), -10], ['낮은 봉우리', ridgeWest(12), 12],
      ['능선', ridgeEast(0), 0], ['골짜기', -1, 1]
    ] },
    river: { height: river, yaw: -.68, side: -1.1, labels: [
      ['좁은 골짜기', center(-15), -15], ['넓은 하천 주변', center(15) + 5, 15]
    ] },
    east: { height: (x, z) => coast('east', x, z), yaw: 1.08, side: 1.57, labels: [
      ['급한 구간', 2.4, -7], ['완만한 구간', 1, 13]
    ] },
    west: { height: (x, z) => coast('west', x, z), yaw: -1.08, side: -1.57, labels: [
      ['완만한 해안', -3, 7], ['섬', -14, 7]
    ] },
    south: { height: (x, z) => coast('south', x, z), yaw: -.32, side: 0, labels: [
      ['육지', 4, -10], ['섬', 4, 18]
    ] },
    dokdo: { height: dokdo, yaw: -.32, side: 0, labels: [
      ['서도', -9, -2], ['동도', 8, 2.8], ['바위섬', 14.6, 9.2]
    ] }
  };
  const colors = Object.fromEntries(Object.entries({
    low: 0xb5ca85, forest: 0x63824d, rock: 0xaba68d, peak: 0xd3c7ac,
    sand: 0xe7cb97, bed: 0x629fa3, earth: 0xa78a67, deep: 0x776553, grass: 0x9fb878
  }).map(([key, value]) => [key, new T.Color(value)]));
  const perimeter = [i => [-24 + 48 * i, -24], i => [24, -24 + 48 * i],
    i => [24 - 48 * i, 24], i => [-24, 24 - 48 * i]];

  function surfaceColor(kind, x, y, z, slope, out) {
    if (kind === 'mountain') {
      out.copy(colors.low).lerp(colors.forest, smooth(y, .5, 5))
        .lerp(colors.rock, smooth(y, 5.6, 9) * .82 + smooth(slope, .4, 1.05) * .18)
        .lerp(colors.peak, smooth(y, 8, 12));
    } else if (kind === 'river') {
      out.copy(colors.sand).lerp(colors.grass, smooth(Math.abs(x - center(z)), channel(z), channel(z) + 2))
        .lerp(colors.forest, smooth(y - waterLevel(z), 1.9, 6.3));
    } else {
      out.copy(colors.bed).lerp(colors.sand, smooth(y, -.45, .3))
        .lerp(colors.grass, smooth(y, .35, 3.4))
        .lerp(colors.rock, smooth(y, .45, 2) * (kind === 'dokdo' ? .96 : smooth(slope, .44, 1.7) * .95));
    }
    out.multiplyScalar(1 + .075 * texture(x, z));
  }

  function buildGround(root, kind, height) {
    const n = 180;
    const geometry = new T.PlaneGeometry(48, 48, n, n);
    geometry.rotateX(-Math.PI / 2);
    const vertices = geometry.attributes.position;
    const color = new T.Color();
    const rgb = [];
    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i), z = vertices.getZ(i), y = height(x, z);
      const slope = Math.hypot(height(x + .18, z) - y, height(x, z + .18) - y) / .18;
      vertices.setY(i, y);
      surfaceColor(kind, x, y, z, slope, color);
      rgb.push(color.r, color.g, color.b);
    }
    geometry.computeVertexNormals();
    geometry.setAttribute('color', new T.Float32BufferAttribute(rgb, 3));
    root.add(new T.Mesh(geometry, new T.MeshStandardMaterial({ vertexColors: true, roughness: .96 })));

    // The sides use the same samples as the surface so the cut face follows the relief exactly.
    const edgePositions = [], edgeColors = [], edgeFaces = [];
    for (const edge of perimeter) {
      const start = edgePositions.length / 3;
      for (let i = 0; i <= n; i++) {
        const [x, z] = edge(i / n);
        const y = height(x, z);
        for (const [level, tint] of [[y, colors.earth], [(y - 3.5) / 2, colors.earth], [-3.5, colors.deep]]) {
          edgePositions.push(x, level, z);
          const factor = 1 + .095 * Math.sin(x * 1.7 + z * 1.7 + level * 2);
          edgeColors.push(tint.r * factor, tint.g * factor, tint.b * factor);
        }
        if (i < n) {
          const a = start + i * 3;
          edgeFaces.push(a, a + 1, a + 3, a + 1, a + 4, a + 3,
            a + 1, a + 2, a + 4, a + 2, a + 5, a + 4);
        }
      }
    }
    const section = new T.BufferGeometry();
    section.setAttribute('position', new T.Float32BufferAttribute(edgePositions, 3));
    section.setAttribute('color', new T.Float32BufferAttribute(edgeColors, 3));
    section.setIndex(edgeFaces);
    section.computeVertexNormals();
    root.add(new T.Mesh(section, new T.MeshStandardMaterial({ vertexColors: true, side: T.DoubleSide })));
  }

  function buildWater(root, kind, height, actual = false) {
    const material = new T.MeshStandardMaterial({ color: 0x3b9eae, side: T.DoubleSide, roughness: .41 });
    if (kind !== 'river') {
      const sea = new T.Mesh(new T.PlaneGeometry(48, 48), material);
      sea.rotation.x = -Math.PI / 2;
      if (actual) sea.position.y = .015;
      root.add(sea);
      const position = [], faces = [];
      for (const edge of perimeter) {
        const start = position.length / 3;
        for (let i = 0; i <= 180; i++) {
          const [x, z] = edge(i / 180);
          position.push(x, 0, z, x, Math.min(0, height(x, z)), z);
          if (i < 180) {
            const a = start + i * 2;
            faces.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
          }
        }
      }
      const edge = new T.BufferGeometry();
      edge.setAttribute('position', new T.Float32BufferAttribute(position, 3));
      edge.setIndex(faces);
      edge.computeVertexNormals();
      root.add(new T.Mesh(edge, new T.MeshStandardMaterial({ color: 0x398593, side: T.DoubleSide })));
      return;
    }
    const positions = [], faces = [];
    for (let i = 0; i <= 220; i++) {
      const z = -24 + 48 * i / 220, x = center(z);
      const w = channel(z) * 1.33;
      positions.push(Math.max(-24, x - w), waterLevel(z), z, Math.min(24, x + w), waterLevel(z), z);
      if (i < 220) {
        const a = i * 2;
        faces.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
      }
    }
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
    geo.setIndex(faces);
    geo.computeVertexNormals();
    root.add(new T.Mesh(geo, material));
  }

  function addLabels(root, spec) {
    const labels = new T.Group();
    for (const [name, x, z] of spec.labels) {
      const y = Math.max(spec.height(x, z), 0);
      const label = textSprite(name);
      label.position.set(x, y + 2.1, z);
      label.scale.set(6.5, 2, 1);
      const line = new T.Line(new T.BufferGeometry().setFromPoints([
        new T.Vector3(x, y + .08, z), new T.Vector3(x, y + 2.1, z)
      ]), new T.LineBasicMaterial({ color: 0x365644 }));
      const pin = new T.Mesh(new T.SphereGeometry(.28, 12, 8), new T.MeshBasicMaterial({ color: 0xf9ddb3 }));
      pin.position.set(x, y + .16, z);
      labels.add(label, line, pin);
    }
    root.add(labels);
    return labels;
  }

  const baseReset = World.prototype.reset;
  World.prototype.reset = function () {
    if (this.mode === 'lesson') this.lessonView('angle');
    else baseReset.call(this);
  };
  World.prototype.lessonView = function (view) {
    const spec = models[this.lessonKind];
    this.yaw = view === 'top' ? 0 : view === 'side' ? spec.side : spec.yaw;
    this.pitch = view === 'top' ? Math.PI / 2 - .001 : view === 'side' ? .16 : .69;
    this.distance = this.lessonDistance();
    this.updateCamera(true);
  };
  World.prototype.lessonDistance = function () {
    return Math.max(85, 78 / Math.max(.75, this.camera.aspect));
  };
  World.prototype.learningRelief = function (kind, view = 'angle', sample = null) {
    this.clear();
    this.mode = 'lesson';
    this.placing = false;
    this.lessonKind = kind;
    let spec = models[kind];
    if (sample) {
      const region = window.TerrainGeo.regions[kind];
      const [w,s,e,n] = region.bounds;
      const mult = 48 * region.exaggeration / (region.km * 1000);
      const offset = kind === 'river' ? 22 : 0;
      const height = (x,z) => clamp((sample(w+(x/48+.5)*(e-w),n-(z/48+.5)*(n-s))-offset)*mult,-2.7,18);
      const names = {
        mountain: [['대청봉',128.465,38.119]],
        river: [['두물머리',127.312,37.532],['팔당댐',127.279,37.526]],
        east: [['정동진',129.035,37.689]],
        west: [['신두리 해안',126.186,36.836]],
        south: [['금오도',127.773,34.530]]
      };
      const labels = names[kind].map(([name,lon,lat])=>[name,48*((lon-w)/(e-w)-.5),48*((n-lat)/(n-s)-.5)]);
      spec = { ...spec,height,labels };
    }
    buildGround(this.root, sample && kind === 'river' ? 'mountain' : kind, spec.height);
    if (kind !== 'mountain' && !(sample && kind === 'river')) buildWater(this.root, kind, spec.height, Boolean(sample));
    this.lessonLabels = addLabels(this.root, spec);
    this.flowArrows = new T.Group();
    if (kind === 'river' && !sample) {
      for (const z of [-20, -13, -6, 1, 8, 15, 21]) {
        const direction = new T.Vector3(center(z + 1.5) - center(z - 1.5), -.144, 3).normalize();
        const origin = new T.Vector3(center(z), waterLevel(z) + .4, z);
        this.flowArrows.add(new T.ArrowHelper(direction, origin, 2.4, 0xffe8a3, 1.12, .9));
      }
      this.root.add(this.flowArrows);
    }
    this.lessonView(view);
  };
};
