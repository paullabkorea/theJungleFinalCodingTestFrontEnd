export default class PlayView {
    
    constructor() {
        this.audio = new Audio();
        this.bindEvents();
    }

    static createRenderElement() {

    }

    static calculateTime(secs) {
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${minutes}:${returnedSeconds}`;
    }

    bindEvents() {
        this.audio.addEventListener('loadedmetadata', (event) => {
            
            console.log(PlayView.calculateTime(this.audio.duration));
            console.log(event);
        })
        
        this.audio.addEventListener('play', (event) => {
            console.log(event);
        })

        this.audio.addEventListener('timeupdate', (event) => {
            // console.log(event);
        })
    }

    playMusic(payload = {}) {
        this.pause();
        const { musics, musicIndex } = payload;
        this.audio.src = musics[musicIndex].source;
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    render() {
        return `
        <article class="play-view">
            <div class="play-view-container">
                <h2 class="invisible-text">Play View</h2>
                <button class="back-button">
                    <i class="icon-controller-back"></i>
                </button>
                <div class="cover-wrapper">
                    <img src="http://localhost:3000/public/images/cover/19th_floor.png" />
                </div>
                <div class="music-information">
                    <h3 class="music-title">Where We Wanna Go</h3>
                    <span class="music-artist-name">Patrick Patrikios</span>
                </div>
                <div class="play-view-controller">
                    <div class="controller-container">
                        <button class="control-button">
                            <i class="icon-controller-repeat"></i>
                        </button>
                        <button class="control-button">
                            <i class="icon-controller-backward"></i>
                        </button>
                        <button class="control-button">
                            <i class="icon-controller-play"></i>
                        </button>
                        <button class="control-button">
                            <i class="icon-controller-forward"></i>
                        </button>
                        <button class="control-button">
                            <i class="icon-controller-rotate"></i>
                        </button>
                    </div>
                    <div class="progress-container">
                        <div class="progress">
                            <div class="progress-bar">
                                <div class="progress-control-circle"></div>
                            </div>
                        </div>
                        <div class="progress-time">
                            <div class="current-time">1:43</div>
                            <div class="end-time">3:16</div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
        `;
    }
}