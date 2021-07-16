/**
 * 1. 입금 버튼 기능
 * 입금액이 없는 상태에서 입금 버튼을 누르면 아무일도 일어나지 않습니다.
 * 입금액을 입력하고 입금 버튼을 누르면 소지금은 소지금 - 입금액, 잔액은 잔액 + 입금액이 됩니다.
 * 입금액이 소지금 보다 많다면 실행을 중단하고 "소지금이 부족합니다." 라고 쓰인 경고창을 띄웁니다.
 * 입금액 인풋창은 초기화됩니다.
 * 
 * 2. 거스름돈 반환 버튼 기능
 * 잔액이 없는 상태에서 반환 버튼을 누르면 아무일도 일어나지 않습니다.
 * 반환 버튼을 누르면 소지금은 소지금 + 잔액이 됩니다.
 * 반환 버튼을 누르면 잔액 창은 초기화됩니다.
 * 
 * 3. 아이템 리스트 기능
 * 아이템을 누르면 잔액은 잔액 - 아이템 가격이 됩니다.
 * 아이템이 획득가능 창에 등록됩니다.
 * 아이템 버튼의 data-count 값이 -1 됩니다.
 * 만약 data-count 값이 0 이라면 부모 li에 sold-out 클래스를 붙여줍니다.
 * 아이템 가격보다 잔액이 적다면 "잔액이 부족합니다. 돈을 입금해주세요" 경고창이 나타납니다.
 * 
 * 
 * 5. 획득 버튼 기능
 * 
 * **/


import ColaGenerator from "./components/colaGenerator.js";
import VendingmachineFunc from "./components/vendingmachineFunc.js";

const colaGenerator = new ColaGenerator();
const vendingmachineFunc = new VendingmachineFunc();

colaGenerator.setup();
vendingmachineFunc.setup();




// vendingmachineFunc 코드
const btnPut = document.querySelector('.btn-put');
const myMoney = document.querySelector('.txt-mymoney');
const balance = document.querySelector('.txt-balance');
const itemList = document.querySelector('.list-item');
const inputCostEl = document.querySelector('.inp-put');
const btnReturn = document.querySelector('.btn-return');
const btnGet = document.querySelector('.btn-get');
const stagedList = document.querySelector('.cont-get .list-item-staged');
const gotList = document.querySelector('.cont-myitems .list-item-staged');
const txtTotal = document.querySelector('.txt-total');

/*
 * 1. 입금 버튼 기능
 * 입금액이 없는 상태에서 입금 버튼을 누르면 아무일도 일어나지 않습니다.
 * 입금액을 입력하고 입금 버튼을 누르면 소지금은 소지금 - 입금액, 잔액은 잔액 + 입금액이 됩니다.
 * 입금액이 소지금 보다 많다면 실행을 중단하고 "소지금이 부족합니다." 라고 쓰인 경고창을 띄웁니다.
 * 입금액 인풋창은 초기화됩니다.
 * */
btnPut.addEventListener('click', (event) => {
    const inputCost = parseInt(inputCostEl.value);
    const myMoneyVal = parseInt(myMoney.innerText.replace(',', ''));
    const balanceVal = parseInt(balance.innerText.replace(',', ''));

    // 입금액이 있다면 
    if (inputCost) {
        if (inputCost <= myMoneyVal) { // 입금액이 소지금보다 적다면
            myMoney.innerText = new Intl.NumberFormat().format(myMoneyVal - inputCost) + ' 원'; //Intl.NumberFormat : 언어에 맞는 숫자 서식을 문자열로 반환합니다. IE11 부터 지원 
            balance.innerText = new Intl.NumberFormat().format((balanceVal ? balanceVal : 0) + inputCost) + ' 원'; // balanceVal 이 NaN이면 0원으로
            inputCostEl.value = null;
        } else {// 입금액이 소지금보다 많다면
            alert('소지금이 부족합니다.');
            inputCostEl.value = null;
        }
    }
});

