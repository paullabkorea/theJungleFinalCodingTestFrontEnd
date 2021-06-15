export default class TabButtons {

    constructor() {
        this.parentElement = document.querySelector('#app');
        this.renderElement = TabButtons.createRenderElement();
    }

    static createRenderElement() {
        const tabsContainer = document.createElement('UL');
        tabsContainer.classList.add('app-controller');
        const tabs = [
            { title: 'Top5', iconName: 'icon-top5' },
            { title: 'Playlist', iconName: 'icon-playlist' },
            { title: 'Search', iconName: 'icon-search' },
        ];

        tabsContainer.innerHTML = tabs.map(tab => {
            return `
                <li>
                    <button class="button-app-controller">
                        <i class="tab-icon ${tab.iconName}"></i>
                        ${tab.title}
                    </button>
                </li>
            `;
        }).join('');

        return tabsContainer;
    }


    render() {
        this.parentElement.append(this.renderElement);
        
        return this;
    }
}