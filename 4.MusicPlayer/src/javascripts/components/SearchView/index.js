import { removeAllChildNodes } from '../../utils/index.js';

/**
 * 검색 컴포넌트
 */
export default class SearchView {
    constructor() {
        this.rootElement = SearchView.createRootElement();
        this.searchedMusics = [];
        this.bindEvents();
    }

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
    
    bindEvents() {

        // 쿼리를 받아 즉시 검색하는 함수를 부모로 호출
        this.rootElement.querySelector('.search-input').addEventListener('input', (event) => {
            const query = event.target.value;
            this.emit('searchMusic', query);
        });

        // 음악에 대한 기능 선택
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

    // 모든 음악 재생 상태(멈춤 아이콘에서 플레이 아이콘으로 변환)를 중단
    renderStopAll() {
        const playingButtons = this.rootElement.querySelectorAll('.icon-pause');
        playingButtons.forEach(element => element.classList.replace('icon-pause', 'icon-play'));
    }

    // 음악 재생을 App.js 에 요청
    requestPlay(target0) {
        const controller = target.parentElement;
        const { index: musicIndex } = controller.dataset;
        const payload = { musics: this.searchedMusics, musicIndex };
        
        this.emit('play', payload);
        this.renderStopAll();
        target.classList.replace('icon-play', 'icon-pause');
    }

    // 음악 중단을 app.js에 요청
    requestPause(target) {
        this.emit('pause');
        target.classList.replace('icon-pause', 'icon-play');
    }

    // 플레이 리스트에 추가를 app.js 에 요청
    requestAddPlayList(target) {
        const controller = target.parentElement;
        const { index: musicIndex } = controller.dataset;
        const payload = { musics: this.searchedMusics, musicIndex };

        this.emit('addPlayList', payload);
    }

    // 검색 결과를 담아 렌더링
    setSearchResult(musicList = []) {
        this.searchedMusics = musicList;
        this.renderSearchedMusics();
    }

    on(eventName, callback) {
        this.events = this.events ? this.events : {};
        this.events[eventName] = callback;
    }

    emit(eventName, payload) {
        this.events[eventName] && this.events[eventName](payload);
    }

    // 음악 검색 결과 부분만 다시 렌더링
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

    // 전체 렌더링을 보내줌
    render() {
        return this.rootElement;
    }
}