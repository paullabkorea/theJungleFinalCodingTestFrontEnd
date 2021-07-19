// 결과 로드 전 로딩 화면을 띄웁니다.
// window.onload = function () {
//   const loadingContainer = document.querySelector(".loading-container");
//   const resultContainer = document.querySelector(".result-container");

//   setTimeout(function () {
//     loadingContainer.style.display = "none";
//     resultContainer.style.display = "block";
//   }, 1800);
// }

// 결과 출력하기
const resultWrap = document.querySelector(".result-wrap");
const url = window.location.href;
const urlSplit = url.split("/");
const developerPk = parseInt(urlSplit[urlSplit.length - 1], 10);

// result.json 데이터 받기
function getData() {
  const loadingContainer = document.querySelector(".loading-container");
  const resultContainer = document.querySelector(".result-container");


  fetch("../data/result.json")
    .then((response) => response.json())
    .then(data => {
      // 데이터를 다운받고 나면 로딩화면을 종료합니다.
      loadingContainer.style.display = "none";
      resultContainer.style.display = "block";
      // querystring 으로 받은 개발자 번호와 같은 개발자 데이터를 developerData에 저장
      const developerData = data[developerPk - 1];

      // setElement 호출
      setElement(developerData);
    });
}

getData();

// resultWrap에 넣을 element와 데이터 생성
function setElement(data) {
  // 임시로 답안 저장할 div 생성
  const tempContainer = document.createElement("div");

  // tempContainer에 개발자 특징 리스트 추가
  for (let feature of data.features) {
    tempContainer.innerHTML += `<li>${feature}</li>`;
  }

  resultWrap.innerHTML = `
    <div class="result-title">${data.title}</div>
      <div class="result-name">${data.name}</div>
        <div class="result-image">
          <img src="${data.img}" alt="">
        </div>
        <div class="result-features">
          <h3>나와 맞는 개발 유형은 ${data.name}?!</h3>
          <ul>
            ${tempContainer.innerHTML}
          </ul>
        </div>
    `;

  // 임시로 생성한 div 제거
  tempContainer.remove();
}

