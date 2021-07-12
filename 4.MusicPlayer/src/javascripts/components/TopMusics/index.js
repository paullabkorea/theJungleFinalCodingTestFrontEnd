/**
 * 첫번째 페이지인 탑뮤직들을 담은 컴포넌트
 */
export default class TopMusics {
    constructor() {
        this.rootElement = TopMusics.createRootElement();
        this.musics = [];
        this.bindEvents();
    }

    static createRootElement() {
        const rootElement = document.createElement('ARTICLE');
        rootElement.classList.add('contents-top5');

        return rootElement;
    }

    /**
     * 이벤트를 등록해주는 도구를 답니다.
     * 상속받는 것도 좋지만, 컴포넌트 클래스를 따로 만들어서 하는 것까지 나가기는 좀 그렇기 때문에
     * 몇개 되지 않으니 각 클래스에 그냥 달도록 하겠습니다.
     */
     on(eventName, callback) {
        this.events = this.events ? this.events : {};
        this.events[eventName] = callback;
    }

    emit(eventName, payload) {
        this.events[eventName] && this.events[eventName](payload);
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

            if (!isControllerButton) {
                return;
            }

            const buttonRole = target.classList.item(1);
            switch (buttonRole) {
                case 'icon-play': {
                    this.requestPlay(target);
                    break;
                }
                case 'icon-pause': {
                    this.requestPause(target);
                    break;
                }
                case 'icon-plus': {
                    this.requestAddPlayList(target);
                    break;
                }
            };
        });
    }

    /**
     * 재생 상태를 중단 (멈춤 아이콘 => 플레이 아이콘으로 전환: 재생상태를 멈춰서 다시 재생 버튼을 눌러야 하기 때문)
     */
    renderStopAll() {
        const playingButtons = this.rootElement.querySelectorAll('.icon-pause');
        playingButtons.forEach(element => element.classList.replace('icon-pause', 'icon-play'));
    }
    
    /**
     * 음악 재생을 app.js 에 요청
     */
    requestPlay(target) {
        const controller = target.parentElement;
        const { index: musicIndex } = controller.dataset;
        const payload = { musics: this.musics, musicIndex };
        
        this.emit('play', payload);
        this.renderStopAll();
        target.classList.replace('icon-play', 'icon-pause');
    }

    /**
     * 음악 중단을 app.js 에 요청 
     */
    requestPause(target) {
        this.emit('pause');
        target.classList.replace('icon-pause', 'icon-play');
    }

    /**
     * 플레이 리스트에 추가를 요청
     * 여기는 검색과도 동일해서 나중에 기능을 묶을 수도 있을 듯함
     * 하지만 여기서는 묶지 않겠음
     */
    requestAddPlayList(target) {
        const controller = target.parentElement;
        const { index: musicIndex } = controller.dataset;
        const payload = { musics: this.musics, musicIndex };

        this.emit('addPlayList', payload);
    }

    // 받아온 음악 데이터를 넣기
    setMusics(musics = []) {
        this.musics = musics;
    }

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