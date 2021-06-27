export default class SearchView {
    constructor() {

    }

    static createRenderElement() {
        return `
            <article class="contents-search">
                <div class="search-controller">
                    <input class="search-input" type="text" placeholder="검색"/>
                    <button class="search-button">
                        <i class="icon-search-controller"></i>
                    </button>
                </div>
            </article>
        `
    }

    render() {

    }
}