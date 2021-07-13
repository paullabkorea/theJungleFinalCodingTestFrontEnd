/**
 * 최초 인트로 화면
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

    show() {
        this.parentElement.append(this.renderElement);
    }

    hide() {
        this.renderElement.style.opacity = 0;
        setTimeout(() => {
            this.parentElement.removeChild(this.renderElement);
        }, 1000);
    }
}