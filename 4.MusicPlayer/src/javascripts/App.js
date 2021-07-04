import { Intro, TabButtons, TopMusics, PlayView, PlayList, SearchView } from './components/index.js';
import { fetchMusics } from '../APIs/index.js';
import { removeAllChildNodes } from './utils/index.js';

export default class App {
    constructor(props) {
        this.props = props;
        this.currentMainIndex = 0;
        this.mainViewComponents = [];
        this.mainView = null;
    }

    async setup() {
        const { el } = this.props;
        this.rootElement = document.querySelector(el);

        this.intro = new Intro();
        this.tabButtons = new TabButtons();
        this.playView = new PlayView();
        this.topMusics = new TopMusics();
        this.playList = new PlayList();
        this.searchView = new SearchView();
        this.mainViewComponents = [this.topMusics, this.playList, this.searchView];
        this.bindEvents();
        await this.fetchMusics();
        this.init();
    }

    /**
     * 각 클래스 컴포넌트에서 발생하는 이벤트를 받아서 처리하는 함수
     * Vue와 jQuery Custom Event 와 비슷한 형태로 작성함
     * 각 클래스 컴포넌트는 이벤트를 등록하는 on 메서드와 이벤트를 발생하는 emit 메서드를 만들어서 구현
     */
    bindEvents() {
        // 탭버튼 컴포넌트 이벤트
        this.tabButtons.on('clickTab', (payload) => {
            const { currentIndex = 0 } = payload;
            // 현재 메인 인덱스를 교체시키고 render 함수에서 main을 렌더링 할때 현재 정해진 mainIndex 값으로 뭘 렌더링 할지 결정
            this.currentMainIndex = currentIndex;
            this.render();
        });
        // 탑뮤직 컴포넌트 이벤트
        this.topMusics.on('play', (payload) => this.playView.playMusic(payload));
        this.topMusics.on('pause', () => this.playView.pause());
        this.topMusics.on('addPlayList', (payload) => {
            const { musics, musicIndex } = payload;
            this.playList.add(musics[musicIndex]);
        });
        // 플레이리스트 컴포넌트 이벤트
        this.playList.on('play', (payload) => this.playView.playMusic(payload));
        this.playList.on('pause', () => this.playView.pause());
    }

    async fetchMusics() {
        const responseBody = await fetchMusics();
        const { musics = [] } = responseBody;
        this.topMusics.setMusics(musics);
    }

    init() {
        this.intro.show();
        this.render();
        this.intro.hide();
    }

    renderMainView() {
        const renderComponent = this.mainViewComponents[this.currentMainIndex];
        return renderComponent ? renderComponent.render() : '';
    }

    render() {
        removeAllChildNodes(this.rootElement);
        const tabButtons = this.tabButtons.render();
        const mainView = this.renderMainView();
        this.rootElement.append(tabButtons);
        this.rootElement.append(mainView);
    }
}