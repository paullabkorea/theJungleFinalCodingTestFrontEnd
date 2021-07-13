/**
 * 최초 인트로 화면 구현
 */
export default class Intro {

    constructor() {
        this.parentElement = document.querySelector('body');
        this.renderElement = Intro.createRenderElement();
    }

    static createRenderElement() {
        const introContainer = document.createElement('DIV');
        introContainer.classList.add('intro');
        const introImage = document.createElement('IMG');
        introImage.src = "assets/images/intro-logo.png";

        introContainer.append(introImage);

        return introContainer;
    }

    // body에 붙여서 추가하는 식으로 사용 fixed 이기 때문에 상관없음
    show() {
        this.parentElement.append(this.renderElement);
    }

    // opacity 를 줄임으로써 fade-out css 효과를 주며 1s로 설정했기 때문에 1000ms 후에는 바디에서 제거
    hide() {
        this.renderElement.style.opacity = 0;
        setTimeout(() => {
            this.parentElement.removeChild(this.renderElement);
        }, 1000);
    }
}