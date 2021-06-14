export default class Intro {

    constructor() {
        this.parentElement = document.querySelector('#app');
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

    render() {
        this.parentElement.append(this.renderElement);
        
        setTimeout(() => {
            this.parentElement.removeChild(this.renderElement);
        }, 1500);

        return this;
    }
}