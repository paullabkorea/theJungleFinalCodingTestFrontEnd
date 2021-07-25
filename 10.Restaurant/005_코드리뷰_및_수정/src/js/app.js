// 1. 세미콜론

// 2. 한글변수
//    2.1 아래의 경우를 제외하고 마크업까지 수정해야 하는 경우는 수정하지 않았습니다.
//    2.2 대기중, 식사중, 식사완료, 거절 변수는 이해를 돕기 위해 남겨두었습니다.
//    2.3 아래 마크업은 일부 수정하였습니다.
/*
<tr>
  <th onclick="sort('reservationNumber')">예약 번호</th>
  <th onclick="sort('personnel')">인원</th>
  <th onclick="sort('currentState')">현재 상태</th>
</tr>
*/

// 3. setInterval은 arrow함수

// 4. getElementsByClassName는 querySelectorAll(수정하진 않음)
//    getElementsByClassName은 HTMLCollection으로 리턴 
//    querySelectorAll은 NodeList으로 리턴


var click = true;
var reservationNumber = 1;
var hour = 8;
var closeTime = 22;
var minute = 1;

var data = [];

class Restaurant {
  //constructor
  //reservationNumber, personnel, currentState(대기중, 식사중, 식사완료, 거절)
  constructor(tableOne, tableTwo, tableFour) {
    //this.tableOne = tableOne
    //this.tableTwo = tableTwo
    //this.tableFour = tableFour
    this.tableStatus = [
      {
        tableType: "tableOne",
        tableNumber: 0,
        tableChair: tableOne[0].getElementsByClassName("chair-item")[0],
        tableState: "available",
      },
      {
        tableType: "tableOne",
        tableNumber: 1,
        tableChair: tableOne[0].getElementsByClassName("chair-item")[1],
        tableState: "available",
      },
      {
        tableType: "tableOne",
        tableNumber: 2,
        tableChair: tableOne[0].getElementsByClassName("chair-item")[2],
        tableState: "available",
      },
      {
        tableType: "tableTwo",
        tableNumber: 3,
        tableChair: tableTwo[0].getElementsByClassName("chair-item"),
        tableState: "available",
      },
      {
        tableType: "tableTwo",
        tableNumber: 4,
        tableChair: tableTwo[1].getElementsByClassName("chair-item"),
        tableState: "available",
      },
      {
        tableType: "tableTwo",
        tableNumber: 5,
        tableChair: tableTwo[2].getElementsByClassName("chair-item"),
        tableState: "available",
      },
      {
        tableType: "tableFour",
        tableNumber: 6,
        tableChair: tableFour[0].getElementsByClassName("chair-item"),
        tableState: "available",
      },
      {
        tableType: "tableFour",
        tableNumber: 7,
        tableChair: tableFour[1].getElementsByClassName("chair-item"),
        tableState: "available",
      },
      {
        tableType: "tableFour",
        tableNumber: 8,
        tableChair: tableFour[2].getElementsByClassName("chair-item"),
        tableState: "available",
      },
      {
        tableType: "tableFour",
        tableNumber: 9,
        tableChair: tableFour[3].getElementsByClassName("chair-item"),
        tableState: "available",
      },
      {
        tableType: "tableFour",
        tableNumber: 10,
        tableChair: tableFour[4].getElementsByClassName("chair-item"),
        tableState: "available",
      },
    ];
  }

  clock() {
    var displayCloseTime = document.getElementsByClassName("time")[0];

    displayCloseTime.innerText = `${hour < 10 ? `0${hour}` : hour}:${
      minute < 10 ? `0${minute}` : minute
    }:00`;
    minute += 1;

    if (minute >= 60) {
      minute = 0;
      hour += 1;
    }
  }
}

class RestaurantGuests {
  //constructor
  //reservationNumber, personnel, currentState(대기중, 식사중, 식사완료, 거절)
  constructor(reservationNumber, personnel, currentState) {
    this.reservationNumber = reservationNumber;
    this.personnel = personnel;
    this.currentState = currentState;
    this.mealTime = 0;
    this.diningTable = -1;
  }
}

function btnReservationClick() {
  const 입력창 = document.getElementById("식사인원");
  personnel = parseInt(입력창.value, 10);
  //console.log(입력값)
  입력창.value = "";
  document.getElementById("경고문구").innerHTML = "";
  if (hour >= closeTime) {
    document.getElementById("경고문구").innerHTML =
      '<strong style="color:red;">※ 영업이 종료되었습니다.</strong>';
    return;
  }
  if (personnel >= 5) {
    document.getElementById("경고문구").innerHTML =
      '<strong style="color:red;">※ 코로나로 인해 5인 이상은 예약을 받고 있지 않습니다.</strong>';
    data.push(new RestaurantGuests(reservationNumber, personnel, "거절"));
    reservationNumber += 1;
  } else if (personnel >= 0) {
    //console.log('5인미만')
    //식사중 또는 대기중
    data.push(new RestaurantGuests(reservationNumber, personnel, "대기중"));
    reservationNumber += 1;
  } else {
    document.getElementById("경고문구").innerHTML =
      '<strong style="color:red;">※ 제대로 된 숫자를 입력하세요.</strong>';
  }
  createTable();
}

