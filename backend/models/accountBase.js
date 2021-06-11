const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const accountBaseSchema = new Schema({
  code: String,
  status: String, // 1 已使用 0 未使用
  special: String,
  type: String, // 1 用户 2 群聊
  random: Number,
});

//发布模型
module.exports = mongoose.model("accountBase", accountBaseSchema);
