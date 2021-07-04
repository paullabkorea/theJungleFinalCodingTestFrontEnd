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
        this.musicList[musicIndex].playing = !this.musicList[musicIndex].playing;
        const isPlaying = this.musicList[musicIndex].playing;
        if (isPlaying) {
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
        const playlist = localStorage.getItem('playlist');
        this.musicList = playlist ? JSON.parse(playlist) : this.musicList;
    }

    saveStorage() {
        localStorage.setItem('playlist', JSON.stringify(this.musicList));
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