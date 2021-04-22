console.log('create javascript');

const pxToInt = (px) => parseInt(px, 10);

const starImageSourceMap = {
    empty: './src/assets/images/icon_empty_star.png',
    harf: './src/assets/images/icon_harf_star.png',
    full: './src/assets/images/icon_star.png'
}

const starContentElement = document.querySelector('.content-star');
const starBackgroundElement = starContentElement.querySelector('.star-background');
const [starBackgroundClientRect] = starBackgroundElement.getClientRects();
const starPointMaxWidth = starBackgroundClientRect.width;
const starImages = Array.from(starBackgroundElement.querySelectorAll('img'));
const starPointResetButton = starContentElement.querySelector('.icon-remove-star');

starBackgroundElement.addEventListener('mousemove', (event) => {
    const { target, offsetX: currentUserPoint } = event;

    if (starBackgroundElement.classList.contains('point-fixed')) {
        return;
    }

    const { point } = target.dataset;
    const starPointIndex = parseInt(point, 10) - 1;
    const [starImageClientRect] = target.getClientRects();
    const starImageWidth = starImageClientRect.width;
    const isOverHarf = starImageWidth / 2 < currentUserPoint;
    
    starImages.forEach((starImage, index) => {
        let imageSource = index < starPointIndex ? starImageSourceMap.full : starImageSourceMap.empty;
        
        if (starPointIndex === index) {
            imageSource = isOverHarf ? starImageSourceMap.full : starImageSourceMap.harf;
        }

        starImage.src = imageSource;
    });
});

starBackgroundElement.addEventListener('mouseout', (event) => {
    if (starBackgroundElement.classList.contains('point-fixed')) {
        return;
    }

    const starPointIndex = -1;
    starImages.forEach((starImage, index) => {
        let imageSource = index < starPointIndex ? starImageSourceMap.full : starImageSourceMap.empty;
        
        if (starPointIndex === index) {
            imageSource = isOverHarf ? starImageSourceMap.full : starImageSourceMap.harf;
        }

        starImage.src = imageSource;
    });
})

starBackgroundElement.addEventListener('click', (event) => {
    starBackgroundElement.classList.add('point-fixed');
});

starPointResetButton.addEventListener('click', (event) => {
    starBackgroundElement.classList.remove('point-fixed');
    const starPointIndex = -1;
    starImages.forEach((starImage, index) => {
        let imageSource = index < starPointIndex ? starImageSourceMap.full : starImageSourceMap.empty;
        
        if (starPointIndex === index) {
            imageSource = isOverHarf ? starImageSourceMap.full : starImageSourceMap.harf;
        }

        starImage.src = imageSource;
    });
});

const favoriteContent = document.querySelector('.content-favorite');
favoriteContent.addEventListener('click', event => {
    const { path } = event;
    const element = path.find(element => element.tagName === 'BUTTON');

    if (!element) {
        return;
    }

    element.classList.toggle('on');
});