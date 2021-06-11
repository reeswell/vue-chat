const { connect } = require("./utils/connect");
const initData = require("./service/initData");

(async () => {
  await connect(); // 执行连接数据库任务
  await initData();
})();
