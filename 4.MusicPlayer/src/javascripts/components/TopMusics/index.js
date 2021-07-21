/**
 * 첫번째 페이지인 탑뮤직들을 담은 컴포넌트
 */
export default class TopMusics {
    constructor() {
        // 루트 엘리먼트를 생성합니다.
        this.rootElement = TopMusics.createRootElement();
        // 부모로부터 받은 음악 데이터를 관리할 객체입니다.
        this.musics = [];
        this.bindEvents();
    }

    // 루트 엘리먼트를 생성합니다.
    static createRootElement() {
        const rootElement = document.createElement('ARTICLE');
        rootElement.classList.add('contents-top5');

        return rootElement;
    }

    bindEvents() {
        /**
         * 이벤트 위임을 사용해서 처리해보았습니다.
         * 지금의 상태에서는 음악이 갑자기 추가될 일이 없긴 하지만,
         * 음악이 하나씩 추가되는 형태일 경우에는 추가될때마다 이벤트를 붙여주는 로직을 만들어야 해서
         * 대응이 좀더 쉽도록 이렇게 작성했습니다.
         * 장점은 협업 관점에서는 코드를 보기가 좀더 수월하다는 점이 있고,
         * 단점은 버튼을 눌렀을 때에 동작 케이스를 나눠 확인해야 하기 때문에 클라에 미세한 부담이 더해집니다.
         * 음악이 자주 추가되는 경우에는 이벤트도 자주 추가가 되기 때문에 위임이 훨씬 유리할 때가 있습니다.
         */
        this.rootElement.addEventListener('click', (event) => {
            const { target } = event;
            const isControllerButton = target.tagName === 'BUTTON';
            // 버튼이 아닌 경우에는 실행하지 않습니다.
            if (!isControllerButton) {
                return;
            }

            // button 태그의 첫번째 인덱스 클래스를 가져와서 체크합니다.(0부터 시작합니다.) 이것은 조금 위험할 수 있으니, 주의해서 사용해야합니다. 항상 첫번째 클래스가 이것이라는 보장은 없기 때문입니다. 누군가 수정을 했을 때 바뀔 수도 있고요.
            const buttonRole = target.classList.item(1);
            switch (buttonRole) {
                // 아이콘 플레이인 경우에는
                case 'icon-play': {
                    // 음악 재생을 요청합니다.
                    this.requestPlay(target);
                    break;
                }
                // 아이콘 멈춤의 경우에는
                case 'icon-pause': {
                    // 음악 멈춤을 요청합니다.
                    this.requestPause(target);
                    break;
                }
                // 아이콘 추가의 경우에는
                case 'icon-plus': {
                    // 플레이리스트에 추가를 요청합니다.
                    this.requestAddPlayList(target);
                    break;
                }
            };
        });
    }

    // 모든 음악 재생 상태(멈춤 아이콘에서 플레이 아이콘으로 변환)를 중단하는 ui 변경처리
    renderStopAll() {
        // 멈춤인 아이콘을 찾아옵니다. (멈춤인 아이콘이어야 현재 재생하고 있다는 것을 의미하기 때문입니다.)
        const playingButtons = this.rootElement.querySelectorAll('.icon-pause');
        // 멈춤인 아이콘을 모두 play 아이콘으로 ui 변경을 해줍니다.
        playingButtons.forEach(element => element.classList.replace('icon-pause', 'icon-play'));
    }

    /**
     * 음악 재생을 app.js 에 요청
     */
    requestPlay(target) {
        // 받아온 엘리먼트의 부모 엘리먼트를 찾습니다. 부모 엘리먼트에 데이터를 저장해두었습니다.
        const controller = target.parentElement;
        // 엘리먼트에서 data- 형태로 된 것은 element.dataset 에서 가져올 수 있습니다. 이중에 index 값 (음악 인덱스) 를 가져옵니다.
        const { index: musicIndex } = controller.dataset;
        // 한덩어리인 페이로드로 묶습니다. 음악리스트를 따로 보내지 않아도 될 것 같긴 한데.. 최초에 이런 식으로 만들어서 그냥 계속 보내게 되었습니다.
        const payload = { musics: this.musics, musicIndex };
        // 부모(app.js)에게 요청을 보냅니다.
        this.emit('play', payload);
        // 모든 엘리먼트의 ui를 정지 상태로 변경합니다.
        this.renderStopAll();
        // 해당하는 음악 엘리먼트의 ui 만 재생을 상징하는 멈춤이 가능한 ui로 변경합니다.
        target.classList.replace('icon-play', 'icon-pause');
    }

