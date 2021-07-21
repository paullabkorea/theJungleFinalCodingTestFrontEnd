// 이미지 뷰어를 담당하는 컴포넌트 입니다.
class ImageViewer {
  constructor(props) {
    const { parentElement } = props;
    this.parentElement = parentElement;
    this.renderElement = ImageViewer.createImageViewer();
    this.bindEvents();
  }

  static createImageViewer() {
    const imageViewerWrapper = document.createElement("section");
    const imageContent = document.createElement("div");
    const imageElement = document.createElement("img");

    imageViewerWrapper.classList.add("modal", "image-viewer");
    imageContent.classList.add("content");

    imageContent.appendChild(imageElement);
    imageViewerWrapper.appendChild(imageContent);

    return imageViewerWrapper;
  }

  // 클릭했을 때 이 컴포넌트의 루트 엘리먼트를 클릭하는 경우에만 닫히도록 설정합니다. (이렇게 해두면 이미지를 클릭했을 때는 닫히지 않고 검은 배경 클릭 시에만 닫힙니다.)
  bindEvents() {
    this.renderElement.addEventListener('click', (event) => {
      const currentTarget = event.target;
      if (this.renderElement === currentTarget) {
        this.close();
      }
    })
  }

  // 이미지 뷰어를 여는 함수입니다.
  open(filePath = "") {
    // 받아온 파일 경로를 src에 넣어줍니다.
    this.renderElement.querySelector('img').src = filePath;
    this.parentElement.appendChild(this.renderElement);
  }

  // 이미지 뷰어를 닫는 함수입니다.
  close() {
    this.parentElement.removeChild(this.renderElement);
  }
}

export default ImageViewer;
