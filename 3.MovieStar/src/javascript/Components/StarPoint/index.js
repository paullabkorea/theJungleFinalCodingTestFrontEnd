const starImageSourceMap = {
    empty: './src/assets/images/icon_empty_star.png',
    harf: './src/assets/images/icon_harf_star.png',
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

    renderStarPointImages (payload = {}) {
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

export default StarPoint;
