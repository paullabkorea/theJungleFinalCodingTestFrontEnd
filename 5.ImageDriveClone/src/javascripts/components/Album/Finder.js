import Component from "../../helpers/Component.js";
import { getClosestElement } from '../../helpers/index.js';

// 실질적인 앨범 부분입니다. 컴포넌트 이름은 파인더로 지었습니다.
class Finder extends Component {

    // 이벤트를 공통으로 들고 있는 Component를 상속받을 것이기 때문에 여기서 super는 필수입니다.
    constructor(props) {
        super(props);
        const { parentElement } = props;
        
        this.renderElement = Finder.createNodesWrapper();
        parentElement.appendChild(this.renderElement);
        this.nodes = [];
        this.bindEvents();
    }
  
    // 만약 루트만 만들어서 컨트롤하려면 이것도 컴포넌트가 공통으로 가질 수 있게 만들어도 좋을 것 같습니다.
    static createNodesWrapper() {
        const nodesWrapper = document.createElement("UL");
        nodesWrapper.classList.add("finder");
    
        return nodesWrapper;
    }

    // 파인더에서 클릭했을 때 발생하는 이벤트를 바인딩해줍니다. 이벤트 위임을 활용했습니다.
    bindEvents() {
        // 렌더 엘리먼트를 클릭했을 때
        this.renderElement.addEventListener("click", async (event) => {
            // li 에 데이터를 넣어뒀으므로 상위의 li를 찾습니다.
            const targetElement = getClosestElement(event.target, 'li');
            if (!targetElement) {
              return;
            }
            // 폴더인지 파일인지와 id 값을 가져옵니다.
            const type = targetElement.dataset.type;
            const nodeID = targetElement.dataset.id;
            // 타입에 따라 부모에게 이벤트 호출을 합니다.
            switch(type) {
              case "DIRECTORY": {
                  this.emit('onNextDirectory', nodeID);
                break;
              }
              case "FILE" : {
                this.emit('onOpenImageViewer', nodeID);
                break;
              }
            }
          });
    }
  
    // 부모로부터 데이터를 받아옵니다.
    set(nodes = []) {
        this.nodes = nodes;
    }
  
    // 가진 데이터로 렌더링을 합니다.
    render() {
        const nodesElements = this.nodes.map((node) => {
            const isDirectory = node.type === "DIRECTORY";

            if (isDirectory) {
                return (
                    `<li data-id="${node.id}" data-type="${node.type}">
                        <div class="node">
                            <img src="/assets/images/icon_folder.png" />
                            <strong>${node.name}</strong>
                        </div>
                    </li>`);
            }

            return (
                `<li data-id="${node.id}" data-type="${node.type}">
                    <div class="file-image">
                        <img src="${node.filePath}">
                    </div>
                    <div class="node">
                        <img src="/assets/images/icon_image.png" />
                        <strong>${node.name}</strong>
                    </div>
                </li>`
            );
        }).join("");
    
        this.renderElement.innerHTML = nodesElements;
    
        return this.renderElement;
    }
}

export default Finder;
