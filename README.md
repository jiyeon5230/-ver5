# 큐티의 지형 탐험 마을

초등학교 5학년 사회 ‘우리나라 국토 여행’의 1~4차시용 정적 웹앱입니다.

## 열기와 배포

압축을 풀고 `index.html`을 Chrome 또는 Edge로 엽니다. GitHub에 올릴 때는 압축 안의 파일을 저장소 루트에 함께 넣습니다. GitHub Pages는 배포 브랜치의 `/(root)`, Netlify는 게시 디렉터리 `.`을 사용합니다. 설치와 빌드 과정은 없습니다.

## 수업에서 사용하기

- 마을에서 방향키나 WASD 또는 화면 방향 버튼으로 움직입니다. 큐티나 탐험 게시판 가까이에서 E를 누르거나 상호작용 버튼을 누릅니다.
- 산지·하천·해안·독도는 드래그로 돌리고 휠, 두 손가락 또는 +/− 버튼으로 확대·축소합니다. 위·비스듬히·옆 시점은 화면 버튼으로 선택합니다.
- 상단 **차시 바로 열기**에서 수업에 쓸 차시를 고릅니다. 마을의 **우리나라 지형도**에서는 지도 위 대표 지점을 눌러 3D 화면을 엽니다. 지도는 드래그, 휠, 두 손가락 또는 확대 버튼으로 조작합니다.
- 1차시는 시점별 질문에 따라 관찰하고 지도에 산지·하천·흐름을 표시합니다. 2차시는 사진을 보고 예상한 뒤, 세 해안을 같은 시점에서 관찰하여 비교표에 기록합니다. 3차시는 독도를 지도에서 찾고 모둠 소개 카드를 만듭니다. 4차시는 모둠 카드를 다시 보고 독도 지킴이 카드를 작성한 뒤 짝의 의견을 받아 보완합니다.
- 4차시의 **빈 카드 출력** 또는 **작성한 카드 출력**을 누르면 A4 인쇄 화면이 열립니다. 용지에 웹페이지 주소가 표시되면 브라우저 인쇄 옵션의 머리글과 바닥글을 끕니다.
- 차시 기록을 저장하면 장식이 열립니다. 정원에서 장식을 고른 뒤 자리 또는 번호를 눌러 배치합니다.

## 저장과 자료

별명, 차시 진행, 카드 초안, 경험치와 장식은 현재 브라우저에 저장됩니다. 기존 앱과 같은 저장 키를 사용하며, 같은 웹사이트 주소에서 업데이트하는 경우 기존 기록을 읽습니다. 로컬 파일 경로나 배포 주소가 달라지면 브라우저가 저장 공간을 다르게 취급할 수 있습니다. 수업 설정에서 기록을 JSON으로 내려받을 수 있습니다.

- 학습용 지도에는 지형 분포를 참고해 만든 높낮이 음영, 대표 지명과 단순화한 해안선·산맥·물길을 표시합니다. 연결되면 실제 해안선은 [Natural Earth / World Atlas 2.0.2](https://github.com/topojson/world-atlas)에서, 표고는 [Mapzen Terrain Tiles](https://registry.opendata.aws/terrain-tiles/)에서 불러옵니다. 실제 자료 적용 여부는 지도 아래에 표시됩니다.
- 관찰 화면의 **실제 표고로 보기**는 설악산, 한강 양평·팔당, 정동진, 신두리, 금오도에 적용됩니다. 세 해안은 같은 22 km 폭과 3배 높이 강조를 사용합니다. 한강의 물 표면과 상류·하류 비교, 독도 3D는 학습용 모형으로 설명합니다.
- 해안과 하천 자료는 국토지리정보원 [대한민국 국가지도집](https://nationalatlas.ngii.go.kr/pages/page_3982.php), 독도 자료는 외교부 [구성 및 위치](https://dokdo.mofa.go.kr/kor/introduce/location.jsp)와 [자연환경](https://dokdo.mofa.go.kr/kor/introduce/nature.jsp)을 참고했습니다. 사례별 지도 출처는 앱에서 확인할 수 있습니다.
- 실제 독도 사진은 Rachouette의 [Dokdo Photo.jpg](https://commons.wikimedia.org/wiki/File:Dokdo_Photo.jpg)와 Sokyo Park의 [Dokdo.jpg](https://commons.wikimedia.org/wiki/File:Dokdo.jpg)입니다. 둘 다 [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/)이며 인터넷으로 불러옵니다. 사진 연결이 어려울 때에도 설명 자료는 앱에서 읽을 수 있습니다.
- 2차시 사진은 [정동진 해변(최광모, CC0)](https://commons.wikimedia.org/wiki/File:20151015_최광모_SONY_DSC-RX10_DSC04343_20151024.JPG), [태안 만리포(Olga Lipunova, CC BY-SA 3.0)](https://commons.wikimedia.org/wiki/File:태안해안국립공원_만리포_1.jpg), [여수 섬 일대(Stephen Alexander-Larkin, CC BY-SA 3.0)](https://commons.wikimedia.org/wiki/File:Yeosu_islands1.jpg)입니다. 사진을 불러오려면 인터넷 연결이 필요합니다.
- 마을의 실제 지형 관찰실은 인터넷을 통해 [Mapzen / AWS Terrain Tiles](https://registry.opendata.aws/terrain-tiles/)의 표고 자료를 불러옵니다. 별도의 학습 모형과 자료 출처를 화면에 표시합니다.
- 진주교대 큐티는 사용자 제공 이미지입니다. Three.js 라이선스는 `THREE-LICENSE.txt`에 있습니다.
