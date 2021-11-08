const sd = require("silly-datetime");
const svgCaptcha = require("svg-captcha"); // 生成 svg 格式的验证码

// 工具封装

// 格式化当前时间
const getCurDate = (format = "YYYYMMDD") => {
  // 默认返回格式：20190925
  return sd.format(new Date(), format);
};

// 生成 svg格式验证码
const createCaptcha = () => {
  const captcha = svgCaptcha.create({
    size: 4,
    noise: 1,
    fontSize: 35,
    width: 100,
    height: 35,
    background: "#e9e9e9",
  });

  return captcha;
};
const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join("-") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
};
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const a = [year, month, day].map(formatNumber);
  return a[0] + "年" + a[1] + "月" + a[2] + "日";
};

const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : "0" + n;
};
module.exports = {
  getCurDate,
  createCaptcha,
  formatTime,
  formatDate,
};
