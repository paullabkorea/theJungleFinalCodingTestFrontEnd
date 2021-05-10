const lodashId = require("lodash-id");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const path = require("path");

const dbPath = "./APIs/db/db.json";
const adapter = new FileSync(dbPath);
const db = low(adapter);

db._.mixin(lodashId);

module.exports = {
  db,
};