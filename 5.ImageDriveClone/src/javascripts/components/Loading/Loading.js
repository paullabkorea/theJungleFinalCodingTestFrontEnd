// 로딩 컴포넌트입니다.
class Loading {
    constructor() {
      this.parentElement = document.querySelector("body");
      this.loadingElement = Loading.createLoadingElement();
      this.isLoading = false;
    }
  
    static createLoadingElement() {
      const loadingWrapper = document.createElement("DIV");
      const loadingContent = document.createElement("DIV");
      const loadingImage = document.createElement("IMG");
  
      loadingWrapper.classList.add("modal", "loading");
      loadingContent.classList.add("content");
      loadingImage.src = "./assets/images/loading.gif";
  
      loadingContent.appendChild(loadingImage);
      loadingWrapper.appendChild(loadingContent);
  
      return loadingWrapper;
    }
  
    // 로딩에 대한 정보를 변경하고 렌더링 시킵니다. isLoading를 제외하고 여기서 바로 렌더링을 해도 좋습니다.
    on() {
      this.isLoading = true;
      this.render();
    }
  
    off() {
      this.isLoading = false;
      this.render();
    }
  
    // 현재 자신이 가진 정보에 따라 로딩을 실행할지 제거할지를 결정합니다.
    render() {
      if (this.isLoading) {
        this.parentElement.appendChild(this.loadingElement);
      } else {
        this.parentElement.removeChild(this.loadingElement);
      }
    }
  }
  
  export default Loading;
  