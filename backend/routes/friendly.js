const Router = require("koa-router");

const router = new Router();
const api = require("../controller/friendly");

router.post("/checkIsFriends", api.checkIsFriends);
router.get("/findMyFriendsList", api.findMyFriendsList);
router.post("/deleteFriend", api.deleteFriend);

module.exports = router;
