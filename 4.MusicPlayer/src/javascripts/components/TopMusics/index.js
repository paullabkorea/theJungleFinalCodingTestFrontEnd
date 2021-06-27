export default class TopMusics {
    constructor(props) {
        const { parentElement, playView } = props;
        this.parentElement = parentElement;
        this.rootElement = TopMusics.createRootElement();
        this.musics = [];
        this.playView = playView;
        this.bindEvents();
    }

    bindEvents() {
        this.parentElement.addEventListener('click', (event) => {
            const { target, path } = event;
            const { tagName, classList } = target;
            
            if (tagName === 'BUTTON') {
                const listItem = path.find(element => element.tagName === 'LI');
                const { index: musicIndex } = listItem.dataset;
                const isPlayButton = classList.contains('icon-play');
                isPlayButton && this.playView.playMusic({ musics: this.musics, musicIndex });
            }
        });
    }

    setMusics(musics = []) {
        this.musics = musics;
    }

    static createRootElement() {
        const rootElement = document.createElement('ARTICLE');
        rootElement.classList.add('contents-top5');

        return rootElement;
    }

    render() {
        const topRoof = `<div class="top5-roof">
                            <img src="assets/images/intro-logo.png"/>
                        </div>`;

        const musicsList = this.musics.map((music, index) => {
            const { cover, title, artists } = music;
            return `
                <li data-index=${index}>
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
                        <div class="music-simple-controller">
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
        this.parentElement.append(this.rootElement);
    }
}