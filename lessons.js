window.createTerrainLessons = function (app) {
  const { $, esc, action, guide, outline } = app;
  const map = window.TerrainMap;
  const geo = window.TerrainGeo;
  const models = {
    mountain: ['산지', '설악산을 지도에서 찾아요. 모형을 옆에서 보면 봉우리 높이와 사면의 경사가, 위에서 보면 이어진 능선과 그 사이 골짜기가 보여요.'],
    river: ['하천', '한강 수계와 연결해요. 같은 물길을 따라 좁은 골짜기와 넓고 낮은 땅을 비교하고, 화살표로 상류에서 하류로 이어지는 흐름을 확인해요.'],
    east: ['동해안', '강릉 정동진 일대와 연결해요. 위에서 해안선과 섬을 살펴본 뒤, 바다 쪽에서 급한 구간과 완만한 구간을 비교해요.'],
    west: ['서해안', '태안 신두리 일대와 연결해요. 위에서 해안선이 들어간 곳과 섬을 찾고, 옆에서 육지가 완만하게 수면과 만나는 구간을 살펴봐요.'],
    south: ['남해안', '여수 금오도 일대와 연결해요. 위에서 육지 해안선과 가까운 섬들을 살펴보고, 옆에서 바위 해안의 높이 차를 찾아요.'],
    dokdo: ['독도', '서도와 동도 사이에 바닷물이 있어요. 두 섬의 높이와 바위 해안의 경사를 비교해요.']
  };
  const groups = [['mountain', 'river'], ['east', 'west', 'south'], ['dokdo'], ['dokdo']];
  const atlas = 'https://nationalatlas.ngii.go.kr/pages/page_3982.php';
  const nature = 'https://dokdo.mofa.go.kr/kor/introduce/nature.jsp';
  const location = 'https://dokdo.mofa.go.kr/kor/introduce/location.jsp';
  const link = (url, title) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a>`;
  const places = {
    a: [128.465, 38.119, '설악산 대청봉', 'https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=9a2b453f-40c1-42c0-af9d-98c573240b78'],
    b: [128.916, 37.23, '태백 검룡소', 'https://hangang.seoul.go.kr/www/contents/770.do?mid=578'],
    c: [127.312, 37.532, '양평 두물머리', 'https://encykorea.aks.ac.kr/Article/E0012254'],
    d: [126.54, 37.776, '한강 하구', 'https://encykorea.aks.ac.kr/Article/E0060950'],
    e: [129.036, 37.684, '강릉 정동진', 'https://encykorea.aks.ac.kr/Article/E0067515'],
    f: [126.189, 36.836, '태안 신두리', 'https://www.taean.go.kr/tour/sub03_06_01.do'],
    g: [127.767, 34.515, '여수 금오도', 'https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=107e9017-f106-4400-8ff9-55379c2be1f3'],
    u: [130.90, 37.48, '울릉도', location],
    v: [131.87, 37.24, '독도', location]
  };
  const tasks = [
    [
      { model: 'mountain', title: '산지 모형을 지도와 연결해요', map: 'abg', answer: 'a',
        hint: '한반도 지도에서 동해와 가까운 강원도 북쪽 산지를 찾아봐요.',
        success: '강원도 동쪽 산지에서 설악산을 찾았어요.' },
      { model: 'river', title: '한강 상류 쪽을 찾아요', map: 'bcd', river: true, answer: 'b',
        hint: '물길이 시작되는 높은 땅을 찾아요. 황해에서 멀리 떨어진 쪽이에요.',
        success: '태백 검룡소 쪽 물줄기가 한강으로 이어져요.' },
      { model: 'river', title: '한강 하류 쪽을 찾아요', map: 'bcd', river: true, answer: 'd',
        hint: '한강 물길을 따라가며 바다와 가까운 쪽을 찾아요.',
        success: '한강은 하구를 거쳐 서쪽의 황해로 흘러요.' },
      { model: 'river', title: '지도에서 한강이 흐르는 방향은?', map: 'bcd', river: true, answer: 1,
        choices: ['황해 쪽 → 산지 쪽', '산지 쪽 → 황해 쪽', '동해 쪽 → 황해 쪽'],
        hint: '북쪽을 위로 두고 지도를 봐요. 높은 땅에서 시작한 물길이 어느 바다로 이어지나요?',
        success: '한강은 동쪽 산지 쪽에서 시작해 대체로 서쪽으로 이어져요.' }
    ],
    [
      { model: 'east', title: '동해안 모형을 지도와 연결해요', map: 'efg', answer: 'e',
        hint: '북쪽이 위인 지도에서 동해가 어느 쪽에 있는지 봐요.',
        success: '강원도 강릉 정동진은 동해안에 있어요.' },
      { model: 'west', title: '서해안 모형을 지도와 연결해요', map: 'efg', answer: 'f',
        hint: '황해와 맞닿고 육지가 바다 쪽으로 길게 나온 곳을 찾아요.',
        success: '충청남도 태안 신두리는 서해안에 있어요.' },
      { model: 'south', title: '남해안 모형을 지도와 연결해요', map: 'efg', answer: 'g',
        hint: '전라남도 남쪽 바다에 섬이 모인 곳을 찾아봐요.',
        success: '전라남도 여수의 금오도 일대는 남해안에 있어요.' },
      { title: '세 해안에 어울리는 설명을 골라요', answer: 2,
        choices: [
          '동해안의 해안선이 가장 굽어 있고, 남해안에는 섬이 거의 보이지 않아요.',
          '동해안·서해안·남해안은 해안선의 굽은 정도와 섬 분포가 모두 비슷해요.',
          '동해안은 해안선이 비교적 단순해요. 서해안과 남해안은 굽은 곳이 많고, 남해안 모형에는 섬이 모여 있어요.'
        ],
        hint: '세 모형을 모두 위에서 봐요. 육지와 물이 만나는 선이 얼마나 굽는지, 바다에 섬이 얼마나 보이는지 따로 비교해요.',
        success: '해안선 모양과 섬 분포를 모두 근거로 설명했어요.' }
    ],
    [
      { title: '독도가 있는 바다를 찾아요', map: 'uv', zoom: true, answer: 0,
        choices: ['동해', '황해', '남해'], hint: '우리나라 전체 지도에서 울릉도와 독도가 있는 쪽의 바다 이름을 찾아요.',
        success: '울릉도와 독도는 동해에 있어요.' },
      { title: '울릉도를 기준으로 독도의 위치를 말해요', map: 'uv', zoom: true, answer: 1,
        choices: ['북동쪽', '남동쪽', '남서쪽'], hint: '방위표를 보고 울릉도에서 독도로 갈 때 오른쪽인지 왼쪽인지, 위쪽인지 아래쪽인지 따로 살펴봐요.',
        success: '독도는 울릉도의 남동쪽에 있어요.' },
      { model: 'dokdo', title: '독도의 바위 해안을 살펴봐요', answer: 0, review: 'model',
        choices: ['두 섬에는 바닷물에서 가파르게 솟은 바위 해안이 보여요.', '두 섬이 하나의 넓고 평평한 땅으로 이어져 있어요.'],
        hint: '비스듬히 보기에서 두 섬 사이와 물에서 바위로 이어지는 곳을 살펴봐요.',
        success: '두 섬 사이에는 물이 있고 해안에는 가파른 구간이 보여요.' },
      { title: '사진이나 설명 자료에서 단서를 찾아요', answer: 1, review: 'photos',
        choices: ['설명 자료에는 독도에서 안개가 거의 생기지 않는다고 나와요.', '설명 자료에는 독도 주변에 안개가 자주 낀다고 나와요.', '설명 자료에는 독도에 식물이 살지 않는다고 나와요.'],
        hint: '사진·설명 자료에서 기후를 읽고 바위섬 뒤쪽이 어떻게 보이는지 비교해요.',
        success: '이제 자료에서 확인한 기후나 생물 중 카드에 소개할 내용을 골라요.' }
    ]
  ];
  const worksheets = [
    { title: '산지·하천 탐험 지도', list: [
      '활동지 지도에서 산지와 하천을 서로 다른 색으로 표시해요.',
      '하천이 어디에서 어디로 흐르는지 물길 위에 화살표를 그려요.',
      '지도를 보고 산지와 하천의 분포 특징을 한 문장으로 적어요.'
    ], label: '활동지에 적을 분포 특징', placeholder: '지도에서 높은 산지는 주로…, 여러 큰 하천은…' },
    { title: '세 해안 비교표', list: [
      '동해안·서해안·남해안별로 해안선 모양과 섬의 분포를 표에 옮겨 적어요.',
      '처음 사진을 보고 예상한 내용과 탐험 결과를 비교해 맞았거나 달라진 점을 적어요.',
      '짝에게 관찰 근거를 말해요. “나는 ___을 보고 ___해안이라고 판단했어.”'
    ], label: '예상과 비교해 확인한 특징', placeholder: '처음에는 …라고 예상했지만, 모형에서 …을 보았어요.' },
    { title: '모둠 독도 자연환경 소개 카드', list: [
      '북쪽을 표시한 작은 지도에 울릉도와 독도를 그리고 이름을 써요.',
      '3D 지형에서 직접 본 특징을 한 가지 적어요.',
      '사진이나 설명에서 알게 된 기후 또는 동식물 특징 한 가지와 자료 이름을 적어요.'
    ], label: '모둠 카드에 넣은 두 가지 특징', placeholder: '모형에서 …을 봤어요. … 자료에서는 …을 확인했어요.' }
  ];
  const guardianFields = [
    ['position', '① 울릉도와 독도의 위치', '울릉도를 기준으로 독도가 어느 쪽에 있는지 적어요.'],
    ['nature', '② 알리고 싶은 독도의 자연환경과 확인한 자료', '자연환경 특징과 그 사실을 확인한 사진이나 설명 자료의 이름을 적어요.'],
    ['action', '③ 내가 할 수 있는 일과 그 까닭', '독도를 알리거나 자연환경을 보호하기 위해 할 수 있는 일과 그 이유를 적어요.']
  ];
  const checks = ['위치와 방향이 알아보기 쉬워요.', '자연환경 특징과 확인한 자료가 들어 있어요.', '할 수 있는 행동과 이유가 구체적이에요.'];
  const questions = {
    mountain: ['높은 부분을 따라가면 능선이 어디까지 이어지나요?', '봉우리 사이에서 골짜기가 어느 쪽으로 열려 있나요?', '어느 봉우리가 더 높고, 어느 쪽 사면이 더 가파른가요?'],
    river: ['물길을 따라가며 좁은 곳과 넓은 곳을 찾아보세요.', '골짜기와 평평한 땅 중 어느 쪽에서 하천 주변이 더 넓나요?', '물길은 양쪽 땅보다 얼마나 낮아 보이나요?'],
    east: ['해안선이 이어지는 모양과 바다에 보이는 섬을 기록해 보세요.', '높은 땅이 바다와 가까운 곳을 찾아보세요.', '육지가 수면과 만나는 곳 중 어디가 더 가파른가요?'],
    west: ['해안선이 깊게 들어간 곳을 따라가고, 가까운 섬을 살펴보세요.', '육지와 바다 사이에 낮고 완만한 곳이 있나요?', '육지에서 수면까지의 경사는 어떻게 달라지나요?'],
    south: ['어디에 섬이 모여 있나요? 육지의 해안선 모양도 살펴보세요.', '섬과 섬 사이의 바닷길을 찾아보세요.', '바위 해안에서 육지와 바다의 높이 차는 어떻게 보이나요?'],
    dokdo: ['북쪽이 위일 때 어느 쪽이 서도이고 어느 쪽이 동도인가요?', '두 섬 사이에 무엇이 있나요?', '어느 섬이 더 높고, 두 섬의 바위 해안은 얼마나 가파른가요?']
  };
  const viewKeys = ['top','angle','side'];
  const coastFields = ['shore','islands'];
  const coastLabels = ['해안선 모양','섬의 분포'];
  const coastPhotos = [
    ['정동진 해변','최광모','20151015_최광모_SONY_DSC-RX10_DSC04343_20151024.JPG',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/20151015_%EC%B5%9C%EA%B4%91%EB%AA%A8_SONY_DSC-RX10_DSC04343_20151024.JPG/960px-20151015_%EC%B5%9C%EA%B4%91%EB%AA%A8_SONY_DSC-RX10_DSC04343_20151024.JPG','CC0 1.0','https://creativecommons.org/publicdomain/zero/1.0/','해변에서 바라본 동해안'],
    ['태안 만리포','Olga Lipunova','태안해안국립공원_만리포_1.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/%ED%83%9C%EC%95%88%ED%95%B4%EC%95%88%EA%B5%AD%EB%A6%BD%EA%B3%B5%EC%9B%90_%EB%A7%8C%EB%A6%AC%ED%8F%AC_1.jpg/960px-%ED%83%9C%EC%95%88%ED%95%B4%EC%95%88%EA%B5%AD%EB%A6%BD%EA%B3%B5%EC%9B%90_%EB%A7%8C%EB%A6%AC%ED%8F%AC_1.jpg','CC BY-SA 3.0','https://creativecommons.org/licenses/by-sa/3.0/','태안의 서해안 해변'],
    ['여수 섬 일대','Stephen Alexander-Larkin','Yeosu_islands1.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/0/0c/Yeosu_islands1.jpg','CC BY-SA 3.0','https://creativecommons.org/licenses/by-sa/3.0/','하늘에서 바라본 여수의 섬들']
  ];
  const dokdoFields = [
    ['shape','3D 지형에서 관찰한 특징','두 섬이나 바위 해안에서 직접 본 특징 한 가지'],
    ['nature','사진 또는 설명에서 확인한 특징','독도의 기후나 생물에 관해 확인한 내용'],
    ['source','확인한 자료 이름','예: 외교부 독도 자연환경']
  ];

  const mapMarkup = (codes, options) => map.render(codes, places, outline, options);

  let id = 0, phase = 0, kind, view, zoom = 0, seen, flags;
  let answered = false, cardDraft, status = '', modelRequest = 0;
  const realSamples = {};
  const draft = name => {
    const s = app.state();
    s.lessonSheets ??= {};
    return s.lessonSheets[name] ??= {};
  };
  function inputField(scope, key, label, placeholder = '') {
    return `<label>${label}<textarea data-sheet="${scope}" data-field="${key}" maxlength="240" placeholder="${placeholder}">${esc(draft(scope)[key] || '')}</textarea></label>`;
  }
  function bindDrafts() {
    document.querySelectorAll('[data-sheet]').forEach(field => field.oninput = () => {
      draft(field.dataset.sheet)[field.dataset.field] = field.value;
      app.save();
    });
  }
  const modelButtons = () => `<div class="row model-choice" aria-label="관찰할 지형">${groups[id].map(key =>
    `<button type="button" data-model="${key}" aria-pressed="${key === kind}">${models[key][0]}</button>`).join('')}</div>`;
  const world = () => app.world();
  function setWorld(show) {
    if (!show) modelRequest++;
    $('world').classList.toggle('lesson-map-mode', !show);
    $('lessonStage').hidden = show;
    $('lessonViews').hidden = !show;
    $('lessonOverlay').hidden = !show;
    if (show) world().resize();
  }
  function close() {
    modelRequest++;
    $('world').classList.remove('lesson-world', 'lesson-map-mode');
    $('lessonStage').hidden = $('lessonViews').hidden = $('lessonOverlay').hidden = true;
    const printSheet = $('lessonPrint');
    printSheet.hidden = true;
    document.body.classList.remove('print-lesson');
  }
  function setView(next) {
    view = next;
    world().lessonView(next);
    if (next === 'top') seen.add(kind + '-top');
    if (next === 'side') seen.add(kind + '-side');
    document.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === next)));
    if ($('viewQuestion')) $('viewQuestion').textContent = questions[kind][viewKeys.indexOf(next)];
  }
  function drawModel(next = kind, nextView = view, skipLoad = false) {
    kind = next;
    view = nextView;
    seen.add(kind);
    const token = ++modelRequest;
    setWorld(true);
    const sample = flags.real && realSamples[kind];
    world().learningRelief(kind, view, sample || null);
    setView(view);
    const region = geo.regions[kind];
    $('lessonOverlay').innerHTML = `<strong>${sample ? region.name : models[kind][0]}</strong><small>${sample ? `실제 표고 · 높이 ${region.exaggeration}배 강조 · 가로 ${region.km} km · Mapzen` : '학습용 모형 · 높이와 경사 강조'}${id === 1 ? ' · 대표 구간' : ''}</small>`;
    $('worldLabel').textContent = '드래그로 회전 · 휠 또는 두 손가락으로 확대·축소';
    renderTools();
    if (!flags.real || sample || !region || skipLoad) return;
    if ($('regionStatus')) $('regionStatus').textContent = '표고를 불러오는 동안 학습용 모형을 볼 수 있어요.';
    geo.loadHeight(region.bounds,region.zoom).then(result => {
      realSamples[next] = result;
      if (token === modelRequest) drawModel(next, view, true);
    }).catch(() => {
      if (token !== modelRequest) return;
      flags.real = false;
      renderTools();
      if ($('regionStatus')) $('regionStatus').textContent = '표고 자료에 연결하지 못해 학습용 모형으로 표시하고 있어요.';
    });
  }
  function renderTools() {
    world().lessonLabels.visible = flags.labels[kind] ?? kind === 'dokdo';
    world().flowArrows.visible = flags.flow;
    const tools = $('modelTools');
    if (!tools) return;
    const region = geo.regions[kind];
    const actual = flags.real && realSamples[kind];
    tools.innerHTML = `<p>${models[kind][1]}</p>
      <p class="view-question" id="viewQuestion" role="status">${questions[kind][viewKeys.indexOf(view)]}</p>
      <label><input id="labelToggle" type="checkbox" ${world().lessonLabels.visible ? 'checked' : ''}> 이름표 표시</label>
      ${kind === 'river' && !actual ? `<label><input id="flowToggle" type="checkbox" ${flags.flow ? 'checked' : ''}> 상류 → 하류 흐름 화살표</label>` : ''}
      ${region ? `<div class="row"><button id="regionData">${flags.real ? '학습용 모형 보기' : '실제 표고로 보기'}</button></div>
        <small id="regionStatus" role="status">${actual && kind === 'river' ? '실제 표고 화면은 강 주변의 높낮이를 보여 줘요. 수면과 흐름은 학습용 모형에서 살펴봐요.' : ''}</small>
        <small>${link(geo.credits.dem, '표고 자료 · Mapzen Terrain Tiles')}</small>` : ''}
      ${id === 1 ? `<div class="coast-criteria"><b>${models[kind][0]} 관찰 기록</b>
        ${coastFields.map((field,i)=>inputField('coast',kind+'-'+field,coastLabels[i], i ? '섬이 어디에 보이나요?' : '해안선은 얼마나 굽어 있나요?')).join('')}
        <small>${link(atlas, '해안 특징 자료 · 국토지리정보원 국가지도집')}</small></div>` : ''}`;
    if ($('labelToggle')) $('labelToggle').onchange = e => {
      flags.labels[kind] = world().lessonLabels.visible = e.target.checked;
    };
    if ($('flowToggle')) $('flowToggle').onchange = e => {
      flags.flow = world().flowArrows.visible = e.target.checked;
    };
    action('regionData', () => { flags.real = !flags.real; drawModel(); });
    bindDrafts();
  }
  function shell(content) {
    $('panel').innerHTML = `<div class="lesson-panel"><span class="tag">${id + 1}차시</span>${content}</div>`;
    $('panel').scrollTop = 0;
  }
  function bindModels() {
    document.querySelectorAll('[data-model]').forEach(button => button.onclick = () => {
      drawModel(button.dataset.model, view);
      document.querySelectorAll('[data-model]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    });
  }
  function setFeedback(message, wrong = false) {
    $('lessonFeedback').textContent = message;
    $('lessonFeedback').classList.toggle('wrong', wrong);
  }
  function phaseSaved(value) {
    const s = app.state();
    s.lessonProgress ??= [0, 0, 0, 0];
    s.lessonProgress[id] = Math.max(s.lessonProgress[id] || 0, value);
    s.missions[id] = Math.max(s.missions[id], value);
    app.save();
  }
  function renderObservation(review = false, returnTo) {
    const heading = id === 3 ? '독도 모형 다시 보기' : '3D 지형을 관찰해요';
    shell(`<h2>${heading}</h2>${modelButtons()}<div id="modelTools"></div>
      ${id >= 2 ? '<button id="photosReview">사진·설명 자료</button>' : ''}
      ${id === 1 ? '<button id="coastPhotoReview">해안 사진 다시 보기</button>' : ''}
      <p id="lessonFeedback" class="feedback" role="status"></p>
      <button id="toLessonMap" class="primary">${returnTo ? '지형도로 돌아가기' : review ? '원래 활동으로 돌아가기' : '관찰 마치고 지도 미션으로 →'}</button>
      ${!review && app.state().lessonProgress?.[id] >= 1 ? '<button id="resumeLesson">이어서 하기</button>' : ''}`);
    const showDefault = id === 1 ? 'top' : 'angle';
    drawModel(kind, review ? view : showDefault);
    bindModels();
    action('photosReview', showPhotos);
    action('coastPhotoReview', () => app.dialog(coastPhotoContent()));
    action('resumeLesson', resume);
    action('toLessonMap', () => {
      if (review) {
        if (returnTo) returnTo();
        else if (id === 3) renderGuardian();
        else if (phase >= tasks[id].length) renderWorksheet();
        else renderMission();
        return;
      }
      const missing = groups[id].filter(key => !seen.has(key) || (id === 1 && !seen.has(key + '-top')));
      if (missing.length) {
        setFeedback(`${missing.map(key => models[key][0]).join('·')}도 ${id === 1 ? '위에서 ' : ''}살펴봐요.`, true);
        return;
      }
      phaseSaved(1);
      renderMission();
    });
  }

  function mapSources(codes) {
    const sources = [...codes].filter(key => key !== 'v').map(key => link(places[key][3], places[key][2]));
    return `<details class="map-sources"><summary>지도 위치 자료</summary>${sources.join(' · ')}</details>`;
  }
  function showMap(codes, options, header, milestones = false) {
    setWorld(false);
    $('lessonStage').innerHTML = `<div class="lesson-stage-inner"><h2>${header}</h2>
      ${milestones ? `<nav class="map-zoom" aria-label="지도 범위">${['우리나라 전체', '동해 주변 확대', '울릉도·독도 확대'].map((label, i) =>
        `<button type="button" data-map-zoom="${i}" aria-pressed="${i === zoom}" ${i > zoom + 1 ? 'disabled' : ''}>${label}</button>`).join('')}</nav>` : ''}
      ${mapMarkup(codes, options)}
      ${options.river ? '<p class="map-caption">초록선은 동쪽 산지의 일부, 파란선은 하천의 물길이에요.</p>' : ''}
      ${options.distribution ? `<p class="map-caption">${link('https://nationalatlas.ngii.go.kr/pages/page_3806.php', '하천 분포 자료 · 국토지리정보원 국가지도집')}</p>` : ''}
      ${mapSources(codes)}</div>`;
    $('worldLabel').textContent = '';
    return map.bind($('lessonStage'), outline, options);
  }
  function bindMapZoom(redraw, requireSequence = false) {
    document.querySelectorAll('[data-map-zoom]').forEach(button => button.onclick = () => {
      zoom = Number(button.dataset.mapZoom);
      if (zoom === 2) seen.add('islands-close');
      redraw();
    });
    if (requireSequence && !seen.has('islands-close')) {
      const full = document.querySelector('[data-map-zoom="2"]');
      full.disabled = zoom === 0;
    }
  }
  function resume() {
    phase = Math.min(tasks[id].length, app.state().lessonProgress[id] - 1);
    answered = false;
    if (id === 2 && phase > 0) {
      zoom = 2;
      seen.add('islands-close');
    }
    phase === tasks[id].length ? renderWorksheet() : renderMission();
  }
  function renderDokdoMapIntro() {
    shell(`<h2>지도에서 독도 찾아보기</h2><p>우리나라 전체 지도를 보고 동해 주변으로 확대해요. 울릉도·독도 주변까지 확대해 두 섬을 살펴보고 방위표에서 북쪽을 확인해요.</p>
      <p id="lessonFeedback" class="feedback" role="status"></p>
      <button id="toLessonMap" class="primary">관찰 마치고 지도 미션으로 →</button>
      ${app.state().lessonProgress?.[id] >= 1 ? '<button id="resumeLesson">이어서 하기</button>' : ''}`);
    const redraw = () => {
      showMap('uv', { zoom }, '우리나라 지도에서 독도까지', true);
      bindMapZoom(redraw, true);
    };
    redraw();
    action('toLessonMap', () => {
      if (!seen.has('islands-close')) {
        setFeedback('동해 주변을 거쳐 울릉도·독도 주변까지 차례로 확대해요.', true);
        return;
      }
      phaseSaved(1);
      renderMission();
    });
    action('resumeLesson', resume);
  }
  function renderMission() {
    const task = tasks[id][phase];
    if (task.model && !answered) kind = task.model;
    shell(`<p class="lesson-kicker">미션 ${phase + 1} / ${tasks[id].length}</p><h2>${task.title}</h2>
      ${task.map && !task.choices ? `<p>지도 기호나 아래의 지점 버튼을 골라요.</p><div class="options">${[...task.map].map((code, i) =>
        `<button data-map-choice="${code}">${i + 1}. ${places[code][2]}</button>`).join('')}</div>` : ''}
      ${task.choices ? `<div class="options">${task.choices.map((choice, i) => `<button data-choice="${i}">${choice}</button>`).join('')}</div>` : ''}
      ${id === 1 ? '<p class="sentence-frame">나는 ___을 보고 ___해안이라고 판단했어.</p>' : ''}
      <div id="lessonFeedback" class="feedback" role="status"></div>
      <div class="row"><button id="lessonHint">힌트</button><button id="reviewModel">3D 다시 보기</button><button id="reviewMap">지도 다시 보기</button>
      ${id === 2 ? '<button id="photosReview">사진·설명 자료</button>' : ''}
      <button id="nextLessonTask" class="primary" hidden>다음 →</button></div>`);
    function redraw() {
      if (task.map) {
        showMap(task.map, { zoom: task.zoom ? zoom : 0, river: task.river, pick: !task.choices,
          arrows: task.river && answered && phase === 3 }, task.zoom ? '울릉도와 독도는 어디에 있을까요?' : '우리나라에서 위치 찾기', task.zoom);
        bindMapZoom(redraw);
      } else if (task.review === 'photos') {
        setWorld(false);
        $('lessonStage').innerHTML = `<div class="lesson-stage-inner">${photoContent()}</div>`;
      } else {
        drawModel(kind, id === 1 ? 'top' : 'angle');
      }
      document.querySelectorAll('[data-map-choice]').forEach(b => b.onclick = () => checkAnswer(b.dataset.mapChoice));
    }
    function checkAnswer(answer) {
      if (answered) return;
      if (task.zoom && phase === 1 && zoom < 2) {
        setFeedback('동해 주변을 거쳐 울릉도·독도 주변까지 차례로 확대해요.', true);
        return;
      }
      if (answer !== task.answer) {
        status = task.hint;
        setFeedback(status, true);
        return;
      }
      answered = true;
      status = '✓ ' + task.success;
      phaseSaved(phase + 2);
      redraw();
      restoreStatus();
    }
    function restoreStatus() {
      setFeedback(status, Boolean(status) && !answered);
      $('nextLessonTask').hidden = !answered;
      if (answered) document.querySelectorAll('[data-choice],[data-map-choice]').forEach(b => b.disabled = true);
    }
    redraw();
    restoreStatus();
    document.querySelectorAll('[data-choice]').forEach(b => b.onclick = () => checkAnswer(Number(b.dataset.choice)));
    action('lessonHint', () => { if (!answered) { status = task.hint; setFeedback(status, true); } });
    action('reviewModel', () => renderObservation(true));
    action('reviewMap', () => {
      const reviewCodes = task.map || ['abcd','efg','uv'][id];
      shell(`<h2>지도에서 단서를 찾아요</h2><p>${task.hint}</p><button id="backToQuestion" class="primary">같은 문제로 돌아가기</button>`);
      const redrawMap = () => {
        showMap(reviewCodes, { zoom: id === 2 ? zoom : 0, river: id === 0 }, '지도를 다시 살펴봐요',id === 2);
        if (id === 2) bindMapZoom(redrawMap);
      };
      redrawMap();
      action('backToQuestion',renderMission);
    });
    action('photosReview', showPhotos);
    action('nextLessonTask', () => {
      phase++;
      status = '';
      answered = false;
      if (phase === tasks[id].length) renderWorksheet();
      else renderMission();
    });
  }

  function photoFigure(title, author, file, url, license, licenseUrl, alt, local = '') {
    const source = 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(file);
    return `<figure><img src="${local || url}" ${local ? `data-photo-fallback="${url}"` : ''} data-reference-photo alt="${alt}" width="533" height="345">
      <figcaption>${title}<br><small>${link(source, author+' · Wikimedia Commons')} · ${link(licenseUrl,license)}</small></figcaption></figure>`;
  }
  function coastPhotoContent() {
    return `<div class="photo-material"><h2>사진을 보고 해안 모습을 예상해요</h2><p>사진은 각 해안의 한 구간을 보여 줘요. 사진에 보이는 단서를 먼저 살펴보고, 모형을 위에서 본 뒤 예상과 비교해요.</p>
      <div class="photo-grid coast-photos">${coastPhotos.map(photo=>photoFigure(...photo)).join('')}</div></div>`;
  }
  function renderCoastIntro() {
    shell(`<h2>해안 모습을 예상해요</h2><p>세 사진에서 해안선 모양과 섬의 모습을 살펴보고, 위에서 보면 어떻게 보일지 적어 보세요.</p>
      ${inputField('coast','prediction','사진을 보고 한 예상','예: 바다 쪽에 섬이 모여 보이는 곳은…')}
      <button id="coastStart" class="primary">3D 해안 관찰 시작</button>
      ${app.state().lessonProgress?.[id] >= 1 ? '<button id="resumeLesson">이어서 하기</button>' : ''}`);
    setWorld(false);
    $('lessonStage').innerHTML = `<div class="lesson-stage-inner">${coastPhotoContent()}</div>`;
    bindDrafts();
    action('coastStart',()=>renderObservation());
    action('resumeLesson',resume);
  }
  function photoContent() {
    const cc = 'https://creativecommons.org/licenses/by-sa/3.0/';
    return `<div class="photo-material"><h2>독도 사진·설명 자료</h2>
      <div class="photo-grid">${photoFigure('바다에서 바라본 독도. 왼쪽이 동도, 오른쪽이 서도예요.','Rachouette','Dokdo_Photo.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/5/5e/Dokdo_Photo.jpg','CC BY-SA 3.0',cc,'동도와 서도가 보이는 독도 전경')}
      ${photoFigure('갈매기가 쉬는 바위 뒤쪽에 바다 안개가 보여요.','Sokyo Park','Dokdo.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/e/ee/Dokdo.jpg','CC BY-SA 3.0',cc,'안개가 낀 독도와 바위 위 갈매기')}</div>
      <article><h3>기후와 생물</h3><p>독도 주변에 안개가 자주 끼고 겨울에는 눈이 내려요. 바위 지대에서 자라는 해국이 있고, 괭이갈매기와 바다제비도 볼 수 있어요.</p>
      <small>${link(nature, '설명 자료 · 외교부 독도 자연환경')} · ${link(location, '외교부 독도 구성 및 위치')}</small></article></div>`;
  }
  function showPhotos() { app.dialog(photoContent()); }
  document.addEventListener('error', event => {
    const image = event.target;
    if (!image.hasAttribute?.('data-reference-photo')) return;
    if (image.dataset.photoFallback) {
      image.src=image.dataset.photoFallback;
      delete image.dataset.photoFallback;
      return;
    }
    image.replaceWith(Object.assign(document.createElement('p'), {
      textContent: '사진을 불러오지 못했어요. 아래 사진 출처에서 확인할 수 있어요.'
    }));
  }, true);
  function renderWorksheet() {
    if (id === 0) return renderDistribution();
    if (id === 2) return renderGroupCard();
    const sheet = worksheets[id];
    shell(`<h2>${sheet.title}</h2><ol class="activity-steps">${sheet.list.map(item => `<li>${item}</li>`).join('')}</ol>
      <p class="sentence-frame"><b>처음 예상</b><br>${esc(draft('coast').prediction || '아직 적은 예상이 없어요.')}</p>
      <table class="coast-sheet"><thead><tr><th scope="col">해안</th>${coastLabels.map(label=>`<th scope="col">${label}</th>`).join('')}</tr></thead>
      <tbody>${groups[1].map(key=>`<tr><th scope="row">${models[key][0]}</th>${coastFields.map((field,i)=>`<td><textarea aria-label="${models[key][0]} ${coastLabels[i]}" data-sheet="coast" data-field="${key}-${field}" maxlength="240">${esc(draft('coast')[key+'-'+field] || '')}</textarea></td>`).join('')}</tr>`).join('')}</tbody></table>
      <p class="sentence-frame">나는 ___을 보고 ___해안이라고 판단했어.</p>
      <label for="lessonNoteText">${sheet.label}</label><textarea id="lessonNoteText" maxlength="1200" placeholder="${sheet.placeholder}">${esc(app.state().notes[id])}</textarea>
      <div class="row"><button id="reviewModel">3D 다시 보기</button><button id="coastPhotoReview">처음 사진 다시 보기</button>
      <button id="finishLesson" class="primary">기록 저장 · 보상 받기</button></div>`);
    showMap('efg', {}, '지도에서 세 해안의 위치를 확인해요');
    bindDrafts();
    $('lessonNoteText').oninput = event => { app.state().notes[id] = event.target.value; app.save(); };
    action('reviewModel', () => renderObservation(true));
    action('coastPhotoReview', () => app.dialog(coastPhotoContent()));
    action('finishLesson', () => {
      const note = $('lessonNoteText').value.trim();
      if (groups[1].some(key=>coastFields.some(field=>!draft('coast')[key+'-'+field]?.trim()))) {
        app.toast('세 해안의 해안선 모양과 섬의 분포를 모두 기록해요.');
        return;
      }
      if (!note) return app.toast('활동지에 옮길 관찰 내용을 먼저 적어요.');
      reward(note);
    });
  }
  function renderDistribution() {
    const record=draft('distribution');
    let tool='mount', start=null, stage;
    shell(`<h2>${worksheets[0].title}</h2><p>표시할 대상을 고른 뒤 지도에서 찾으세요. 화살표는 물길이 시작되는 점부터 찍어요.</p>
      <div class="row"><button id="paintMountain" aria-pressed="true">산지 · 갈색</button><button id="paintWater" aria-pressed="false">하천 · 파란색</button><button id="paintArrow" aria-pressed="false">한강 흐름 화살표</button></div>
      <div class="row"><button id="markRidge">태백산맥 표시</button><button id="markRiver">한강 표시</button></div>
      <div class="row"><button id="flowStart">검룡소 점</button><button id="flowEnd">한강 하구 점</button></div>
      <p id="markFeedback" class="reading" role="status"></p>
      <label for="lessonNoteText">지도에서 확인한 분포 특징 한 문장</label><textarea id="lessonNoteText" maxlength="1200" placeholder="${worksheets[0].placeholder}">${esc(app.state().notes[id])}</textarea>
      <div class="row"><button id="reviewModel">3D 다시 보기</button><button id="finishLesson" class="primary">기록 저장 · 보상 받기</button></div>`);
    const message=value=>$('markFeedback').textContent=value;
    function draw() {
      stage=showMap('bd', { pick:true, arrows:record.arrow ? 'han' : false, onPaint:mark }, '지도에 산지·하천·흐름을 표시해요');
      stage?.querySelector('[data-range-index="0"]')?.classList.toggle('atlas-marked-ridge', Boolean(record.mountain));
      stage?.querySelector('[data-river-index="0"]')?.classList.toggle('atlas-marked-water', Boolean(record.river));
      document.querySelectorAll('[data-map-choice]').forEach(el=>el.onclick=()=>plot(el.dataset.mapChoice));
    }
    function change(next) {
      tool=next;start=null;
      for(const [key,button] of [['mount','paintMountain'],['water','paintWater'],['arrow','paintArrow']])
        $(button).setAttribute('aria-pressed',String(key===tool));
      message(tool==='mount' ? '동쪽에서 길게 이어지는 산맥을 찾으세요.' : tool==='water' ? '산지에서 황해로 이어지는 한강을 찾으세요.' : '먼저 산지 쪽의 상류를 찾아요.');
    }
    function mark(type,index) {
      if (tool!==type || index!==0) {
        message(tool==='mount' ? '동쪽에서 남북으로 길게 이어지는 줄기를 살펴봐요.' :
          tool==='water' ? '검룡소와 한강 하구를 연결하는 파란 물길을 살펴봐요.' : '화살표는 물길 위의 두 지점을 차례로 찍어요.');
        return;
      }
      record[type==='mount' ? 'mountain' : 'river']=true;
      app.save();draw();message(type==='mount' ? '태백산맥을 갈색으로 표시했어요.' : '한강을 파란색으로 표시했어요.');
    }
    function plot(code) {
      if (tool!=='arrow') return message('화살표를 그리려면 한강 흐름 화살표를 선택해요.');
      if (!start) {
        if (code!=='b') return message('시작점이 어디인지 살펴봐요. 물은 높은 곳에서 낮은 곳으로 흘러요.');
        start=code;message('이제 물이 바다로 향하는 도착점을 찾아요.');return;
      }
      if (code!=='d') return message('물길을 따라가며 바다와 가까운 지점을 찾아요.');
      record.arrow=true;start=null;app.save();draw();message('한강 상류에서 하구로 흐르는 방향을 표시했어요.');
    }
    draw();
    for (const [button,key] of [['paintMountain','mount'],['paintWater','water'],['paintArrow','arrow']]) action(button,()=>change(key));
    action('markRidge',()=>{change('mount');mark('mount',0);});
    action('markRiver',()=>{change('water');mark('water',0);});
    action('flowStart',()=>plot('b'));action('flowEnd',()=>plot('d'));
    $('lessonNoteText').oninput=e=>{app.state().notes[id]=e.target.value;app.save();};
    action('reviewModel',()=>renderObservation(true));
    action('finishLesson',()=>{
      if (!record.mountain||!record.river||!record.arrow) return app.toast('지도에 산지, 하천, 흐름 화살표를 표시해요.');
      const note=$('lessonNoteText').value.trim();
      if (!note) return app.toast('지도에서 확인한 특징을 한 문장으로 적어요.');
      reward(note);
    });
  }
  function renderGroupCard() {
    const card=draft('group');
    let name='u';
    shell(`<h2>${worksheets[2].title}</h2><p>섬 이름을 고르고 작은 지도에서 위치를 찍어요.</p>
      <div class="row"><button id="markUlleung" aria-pressed="true">울릉도</button><button id="markDokdo" aria-pressed="false">독도</button></div>
      <div class="row"><button id="islandLeft">지도 1번 점</button><button id="islandRight">지도 2번 점</button></div>
      <p id="islandFeedback" class="feedback" role="status"></p>
      ${dokdoFields.map(([key,label,hint])=>inputField('group',key,label,hint)).join('')}
      <div class="row"><button id="reviewModel">독도 3D 지형 다시 보기</button><button id="photosReview">사진·설명 자료</button>
      <button id="finishLesson" class="primary">모둠 카드 저장 · 보상 받기</button></div>`);
    function draw() { showMap('uv',{zoom:2,worksheet:true,marked:['u','v'].filter(code=>card[code]),onIsland:mark},'울릉도와 독도를 표시해요'); }
    function mark(code) {
      if (code!==name) return $('islandFeedback').textContent='방위표를 보고 두 섬 중 어느 쪽이 동쪽인지 살펴봐요.';
      card[code]=true;app.save();draw();
      $('islandFeedback').textContent=places[code][2]+'를 지도에 표시했어요.';
    }
    function choose(code) {
      name=code;
      $('markUlleung').setAttribute('aria-pressed',String(code==='u'));
      $('markDokdo').setAttribute('aria-pressed',String(code==='v'));
    }
    draw();
    action('markUlleung',()=>choose('u'));action('markDokdo',()=>choose('v'));
    action('islandLeft',()=>mark('u'));action('islandRight',()=>mark('v'));
    bindDrafts();
    action('photosReview',showPhotos);
    action('reviewModel',()=>renderObservation(true));
    action('finishLesson',()=>{
      if (!card.u||!card.v||dokdoFields.some(([key])=>!card[key]?.trim())) return app.toast('두 섬을 지도에 표시하고 카드의 세 칸을 채워요.');
      reward(dokdoFields.map(([key,label])=>label+'\n'+card[key].trim()).join('\n\n'));
    });
  }
  function showGroupCard() {
    const data=draft('group');
    const saved=dokdoFields.some(([key])=>data[key])||data.u||data.v;
    app.dialog(`<h2>3차시 모둠 독도 자연환경 소개 카드</h2>${saved ? `<div id="groupPreviewMap">${mapMarkup(['u','v'].filter(key=>data[key]).join(''),{compact:true,zoom:2})}</div>
      ${dokdoFields.map(([key,label])=>`<article><h3>${label}</h3><p class="reward-note">${esc(data[key] || '아직 작성하지 않았어요.')}</p></article>`).join('')}` :
      `<p>${app.state().notes[2] ? esc(app.state().notes[2]) : '이 브라우저에 모둠 카드 기록이 없어요. 수업에서 만든 모둠 카드를 펼쳐 보세요.'}</p>`}`);
    if ($('groupPreviewMap')) map.bind($('groupPreviewMap'),outline,{zoom:2});
  }
  function reward(note) {
    const s = app.state();
    s.notes[id] = note;
    s.done[id] = true;
    s.missions[id] = 5;
    app.save();
    shell(`<h2>탐험 완료!</h2>${guide('발견한 내용을 기록했구나. 마을에 새 장식을 놓아 봐!')}
      <article><h3>${app.rewards[id]} 획득</h3><p class="reward-note">${esc(note)}</p></article>
      <button id="rewardHome" class="primary">마을에 장식 놓기</button>`);
    action('rewardHome', app.toGarden);
  }

  function printCard(blank) {
    const printable = $('lessonPrint');
    printable.innerHTML = `<h1>독도 지킴이 카드</h1><p class="print-name">5학년 ____반 ____번 &nbsp;&nbsp; 이름 ____________________</p>
      <p>모둠 독도 자연환경 소개 카드를 참고해 나의 카드를 완성해요.</p>
      ${guardianFields.map(([key, label, prompt]) => `<section><h2>${label}</h2><p>${prompt}</p>
        <div class="print-answer">${blank ? '' : esc(cardDraft[key] || '')}</div></section>`).join('')}
      <section><h2>짝과 바꾸어 읽고 보완해요</h2><ul>${checks.map(item => `<li>□ ${item}</li>`).join('')}</ul>
      <p>보완할 점 ${!blank && cardDraft.improvement ? esc(cardDraft.improvement) : '________________________________________________________'}</p></section>`;
    printable.hidden = false;
    document.body.classList.add('print-lesson');
    const cleanup = () => {
      printable.hidden = true;
      document.body.classList.remove('print-lesson');
    };
    window.addEventListener('afterprint', cleanup, { once: true });
    window.print();
  }
  function renderGuardian() {
    shell(`<h2>독도 지킴이 카드</h2><p>3차시 모둠 소개 카드를 참고해 나만의 카드를 만들어요.</p>
      <div class="row"><button id="groupCardReview">모둠 소개 카드</button><button id="guardianMap">독도 지도</button><button id="reviewModel">독도 3D 지형</button><button id="photosReview">사진·설명 자료</button></div>
      ${guardianFields.map(([key, label, prompt]) => `<label for="guardian-${key}">${label}</label><p class="field-hint">${prompt}</p>
        <textarea id="guardian-${key}" data-guardian="${key}" maxlength="240">${esc(cardDraft[key] || '')}</textarea>`).join('')}
      <fieldset><legend>짝과 바꾸어 읽고 보완해요</legend>${checks.map((label, i) =>
        `<label><input type="checkbox" data-peer="${i}" ${cardDraft.peer[i] ? 'checked' : ''}> ${label}</label>`).join('')}
      <label for="guardian-improvement">보완할 점</label><textarea id="guardian-improvement" data-guardian="improvement" maxlength="240" placeholder="짝이 알려 준 보완할 점을 적고, 위의 카드 내용을 고쳐 보세요.">${esc(cardDraft.improvement || '')}</textarea></fieldset>
      <div class="row"><button id="printBlank">빈 카드 출력</button><button id="printFilled">작성한 카드 출력</button>
      <button id="finishGuardian" class="primary">카드 저장 · 보상 받기</button></div>`);
    function guardianMap() {
      showMap('uv', { zoom }, '울릉도와 독도의 위치', true);
      bindMapZoom(guardianMap);
    }
    guardianMap();
    action('guardianMap', guardianMap);
    action('groupCardReview', showGroupCard);
    action('reviewModel', () => renderObservation(true));
    action('photosReview', showPhotos);
    const saveDraft = () => { app.state().guardianCard = cardDraft; app.save(); };
    document.querySelectorAll('[data-guardian]').forEach(input => input.oninput = () => {
      cardDraft[input.dataset.guardian] = input.value;
      saveDraft();
    });
    document.querySelectorAll('[data-peer]').forEach(input => input.onchange = () => {
      cardDraft.peer[Number(input.dataset.peer)] = input.checked;
      saveDraft();
    });
    action('printBlank', () => printCard(true));
    action('printFilled', () => printCard(false));
    action('finishGuardian', () => {
      if (guardianFields.some(([key]) => !cardDraft[key]?.trim())) return app.toast('카드의 세 칸을 모두 채워요.');
      if (cardDraft.peer.length !== checks.length || !checks.every((_, i) => cardDraft.peer[i]))
        return app.toast('짝과 읽고 세 항목을 확인해요.');
      saveDraft();
      reward(guardianFields.map(([key, label]) => label + '\n' + cardDraft[key].trim()).join('\n\n'));
    });
  }

  function enter(index, teacher = false) {
    const s = app.state();
    if (index >= s.unlocked && !teacher) return;
    app.setCurrent(index);
    id = index;
    phase = 0;
    answered = false;
    status = '';
    zoom = 0;
    kind = groups[id][0];
    view = id === 1 ? 'top' : 'angle';
    seen = new Set();
    flags = { labels: {}, flow: false, real: false };
    $('world').classList.add('lesson-world');
    world().placing = false;
    world().keys.clear();
    world().clear();
    world().mode = 'lesson-map';
    $('eyebrow').textContent = (id + 1) + '차시';
    $('mapBox').hidden = $('walkControls').hidden = $('interact').hidden = true;
    app.setHeading(app.titles[id], ['산지 높이와 물길', '해안선 모양과 섬의 분포', '두 섬의 위치와 자연환경', '자료를 바탕으로 실천 카드 만들기'][id]);
    if (id === 3) {
      const draft = s.guardianCard;
      cardDraft = { ...(draft || {}), peer: checks.map((_, i) => Boolean(draft?.peer?.[i])) };
      renderGuardian();
    } else if (id === 2) renderDokdoMapIntro();
    else if (id === 1) renderCoastIntro();
    else renderObservation();
  }
  function openAtlas() {
    $('world').classList.add('lesson-world');
    world().placing=false;world().keys.clear();world().clear();world().mode='lesson-map';
    $('walkControls').hidden=$('interact').hidden=$('mapBox').hidden=true;
    $('panel').innerHTML=`<div class="lesson-panel"><h2>우리나라 지형도</h2>
      <p>지도를 확대하거나 끌어서 움직여요. 지도에서 지역을 눌러 그곳의 3D 지형을 열어 보세요.</p>
      <div class="options">${Object.entries(models).map(([key,m])=>`<button data-atlas-region="${key}">${m[0]} 관찰</button>`).join('')}</div>
      <button id="openClassFromMap">차시 바로 열기</button><button id="atlasVillage">나의 마을</button></div>`;
    function go(key) {
      const index=groups.findIndex(group=>group.includes(key));
      enter(index,true);kind=key;
      flags.real=Boolean(geo.regions[key]);
      renderObservation(true,openAtlas);
    }
    showMap('acefguv',{overview:true,guide:true,onModel:go,automatic:true},'우리나라의 산지·하천·평야');
    document.querySelectorAll('[data-atlas-region]').forEach(b=>b.onclick=()=>go(b.dataset.atlasRegion));
    action('openClassFromMap',openClass);
    action('atlasVillage',app.toVillage);
  }
  function openClass() {
    app.dialog(`<h2>차시 바로 열기</h2><p>관찰을 시작할 차시를 골라요.</p><div class="options">
      ${app.titles.map((title,i)=>`<button data-class-open="${i}">${i+1}차시 · ${title}</button>`).join('')}</div>`);
    document.querySelectorAll('[data-class-open]').forEach(b=>b.onclick=()=>{
      $('dialog').close();enter(Number(b.dataset.classOpen),true);
    });
  }
  document.querySelectorAll('[data-view]').forEach(button => button.onclick = () => setView(button.dataset.view));
  $('resetCamera').addEventListener('click', () => {
    if (world()?.mode === 'lesson') setView('angle');
  });
  return { enter, close, openAtlas, openClass };
};
