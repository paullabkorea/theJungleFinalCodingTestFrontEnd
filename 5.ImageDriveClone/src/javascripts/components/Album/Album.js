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
    // 여기에서의 루트 엘리먼트입니다.
    this.renderElement = document.querySelector(elementQuery);
    // 라우트 데이터 및 뷰를 담당할 브레드크럼(빵가루라는 뜻 & 헨젤과 그레텔?)입니다.
    this.breadcrumb = new Breadcrumb({ parentElement: this.renderElement });
    // 드라이브 뷰를 담당할 파인더입니다.
    this.finder = new Finder({ parentElement: this.renderElement });
    // 이미지를 띄울 이미지 뷰어입니다.
    this.imageViewer = new ImageViewer({ parentElement: this.renderElement });
    // 로딩바입니다.
    this.loading = new Loading();
    // 이벤트를 바인딩 합니다.
    this.bindEvents();
    // 파인더에 보여줄 데이터를 가지고 옵니다.
    await this.fetchFinder();
  }

  // 각 컴포넌트에서 발생하는 이벤트들을 바인딩한 것입니다.
  bindEvents() {
    // 다음 디렉토리로 넘기라는 호출을 받으면 넘기는 메서드를 사용합니다.
    this.finder.on('onNextDirectory', (nodeID) => this.next(nodeID));
    // 이미지 뷰어를 열어라는 호출을 받으면 해당하는 이미지를 파인더에서 찾아서 뷰어로 넘겨줍니다.
    this.finder.on('onOpenImageViewer', (nodeID) => this.openImageViewer(nodeID));
    // 브레드 크럼에서 뒤로 가라는 호출을 받으면 이전 폴더 상태로 갑니다. (루트일때는 early return 처리하여 뒤로 가지 않습니다.)
    this.breadcrumb.on('back', () => this.back());
  }

  // 디렉토리를 눌렀을 때 다음 디렉토리로 가는 함수입니다.
  async next(nodeID) {
    // nodeId로 파인더에서 찾아서 해당하는 데이터를 찾습니다.
    const targetNode = this.finder.nodes.find(node => node.id === nodeID);
    // 그 데이터를 브레드크럼에 줘서 다음 라우터를 추가할 수 있게 하고
    this.breadcrumb.forward(targetNode);
    // 그 폴더 데이터를 파인더로 가져와서 새로 렌더링하게 합니다.
    await this.fetchFinder(nodeID);
  }

  // 뒤로 가기를 실행하는 함수입니다. 브레드크럼이 라우트 관리를 하고 있기 때문에 브레드 크럼에서 정보를 찾아서 검증하고 관리합니다.
  async back() {
    // 하나만 있는 것은 루트일때므로 얼리리턴 처리합니다.
    if (this.breadcrumb.routes.length <= 1) {
      return;
    }
    // 라우트를 뒤로 가도록 합니다. 
    this.breadcrumb.back();
    // 브레드크럼에서 현재 최상위 부모 데이터를 받아옵니다.
    const parentNode = this.breadcrumb.getParentNode();
    const nodeID = parentNode?.id;
    // 그 데이터를 가지고 파인더 데이터를 새로 호출하고 렌더링 하게 합니다.
    await this.fetchFinder(nodeID);
  }

  // 이미지 뷰어를 여는 함수입니다.
  openImageViewer(nodeID = "") {
    // nodeID로 파인더에서 데이터를 조회합니다.
    const targetNode = this.finder.nodes.find(node => node.id === nodeID);
    // 파일 주소를 가지고 이미지뷰어에게 열람하도록 합니다.
    this.imageViewer.open(targetNode.filePath);
  }

  // 파인더의 실질적인 데이터를 가져오는 함수입니다. 마지막에 로딩에 셋타임 아웃을 준 것은 좀더 자연스러운 렌더링을 위한 것으로 큰 의미는 없습니다. 
  async fetchFinder(nodeID = "") {
    // 로딩창을 엽니다.
    this.loading.on();
    // api 함수로 데이터를 받아옵니다.
    const responseBody = await fetchObjects(nodeID);
    // 받아온 데이터를 파인더에 넣어줍니다.
    this.finder.set(responseBody);
    // 정리가 끝났으니 화면을 렌더링 합니다.
    this.render();
    // 셋타임아웃은 굳이 주지 않아도 되지만, 부드러운 처리를 위해 넣었습니다. 실전에서는 넣지 않아도 됩니다.
    setTimeout(() => {
      // 로딩을 끝냅니다.
      this.loading.off();
    }, 200);
  }

  // 데이터를 가져올 때마다 화면이 바뀌도록 렌더함수를 실행하는데 그 때 실행되는 렌더링입니다.
  render() {
    // 파인더를 렌더링 합니다.
    this.finder.render();
    // 브레드크럼을 렌더링 합니다.
    this.breadcrumb.render();
  }
}

export default Album;
