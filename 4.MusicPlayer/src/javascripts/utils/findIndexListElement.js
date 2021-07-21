// 리스트안에서 엘리먼트의 인덱스 번호 찾기
const findIndexListElement = (element) => {
    const listItems = element.parentElement.querySelectorAll('li');
    const currentIndex = Array.prototype.slice.call(listItems).findIndex(listItem => listItem === element); //findIndex : 주어진 판별 함수를 만족하는 배열의 첫 번째 요소에 대한 인덱스를 반환

    return currentIndex;
}

export default findIndexListElement;