    /**
     * 음악 중단을 app.js 에 요청 
     */
    requestPause(target) {
        this.emit('pause');
        // 해당하는 음악 엘리먼트의 ui 만 멈춤을 상징하는 재생이 가능한 ui로 변경합니다.
        target.classList.replace('icon-pause', 'icon-play');
    }

    /**
     * 플레이 리스트에 추가를 요청
     * 여기는 검색과도 동일해서 나중에 기능을 묶을 수도 있을 듯함
     * 하지만 여기서는 묶지 않겠음
     */
    requestAddPlayList(target) {
        // 음악 요청과 마찬가지로 받아온 엘리먼트의 부모 엘리먼트를 찾습니다. 부모엘리먼트에 데이터를 저장해두었습니다.
        const controller = target.parentElement;
        // 엘리먼트에서 data- 형태로 된 것은 element.dataset 에서 가져올 수 있습니다. 이중에 index 값 (음악 인덱스) 를 가져옵니다.
        const { index: musicIndex } = controller.dataset;
        // 한덩어리인 페이로드로 묶습니다. 음악리스트를 따로 보내지 않아도 될 것 같긴 한데.. 최초에 이런 식으로 만들어서 그냥 계속 보내게 되었습니다.
        const payload = { musics: this.musics, musicIndex };
        // 부모(app.js)에게 플레이리스트에 추가하라는 요청을 보냅니다. 부모는 자기 자식중 하나인 플레이리스트에게 추가하라는 명령을 내릴 것입니다.
        this.emit('addPlayList', payload);
    }

    // 받아온 음악 데이터를 넣기
    setMusics(musics = []) {
        this.musics = musics;
    }

    // 공통 이벤트입니다. 만약 시험에서 사용하시게 된다면 각 Component에 따로 두는 것보다 공통 베이스 컴포넌트를 만들어서 상속받는 형태로 하시는 것이 좋습니다. (5)번에 샘플이 있습니다.
    on(eventName, callback) {
        this.events = this.events ? this.events : {};
        this.events[eventName] = callback;
    }
    // 공통 이벤트입니다. 만약 시험에서 사용하시게 된다면 각 Component에 따로 두는 것보다 공통 베이스 컴포넌트를 만들어서 상속받는 형태로 하시는 것이 좋습니다. (5)번에 샘플이 있습니다.
    emit(eventName, payload) {
        this.events[eventName] && this.events[eventName](payload);
    }

    // 탑 뮤직 UI 전체를 렌더링합니다.
    render() {
        const topRoof = `<div class="top5-roof">
                            <img src="assets/images/intro-logo.png"/>
                        </div>`;

        const musicsList = this.musics.map((music, index) => {
            const { cover, title, artists } = music;
            return `
                <li>
                    <div class="music-rank">${index + 1}</div>
                    <div class="music-content">
                        <div class="music-data">
                            <div class="music-cover">
                                <img src="${cover}" />
                            </div>
                            <div class="music-info">
                                <strong class="music-title">${title}</strong>
                                <em class="music-artist">${artists[0]}</em>
                            </div>
                        </div>
                        <div class="music-simple-controller" data-index=${index}>
                            <button class="icon icon-play">
                                <span class="invisible-text">재생</span>
                            </button>
                            <button class="icon icon-plus">
                                <span class="invisible-text">추가</span>
                            </button>
                        </div>
                    </div>
                </li>
            `;
        }).join('');
        this.rootElement.innerHTML = topRoof + `<ol class="top5-list">` + musicsList + `</ol>`;

        return this.rootElement;
    }
}