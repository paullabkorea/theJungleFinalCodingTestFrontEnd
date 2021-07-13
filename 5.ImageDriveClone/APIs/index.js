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

app.get("/files", (request, response) => {
  const rootFiles = db.get("files").root().value();
  setTimeout(() => {
    response.json(rootFiles);
  }, TIMER);
});

const baseAssetPath = '/public/images';

app.get("/files/:nodeId", (request, response) => {
  const { nodeId } = request.params;
  const files = db.get("files").findChildren(nodeId).value();
  setTimeout(() => {
    response.json(files);
  }, TIMER);
});

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "../src/index.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Album App listening at http://localhost:${PORT}`);
});
