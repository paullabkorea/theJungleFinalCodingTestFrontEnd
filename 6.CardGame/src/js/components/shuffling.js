// 카드 생성하고 랜덤하게 배치
class Shuffling {
    constructor() {
        this.data = ["gary", "mura", "licat", "binky", "javadog"];
        this.parent = document.querySelector(".list-card");
    }

    setup() {
        this.shufflingCards();
    }

    // 카드 섞기 
    shufflingCards() {
        // data 배열은 같은 요소가 쌍으로 필요하기 때문에 array.prototype.concat() 사용.
        let dataDouble = (this.data).concat(this.data);

        // 랜덤 함수의 범위는 0 ~ 0.999999 ...
        // 0 ~ 9까지의 범위를 구하고 싶을 경우.
        // 곱하기 10을 했을 때 0 ~ 9.999999 ...
        // 소수점 이하는 나올 필요가 없기 때문에 내림 Math.floor()aa
        while (dataDouble.length > 0) {
            const randomNum = Math.floor(Math.random() * dataDouble.length); //0~9까지의 숫자 중 하나를 랜덤하게 생성
            if (dataDouble[randomNum]) { // 해당인덱스에 요소가 있다면.

                this.generateCards(dataDouble[randomNum]);

                // 사용한 데이터를 배열에서 삭제
                dataDouble.splice(randomNum, 1);
            }
        }
    }

    // li 요소 생성 후 html에 배치
    generateCards(item) {
        const element = document.createElement("li");
        element.classList.add(item)
        element.dataset.name = item;
        this.parent.appendChild(element);
    }

}

export default Shuffling;