class VendingmachineFunc {
    constructor() {
        this.btnPut = document.querySelector('.btn-put');
        this.myMoney = document.querySelector('.txt-mymoney');
        this.balance = document.querySelector('.txt-balance');
        this.itemList = document.querySelector('.list-item');
        this.inputCostEl = document.querySelector('.inp-put');
        this.btnReturn = document.querySelector('.btn-return');
        this.btnGet = document.querySelector('.btn-get');
        this.stagedList = document.querySelector('.cont-get .list-item-staged');
        this.gotList = document.querySelector('.cont-myitems .list-item-staged');
        this.txtTotal = document.querySelector('.txt-total');
    }

    setup() {
        this.bindEvents();
    }

    // 선택한 음료수 목록 생성
    stagedItemGenerator(target) {
        const stagedItem = document.createElement('li');
        stagedItem.dataset.item = target.dataset.item;
        stagedItem.dataset.price = target.dataset.price;
        stagedItem.innerHTML = `
            <img src="./src/images/${target.dataset.img}" alt="" class="img-item">
            <strong class="txt-item">${target.dataset.item}</strong>
            <span class="num-counter">1</span>
        `;
        this.stagedList.appendChild(stagedItem);
    }

    bindEvents() {
        /*
         * 1. 입금 버튼 기능
         * 입금액을 입력하고 입금 버튼을 누르면 소지금은 소지금 - 입금액, 잔액은 잔액 + 입금액이 됩니다.
         * 입금액이 소지금 보다 많다면 실행을 중단하고 "소지금이 부족합니다." 라고 쓰인 경고창을 띄웁니다.
         * 입금액 인풋창은 초기화됩니다.
         * */
        this.btnPut.addEventListener('click', (event) => {
            const inputCost = parseInt(this.inputCostEl.value);
            const myMoneyVal = parseInt(this.myMoney.innerText.replace(',', ''));
            const balanceVal = parseInt(this.balance.innerText.replace(',', ''));

            // 입금액이 있다면 
            if (inputCost) {
                if (inputCost <= myMoneyVal) { // 입금액이 소지금보다 적다면
                    this.myMoney.innerText = new Intl.NumberFormat().format(myMoneyVal - inputCost) + ' 원'; //Intl.NumberFormat : 언어에 맞는 숫자 서식을 문자열로 반환합니다. IE11 부터 지원 
                    this.balance.innerText = new Intl.NumberFormat().format((balanceVal ? balanceVal : 0) + inputCost) + ' 원'; // balanceVal 이 NaN이면 0원으로
                    this.inputCostEl.value = null;
                } else {// 입금액이 소지금보다 많다면
                    alert('소지금이 부족합니다.');
                    this.inputCostEl.value = null;
                }
            }
        });

        /*
        * 2. 거스름돈 반환 버튼 기능
        * 반환 버튼을 누르면 소지금은 소지금 + 잔액이 됩니다.
        * 반환 버튼을 누르면 잔액 창은 초기화됩니다.
        */
        this.btnReturn.addEventListener('click', (event) => {
            const balanceVal = parseInt(this.balance.innerText.replace(',', ''));
            const myMoneyVal = parseInt(this.myMoney.innerText.replace(',', ''));

            if (balanceVal) {
                this.myMoney.innerText = new Intl.NumberFormat().format(myMoneyVal + balanceVal) + ' 원';
                this.balance.innerText = '원';
            }
        });


        /*
         * 3. 아이템 리스트 기능
         * 아이템을 누르면 잔액은 잔액 - 아이템 가격이 됩니다.
         * 아이템이 획득가능 창에 등록됩니다.
         * 아이템 버튼의 data-count 값이 -1 됩니다.
         * 만약 data-count 값이 0 이라면 부모 li에 sold-out 클래스를 붙여줍니다.
         * 아이템 가격보다 잔액이 적다면 "잔액이 부족합니다. 돈을 입금해주세요" 경고창이 나타납니다.
        */
        this.itemList.addEventListener('click', (event) => {
            const targetEl = event.target;
            const balanceVal = parseInt(this.balance.innerText.replace(',', ''));
            const targetElBtn = targetEl.querySelector('.btn-item');
            let isStaged = false; // 이미 선택되었는가?

            if (targetEl.tagName === "LI") {  // 음료수를 선택했을 경우
                const targetElPrice = parseInt(targetElBtn.dataset.price);
                if (balanceVal >= targetElPrice) { // 입금된 금액이 음료수 값보다 많거나 같을 경우
                    this.balance.innerText = new Intl.NumberFormat().format(balanceVal - targetElPrice) + ' 원';

                    if (this.stagedList.querySelectorAll('li').length > 0) { // 이미 선택한 음료수가 있을 경우
                        this.stagedList.querySelectorAll('li').forEach((item) => {  // 클릭한 음료수가 내가 이미 선택한 아이템인지 탐색
                            if (item.dataset.item === targetElBtn.dataset.item) { //내가 클릭한 상품과 내가 담은 상품이 같을 경우
                                item.querySelector('.num-counter').innerText++;
                                isStaged = true;
                                return;
                            }
                        });
                        // 해당 아이템을 처음 선택했을 경우
                        if (!isStaged) {
                            this.stagedItemGenerator(targetElBtn);
                        }
                    } else {
                        this.stagedItemGenerator(targetElBtn);
                    }


                    targetElBtn.dataset.count--;
                    if (targetElBtn.dataset.count == 0) { // 상품이 소진되면 품절 표시
                        targetEl.classList.add('sold-out');
                    }
                } else {
                    alert('잔액이 부족합니다. 돈을 입금해주세요.');
                }
            }
        });

        /**
         * 4. 획득 버튼 기능
         * 획득 버튼을 누르면 선택한 음료수 목록이 획득한 음료 목록으로 이동합니다.
         * 획득한 음료의 금액을 모두 합하여 총금액을 업데이트 합니다.
        */
        this.btnGet.addEventListener('click', (event) => {
            let isGot = false;
            let totalPrice = 0;
            this.stagedList.querySelectorAll('li').forEach((itemStaged, index) => {
                this.gotList.querySelectorAll('li').forEach((itemGot) => {
                    let itemGotCount = itemGot.querySelector('.num-counter');
                    // 획득할 아이템이 이미 획득한 음료 리스트에 존재하는지 확인
                    if (itemStaged.dataset.item === itemGot.dataset.item) {
                        //획득한 음료 리스트의 아이템 갯수 업데이트 
                        itemGotCount.innerText = parseInt(itemGotCount.innerText) + parseInt(itemStaged.querySelector('.num-counter').innerText);
                        this.stagedList.removeChild(itemStaged); // stagedList 에서 삭제
                        isGot = true;
                        return;
                    }
                });
                if (!isGot) {
                    this.gotList.appendChild(itemStaged);
                }
            });

            // 획득한 음료 리스트를 순환하면서 총 금액을 계산합니다.
            this.gotList.querySelectorAll('li').forEach((itemGot) => {
                totalPrice += itemGot.dataset.price * parseInt(itemGot.querySelector('.num-counter').innerText);
            });
            this.txtTotal.innerText = `총금액 : ${new Intl.NumberFormat().format(totalPrice)}원`;
        });
    }
}

export default VendingmachineFunc;