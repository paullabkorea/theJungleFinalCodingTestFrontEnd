// 부모 엘리먼트로 올라가면서 셀렉터를 통해 찾기입니다. 현재는 클래스 이름과 태그 이름으로만 구분합니다.
const getClosestElement = (element, selector) => {
  let evaluate = false; 
  if (/^\./.test(selector)) {
      evaluate = element.classList.contains(selector);
  } else {
      evaluate = element.tagName === selector.toUpperCase();
  }

  if (evaluate) {
      return element;
  }

  return getClosestElement(element.parentElement, selector);
};

export {
  getClosestElement,
};
