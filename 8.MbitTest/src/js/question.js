const form = document.querySelector("#question-form");

// data.json 데이터 받기
function loadQuestionData(){
    fetch("../data/data.json")
      .then((response) => response.json())
      .then(data => {
        // 질문과 답안 데이터 저장
        const questions = data.questions;
        const answers = data.answers;

        // 문항 배열을 순환하며 문항 번호와 맞는 각 답안들을 답안 배열에 저장
        questions.forEach(question => {
            let questionNumber = question.pk;
            let answerArr = [];

            for(let answer of answers){
                if(questionNumber == answer.question){
                    answerArr.push(answer);
                }
            }

            form.appendChild(setElement(question, answerArr));
        });

        // 첫번째 문항에 class "on" 추가
        // 항상 현재 보여지고 있는 문항에 on을 추가합니다.
        const questionItem = document.querySelectorAll(".question-item");
        const firstQuestionItem = questionItem[0];

        firstQuestionItem.classList.add("on");

        // 첫번째 문항, 마지막 문항의 버튼 변경
        const buttonBoxes = document.querySelectorAll(".button-box");
        const firstButtonBox = buttonBoxes[0];
        const lastButtonBox = buttonBoxes[buttonBoxes.length - 1];

        // 첫번째 문항에는 이전 버튼이 필요없기 때문에 다음 버튼만 배치
        // 버튼 가운데 정렬
        firstButtonBox.innerHTML = "<button type='button' class='next-btn'>다음</button>";
        firstButtonBox.classList.add("style-center");

        // 마지막 문항에는 다음 버튼 대신 제출 버튼 추가
        lastButtonBox.innerHTML = `<button type='button' class='previous-btn'>이전</button><button type='button' class='submit-btn'>제출</button>`;

        // 버튼에 클릭 이벤트 추가
        const prevButtons = document.querySelectorAll(".previous-btn");
        const nextButtons = document.querySelectorAll(".next-btn");

        for(let prevButton of prevButtons){
            prevButton.addEventListener("click", function(){
                let current = document.querySelector(".on");
                movePrev(current);
            });
        }

        for(let nextButton of nextButtons){
            nextButton.addEventListener("click", function(){
                let current = document.querySelector(".on");
                moveNext(current);
            });
        }

        // 상태바 스타일 변경
        const statusBar = document.querySelectorAll(".status-bar");

        statusBar.forEach((e, i) => {
            e.style.width = `${(Number(i)+1)*10}%`;
        });

        // 제출 버튼 - 버튼을 클릭하면 form 제출
        const submitButton = document.querySelector(".submit-btn");

        submitButton.addEventListener("click", function(){
            form.submit();

            return false;
        });
      });
}

loadQuestionData();

// 문항 세팅
function setElement(question, answerArr){
    const questionItem = document.createElement("div");
    questionItem.classList.add("question-item");

    // 임시로 답안 저장할 div 생성
    const tempContainer = document.createElement("div");

    // tempContainer에 답안 리스트 추가
    for(let idx in answerArr){
        let answer = answerArr[idx];
        tempContainer.innerHTML += `
            <li class="answer-item">
                <input type="radio" id="answer-${answer.pk}" name="question-${question.pk}" value="${answer.developer}" required/>
                <label for="answer-${answer.pk}">${Number(idx)+1}. ${answer.content}</label>
            </li>`;
    }

    questionItem.innerHTML = `
        <div class="status-box">
          <span> ${question.pk}/10 </span>
          <div class="status-bar">
          </div>
        </div>
        <div class="question-box">
          <h2>Q. ${question.content}</h2>
          <ol class="answer-list">
          ${tempContainer.innerHTML}
          </ol>
        </div>
        <div class="button-box">
          <button type="button" class="previous-btn">이전</button>
          <button type="button" class="next-btn">다음</button>
        </div>`;

    // 임시로 생성한 div 제거
    tempContainer.remove();

    return questionItem;
}

/* 
다음, 이전 버튼 클릭 이벤트
버튼을 클릭하면 이동할 문항의 class에 "on"을 추가한다.
*/
function moveNext(currentItem){
    currentItem.classList.remove("on");
    let next = currentItem.nextElementSibling;

    if(next){
        next.classList.add("on");
    }
}

function movePrev(currentItem){
    currentItem.classList.remove("on");
    let prev = currentItem.previousElementSibling;

    if(prev){
        prev.classList.add("on");
    }
}