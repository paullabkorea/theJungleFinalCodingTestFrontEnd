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

    bindEvents() {
        this.topMusics.on('play', (payload) => this.playView.playMusic(payload));
        this.topMusics.on('pause', () => this.playView.pause());
        this.tabButtons.on('clickTab', (payload) => {
            const { currentIndex = 0 } = payload;
            this.currentMainIndex = currentIndex;
            this.render();
        });
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