const Router = require("koa-router");

const router = new Router();
const api = require("../controller/message");

router.post("./deleteMessage", api.deleteMessage);
router.get("/loadMoreMessages", api.loadMoreMessages);
