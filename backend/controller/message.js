const mesModel = require("../models/message");
// 保存消息
const saveMessage = async (obj) => {
  try {
    const mesDoc = await new mesModel(obj);
    await mesDoc.save();
    return {
      code: 200,
      data: "ok",
      msg: "ok",
    };
  } catch (error) {
    return { code: -1, msg: "err" };
  }
};
// 删除消息
const deleteMessage = async (ctx) => {
  const data = ctx.request.body;
  try {
    await mesModel.deleteOne(data);
    ctx.body = { code: 200, mes: "删除成功" };
  } catch (error) {
    console.log(error);
  }
};

const getMessage = async (obj, count = 0) => {
  try {
    let result;
    await mesModel
      .find({ roomId: obj.roomId })
      .populate({ path: "self", select: "signature avatar nickname" })
      .skip((obj.offset - 1) * obj.limit)
      .limit(obj.limit)
      .sort({ time: -1 })
      .then((r) => {
        r.forEach((v) => {
          // 防止用户修改资料后，信息未更新
          if (v.userM) {
            v.nickname = v.userM.nickname;
            v.avatar = v.userM.photo;
            v.signature = v.userM.signature;
          }
        });
        r.reverse();
        result = { code: 200, data: r, count: count };
      })
      .catch((err) => {
        console.log(err);
        result = { code: -1 };
      });
    // console.log("result", result);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getHistoryMessage = async (obj, reverse) => {
  try {
    if (reverse === 2) {
      const count = await mesModel.countDocuments({ roomId: obj.roomId });

      return count > 0
        ? getMessage({ obj, count })
        : { code: 200, count: 0, data: [] };
    } else if (reverse === 1) {
      return getMessage(obj);
    } else if (reverse === -1) {
      const mesDoc = await mesModel
        .find({ roomId: obj.roomId })
        .skip((obj.offset - 1) * obj.limit)
        .limit(obj.limit)
        .sort({ time: -1 });
      return { code: 200, data: mesDoc };
    }
  } catch (error) {
    console.log(error);
  }
};

const loadMoreMessages = (ctx) => {
  const data = ctx.query;
  getHistoryMessage(data, 2, (item) => {
    if (item.code !== 200)
      return (ctx.body = {
        code: -1,
        data: "获取失败",
      });
    ctx.body = item;
  });
};
// 设置消息的状态
const setReadStatus = async (obj) => {
  const { roomId, userName } = obj;
  try {
    const mesList = await mesModel.find({ roomId });
    mesList.forEach((item) => {
      if (item.read.indexOf(userName) === -1) {
        item.read.push(userName);
        item.save();
      }
    });
    console.log(userName);

    return { code: 200, msg: "ok" };
  } catch (error) {
    console.log(error);
  }
};

const setMessageStatus = async (obj) => {
  const { self, status } = obj;
  try {
    const result = await mesModel.find({ self }, (err, doc) => {
      if (!err) {
        doc.forEach((item) => {
          if (
            item.type === "validate" &&
            (item.state === "friend" || item.state === "group")
          ) {
            item.status = status;
            item.save();
          }
        });
      } else {
        return { code: -1, msg: "err" };
      }
    });

    return { code: 200, msg: "ok", data: result };
  } catch (error) {
    console.log(error);
  }
};

const updateMesStatus = async (obj) => {
  const { _id, status } = obj;
  try {
    const mesDoc = await mesModel.updateOne({ _id }, { status });
    if (mesDoc.nModified > 0) return { code: 200, msg: "ok" };
    return { code: -1, msg: "更新失败" };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  saveMessage,
  deleteMessage,
  loadMoreMessages,
  getHistoryMessage,
  setReadStatus,
  setMessageStatus,
  updateMesStatus,
};
