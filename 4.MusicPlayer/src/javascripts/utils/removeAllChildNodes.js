// 자신의 모든 자식 엘리먼트 제거하기
export default (parent) => {
    while (parent.firstChild) { //parent의 첫번째 자식을 반환합니다.
        parent.removeChild(parent.firstChild); // removeChild 자식 노드를 제거합니다.
    }
}
