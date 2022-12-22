const UserModel = require("../models/user");
const GroupModel = require("../models/group");
const GroupUserModel = require("../models/groupUser");
const { log } = require("debug");
// 获取我的群聊
const getMyGroup = async (ctx) => {
  const { userName } = ctx.query;
  try {
    const groupUserDoc = await GroupUserModel.findGroupByUserName(userName);
    console.log(groupUserDoc);
    // if (!groupUserDoc.length) return (ctx.body = { code: -1, msg: "查找失败" });
    ctx.body = { code: 200, data: groupUserDoc };
  } catch (error) {
    console.log(error);
  }
};
// 获取群聊详情
const getGroupInfo = async (ctx) => {
  const { id } = ctx.query;
  try {
    const groupResult = await GroupModel.findById(id);
    const groupUser = await GroupUserModel.findGroupUsersByGroupId(id);
    if (groupResult === null || groupUser.length === 0) {
      ctx.body = { code: -1, msg: "查找失败" };
    }
    ctx.body = { code: 200, data: groupResult, users: groupUser };
  } catch (error) {
    console.log(error);
  }
};
// 搜索群聊
const huntGroups = async (ctx) => {
  const { keyword } = ctx.query; // 关键字，页数

  try {
    const groupDoc = await GroupModel.findOne({
      groupCode: keyword,
    });

    if (groupDoc === null)
      return (ctx.body = { code: -1, msg: "该群组不存在" });
    ctx.body = {
      code: 200,
      data: {
        userName: groupDoc.title,
        signature: groupDoc.desc,
        avatar: groupDoc.img,
        id: groupDoc._id,
        type: groupDoc.type,
      },
      msg: "查找成功",
    };
  } catch (error) {
    console.log(error);
  }
};
// 群聊添加新成员
const InsertGroupUsers = async (obj) => {
  const { groupId, userName, self } = obj;
  try {
    const hasGroupUser = await GroupUserModel.find({
      groupId,
      userId: self,
    });
    if (hasGroupUser.length) {
      return { code: -1, msg: "此用户已经存在该群了" };
    }

    const newGroupUser = new GroupUserModel({
      groupId: groupId,
      userName: userName,
      userId: self,
    });
    await newGroupUser.save();
    // 群组的人员数量+1
    const result = await GroupModel.updateOne(
      { _id: groupId },
      { $inc: { userNum: 1 } }
    );
    if (result.nModified > 0) {
      return { code: 200, msg: "添加成功", user: newGroupUser };
    }
    return { code: -1, msg: "添加失败" };
  } catch (error) {
    console.log(error);
  }
};
// 创建群聊
const createGroup = async (ctx) => {
  const {
    groupName,
    groupDesc,
    groupImage,
    userName,
    groupCode,
    type,
  } = ctx.request.body;
  try {
    const result = await GroupModel.find({ groupCode });
    if (result.length) return (ctx.body = { code: -1, msg: "该群id已存在" });
    const newGroup = new GroupModel({
      title: groupName,
      desc: groupDesc,
      img: groupImage,
      userNum: 1,
      holderName: userName,
      groupCode,
      type,
    });
    await newGroup.save();
    const userResult = await UserModel.findOne({ userName });
    const newGroupUser = new GroupUserModel({
      userName,
      userId: userResult._id,
      manager: 0,
      holder: 1,
      groupId: newGroup._id,
    });
    newGroupUser.save();
    ctx.body = { code: 200, data: newGroup };
  } catch (error) {
    GroupModel.deleteOne({ _id: newGroup._id });
    console.log(error);
  }
};

// 查找指定群聊成员

const getGroupUsers = async (ctx) => {
  const { groupId } = ctx.query;
  try {
    const groupUserDoc = await GroupUserModel.findGroupUsersByGroupId(groupId);
    if (groupUserDoc === null)
      return (ctx.body = { code: -1, msg: "查找失败" });
    ctx.body = { code: 200, data: groupUserDoc };
  } catch (error) {
    console.log(error);
  }
};

const quitGroup = async (ctx) => {
  const { userId, groupId } = ctx.request.body;
  try {
    await GroupUserModel.findOneAndDelete({ userId });
    await UserModel.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $pull: {
          conversationsList: {
            id: groupId,
          },
        },
      },
      {
        new: true,
      }
    );
    ctx.body = { code: 200, msg: "退群成功" };
  } catch (error) {
    console.log(error);
  }
};

// 获取所有群聊
module.exports = {
  createGroup,
  getMyGroup,
  getGroupUsers,
  huntGroups,
  getGroupInfo,
  InsertGroupUsers,
  quitGroup,
};
