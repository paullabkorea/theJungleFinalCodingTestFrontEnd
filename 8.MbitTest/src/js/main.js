const form = document.querySelector("#form");

function loadQuestionData(){
    fetch("data/data.json")
      .then((response) => response.json())
      .then(data => {
        const questions = data.questions;
        const answers = data.answers;

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

        const questionContainer = document.querySelectorAll(".question-container");

        // 첫번째 문항과 마지막 문항 버튼 변경
        const firstQuestionContainer = questionContainer[0];
        const lastQuestionContainer = questionContainer[questionContainer.length - 1];

        const buttonBoxes = document.querySelectorAll(".button-box");

        const firstButtonBox = firstQuestionContainer.querySelector(".button-box");
        const lastButtonBox = lastQuestionContainer.querySelector(".button-box");
        
        firstButtonBox.innerHTML = "<button type='button' class='next-btn'>다음</button>";
        lastButtonBox.innerHTML = `<button type='button' class='previous-btn'>이전</button><button type='button' class='submit-btn'>제출</button>`;

        // 첫번째 문항에 class "on" 추가
        firstQuestionContainer.classList.add("on");

        // 버튼에 클릭 이벤트 추가
        const prevButtons = document.querySelectorAll(".previous-btn");
        const nextButtons = document.querySelectorAll(".next-btn");

        for(let prevButton of prevButtons) {
            prevButton.addEventListener("click", movePrev);
        }

        for(let nextButton of nextButtons) {
            nextButton.addEventListener("click", moveNext);
        }
      });
}

loadQuestionData();

function setElement(question, answerArr){
    const questionContainer = document.createElement("DIV");
    questionContainer.classList.add("question-container");

    // 임시로 답안 저장할 div 생성
    const tempContainer = document.createElement("div");

    // tempContainer에 답안 리스트 추가
    for(let idx in answerArr){
        let answer = answerArr[idx];
        tempContainer.innerHTML += `
            <li class="answer-item">
                <input type="radio" id="answer-${answer.pk}" />
                <label for="answer-${answer.pk}">${Number(idx)+1}. ${answer.content}</label>
            </li>`;
    }

    questionContainer.innerHTML = `
        <div class="status-box">
          <span> ${question.pk}/10 </span>
          <div class="status-bar">
            <div class="status"></div>
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

    // 임시로 생성산 div 제거
    tempContainer.remove();

    return questionContainer;
}

/* 
다음, 이전 버튼 클릭 이벤트
버튼을 클릭하면 이동할 문항의 class에 "on"을 추가한다.
*/
function moveNext(){
    const currentItem = document.querySelector(".on");

    if(currentItem){
        currentItem.classList.remove(".on");
        let next = currentItem.nextElementSibling;
        if(next){
            next.classList.add(".on");
        }else{
            firstQuestionContainer.classList.add(".on");
        }
    } else {
        firstQuestionContainer.classList.add(".on");
    }
}

function movePrev(){
    const currentItem = document.querySelector(".on");

    if(currentItem){
        currentItem.classList.remove(".on");
        let prev = currentItem.previousElementSibling;
        if(prev){
            prev.classList.add(".on");
        }else{
            lastQuestionContainer.classList.add(".on");
        }
    } else {
        lastQuestionContainer.classList.add(".on");
    }
}