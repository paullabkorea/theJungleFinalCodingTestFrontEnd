import { findIndexListElement, getClosestElement } from '../../utils/index.js';

/**
 * 하단의 탭버튼 세가지를 담당하는 컴포넌트
 */
export default class TabButtons {

    constructor() {
        this.renderElement = TabButtons.createRenderElement();
        this.bindEvents();
    }

    // 루트 엘리먼트를 만들어줍니다. 탭버튼은 딱히 변할일이 없기 때문에 여기에서 한번 생성한것으로 끝냅니다.
    static createRenderElement() {
        const tabsContainer = document.createElement('UL');
        tabsContainer.classList.add('app-controller');
        const tabs = [
            { title: 'Top5', iconName: 'icon-top5' },
            { title: 'Playlist', iconName: 'icon-playlist' },
            { title: 'Search', iconName: 'icon-search' },
        ];

        tabsContainer.innerHTML = tabs.map(tab => { // map : 배열의 각 요소에 주어진 함수를 적용하고 새로운 배열을 리턴
            return `
                <li>
                    <button class="button-app-controller">
                        <i class="tab-icon ${tab.iconName}"></i>
                        ${tab.title}
                    </button>
                </li>
            `;
        }).join(''); //배열의 요소를 연결해 하나의 문자열로 반환

        return tabsContainer;
    }

    // 클릭했을 경우 부모(app.js)에게 탭이 클릭되었음을 알려줍니다.
    bindEvents() {
        this.renderElement.addEventListener('click', (event) => {
            // 이벤트 위임을 통해 어떤 li 가 잡혔는지를 찾습니다. css 구조상 li 만 잡을 수 있도록 되어있기 때문에 이런식으로 사용이 가능합니다.
            const element = getClosestElement(event.target, 'li');
            // li의 인덱스를 찾습니다.
            const currentIndex = findIndexListElement(element);
            // 부모에게 몇번째 인덱스가 클릭되었음을 알립니다. 그럼 부모(app.js)는 이것을 받아 적절한 화면을 렌더링합니다.
            this.emit('clickTab', { currentIndex });
        })
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

    // 전체 렌더링을 보내줌. 부모 엘리먼트는 이 엘리먼트를 획득하고 자기 자신의 루트 엘리먼트에 부착할 것입니다.
    render() {
        return this.renderElement;
    }
}