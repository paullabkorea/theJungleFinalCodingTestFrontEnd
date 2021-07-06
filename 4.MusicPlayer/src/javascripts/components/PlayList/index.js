import { findIndexListElement, getClosestElement } from '../../utils/index.js';


export default class PlayList {
    constructor() {
        this.rootElement = PlayList.createRootElement();
        this.musicList = [];
        this.loadStorage();
        this.bindEvents();
    }

    static createRootElement() {
        const rootElement = document.createElement('ARTICLE');
        rootElement.classList.add('contents-playlist');

        return rootElement;
    }

    bindEvents() {
        this.rootElement.addEventListener('click', (event) => {
            const { target } = event;
            const isControllerButton = target.tagName === 'BUTTON';

            if (!isControllerButton) {
                return this.playMusicItem(target);
            }

            this.removeMusicItem(target);
        })
    }

    playMusicItem(target) {
        const listItemElement = getClosestElement(target, 'LI');
        const musicIndex = findIndexListElement(listItemElement);
        const isPlaying = this.musicList[musicIndex].playing;
        this.musicList.forEach(musicInfo => {
            musicInfo.playing = false
        });
        this.rootElement.querySelectorAll('LI').forEach(element => element.classList.remove('on'));
        if (!isPlaying) {
            listItemElement.classList.add('on');
            this.musicList[musicIndex].playing = true;
            this.emit('play', { musics: this.musicList, musicIndex });
        } else {
            this.emit('pause');
        }
       
    }

    removeMusicItem(target) {
        const listItemElement = getClosestElement(target, 'LI');
        const musicIndex = findIndexListElement(listItemElement);
        this.remove(Number(musicIndex));
        listItemElement.parentElement.removeChild(listItemElement);
    }

    add(music) {
        this.musicList.push(music);
        this.saveStorage();
    }

    remove(index) {
        this.musicList.splice(index, 1);
        this.saveStorage();
    }

    loadStorage() {
        const stringifiedPlaylist = localStorage.getItem('playlist');
        try {
            const playList = JSON.parse(stringifiedPlaylist);
            this.musicList = playList instanceof Array ? playList : [];
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * 다음에 다시 호출할 수 있도록 로컬 스토리지에 저장합니다.
     * 원본은 플레이 중일 수도 있기 때문에 map 을 사용하여 새로운 복제본을 만들거나
     * 복제본을 JSON 을 활용하여 만든 다음 playing 상태를 제거하세요.
     */
    saveStorage() {
        const musicList = this.musicList.map(
            ({artists, cover, source, title}) => ({artists, cover, source, title})
        );
        localStorage.setItem('playlist', JSON.stringify(musicList));
    }

    on(eventName, callback) {
        this.events = this.events ? this.events : {};
        this.events[eventName] = callback;
    }

    emit(eventName, payload) {
        this.events[eventName] && this.events[eventName](payload);
    }

    render() {
        const playListTitle = `<h2 class="playlist-title">MY PLAYLIST</h2>`;
        const musicsList = this.musicList.map((music, index) => {
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
                        <div class="music-simple-controller">
                            <button class="icon icon-minus">
                                <span class="invisible-text">제거</span>
                            </button>
                        </div>
                    </div>
                </li>
            `;
        }).join('');
        this.rootElement.innerHTML = playListTitle + '<ul class="music-list">' + musicsList + '</ul>';
        return this.rootElement;
    }
}