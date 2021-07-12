// 강의 순서 별점 랜더링 --> 별점 고정 ---> 별점 삭제

// 호버 상태에 따른 이미지 맵핑 객체
const starImageSourceMap = {
    empty: './src/assets/images/icon_empty_star.png',
    harf: './src/assets/images/icon_half_star.png',
    full: './src/assets/images/icon_star.png'
};

class StarPoint {

    constructor() {
        this.starContentElement = document.querySelector('.content-star');
        this.starBackgroundElement = this.starContentElement.querySelector('.star-background');
        // this.starImages = Array.from(this.starBackgroundElement.querySelectorAll('img')); // 별점 백그라운드 이미지 목록
        this.starImages = this.starBackgroundElement.querySelectorAll('img');
        this.starPointResetButton = this.starContentElement.querySelector('.icon-remove-star');
        this.lockedStarPoint = false; // 별점이 고정되어 있는지 아닌지 상태 
    }

    setup() {
        this.bindEvents();
    }

    // 별점이 고정되어 있는 상태
    lockStarPoint() {
        this.lockedStarPoint = true;
    }

    // 별점이 고정되어 있지 않은 상태
    unlockStarPoint() {
        this.lockedStarPoint = false;
    }

    // 별점의 상태를 반환
    isLockedStarPoint() {
        return this.lockedStarPoint;
    }

    bindEvents() {
        // 마우스 무브 이벤트 
        this.starBackgroundElement.addEventListener('mousemove', (event) => {

            // 새로운 변수 이름으로 할당하기 : offsetX --> currentUserPoint
            // offsetX : 타겟 요소에서의 마우스 포인터의 X축 위치를 반환합니다.
            const { target, offsetX: currentUserPoint } = event;

            // 별점이 고정되어 있다면 이벤트 핸들링 중지
            if (this.isLockedStarPoint()) {
                return;
            }

            const { point } = target.dataset;
            const starPointIndex = parseInt(point, 10) - 1;
            const [starImageClientRect] = target.getClientRects(); //getClientRects() : 요소의 좌표와 크기에 대한 정보를 반환. target.getClientRects()[0] 값만 사용하기 위해 구조분해 할당 이용
            const starImageWidth = starImageClientRect.width;
            const isOverHarf = starImageWidth / 2 < currentUserPoint; // 마우스 포인터의 위치가 별점의 중간을 넘어서면 true

            this.renderStarPointImages({ drawableLimitIndex: starPointIndex, isOverHarf });
        });

        // 마우스 클릭시 별점 상태 고정
        this.starBackgroundElement.addEventListener('click', () => this.lockStarPoint());

        // 리셋버튼 이벤트 리스너
        this.starPointResetButton.addEventListener('click', () => {
            this.unlockStarPoint();
            this.resetStarPointImages();
        });

        //  && 연산자는 첫번째 피연산자가 true 라면 다음 피연산자를 반환하고 첫번째 피연산자가 false 라면 첫번째 피연산자를 반환합니다.
        // 마우스 아웃 시 별점이 고정인 상태가 아니라면 resetStarPointImages()를 실행하여 별점 초기화. 
        this.starBackgroundElement.addEventListener('mouseout', () => !this.isLockedStarPoint() && this.resetStarPointImages());
    }

    // 별점 이미지 랜더링 함수 
    renderStarPointImages(payload = {}) {  // 초기값 할당
        const { drawableLimitIndex = -1, isOverHarf = false } = payload;  // 초기값 할당

        // NodeList는 Array가 아닙니다. 일부 브라우져에서 NodeList를 forEach 문으로 실행할 수 없기 때문에
        // call를 통해서 함수를 호출하는 객체를 Array에서 NodeList 객체로 재할당합니다.
        Array.prototype.forEach.call(this.starImages, (starImage, index) => { // 별 이미지를 순환
            //this.starImages.forEach((starImage, index) => {

            // 현재 순환 순서보다 마우스가 호버된 별의 인덱스가 크다면 꽉찬 별, 아니면 빈 별. 
            let imageSource = index < drawableLimitIndex ? starImageSourceMap.full : starImageSourceMap.empty;

            // 현재 순환 순서와 마우스가 호버된 별의 인덱스가 같다면
            if (drawableLimitIndex === index) {
                // 마우스 포인터의 위치가 별점의 중간을 넘어섰다면 꽉찬별, 아니면 반쪽 별
                imageSource = isOverHarf ? starImageSourceMap.full : starImageSourceMap.harf;
            }
            // 현재 순환중인 이미지에 src 값 할당
            starImage.src = imageSource;
        });
    }

    // 스타포인트 제거
    resetStarPointImages() {
        this.renderStarPointImages();
    }
}
// export : 모듈에서 내보냅니다. default를 붙이면 이 모듈에서는 내보낼것이 한 개라는 정보를 나타냅니다. 내보낼 것이 개체 한 개뿐이기 때문에 export, import 구문에서 중괄호를 삭제할 수 있습니다. 여러가지면 이렇게 표현 > export {sayHi, sayBye} / import {sayHi, sayBye} from './say.js';
export default StarPoint;
