import Component from "../../helpers/Component.js";

// 라우트를 관리하는 컴포넌트입니다. 브레드크럼 UI를 담당하고 있기도 하지만, UI가 없다 하더라도 라우트를 담당하게 하는 기능적인 함수로 사용할 수 있습니다.
class Breadcrumb extends Component {

    // 이벤트를 공통으로 제공하는 컴포넌트를 상속받고 있기 때문에 super를 반드시 작성해주어야 합니다.
    constructor(props) {
        super(props);
        const { parentElement } = props;
        this.routes = [{ name: "ROOT" }];
        this.parentElement = parentElement;
        this.renderElement = Breadcrumb.createBreadcrumb();
        this.init();
    }
  
    // 브레드크럼에서 변하지 않는 부분을 생성합니다.
    static createBreadcrumb() {
        const breadcrumbWrapper = document.createElement("section");
        breadcrumbWrapper.classList.add("breadcrumb-container");
        const breadcrumb = document.createElement('div');
        breadcrumb.classList.add("breadcrumbs");
        breadcrumbWrapper.append(breadcrumb);

        const backButton = document.createElement('button');
        backButton.classList.add('button-back');
        breadcrumbWrapper.append(backButton);

        return breadcrumbWrapper;
    }
  
    init() {
        this.parentElement.appendChild(this.renderElement);
        this.bindEvents();
    }

    // 뒤로 가기 버튼을 눌렀을 때 발생하는 이벤트를 넣어줍니다.
    bindEvents() {
        const backButton = this.renderElement.querySelector('.button-back');
        backButton.addEventListener('click', () => this.emit("back"));
    };
  
    // 브레드크럼이 가진 데이터를 외부에서 함부로 사용하게 하는 것보다 이렇게 메서드를 뚫어 사용하게 함으로써 좀더 안전하게 관리합니다.
    forward(route) {
        this.routes.push(route);
        return this;
    }
  
    // 브레드크럼이 가진 데이터를 외부에서 함부로 사용하게 하는 것보다 이렇게 메서드를 뚫어 사용하게 함으로써 좀더 안전하게 관리합니다.
    back() {
        this.routes.pop();
        return this;
    }
  
    // 부모컴포넌트가 브레드크럼으로부터 필요한 정보를 제공할 수 있게 해줍니다.
    getParentNode() {
        return this.routes[this.routes.length - 1];
    }
  
    render() {
        const routeElements =  this.routes.map(route => `<span>${route.name}</span>`).join("");
        this.renderElement.querySelector(".breadcrumbs").innerHTML = routeElements;
    
        return this.renderElement;
    }
}

export default Breadcrumb;
