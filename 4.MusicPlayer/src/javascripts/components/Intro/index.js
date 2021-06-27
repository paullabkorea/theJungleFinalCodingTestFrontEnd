export default class Intro {

    constructor(props) {
        const { parentElement } = props;
        this.parentElement = parentElement;
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
        this.parentElement.removeChild(this.renderElement);
    }
}