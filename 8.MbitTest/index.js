const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended : true}));

app.use(express.static(path.join(__dirname, "src")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src/index.html"));
});

app.get("/question", (req, res) => {
  res.sendFile(path.join(__dirname, "src/component/question.html"));
});

// 전달받은 form 데이터에서 가장 많은 득표된 개발자를 구합니다.
app.post("/submit", (req, res) => {
  // 전달받은 data
  const data = req.body;

  // 개발자를 카운팅할 배열
  const numberArr = new Array(5);
  numberArr.fill(0);

  for(let i = 1; i < 11; i++){
    let developerNum = Number(data[`question-${i}`]);
    numberArr[developerNum-1] += 1;
  }

  // numberArr에서 최댓값과 그의 인덱스를 구합니다.
  let maxValue = 0;
  let maxValueIdx = 0;

  for(let i = 0; i < numberArr.length; i++){
    if(numberArr[i] > maxValue){
      maxValue = numberArr[i];
      maxValueIdx = i;
    }
  }

  // 개발자 번호를 querystring으로 전달
  res.redirect("/result/"+(maxValueIdx+1));
});

app.get("/result/[0-9]", (req, res) => {
  res.sendFile(path.join(__dirname, "src/component/result.html"));
});

app.listen(3000, () => {
  console.log("Server running on 3000!");
});