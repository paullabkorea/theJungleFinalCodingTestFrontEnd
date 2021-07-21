import { removeAllChildNodes } from '../../utils/index.js';

/**
 * 검색 컴포넌트
 */
export default class SearchView {
    constructor() {
        // 루트 엘리먼트를 생성해줍니다.
        this.rootElement = SearchView.createRootElement();
        // 검색한 결과를 담는 배열입니다.
        this.searchedMusics = [];
        this.bindEvents();
    }

    // 미리 만들어두면 좋을 엘리먼트들이 있어서 루트 뿐만이 아니라 모두 여기서 생성했습니다.
    static createRootElement() {
        const rootElement = document.createElement('ARTICLE');
        rootElement.classList.add('contents-search');
        rootElement.innerHTML = `
        <div class="search-controller">
            <input class="search-input" type="text" placeholder="검색"/>
            <button class="search-button">
                <i class="icon-search-controller"></i>
            </button>
        </div>
        <ul class="music-list"></ul>
        `;

        return rootElement;
    }

    // 이벤트 바인딩
    bindEvents() {

        // 쿼리를 받아 즉시 검색하는 함수를 부모로 요청합니다. 부모(app.js)는 이 값을 받아서 다시 처리할 것입니다.
        this.rootElement.querySelector('.search-input').addEventListener('input', (event) => {
            const query = event.target.value;
            this.emit('searchMusic', query);
        });

        // 음악에 대한 기능 선택
        this.rootElement.addEventListener('click', (event) => {
            const { target } = event;
            // 버튼인 경우에만 처리하도록 하고, 여기서는 버튼마다 따로 이벤트를 두지 않고 이벤트 위임 형식으로 작성했습니다.
            const isControllerButton = target.tagName === 'BUTTON';

            if (!isControllerButton) {
                return;
            }

            // 첫번째 클래스를 가져와서 체크합니다. 이것은 조금 위험할 수 있으니, 주의해서 사용해야합니다. 항상 첫번째 클래스가 이것이라는 보장은 없기 때문입니다. 누군가 수정을 했을 때 바뀔 수도 있고요.
            const buttonRole = target.classList.item(1);
            switch (buttonRole) {
                // 아이콘 플레이인 경우에는
                case 'icon-play': {
                    // 부모(app.js)에게 음악 재생을 요청합니다.
                    this.requestPlay(target);
                    break;
                }
                // 아이콘 멈춤인 경우에는
                case 'icon-pause': {
                    // 부모(app.js)에게 음악 멈춤을 요청합니다.
                    this.requestPause(target);
                    break;
                }
                // 아이콘 추가인 경우에는
                case 'icon-plus': {
                    // 부모(app.js)에게 플레이 리스트에 음악 추가를 요청합니다.
                    this.requestAddPlayList(target);
                    break;
                }
            };
        });
    }
    // 탑뮤직과 동일한 컴포넌트를 사용하기 때문에 거의 비슷한데 이런 경우에는 또 자식 컴포넌트로 빼주면 더 좋습니다. 코드를 재활용할 수 있기 때문입니다. 이번에는 재활용없이 작성하는 형태로 가겠습니다.

    // 모든 음악 재생 상태(멈춤 아이콘에서 플레이 아이콘으로 변환)를 중단하는 ui 변경처리
    renderStopAll() {
        // 멈춤인 아이콘을 찾아옵니다. (멈춤인 아이콘이어야 현재 재생하고 있다는 것을 의미하기 때문입니다.)
        const playingButtons = this.rootElement.querySelectorAll('.icon-pause');
        // 멈춤인 아이콘을 모두 play 아이콘으로 ui 변경을 해줍니다.
        playingButtons.forEach(element => element.classList.replace('icon-pause', 'icon-play'));
    }

    // 음악 재생을 App.js 에 요청
    requestPlay(target) {
        // 받아온 엘리먼트의 부모 엘리먼트를 찾습니다. 부모엘리먼트에 데이터를 저장해두었습니다.
        const controller = target.parentElement;
        // 엘리먼트에서 data- 형태로 된 것은 element.dataset 에서 가져올 수 있습니다. 이중에 index 값 (음악 인덱스) 를 가져옵니다.
        const { index: musicIndex } = controller.dataset;
        // 한덩어리인 페이로드로 묶습니다. 음악리스트를 따로 보내지 않아도 될 것 같긴 한데.. 최초에 이런 식으로 만들어서 그냥 계속 보내게 되었습니다.
        const payload = { musics: this.searchedMusics, musicIndex };
        // 부모(app.js)에게 요청을 보냅니다.
        this.emit('play', payload);
        // 모든 엘리먼트의 ui를 정지 상태로 변경합니다.
        this.renderStopAll();
        // 해당하는 음악 엘리먼트의 ui 만 재생을 상징하는 멈춤이 가능한 ui로 변경합니다.
        target.classList.replace('icon-play', 'icon-pause');
    }

    // 음악 중단을 app.js에 요청
    requestPause(target) {
        this.emit('pause');
        // 해당하는 음악 엘리먼트의 ui 만 멈춤을 상징하는 재생이 가능한 ui로 변경합니다.
        target.classList.replace('icon-pause', 'icon-play');
    }

    // 플레이 리스트에 추가를 app.js 에 요청
    requestAddPlayList(target) {
        // 음악 요청과 마찬가지로 받아온 엘리먼트의 부모 엘리먼트를 찾습니다. 부모엘리먼트에 데이터를 저장해두었습니다.
        const controller = target.parentElement;
        // 엘리먼트에서 data- 형태로 된 것은 element.dataset 에서 가져올 수 있습니다. 이중에 index 값 (음악 인덱스) 를 가져옵니다.
        const { index: musicIndex } = controller.dataset;
        // 한덩어리인 페이로드로 묶습니다. 음악리스트를 따로 보내지 않아도 될 것 같긴 한데.. 최초에 이런 식으로 만들어서 그냥 계속 보내게 되었습니다.
        const payload = { musics: this.searchedMusics, musicIndex };
        // 부모(app.js)에게 플레이리스트에 추가하라는 요청을 보냅니다. 부모는 자기 자식중 하나인 플레이리스트에게 추가하라는 명령을 내릴 것입니다.
        this.emit('addPlayList', payload);
    }

    // 검색 결과를 담아 새로 렌더링합니다.
    setSearchResult(musicList = []) {
        this.searchedMusics = musicList;
        this.renderSearchedMusics();
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

    // 음악 검색 결과 부분만 다시 렌더링합니다.
    renderSearchedMusics() {
        const musicListElement = this.rootElement.querySelector('.music-list');
        removeAllChildNodes(musicListElement);
        const searchedMusics = this.searchedMusics.map((music, index) => {
            const { cover, title, artists } = music;
            return `
                <li>
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

        musicListElement.innerHTML = searchedMusics;
    }

    // 전체 렌더링을 보내줌. 부모 엘리먼트는 이 엘리먼트를 획득하고 자기 자신의 루트 엘리먼트에 부착할 것입니다.
    render() {
        return this.rootElement;
    }
}