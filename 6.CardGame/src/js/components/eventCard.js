/* 카드 클릭 이벤트 로직

<step1>
1. 클릭한다.
2. li요소에 on 클래스를 붙인다 --> 뒤집어 진다.
3. 클릭한 li 요소의 data-name 값을 변수에 저장한다.

<step2>
1. 클릭한다
2. li요소에 on 클래스를 붙인다 --> 뒤집어 진다.
3. 클릭한 li 요소의 data-name 값을 변수에 저장한다.

<step4>
1. 클릭한 두 요소의 data-name 값을 비교한다.
2. 값이 같다면 두 요소를 숨긴다. 클릭도 불가능하게 만든다.
3. 값이 다르다면 두 요소의 on클래스를 삭제한다.

*/
class EventCard {
    constructor() {
        this.cards = document.querySelector(".list-card");
        this.cardEl = [];
    }

    setup() {
        this.bindEvents();
    }

    bindEvents() {
        this.cards.addEventListener('click', (event) => {
            const elClicked = event.target;

            if (elClicked.tagName === "LI") {

                if (this.cardEl.length < 2) {
                    // 클릭한 카드 데이터 저장
                    this.cardEl.push(elClicked);
                    // 카드 뒤집기
                    elClicked.classList.add('on');
                }

                // 카드를 두장 클릭했을때 검증 시작
                if (this.cardEl.length === 2) {
                    // 클릭 후 카드 애니메이션에 맞춰 0.5초 뒤에 실행
                    setTimeout(() => {
                        this.cardEl.forEach((item) => {
                            // 같은 카드를 선택했을 경우 
                            if (this.cardEl[0].dataset.name === this.cardEl[1].dataset.name) {
                                item.style.visibility = "hidden";
                                // 다른 카드를 선택했을 경우 
                            } else {
                                item.classList.remove("on");
                            }
                        });

                        // 카드 데이터 초기화
                        // splice() 메서드는 배열의 기존 요소를 삭제 또는 교체하거나 새 요소를 추가하여 배열의 내용을 변경합니다.
                        // 첫번째 인자는 시작 인덱스, 두번째 인자는 시작 인덱스로부터 삭제할 요소 숫자
                        this.cardEl.splice(0);
                    }, 500);
                }
            }
        });
    }
}
export default EventCard;