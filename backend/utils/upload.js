const tools = require("./tools");
const fs = require("fs");
const multer = require("@koa/multer");
const storage = multer.diskStorage({
  //设置上传后文件路径， // 路径写成函数需要自己创建文件夹，字符串会自动创建。
  destination: function (req, file, cb) {
    let date = tools.formatTime(new Date()).split(" ")[0];
    let path = "./public/uploads";
    let pathDate = "./public/uploads/" + date;
    let stat = fs.existsSync(path);
    if (!stat) {
      // 不存在就创建
      fs.mkdirSync(path);
    }
    let statDate = fs.existsSync(pathDate);
    if (!statDate) {
      // 不存在就创建
      fs.mkdirSync(pathDate);
    }
    cb(null, pathDate);
  },
  //给上传文件重命名，获取添加后缀名
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

//如需其他设置，请参考multer的limits,使用方法如下。
//var upload = multer({
//    storage,
//    limits
// });
const upload = multer({
  storage,
});
module.exports = upload;
