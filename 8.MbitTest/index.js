const express = require("express"); /* require : node.js 함수로 express 모듈을 로드합니다.  */
const app = express();
const path = require("path"); /* path 모듈을 로드합니다. 파일과 Directory 경로 작업을 위한 여러 기능을 제공합니다.  */


app.use(express.json()); /* json 파일을 서버에서 해석 가능하게 파싱합니다. */
app.use(express.urlencoded({ extended: true })); /*  url 쿼리 스트링을 파싱합니다. 쿼리 스트링 : url 주소 뒤에 데이터를 입력하는 방식 */
app.use(express.static(path.join(__dirname, "src"))); /* src 폴더 안의 데이터들을 웹브라우저의 요청에 따라 제공할 수 있게 합니다.    __dirname : 현재경로 === ./ */

app.get("/", (req, res) => {  // 루트(/) 요청에 “src/index.html”로 응답합니다.
  res.sendFile(path.join(__dirname, "src/index.html"));
});

app.get("/question", (req, res) => { // URL(/question) 요청에 “src/component/question.html”로 응답합니다.
  res.sendFile(path.join(__dirname, "src/component/question.html"));
});

// 전달받은 form 데이터에서 가장 많은 득표된 개발자를 구합니다.
// 예시)
// 전달받은 데이터 -> {  'question-1': '3', ... , 'question-10': '4'}
// 데이터를 카운팅하기 위해 개발자수(5)만큼의 0으로 채워진 배열을 만듭니다.
// (개발자 번호 - 1)에 해당하는 인덱스의 값에 1을 더하는 방식으로 카운팅합니다.
// 카운팅 후 배열에서 최댓값을 구하고 그 최댓값에 해당하는 인덱스를 구합니다.
// 그 (인덱스 + 1)이 우리가 구할 개발자 번호(result.json의 pk 값을 말함)입니다.
app.post("/submit", (req, res) => {
  // 전달받은 data
  const data = req.body;
  // 개발자를 카운팅할 배열
  const numberArr = [0, 0, 0, 0, 0];

  // 결과를 순환하면서 응답된 개발자 유형마다 +1 을 합니다.
  for (let i = 1; i < 11; i++) {
    let developerNum = Number(data[`question-${i}`]);
    numberArr[developerNum - 1] += 1;
  }

  // numberArr에서 최댓값과 그의 인덱스를 구합니다.
  let maxValue = 0;
  let maxValueIdx = 0;

  for (let i = 0; i < numberArr.length; i++) {
    if (numberArr[i] > maxValue) {
      maxValue = numberArr[i];
      maxValueIdx = i;
    }
  }


  // 개발자 번호를 querystring으로 전달
  res.redirect("/result/" + (maxValueIdx + 1));
});

app.get("/result/[1-5]", (req, res) => { // URL(/result/[1-5]) 요청에 “src/component/question.html”로 응답합니다.
  res.sendFile(path.join(__dirname, "src/component/result.html"));
});

app.listen(3000, () => { // 서버를 구동하며 3000번 포트에서 연결을 합니다.
  console.log("Server running on 3000!");
});