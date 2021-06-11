const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// 群成员的集合
const groupUserSchema = new Schema({
  groupId: {
    type: Schema.Types.ObjectId,
    ref: "group",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  userName: { type: String },
  manager: { type: Number, default: 0 }, // 是否是管理员，默认0，不是，1是
  holder: { type: Number, default: 0 }, // 是否是群主，默认0，不是，1是
  card: String, // 群名片
});

groupUserSchema.statics.findGroupByUserName = function (userName, cb) {
  // 根据用户名查找所在群聊
  return this.find({ userName: userName }).populate("groupId").exec(cb);
};
groupUserSchema.statics.findGroupUsersByGroupId = function (groupId, cb) {
  // 通过groupId查找群成员
  return this.find({ groupId: groupId })
    .populate({ path: "userId", select: "signature avatar nickname " })
    .exec(cb);
};

module.exports = mongoose.model("groupUser", groupUserSchema);
