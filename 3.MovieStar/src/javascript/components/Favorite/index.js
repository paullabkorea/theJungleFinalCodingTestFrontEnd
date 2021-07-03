class Favorite {
    constructor() {
        this.favoriteElement = document.querySelector('.content-favorite')
    }

    setup() {
        this.bindEvents();
    }

    bindEvents() {
        this.favoriteElement.addEventListener('click', (event) => {
            // event.composedPath() : 리스너의 이벤트 경로를 배열로 반환합니다. IE 지원 X
            const cPath = event.composedPath();
            const element = cPath.find(element => element.tagName === 'BUTTON');

            if (!element) {
                return;
            }

            element.classList.toggle('on');
        });
    }
}

export default Favorite;
