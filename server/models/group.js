const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const groupSchema = new Schema({
  groupCode: { type: String, unique: true },
  title: {
    type: String,
    required: true,
  }, // 群名称
  desc: {
    type: String,
    default: "",
  }, // 群的描述
  img: {
    type: String,
    default: "/img/zwsj5.png",
  }, // 群图片

  userNum: {
    type: Number,
    default: 1,
  }, // 群成员数量，避免某些情况需要多次联表查找，如搜索；所以每次加入一人，数量加一
  type: { type: String, default: "group" }, // group/channel
  createDate: { type: Date, default: Date.now }, // 建群时间
  grades: { type: String, default: "1" }, // 群等级，备用
  holderName: String, // 群主账号，在user实体中对应name字段
});

//发布模型
module.exports = mongoose.model("group", groupSchema);
