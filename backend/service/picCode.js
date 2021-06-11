const tools = require("../utils/tools");

const sendPicCode = async (ctx) => {
  const picCode = tools.createCaptcha();
  // 将验证码保存到session中
  ctx.session.picCode = picCode.text;
  // 指定返回类型
  ctx.set("Content-Type", "image/svg+xml");
  ctx.body = picCode.data;
};

module.exports = sendPicCode;
