const express = require("express");
const cors = require('cors');
const path = require("path");

const app = express();
const database = require("./db");
const { db } = database;

const TIMER = 1000;

app.use(cors());
app.use(express.static(path.join(__dirname, "../src")));
app.use("/public", express.static(path.join(__dirname, "./public")));

app.get("/musics", (request, response) => { // /musics url로 요청이 오면 DB 데이터를 반환합니다.
  const musics = db.get("musics");

  return response.json({ musics });
});

app.get("/", (request, response) => { // 루트 경로. src/index.html 초기 화면을 반환합니다.
  response.sendFile(path.join(__dirname, "../src/index.html"));
});

const PORT = 3000;
app.listen(PORT, () => { // 서버를 실행할 때 3000번 포트를 엽니다.
  console.log(`Server listening at http://localhost:${PORT}`);
});