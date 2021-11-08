const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expressionSchema = new Schema({
  name: String, // 表情包名称
  info: String, // 描述
  list: Array, // 表情列表
});

module.exports = mongoose.model("expression", expressionSchema);
