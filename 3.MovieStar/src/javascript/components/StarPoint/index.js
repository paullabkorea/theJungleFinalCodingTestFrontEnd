const starImageSourceMap = {
    empty: './src/assets/images/icon_empty_star.png',
    harf: './src/assets/images/icon_half_star.png',
    full: './src/assets/images/icon_star.png'
};

class StarPoint {

    constructor() {
        this.starContentElement = document.querySelector('.content-star');
        this.starBackgroundElement = this.starContentElement.querySelector('.star-background');
        this.starImages = Array.from(this.starBackgroundElement.querySelectorAll('img'));
        this.starPointResetButton = this.starContentElement.querySelector('.icon-remove-star');
        this.lockedStarPoint = false;
    }

    setup() {
        this.bindEvents();
    }

    bindEvents() {
        this.starBackgroundElement.addEventListener('mousemove', (event) => {
            const { target, offsetX: currentUserPoint } = event;

            if (this.isLockedStarPoint()) {
                return;
            }

            const { point } = target.dataset;
            const starPointIndex = parseInt(point, 10) - 1;
            const [starImageClientRect] = target.getClientRects();
            const starImageWidth = starImageClientRect.width;
            const isOverHarf = starImageWidth / 2 < currentUserPoint;

            this.renderStarPointImages({ drawableLimitIndex: starPointIndex, isOverHarf });
        });
        this.starBackgroundElement.addEventListener('mouseout', () => !this.isLockedStarPoint() && this.resetStarPointImages());
        this.starBackgroundElement.addEventListener('click', () => this.lockStarPoint());
        this.starPointResetButton.addEventListener('click', () => {
            this.unlockStarPoint();
            this.resetStarPointImages();
        });
    }

    lockStarPoint() {
        this.lockedStarPoint = true;
    }

    unlockStarPoint() {
        this.lockedStarPoint = false;
    }

    isLockedStarPoint() {
        return this.lockedStarPoint;
    }

    renderStarPointImages(payload = {}) {
        const { drawableLimitIndex = -1, isOverHarf = false } = payload;
        this.starImages.forEach((starImage, index) => {
            let imageSource = index < drawableLimitIndex ? starImageSourceMap.full : starImageSourceMap.empty;

            if (drawableLimitIndex === index) {
                imageSource = isOverHarf ? starImageSourceMap.full : starImageSourceMap.harf;
            }

            starImage.src = imageSource;
        });
    }

    resetStarPointImages() {
        this.renderStarPointImages();
    }
}
// export : 모듈에서 내보냅니다. default를 붙이면 이 모듈에서는 내보낼것이 한 개라는 정보를 나타냅니다. 내보낼 것이 개체 한 개뿐이기 때문에 export, import 구문에서 중괄호를 삭제할 수 있습니다. 여러가지면 이렇게 표현 > export {sayHi, sayBye} / import {sayHi, sayBye} from './say.js';
export default StarPoint;
