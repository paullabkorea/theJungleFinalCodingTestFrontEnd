import { Intro, TabButtons, TopMusics, PlayView } from './components/index.js';
import { fetchMusics } from '../APIs/index.js';

export default class App {
    constructor(props) {
        this.props = props;
    }

    async setup() {
        const { el } = this.props;
        this.rootElement = document.querySelector(el);

        const config = {
            parentElement: this.rootElement
        };

        this.intro = new Intro(config);
        this.tabButtons = new TabButtons(config);
        this.playView = new PlayView(config);
        this.topMusics = new TopMusics({...config, playView: this.playView });

        await this.fetchMusics();
        this.init();
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

    render() {
        this.tabButtons.render();
        this.topMusics.render();
    }
}