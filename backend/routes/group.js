const Router = require("koa-router");

const router = new Router();

const api = require("../controller/group");

router.post("/createGroup", api.createGroup); // 新建群
router.post("/getMyGroup", api.getMyGroup); // 查找我的群聊
router.post("/getGroupUsers", api.getGroupUsers); // 查找指定群聊成员
router.post("/huntGroups", api.huntGroups); // 搜索聊天群（名称/code）
router.post("/getGroupInfo", api.getGroupInfo); // 查找群详细信息
router.post("/quitGroup", api.quitGroup); // 退出群聊

module.exports = router;
