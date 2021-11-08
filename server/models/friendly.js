const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const friendlySchema = new Schema({
  self: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  other: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  roomId: {
    type: String,
    default: "",
  },
  createDate: { type: Date, default: Date.now() }, // 加好友时间
});

friendlySchema.statics.findFriendBySelf = function (userId, cb) {
  // 联表查询 select:关联表的部分属性
  return this.find({ self: userId })
    .populate({ path: "other", select: "signature avatar nickname" })
    .exec(cb);
};
friendlySchema.statics.findFriendByOther = function (userId, cb) {
  return this.find({ other: userId })
    .populate({ path: "self", select: "signature avatar nickname" })
    .exec(cb);
};

module.exports = mongoose.model("friendly", friendlySchema);
