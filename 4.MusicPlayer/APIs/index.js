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

app.get("/files", (request, response) => {});

const baseAssetPath = '/public/musics';

app.get("/files/:nodeId", (request, response) => {});

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "../src/index.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});