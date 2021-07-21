// 오디오를 담당하는 플레이뷰입니다. 이 앱 전체의 오디오를 담당하고 있습니다. 한군데서 담당하게 해야 음악 충돌, 두번씩 연속 재생 등이 발생하지 않을 것이기 때문입니다.
export default class PlayView {

    constructor() {
        // 여기에서 핸들링할 오디오 객체를 하나 생성해줍니다.
        this.audio = new Audio();
        // 루트 엘리먼트를 생성해줍니다.
        this.rootElement = PlayView.createRenderElement();
        // 현재 음악을 담당할 변수입니다.
        this.playViewMusic = null;
        // 반복할지 여부입니다. 플레이리스트에 나중에 app.js를 통해서 요청할 값입니다.
        this.repeat = false;
        // 랜덤할지 여부입니다. 플레이리스트에 나중에 app.js를 통해서 요청할 값입니다.
        this.random = false;
        // 생성하면서 이벤트를 바인딩합니다.
        this.bindEvents();
    }

    static createRenderElement() {
        const playViewWrapper = document.createElement('ARTICLE');
        playViewWrapper.classList.add('play-view');

        return playViewWrapper;
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

            // 타임 업데이트를 잠시 멈추고 진행상황을 업데이트합니다.
            intervaler++;
            if (intervaler % 3 !== 0) {
                return;
            }
            // 오디오의 현재 시간 / 오디오의 전체 시간을 나누기 계산하여 현재 진행율을 확인합니다.
            const audioProgress = this.audio.currentTime / this.audio.duration * 100;
            // 100 이 혹시 넘는 경우 처리를 해줍니다. (보통은 그럴 일이 없긴 합니다.)
            const controlProgress = audioProgress > 100 ? 100 : audioProgress;
            // 루트 엘리먼트로부터 재생하는 인풋 레인지 엘리먼트를 찾습니다.
            const progressBarElement = this.rootElement.querySelector('.progress');
            // 레인지를 1000으로 해주었기 때문에 10씩 곱해줍니다. 1000으로 한 이유는 100씩 하면 1%씩 움직여서 뚝뚝 끊어지는 느낌이 납니다.
            progressBarElement.value = controlProgress ? controlProgress * 10 : 0;
        })
    }

    /**
     * 음악을 실제로 플레이 하는 부분
     * 플레이 뷰에서는 오디오 이벤트를 핸들링 하는 곳이 많기 때문에 모든 음악도 여기에서 실행/멈춤하게 했다.
     */
    playMusic(payload) {
        // 일단 기존 재생을 멈춥니다.
        this.pause();

        // 만약 새로운 음악이 들어왔을 경우에는 페이로드를 통해 값이 왔다는 것입니다. 페이로드가 없다면 기존 음악을 멈췄다 껐다 하는 것으로 생각하고 만들었습니다.
        if (payload) {
            const { musics, musicIndex } = payload;
            // 새로운 음악의 소스를 가져와 넣어줍니다.
            this.audio.src = musics[musicIndex].source;
            this.playViewMusic = musics[musicIndex];
            // 음악이 바꼈기 때문에 플레이뷰의 화면도 변경해줍니다.
            this.renderMusicContainer();
        }

        // 음악을 재생합니다.
        this.audio.play();
    }

    /**
     * 음악이 실제로 멈추는 부분
     */
    pause() {
        // 음악을 멈춥니다.
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

        // 이 방법을 사용해서 생성했기 때문에 엘리먼트를 다시 붙일 때마다 이벤트를 새로 걸어줘야 하는 단점이 생기지만 한군데에 묶었기 때문에 놓치진 않아 괜찮을 것 같습니다.]
        // 이벤트들을 새로 바인딩 해줍니다.
        const backButton = this.rootElement.querySelector('.back-button');
        // 재생하기 위한 버튼입니다.
        const playButton = this.rootElement.querySelector('.control-play');
        // 멈추기 버튼입니다.
        const pauseButton = this.rootElement.querySelector('.control-pause');
        // 이전 음악 재생을 위한 버튼입니다.
        const backward = this.rootElement.querySelector('.control-backward');
        // 다음 곡 재생을 위한 버튼입니다.
        const forward = this.rootElement.querySelector('.control-forward');
        // 반복하기 설정 버튼입니다.
        const repeat = this.rootElement.querySelector('.control-repeat');
        // 랜덤 버튼입니다. 아이콘이 로테이트라 착각할 수 있으니 주의하세요.
        const random = this.rootElement.querySelector('.control-rotate');
        // 진행 버튼입니다. 이것의 변경을 통해 현재 음악의 재생 지점을 변경하려고 합니다.
        const progress = this.rootElement.querySelector('.progress');

        // 멈춤에서 플레이로 바꾸는 엘리먼트 (멈춤 버튼)
        playButton.addEventListener('click', () => {
            this.playMusic();
            playButton.classList.add('hide');
            pauseButton.classList.remove('hide');
        });

        // 플레이에서 멈춤으로 바꾸는 엘리먼트 (플레이 버튼)
        pauseButton.addEventListener('click', () => {
            this.pause();
            pauseButton.classList.add('hide');
            playButton.classList.remove('hide');
        });

        // 반복하도록 하는 버튼
        repeat.addEventListener('click', () => {
            // 클릭시 값을 변경해주고
            this.repeat = !this.repeat;
            // 변경된 값에 따라 ui 변경
            if (this.repeat) {
                repeat.classList.add('on');
            } else {
                repeat.classList.remove('on');
            }
        });

        // 음악이 끝나면 랜덤으로 재생하게 하는 버튼
        random.addEventListener('click', () => {
            // 클릭시 값을 변경해주고
            this.random = !this.random;
            // 변경된 값에 따라 ui 변경
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

        // 진행도를 변경할 수 있게 하는 이벤트
        progress.addEventListener('change', (event) => {
            const targetTime = this.audio.duration * Number(event.target.value) / 1000;
            this.audio.currentTime = targetTime;
        });
    }

    // fixed로 되어있기 때문에 body에 부착시켰습니다.
    show() {
        document.body.append(this.rootElement);
    }

    // body에서 제거합니다.
    hide() {
        document.body.removeChild(this.rootElement);
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
}