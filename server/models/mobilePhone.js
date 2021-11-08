const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// 手机号数据模型 （用于发送验证码）
const mobilePhoneSchema = new Schema({
  mobilePhone: { type: String, unique: true }, // 手机号
  clientIp: { type: String, default: "" }, // 客户端 ip
  sendCount: Number, // 发送次数
  curDate: String, // 当前日期
  sendTimestamp: { type: String, default: +new Date() }, // 短信发送的时间戳
});

module.exports = mongoose.model("mobilePhone", mobilePhoneSchema);
