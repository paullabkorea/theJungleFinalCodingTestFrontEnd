export default class PlayView {
    
    constructor() {
        this.audio = new Audio();
        this.rootElement = PlayView.createRenderElement();
        this.playViewMusic = null;
        this.repeat = false;
        this.random = false;
        this.bindEvents();
    }

    static createRenderElement() {
        const playViewWrapper = document.createElement('ARTICLE');
        playViewWrapper.classList.add('play-view');

        return playViewWrapper;
    }

    static calculateTime(secs) {
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${minutes}:${returnedSeconds}`;
    }

    bindEvents() {
        /**
         * 음악이 종료되면 일단 play, pause UI 처리를 한 후 음악이 끝났음을 앱.js에 알린다. 앱.js 는 그 후에 처리를 담당한다.
         */
        this.audio.addEventListener('ended', () => {
            const fromPauseToPlay = this.rootElement.querySelector('.control-play');
            const fromPlayToPause = this.rootElement.querySelector('.control-pause');
            fromPlayToPause.classList.add('hide');
            fromPauseToPlay.classList.remove('hide');
            this.emit('musicEnded', { repeat: this.repeat, random: this.random });
        });

        /**
         * 플레이 시간을 옮길 때 (레인지 인풋) 충돌이 있어 인터벌을 주어 레인지 인풋 이벤트가 충분히 발생할 수 있도록 한다.
         * 시간이 지날 때마다 레인지 인풋을 옮긴다.
         * 레인지 인풋으로 쓴 이유는 이벤트 처리가 간단해서 사용하였다.
         * CSS를 할때는 더 난이도가 있다.
         * div를 활용한 css 는 처리가 쉽지만 이벤트를 붙이기가 곤란하다. 시험이 나온다면 일반적으로는 레인지 인풋으로 하게 할 가능성이 좀더 높다.
         */
        let intervaler = 0;
        this.audio.addEventListener('timeupdate', () => {
            intervaler++;
            if (intervaler % 3 !== 0) {
                return;
            }

            const audioProgress = this.audio.currentTime / this.audio.duration * 100;
            const controlProgress = audioProgress > 100 ? 100 : audioProgress;
            const progressBarElement = this.rootElement.querySelector('.progress');
            progressBarElement.value = controlProgress ? controlProgress * 10 : 0;
        })
    }

    /**
     * 음악을 실제로 플레이 하는 부분
     * 플레이 뷰에서는 오디오 이벤트를 핸들링 하는 곳이 많기 때문에 모든 음악도 여기에서 실행/멈춤하게 했다.
     */
    playMusic(payload) {
        this.pause();

        if (payload) {
            const { musics, musicIndex } = payload;
            this.audio.src = musics[musicIndex].source;
            this.playViewMusic = musics[musicIndex];
            this.renderMusicContainer();
        }

        this.audio.play();
    }

    /**
     * 음악이 실제로 멈추는 부분
     */
    pause() {
        this.audio.pause();
    }

    /**
     * 루트를 제외한 나머지는 빠르게 구성하기 위해 문자열로 생성한 후 innerHTML 처리하였다.
     * 레인지 인풋을 사용한 이유는 위에 설명. CSS 처리가 어렵기 때문에 디자인을 따르지 않았다.
     */
    renderMusicContainer() {
        const { artists, cover, title } = this.playViewMusic;
        this.rootElement.innerHTML = `
            <div class="play-view-container">
                <h2 class="invisible-text">Play View</h2>
                <button class="back-button">
                    <i class="icon-controller-back"></i>
                </button>
                <div class="cover-wrapper">
                    <img src="http://localhost:3000${cover}" />
                </div>
                <div class="music-information">
                    <h3 class="music-title">${title}</h3>
                    <span class="music-artist-name">${artists.join(', ')}</span>
                </div>
                <div class="play-view-controller">
                    <div class="controller-container">
                        <button class="control-button control-repeat ${this.repeat ? 'on' : ''}">
                            <i class="icon-controller-repeat"></i>
                        </button>
                        <button class="control-button control-backward">
                            <i class="icon-controller-backward"></i>
                        </button>
                        <button class="control-button control-play hide">
                            <i class="icon-controller-play"></i>
                        </button>
                        <button class="control-button control-pause">
                            <i class="icon-controller-pause"></i>
                        </button>
                        <button class="control-button control-forward">
                            <i class="icon-controller-forward"></i>
                        </button>
                        <button class="control-button control-rotate" ${this.random ? 'on' : ''}>
                            <i class="icon-controller-rotate"></i>
                        </button>
                    </div>
                    <div class="progress-container">
                        <input class="progress" type="range" min="0" max="1000" value="0">
                        <div class="progress-time">
                            <div class="current-time">1:43</div>
                            <div class="end-time">3:16</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 이 방법을 사용해서 생성했기 때문에 엘리먼트를 다시 붙일 때마다 이벤트를 새로 걸어줘야 하는 단점이 생긴다.
        const backButton = this.rootElement.querySelector('.back-button');
        
        const fromPauseToPlay = this.rootElement.querySelector('.control-play');
        const fromPlayToPause = this.rootElement.querySelector('.control-pause');
        const backward = this.rootElement.querySelector('.control-backward');
        const forward = this.rootElement.querySelector('.control-forward');
        
        const repeat = this.rootElement.querySelector('.control-repeat');
        const random = this.rootElement.querySelector('.control-rotate');
        const progress = this.rootElement.querySelector('.progress');

        // 멈춤에서 플레이로 바꾸는 엘리먼트 (멈춤 버튼)
        fromPauseToPlay.addEventListener('click', () => {
            this.playMusic();
            fromPauseToPlay.classList.add('hide');
            fromPlayToPause.classList.remove('hide');
        });

        // 플레이에서 멈춤으로 바꾸는 엘리먼트 (플레이 버튼)
        fromPlayToPause.addEventListener('click', () => {
            this.pause();
            fromPlayToPause.classList.add('hide');
            fromPauseToPlay.classList.remove('hide');
        });

        // 반복하도록 하는 버튼
        repeat.addEventListener('click', () => {
            this.repeat = !this.repeat;
            if (this.repeat) {
                repeat.classList.add('on');
            } else {
                repeat.classList.remove('on');
            }
        });

        // 음악이 끝나면 랜덤으로 재생하게 하는 버튼
        random.addEventListener('click', () => {
            this.random = !this.random;
            if (this.random) {
                random.classList.add('on');
            } else {
                random.classList.remove('on');
            }
        });

        // 뒤로 가기 버튼, 사실상 플레이뷰 종료
        backButton.addEventListener('click', () => this.hide());

        // 이전 플레이리스트 음악 듣기
        backward.addEventListener('click', () => this.emit('backward'));
        
        // 이후 플레이리스트 음악 듣기
        forward.addEventListener('click', () => this.emit('forward'));

        // 진행도를 추가하는 이벤트
        progress.addEventListener('change', (event) => {
            const targetTime = this.audio.duration * Number(event.target.value) / 1000;
            this.audio.currentTime = targetTime;
        });
    }

    show() {
        document.body.append(this.rootElement);
    }

    hide() {
        document.body.removeChild(this.rootElement);
    }

    on(eventName, callback) {
        this.events = this.events ? this.events : {};
        this.events[eventName] = callback;
    }

    emit(eventName, payload) {
        this.events[eventName] && this.events[eventName](payload);
    }
}