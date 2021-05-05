const Router = require("koa-router");

const router = new Router();

const uploads = require("../utils/upload"); // 上传js
const tools = require("../utils/tools");

// f  前端文件上传name必须为f
// router.post('/uploadInmage', upload.single('f'), uploadInmage); // 第一种上传方案所需
router.post("/uploadFile", uploads.single("file"), async (ctx) => {
  // 第二种上传方案

  const date = tools.formatTime(new Date()).split(" ")[0];

  ctx.body = {
    code: 200,
    data: "/uploads/" + date + "/" + ctx.request.file.filename,
  };
});

module.exports = router;
