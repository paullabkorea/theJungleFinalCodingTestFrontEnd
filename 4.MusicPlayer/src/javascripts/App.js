import { Intro, TabButtons, TopMusics, PlayView, PlayList, SearchView } from './components/index.js';
import { fetchMusics } from '../APIs/index.js';
import { removeAllChildNodes } from './utils/index.js';

// 전체를 총괄하는 App 부모 컴포넌트입니다.
export default class App {
    constructor(props) {
        // 혹시 몰라 담아두긴 했는데 필요는 없을 것 같긴 합니다.
        this.props = props;
        // 현재 메인 뷰의 화면이 어떤 인덱스인지 상태를 관리합니다.
        this.currentMainIndex = 0;
        // 메인 뷰를 담당할 컴포넌트들을 넣을 객체입니다.
        this.mainViewComponents = [];
        // 메인 뷰 렌더링 결과를 담아둘 변수입니다.
        this.mainView = null;
    }

    async setup() {
        const { el } = this.props;
        // 최초 el 은 #app 을 받아와서 처리합니다.
        this.rootElement = document.querySelector(el);
        // 각 컴포넌트들을 생성합니다. 인트로, 탭버튼, 플레이뷰, 탑뮤직, 플레이리스트, 검색뷰
        // 앱이 나머지 모든 자식들을 트리형태로 가지고 있는 모습입니다. app.js 가 중심이 됩니다.
        this.intro = new Intro();
        this.tabButtons = new TabButtons();
        this.playView = new PlayView();
        this.topMusics = new TopMusics();
        this.playList = new PlayList();
        this.searchView = new SearchView();
        this.mainViewComponents = [this.topMusics, this.playList, this.searchView];
        // 이벤트를 바인딩합니다.
        this.bindEvents();
        // 음악을 가져옵니다. 인트로 시점을 이 위로 변경할 수도 있습니다.
        await this.fetchMusics();
        // 화면을 init 합니다.
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
        // 플레이 요청이 오면 플레이를 담당하는 플레이뷰에게 음악 플레이를 요청시킵니다.
        this.topMusics.on('play', (payload) => this.playView.playMusic(payload));
        // 멈춤 요청이 오면 플레이를 담당하는 플레이뷰에게 음악 멈춤 요청을 합니다.
        this.topMusics.on('pause', () => this.playView.pause());
        // 플레이 리스트 추가 요청이 오면 받아온 데이터로 플레이리스트에 추가를 할 것을 요청합니다.
        this.topMusics.on('addPlayList', (payload) => {
            const { musics, musicIndex } = payload;
            this.playList.add(musics[musicIndex]);
        });
        // 플레이리스트 컴포넌트 이벤트
        // 플레이 리스트에서 음악 요청이 오면 플레이를 담당하는 플레이뷰에게 음악플레이를 요청시키고,
        this.playList.on('play', (payload) => {
            this.playView.playMusic(payload);
            // 플레이 리스트의 경우에는 플레이뷰 화면을 보여주기로 했어서 플레이뷰 화면도 띄워줍니다.
            this.playView.show();
        });
        // 멈춤 요청이 오면 플레이를 담당하는 플레이뷰에게 멈춤을 요청합니다.
        this.playList.on('pause', () => this.playView.pause());
        // 검색 컴포넌트 이벤트
        this.searchView.on('searchMusic', (query) => {
            // 아무 값이 없으면 검색 결과를 빈화면으로 돌립니다.
            if (!query) {
                return this.searchView.setSearchResult([]);;
            }
            // 값이 있는 경우에는 탑뮤직에서 들고 있는 전체 음악에서 필터링하여 그 결과를 검색뷰에 다시 보내줍니다.
            const searchedMusics = this.topMusics.musics.filter(music => {
                const { artists, title } = music;
                // 대소문자를 모두 판별하기 위해 모드 uppercase 형태로 바꿔서 필터링합니다.
                const upperCaseQuery = query.toUpperCase();
                // 아티스트를 찾습니다.
                const filteringName = artists.some(artist => artist.toUpperCase().includes(upperCaseQuery));
                // 제목을 찾습니다.
                const filteringTitle = title.toUpperCase().includes(upperCaseQuery);

                return filteringName || filteringTitle;
            });
            // 찾은 결과를 검색뷰에 반환해줍니다.
            this.searchView.setSearchResult(searchedMusics);
        });
        // 검색뷰에서 플레이 요청이 오면 플레이를 담당하고 있는 플레이뷰에게 음악 재생을 요청합니다.
        this.searchView.on('play', (payload) => this.playView.playMusic(payload));
        // 검색뷰에서 멈춤 요청 오면 플레이를 담당하고 있는 플레이뷰에게 음악 중단을 요청합니다.
        this.searchView.on('pause', () => this.playView.pause());
        // 검색뷰에서 플레이리스트 추가 요청이 오면 플레이리스트에 추가할 것을 요청합니다.
        this.searchView.on('addPlayList', (payload) => {
            const { musics, musicIndex } = payload;
            this.playList.add(musics[musicIndex]);
        });
        // 플레이뷰 컴포넌트 이벤트
        // 이전 음악 재생 요청이 오면 플레이리스트에 이전 음악을 찾아서 재생요청할 것을 요청합니다.
        // 이러면 플레이리스트는 자기가 가진 정보에서 이전 음악을 찾은 다음 다시 그 음악을 부모에게 플레이할 것을 요청하고
        // 위에 걸어둔 이벤트 play 가 발동하여 다시 음악을 재생하게 됩니다.
        this.playView.on('backward', () => this.playList.playPrev());
        // 다음 음악 재생 요청이 오면 플레이리스트에 다음 음악을 찾아서 재생요청할 것을 요청합니다.
        this.playView.on('forward', () => this.playList.playNext());
        // 플레이뷰에서 음악이 끝났을 경우 repeat, random 값을 받아서 플레이 리스트에게 어떻게 처리할 것인지 확인 시킵니다.
        this.playView.on('musicEnded', (payload) => this.playList.playNext(payload));
    }

    // 음악 데이터를 가져옵니다.
    async fetchMusics() {
        const responseBody = await fetchMusics();
        const { musics = [] } = responseBody;
        // 전체 음악은 탑뮤직에서 관리합니다.
        this.topMusics.setMusics(musics);
    }

    // 인트로를 보여줬다가 내부적으로는 렌더링하고 일정 시간 후에 사라지게 합니다.
    // 데이터를 fetch 하는 부분도 함께 포함되는 편이 더 좋긴 한데 일단 빠르기 때문에 그렇게 처리하진 않았습니다.
    init() {
        this.intro.show();
        setTimeout(() => {
            this.render();
            this.intro.hide();
        }, 750);
    }

    // 메인뷰만을 따로 렌더링하는 부분을 만들었습니다.
    renderMainView() {
        const renderComponent = this.mainViewComponents[this.currentMainIndex];
        return renderComponent ? renderComponent.render() : '';
    }

    // 전체화면을 렌더링하는 함수입니다.
    render() {
        removeAllChildNodes(this.rootElement);
        const tabButtons = this.tabButtons.render();
        const mainView = this.renderMainView();
        this.rootElement.append(tabButtons);
        this.rootElement.append(mainView);
    }
}