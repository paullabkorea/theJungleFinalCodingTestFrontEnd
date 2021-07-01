class Favorite {
    constructor() {
        this.favoriteElement = document.querySelector('.content-favorite')
    }

    setup() {
        this.bindEvents();
    }

    bindEvents() {
        this.favoriteElement.addEventListener('click', (event) => {
            const { path } = event;
            const element = path.find(element => element.tagName === 'BUTTON');

            if (!element) {
                return;
            }

            element.classList.toggle('on');
        });
    }
}

export default Favorite;