function createTable() {
  //console.log(data)
  let tableBodyData = [];
  for (const iterator of data) {
    if (iterator.currentState == "대기중") {
      tableBodyData.push(`
          <tr>
              <td>${iterator.reservationNumber}</td>
              <td>${iterator.personnel}</td>
              <td class="waiting">${iterator.currentState}</td>
          </tr>
          `);
    } else if (iterator.currentState == "거절") {
      tableBodyData.push(`          
          <tr>
              <td>${iterator.reservationNumber}</td>
              <td>${iterator.personnel}</td>
              <td class="reject">${iterator.currentState}</td>
          </tr>
          `);
    } else {
      tableBodyData.push(`
          <tr>
              <td>${iterator.reservationNumber}</td>
              <td>${iterator.personnel}</td>
              <td>${iterator.currentState}</td>
          </tr>
          `);
    }
  }
  document.querySelector(".reservation-table > tbody").innerHTML =
    tableBodyData.join("");
}

function btnOpenClick() {
  // document.querySelector(".bar-table"); --> 쿼리 셀렉터 사용 필요, 너무 옛날 메소드
  const tableOne = document.getElementsByClassName("bar-table");
  const tableTwo = document.getElementsByClassName("rec-table");
  const tableFour = document.getElementsByClassName("circle-table");
  var restaurant = new Restaurant(tableOne, tableTwo, tableFour);
  //console.log(restaurant)
  //console.log(restaurant.tableTwo[0])
  //console.log(restaurant.tableTwo[0].getElementsByClassName('chair-item')[0])
  //restaurant.tableTwo[0].getElementsByClassName('chair-item')[0].classList.add('test')
  //restaurant.tableTwo[0].getElementsByClassName('chair-item')[0].classList.remove('on')

  //시간표시
  // function --> ()=> 이름 없는 함수는 화살표 함수로
  var timer = setInterval(() => {
    restaurant.clock();
    //console.log(data)
    for (const guest of data) {
      //점유코드
      if (guest.currentState == "대기중") {
        if (guest.personnel == 1) {
          for (const table of restaurant.tableStatus) {
            if (
              table.tableType == "tableOne" &&
              table.tableState == "available" &&
              guest.currentState == "대기중"
            ) {
              table.tableChair.classList.add("on");
              table.tableState = "notAvailable";
              guest.currentState = "식사중";
              guest.diningTable = table.tableNumber;
            }
          }
        }
        if (guest.personnel == 2) {
          for (const table of restaurant.tableStatus) {
            if (
              table.tableType == "tableTwo" &&
              table.tableState == "available" &&
              guest.currentState == "대기중"
            ) {
              table.tableChair[0].classList.add("on");
              table.tableChair[1].classList.add("on");
              table.tableState = "notAvailable";
              guest.currentState = "식사중";
              guest.diningTable = table.tableNumber;
            }
          }
        }
        if (guest.personnel == 3 || guest.personnel == 4) {
          for (const table of restaurant.tableStatus) {
            if (
              table.tableType == "tableFour" &&
              table.tableState == "available" &&
              guest.currentState == "대기중"
            ) {
              for (let people = 0; people < guest.personnel; people++) {
                table.tableChair[people].classList.add("on");
              }
              table.tableState = "notAvailable";
              guest.currentState = "식사중";
              guest.diningTable = table.tableNumber;
            }
          }
        }
      }
      if (guest.currentState == "식사중" && guest.mealTime < 60) {
        guest.mealTime += 1;
      } else if (guest.mealTime >= 60 && guest.currentState == "식사중") {
        guest.currentState = "식사완료";
        restaurant.tableStatus[guest.diningTable].tableState = "available";
        if (guest.personnel == 1) {
          restaurant.tableStatus[guest.diningTable].tableChair.classList.remove(
            "on"
          );
        } else {
          for (let people = 0; people < guest.personnel; people++) {
            restaurant.tableStatus[guest.diningTable].tableChair[
              people
            ].classList.remove("on");
          }
        }
      }
    }
    createTable();

    if (hour >= closeTime) {
      clearInterval(timer);
    }
  }, 1000);
}

function sort(key) {
  if (click) {
    click = false;
    var sortedData = data.sort((a, b) =>
      a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0
    );
  } else {
    click = true;
    var sortedData = data.sort((a, b) =>
      a[key] > b[key] ? -1 : a[key] < b[key] ? 1 : 0
    );
  }

  let tableBodyData = [];

  for (const iterator of sortedData) {
    if (iterator.currentState == "대기중") {
      tableBodyData.push(`
          <tr>
              <td>${iterator.reservationNumber}</td>
              <td>${iterator.personnel}</td>
              <td class="waiting">${iterator.currentState}</td>
          </tr>
          `);
    } else if (iterator.currentState == "거절") {
      tableBodyData.push(`          
          <tr>
              <td>${iterator.reservationNumber}</td>
              <td>${iterator.personnel}</td>
              <td class="reject">${iterator.currentState}</td>
          </tr>
          `);
    } else {
      tableBodyData.push(`
          <tr>
              <td>${iterator.reservationNumber}</td>
              <td>${iterator.personnel}</td>
              <td>${iterator.currentState}</td>
          </tr>
          `);
    }
  }

  document.querySelector(".reservation-table > tbody").innerHTML =
    tableBodyData.join("");
}

const btnReservation = document.getElementById("예약버튼");
btnReservation.addEventListener("click", btnReservationClick);

const btnOpen = document.getElementById("영업개시");
btnOpen.addEventListener("click", btnOpenClick);
