const express = require('express');
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended : true}));

app.use(express.static(path.join(__dirname, 'src')));
app.use("/static", express.static(path.join(__dirname, 'src/component')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/index.html'));
});

app.get('/question', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/component/question.html'));
});

app.post('/submit', (req, res) => {
  const data = req.body;
  const numberArr = new Array(5);
  numberArr.fill(0);

  for(let i = 1; i < 11; i++){
    let developerNum = Number(data[`question-${i}`]);
    console.log(developerNum);
    numberArr[developerNum-1] += 1;
  }

  let maxValue = 0;
  let maxValueIdx = 0;

  for(let i = 0; i < numberArr.length; i++){
    if(numberArr[i] > maxValue){
      maxValue = numberArr[i];
      maxValueIdx = i;
    }
  }

  res.redirect('/result/'+(maxValueIdx+1));
});

app.get('/result/[0-9]', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/component/result.html'));
});

app.listen(3000, () => {
  console.log('Express App on port 3000!');
});