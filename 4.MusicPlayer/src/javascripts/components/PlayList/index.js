export default class PlayList {
    constructor() {
        this.rootElement = PlayList.createRootElement();
    }

    static createRootElement() {
        const rootElement = document.createElement('ARTICLE');
        rootElement.classList.add('contents-playlist');

        return rootElement;
    }

    render() {
        this.rootElement.innerHTML = `<h2 class="playlist-title">MY PLAYLIST</h2>`;
        return this.rootElement;
    }
}