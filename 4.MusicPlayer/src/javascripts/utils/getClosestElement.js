// 부모 엘리먼트로 올라가면서 셀렉터를 만족하는 가장 가까운 요소를 찾기
const getClosestElement = (element, selector) => {
    let evaluate = false;
    if (/^\./.test(selector)) { // test() 메서드는 주어진 문자열이 정규 표현식을 만족하는지 판별하고, 그 여부를 true 또는 false로 반환합니다. 앞에 . 이 있는가? 라고 묻고 있습니다. 
        evaluate = element.classList.contains(selector);
    } else {
        evaluate = element.tagName === selector.toUpperCase();
    }

    if (evaluate) {
        return element;
    }

    return getClosestElement(element.parentElement, selector);
}

export default getClosestElement;