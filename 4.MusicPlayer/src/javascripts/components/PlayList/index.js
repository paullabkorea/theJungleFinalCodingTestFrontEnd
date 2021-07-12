import { findIndexListElement, getClosestElement } from '../../utils/index.js';

/**
 * 음악 플레이 리스트를 담당하는 컴포넌트
 */
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
        // 버튼이 눌릴 때 두가지 종류만 있기 때문에 재생 / 삭제로만 구분하였다.
        this.rootElement.addEventListener('click', (event) => {
            const { target } = event;
            const isControllerButton = target.tagName === 'BUTTON';

            if (!isControllerButton) {
                return this.playMusicItem(target);
            }

            this.removeMusicItem(target);
        })
    }

    // 다음 음악을 재생하는 기능, 만약 payload를 넣을 경우에는 repeat, random 을 체크하여 처리한다. 현재 payload 는 playview에서만 넘어오도록 되어 있다.
    playNext(payload) {
        let currentIndex = this.musicList.findIndex(music => music.playing);
        const isMusicIndexEnd = currentIndex >= this.musicList.length - 1; 
        if (isMusicIndexEnd) {
            currentIndex = -1;
        }

        if (payload) {
            const { repeat, random } = payload;

            if (!random && !repeat && isMusicIndexEnd) {
                return;
            }

            if (random) {
                currentIndex = Math.floor(Math.random() * (this.musicList.length - 2));
            }
        }

        const nextIndex = currentIndex + 1;
        this.playMusicItem(nextIndex);
    }

    // 이전 음악을 재생하는 기능
    playPrev() {
        let currentIndex = this.musicList.findIndex(music => music.playing);
        if (currentIndex <= 0) {
            currentIndex = this.musicList.length;
        }
        const prevIndex = currentIndex - 1;
        this.playMusicItem(prevIndex);
    }

    // 실질적으로 플레이리스트의 몇번째 음악인지를 받아 처리하는 부분
    playMusicItem(target) {
        const listItemElement = typeof target === 'number' ? this.rootElement.querySelectorAll('LI')[target] : getClosestElement(target, 'LI');
        const musicIndex = findIndexListElement(listItemElement);
        const requestPlay = this.musicList[musicIndex].playing;
        this.musicList.forEach(musicInfo => {
            musicInfo.playing = false
        });
        this.rootElement.querySelectorAll('LI').forEach(element => element.classList.remove('on'));
        if (!requestPlay) {
            listItemElement.classList.add('on');
            this.musicList[musicIndex].playing = true;
            this.emit('play', { musics: this.musicList, musicIndex });
        } else {
            listItemElement.classList.remove('on');
            this.emit('pause');
        }
       
    }

    // 플레이 리스트에서 음악 제거
    removeMusicItem(target) {
        const listItemElement = getClosestElement(target, 'LI');
        const musicIndex = findIndexListElement(listItemElement);
        this.remove(Number(musicIndex));
        listItemElement.parentElement.removeChild(listItemElement);
    }


    // 플레이 리스트에 음악 추가
    add(music) {
        this.musicList.push(music);
        this.saveStorage();
    }

    // 플레이 리스트에서 음악 제거
    remove(index) {
        this.musicList.splice(index, 1);
        this.saveStorage();
    }

    // 저장소에서 임시저장한 음악 리스트 호출
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

    // 화면 렌더링
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