/*
* 2. 거스름돈 반환 버튼 기능
* 잔액이 없는 상태에서 반환 버튼을 누르면 아무일도 일어나지 않습니다.
* 반환 버튼을 누르면 소지금은 소지금 + 잔액이 됩니다.
* 반환 버튼을 누르면 잔액 창은 초기화됩니다.
*/
btnReturn.addEventListener('click', (event) => {
    const balanceVal = parseInt(balance.innerText.replace(',', ''));
    const myMoneyVal = parseInt(myMoney.innerText.replace(',', ''));

    if (balanceVal) {
        myMoney.innerText = new Intl.NumberFormat().format(myMoneyVal + balanceVal) + ' 원';
        balance.innerText = '원';
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
itemList.addEventListener('click', (event) => {
    const targetEl = event.target;
    const balanceVal = parseInt(balance.innerText.replace(',', ''));
    const targetElBtn = targetEl.querySelector('.btn-item');
    let isStaged = false; // 이미 선택되었는가?

    if (targetEl.tagName === "LI") {  // 음료수를 선택했을 경우
        const targetElPrice = parseInt(targetElBtn.dataset.price);
        if (balanceVal >= targetElPrice) { // 입금된 금액이 음료수 값보다 많거나 같을 경우
            balance.innerText = new Intl.NumberFormat().format(balanceVal - targetElPrice) + ' 원';

            if (stagedList.querySelectorAll('li').length > 0) { // 이미 선택한 음료수가 있을 경우
                stagedList.querySelectorAll('li').forEach((item) => {  // 클릭한 음료수가 내가 이미 선택한 아이템인지 탐색
                    if (item.querySelector('button').dataset.item === targetElBtn.dataset.item) { //내가 클릭한 상품과 내가 담은 상품이 같을 경우
                        item.querySelector('.num-counter').innerText++;
                        isStaged = true;
                        return;
                    }
                });
                // 해당 아이템을 처음 선택했을 경우
                if (!isStaged) {
                    stagedItemGenerator(targetElBtn);
                }
            } else {
                stagedItemGenerator(targetElBtn);
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

// 선택한 음료수 목록 생성
function stagedItemGenerator(target) {
    const stagedItem = document.createElement('li');
    stagedItem.innerHTML = `
    <button type="button" class="btn-staged" data-item="${target.dataset.item}" data-price="${target.dataset.price}">
        <img src="./src/images/${target.dataset.img}" alt="" class="img-item">
        <strong class="txt-item">${target.dataset.item}</strong>
        <span class="num-counter">1</span>
    </button>
    `;
    stagedList.appendChild(stagedItem);
}


/*
* 4. 구입 취소 기능
* 선택한 음료수 목록의 음료수를 클릭하면 해당 음료수의 선택이 취소됩니다.
* 한 개만 선택했을 경우 목록에서 제거하고 잔액이 음료수의 금액만큼 불어납니다.
* 아이템 리스트에서 해당 아이템의 갯수가 +1 됩니다.
* 한 개 이상일 경우 선택한 아이템 갯수를 줄이고 잔액이 음료수의 금액만큼 불어납니다.
* 아이템 리스트에서 해당 아이템의 갯수가 +1 됩니다.
*/

/**
 * 5. 획득 버튼 기능
 * 획득 버튼을 누르면 선택한 음료수 목록이 획득한 음료 목록으로 이동합니다.
 * 획득한 음료의 금액을 모두 합하여 총금액을 업데이트 합니다.
 *
*/
btnGet.addEventListener('click', (event) => {
    let isGot = false;
    let totalPrice = 0;
    stagedList.querySelectorAll('li').forEach((itemStaged, index) => {
        gotList.querySelectorAll('li').forEach((itemGot) => {
            let itemGotCount = itemGot.querySelector('.num-counter');
            // 획득할 아이템이 이미 획득한 음료 리스트에 존재하는지 확인
            if (itemStaged.querySelector('button').dataset.item === itemGot.querySelector('button').dataset.item) {
                //획득한 음료 리스트의 아이템 갯수 업데이트 
                itemGotCount.innerText = parseInt(itemGotCount.innerText) + parseInt(itemStaged.querySelector('.num-counter').innerText);
                stagedList.removeChild(itemStaged); // stagedList 에서 삭제
                isGot = true;
                return;
            }
        });
        if (!isGot) {
            gotList.appendChild(itemStaged);
        }
    });

    // 획득한 음료 리스트를 순환하면서 총 금액을 계산합니다.
    gotList.querySelectorAll('li').forEach((itemGot) => {
        totalPrice += itemGot.querySelector('button').dataset.price * parseInt(itemGot.querySelector('.num-counter').innerText);
    });
    txtTotal.innerText = `총금액 : ${new Intl.NumberFormat().format(totalPrice)}원`;
});