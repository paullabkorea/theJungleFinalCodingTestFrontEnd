export default class SearchView {
    constructor() {
        this.rootElement = SearchView.createRootElement();
    }

    static createRootElement() {
        const rootElement = document.createElement('ARTICLE');
        rootElement.classList.add('contents-search');

        return rootElement;
    }

    static createRenderElement() {
        return `
            <article class="contents-search">
                
            </article>
        `
    }

    render() {
        this.rootElement.innerHTML = `
        <div class="search-controller">
                    <input class="search-input" type="text" placeholder="검색"/>
                    <button class="search-button">
                        <i class="icon-search-controller"></i>
                    </button>
                </div>`;

                return this.rootElement;
    }
}