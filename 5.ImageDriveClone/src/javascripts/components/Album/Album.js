import Breadcrumb from "./Breadcrumb.js";
import Finder from "./Finder.js";
import ImageViewer from "../ImageViewer/index.js";
import Loading from "../Loading/index.js";

import { fetchObjects } from '../../api/index.js';

class Album {
    constructor() {
      this.breadcrumb = null;
      this.finder = null;
      this.imageViewer = null;
      this.loading = null;
      this.renderElement = null;
    }

    // 이번에는 지난번과는 다르게 반대로 부모 엘리먼트를 자식 엘리먼트에 주입하는 식으로 작성해 보겠습니다.
    async init(elementQuery) {
      this.renderElement = document.querySelector(elementQuery);
      this.breadcrumb = new Breadcrumb({ parentElement: this.renderElement });
      this.finder = new Finder({ parentElement: this.renderElement });
      this.imageViewer = new ImageViewer({ parentElement: this.renderElement });
      this.loading = new Loading();
      this.bindEvents();
      await this.fetchFinder();
    }
  
    // 각 컴포넌트에서 발생하는 이벤트들을 바인딩한 것입니다.
    bindEvents() {
      this.finder.on('onNextDirectory', (nodeID) => this.next(nodeID));
      this.finder.on('onOpenImageViewer', (nodeID) => this.openImageViewer(nodeID));

      this.breadcrumb.on('back', () => this.back());
    }
  
    // 디렉토리를 눌렀을 때 다음 디렉토리로 가는 함수입니다.
    async next(nodeID) {
      const targetNode = this.finder.nodes.find(node => node.id === nodeID);
      this.breadcrumb.forward(targetNode);
      await this.fetchFinder(nodeID);
    }
  
    // 뒤로 가기를 실행하는 함수입니다. 브레드크럼이 라우트 관리를 하고 있기 때문에 브레드 크럼에서 정보를 찾아서 검증하고 관리합니다.
    async back() {
        if (this.breadcrumb.routes.length <= 1) {
            return;
        }
        this.breadcrumb.back();
        const parentNode = this.breadcrumb.getParentNode();
        const nodeID = parentNode?.id;
        await this.fetchFinder(nodeID);
    }
  
    // 이미지 뷰어를 여는 함수입니다.
    openImageViewer(nodeID = "") {
      const targetNode = this.finder.nodes.find(node => node.id === nodeID);
      this.imageViewer.open(targetNode.filePath);
    }
  
    // 파인더의 실질적인 데이터를 가져오는 함수입니다. 마지막에 로딩에 셋타임 아웃을 준 것은 좀더 자연스러운 렌더링을 위한 것으로 큰 의미는 없습니다. 
    async fetchFinder(nodeID = "") {
      this.loading.on();
      const responseBody = await fetchObjects(nodeID);
      this.finder.set(responseBody);
      this.render();
      setTimeout(() => {
        this.loading.off();
      }, 200);
    }
  
    // 데이터를 가져올 때마다 화면이 바뀌도록 렌더함수를 실행하는데 그 때 실행되는 렌더링입니다.
    render() {
      this.finder.render();
      this.breadcrumb.render();
    }
}

export default Album;
