const UserModel = require("../models/user");
const MobilePhoneModel = require("../models/mobilePhone");
const mesModel = require("../models/message");

const fs = require("fs");
const jwt = require("jsonwebtoken");
const tools = require("../utils/tools");
const bcrypt = require("bcryptjs"); // 用于密码哈希的加密算法
const { log } = require("debug");
const SALT_WORK_FACTOR = 10; // 定义加密密码计算强度

const register = async (ctx) => {
  const { userName, password, mobilePhone, smsCode } = ctx.request.body;
  if (!userName || !password || !mobilePhone || !smsCode)
    return (ctx.body = {
      code: 5020,
      msg: "请输入完整信息",
    });
  if (!ctx.session.smsCode)
    return (ctx.body = {
      code: 5021,
      msg: "验证码已过期",
    });
  if (ctx.session.smsCode !== smsCode)
    return (ctx.body = {
      code: 5022,
      msg: "验证码不正确",
    });
  try {
    const userDoc = await UserModel.findOne({
      $or: [
        {
          userName,
        },
        {
          mobilePhone,
        },
      ],
    });
    if (userDoc !== null)
      return (ctx.body = {
        code: 0,
        msg: "用户名已存在",
      });
    // 注册账号
    const userEntity = new UserModel({
      userName,
      password,
      mobilePhone,
      nickname: userName,
    });
    await userEntity.save();
    const obj = {
      userName: userEntity.userName,
      avatar: userEntity.avatar,
      id: userEntity._id,
      type: "me",
      friendId: userEntity._id,
    };
    await serverAddConversationList(userName, obj);
    ctx.body = {
      code: 200,
      msg: "注册成功",
    };
  } catch (error) {
    console.log(error);
  }
};

const login = async (ctx) => {
  const { userName, password, verifyCode } = ctx.request.body;
  if (!userName || !password || !verifyCode)
    return (ctx.body = {
      code: 5020,
      msg: "请输入完整信息",
    });
  if (!ctx.session.picCode)
    return (ctx.body = {
      code: 5021,
      msg: "验证码已过期",
    });
  if (ctx.session.picCode.toUpperCase() !== verifyCode.toUpperCase())
    return (ctx.body = {
      code: 5022,
      msg: "验证码不正确",
    });
  try {
    const userDoc = await UserModel.findOne({
      $or: [
        {
          userName,
        },
        {
          mobilePhone: userName,
        },
      ],
    });
    // 登录账号
    const result = await userDoc.comparePassword(password, userDoc.password); // 进行密码比对是否一致
    const token = jwt.sign({ _id: userDoc._id }, "chat_jwt", {
      expiresIn: 60 * 60 * 24,
    });
    if (!result) return (ctx.body = { code: -2, msg: "用户名或者密码错误" });
    ctx.body = {
      code: 200,
      msg: "登录成功",
      token,
      data: {
        userName: userDoc.userName,
        mobilePhone: userDoc.mobilePhone,
        avatar: userDoc.avatar,
        signature: userDoc.signature,
        nickname: userDoc.nickname,
        email: userDoc.email,
        province: userDoc.province,
        city: userDoc.city,
        gender: userDoc.gender,
        conversationsList: userDoc.conversationsList,
        age: userDoc.age,
        friendsGroup: userDoc.friendsGroup,
        id: userDoc._id,
      },
    };
  } catch (error) {
    console.log(error);
  }
};

// 发送短信验证码
const sendSMSCode = async (ctx) => {
  const { mobilePhone } = ctx.request.body;
  // mobilePhone = Number(mobilePhone);
  // console.log(mobilePhone);
  const clientIp =
    ctx.req.headers["x-forwarded-for"] || // 判断是否有反向代理 IP
    ctx.req.connection.remoteAddress || // 判断 connection 的远程 IP
    ctx.req.socket.remoteAddress || // 判断后端的 socket 的 IP
    ctx.req.connection.socket.remoteAddress ||
    "";
  // console.log('777777'+ new Date()+ "888888");
  const curDate = tools.formatDate(new Date()); // 当前时间
  let clientIpCount = 0;
  const smsSendMax = 99; // 设定短信发送限制数
  const ipCountMax = 99; // 设定 ip 数限制数
  let smsCode = ""; // 随机短信验证码
  const smsCodeLen = 6; // 随机短信验证码长度
  for (let i = 0; i < smsCodeLen; i++) {
    smsCode += Math.floor(Math.random() * 10);
  }
  try {
    const mobilePhoneDoc = await MobilePhoneModel.findOne({
      mobilePhone,
      curDate,
    });

    if (mobilePhoneDoc !== null) {
      clientIpCount += 1;
      if (+new Date().getTime() - mobilePhoneDoc.sendTimestamp < 5000) {
        return (ctx.body = {
          code: 4010,
          time:
            5000 -
            Math.floor(+new Date().getTime() - mobilePhoneDoc.sendTimestamp),
          msg: "限制 60 秒内无法再发送短信验证码",
        });
      }
      // 说明次数未到到限制，可继续发送
      if (mobilePhoneDoc.sendCount < smsSendMax && clientIpCount < ipCountMax) {
        await MobilePhoneModel.updateOne(
          {
            mobilePhone,
          },
          {
            $inc: {
              sendCount: 1,
            },
            $set: {
              sendTimestamp: +new Date(),
            },
          }
        );
        ctx.session.smsCode = smsCode;

        return (ctx.body = {
          smsCode,
          code: 200,
          msg: "验证码发送成功",
        });
      } else {
        return (ctx.body = {
          code: 4020,
          msg: "当前手机号码发送次数达到上限，明天重试",
        });
      }
    } else {
      console.log("22");
      await MobilePhoneModel.create({
        mobilePhone,
        clientIp,
        curDate,
        sendCount: 1,
        sendTimestamp: +new Date(),
      });
      ctx.session.smsCode = smsCode;
      return (ctx.body = {
        smsCode,
        code: 200,
        msg: "验证码发送成功",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
// 更新个人信息
const updateUserInfo = async (ctx) => {
  const data = ctx.state.user;

  const {
    area = null,
    avatar = null,
    nickname = null,
    email = null,
    mobilePhone = null,
    gender = null,
    age = null,
    unlink = null,
  } = ctx.request.body;
  try {
    let userDoc;

    if (area) {
      const province = area[0];
      const city = area[1];
      userDoc = await UserModel.findByIdAndUpdate(
        data._id,
        {
          province,
          city,
        },
        {
          new: true,
        }
      );
    }
    if (avatar) {
      userDoc = await UserModel.findByIdAndUpdate(
        data._id,
        {
          avatar,
        },
        {
          new: true,
        }
      );
    }
    if (nickname) {
      userDoc = await UserModel.findByIdAndUpdate(
        data._id,
        {
          nickname,
        },
        {
          new: true,
        }
      );
    }
    if (mobilePhone) {
      userDoc = await UserModel.findByIdAndUpdate(
        data._id,
        {
          mobilePhone,
        },
        {
          new: true,
        }
      );
    }
    if (age) {
      userDoc = await UserModel.findByIdAndUpdate(
        data._id,
        {
          age,
        },
        {
          new: true,
        }
      );
    }
    if (gender) {
      userDoc = await UserModel.findByIdAndUpdate(
        data._id,
        {
          gender,
        },
        {
          new: true,
        }
      );
    }
    if (email) {
      userDoc = await UserModel.findByIdAndUpdate(
        data._id,
        {
          email,
        },
        {
          new: true,
        }
      );
    }
    if (userDoc === null) {
      return (ctx.body = {
        code: 200,
        msg: "修改失败",
      });
    }
    ctx.body = {
      code: 200,
      msg: "修改成功",
      data: {
        userName: userDoc.userName,
        mobilePhone: userDoc.mobilePhone,
        avatar: userDoc.avatar,
        signature: userDoc.signature,
        nickname: userDoc.nickname,
        email: userDoc.email,
        province: userDoc.province,
        city: userDoc.city,
        gender: userDoc.gender,
        conversationsList: userDoc.conversationsList,
        age: userDoc.age,
        friendsGroup: userDoc.friendsGroup,
        id: userDoc._id,
      },
    };
  } catch (error) {
    console.log(error);
  }
};

// 获取登录用户信息

const getUserInfo = async (ctx) => {
  const data = ctx.state.user;
  try {
    const userDoc = await UserModel.findById(data._id);
    if (userDoc === null) {
      return (ctx.body = { code: -1, msg: "获取个人信息失败" });
    }
    ctx.body = {
      code: 200,
      data: {
        userName: userDoc.userName,
        mobilePhone: userDoc.mobilePhone,
        avatar: userDoc.avatar,
        signature: userDoc.signature,
        nickname: userDoc.nickname,
        email: userDoc.email,
        province: userDoc.province,
        city: userDoc.city,
        gender: userDoc.gender,
        conversationsList: userDoc.conversationsList,
        age: userDoc.age,
        friendsGroup: userDoc.friendsGroup,
        id: userDoc._id,
      },
    };
  } catch (error) {
    console.log(error);
  }
};
// 获取个人以及好友列表信息 分组状态
const previewUser = async (ctx) => {
  const { id } = ctx.request.body;
  // console.log(id);
  try {
    const userDoc = await UserModel.findById(id);
    if (userDoc === null) return (ctx.body = { code: -1, msg: "获取失败" });
    ctx.body = {
      code: 200,
      data: {
        userName: userDoc.userName,
        mobilePhone: userDoc.mobilePhone,
        avatar: userDoc.avatar,
        signature: userDoc.signature,
        nickname: userDoc.nickname,
        email: userDoc.email,
        province: userDoc.province,
        city: userDoc.city,
        gender: userDoc.gender,
        conversationsList: userDoc.conversationsList,
        age: userDoc.age,
        friendsGroup: userDoc.friendsGroup,
        id: userDoc._id,
      },
      msg: "查找成功",
    };
  } catch (error) {
    console.log(error);
  }
};

// 添加会话

const addConversationList = async (ctx) => {
  const { userName, obj } = ctx.request.body;
  try {
    const result = await UserModel.updateOne(
      {
        userName,
      },
      {
        $push: {
          conversationsList: obj,
        },
      }
    );
    if (result === null) return (ctx.body = { code: -1, msg: "添加失败" });
    ctx.body = {
      code: 200,
      msg: "添加成功",
    };
  } catch (error) {
    console.log(error);
  }
};
const serverAddConversationList = async (userName, obj) => {
  try {
    const result = await UserModel.updateOne(
      {
        userName,
      },
      {
        $push: {
          conversationsList: obj,
        },
      }
    );
    if (result === null) return { code: -1, msg: "添加失败" };
    return {
      code: 200,
      msg: "添加成功",
    };
  } catch (error) {
    console.log(error);
  }
};

// 移除会话
const removeConversationList = async (ctx) => {
  const { userName, ...obj } = ctx.request.body;
  try {
    const result = await UserModel.updateOne(
      {
        userName,
      },
      {
        $pull: {
          conversationsList: obj,
        },
      }
    );
    if (result === null) return (ctx.body = { code: -1, msg: "移除失败" });
    ctx.body = {
      code: 200,
      msg: "移除成功",
    };
  } catch (error) {
    console.log(error);
  }
};

// 搜索用户
const searchFriends = async (ctx) => {
  const { keyword } = ctx.request.body; //

  const arr = [
    {
      userName: keyword,
    },
    {
      mobilePhone: keyword,
    },
  ];
  try {
    const userDoc = await UserModel.findOne({
      $or: arr,
    });
    if (userDoc === null) return (ctx.body = { code: -1, msg: "该用户不存在" });
    ctx.body = {
      code: 200,
      data: {
        userName: userDoc.userName,
        signature: userDoc.signature,
        avatar: userDoc.avatar,
        id: userDoc.id,
      },
      msg: "查找成功",
    };
  } catch (error) {
    console.log(error);
  }
};
// 删除对话 即好友或群组
const deleteDialog = async (ctx) => {
  const { userId, friendId, roomId } = ctx.request.body;
  try {
    await UserModel.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $pull: {
          conversationsList: {
            id: roomId,
          },
        },
      },
      {
        new: true,
      }
    );

    ctx.body = { code: 200, msg: "删除好友成功！" };
  } catch (error) {
    console.log(error);
  }
};
const userCheckIsMyFriend = async (obj) => {
  const { roomId, userId } = obj;
  try {
    const result = await UserModel.findOne({
      _id: userId,
      conversationsList: { $elemMatch: { id: roomId } },
    });
    if (result === null) {
      return { code: 200, msg: "gogo" };
    }
    return { code: -1, msg: "你们已经是好友" };
  } catch (error) {
    console.log(error);
  }
};
// 修改好友备注
const modifyFriendRemark = async (ctx) => {
  const { userId, friendId, remark } = ctx.request.body;
  // const  otherName = await UserModel.findOne({userName})
  try {
    await UserModel.findOneAndUpdate(
      {
        _id: userId,
        conversationsList: { $elemMatch: { friendId: friendId } },
      },
      {
        $set: { "conversationsList.$.userName": remark },
      },
      {
        new: true,
      }
    );
    ctx.body = { code: 200, msg: "修改备注成功！" };
  } catch (error) {
    console.log(error);
  }
};

// 修改好友头像
const updateUserConversations = async (ctx) => {
  const { id } = ctx.request.body;
  try {
    const userDoc = await UserModel.findById(id);
    const result = await UserModel.updateMany(
      { conversationsList: { $elemMatch: { friendId: id } } },
      {
        $set: { "conversationsList.$.avatar": userDoc.avatar },
      }
    );
    const mesDoc = await mesModel.updateMany(
      { userName: userDoc.userName, type: "validate" },
      {
        $set: { avatar: userDoc.avatar },
      }
    );

    ctx.body = { code: 200, msg: "更新会话头像成功" };
  } catch (error) {
    console.log(error);
  }
};
const getOfficialInfo = async (ctx) => {
  try {
    const result = await UserModel.findOne({ userName: "vueChat" });
    if (result === null)
      return (ctx.body = { code: -1, msg: "官方账号不存在" });
    ctx.body = {
      code: 200,
      msg: "成功找到官方账号",
      data: {
        userName: result.userName,
        avatar: result.avatar,
        nickname: result.nickname,
        signature: result.signature,
        id: result._id,
      },
    };
  } catch (error) {
    console.log(error);
  }
};

const updatedUserPhone = async (ctx) => {
  const { mobilePhone, newMobilePhone, smsCode } = ctx.request.body;
  if (smsCode !== ctx.session.smsCode)
    return (ctx.body = { code: -1, msg: "短信验证码不正确" });
  const data = ctx.state.user;

  try {
    const result = await MobilePhoneModel.findOne({ newMobilePhone });
    if (result !== null)
      return (ctx.body = { code: -1, msg: "该手机号码已注册" });

    await MobilePhoneModel.findOneAndUpdate(
      { mobilePhone },
      { mobilePhone: newMobilePhone },
      { new: true }
    );
    const userDoc = await UserModel.findByIdAndUpdate(
      data._id,
      { mobilePhone: newMobilePhone },
      { new: true }
    );
    ctx.body = {
      code: 200,
      data: {
        userName: userDoc.userName,
        mobilePhone: userDoc.mobilePhone,
        avatar: userDoc.avatar,
        signature: userDoc.signature,
        nickname: userDoc.nickname,
        email: userDoc.email,
        province: userDoc.province,
        city: userDoc.city,
        gender: userDoc.gender,
        conversationsList: userDoc.conversationsList,
        age: userDoc.age,
        friendsGroup: userDoc.friendsGroup,
        id: userDoc._id,
      },
    };
  } catch (error) {
    console.log(error);
  }
};
const updatedUserPassword = async (ctx) => {
  let { password, newPassword } = ctx.request.body;
  const data = ctx.state.user;

  try {
    const userDoc = await UserModel.findById(data._id);
    const result = await userDoc.comparePassword(password, userDoc.password); // 进行密码比对是否一致

    if (!result) return (ctx.body = { code: -2, msg: "原密码错误" });
    await new Promise((resolve, reject) => {
      bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) reject(err);
        // 结合 salt 产生新的hash
        bcrypt.hash(newPassword, salt, (err, hash) => {
          if (err) reject(err);
          // 使用 hash 覆盖明文密码
          newPassword = hash;
          resolve(newPassword);
        });
      });
    });
    console.log(newPassword);
    await UserModel.findByIdAndUpdate(
      data._id,
      {
        password: newPassword,
      },
      {
        new: true,
      }
    );

    ctx.body = {
      code: 200,
      msg: "修改密码成功！",
    };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  register,
  login,
  sendSMSCode,
  updateUserInfo,
  getUserInfo,
  previewUser,
  addConversationList,
  removeConversationList,
  searchFriends,
  getOfficialInfo,
  serverAddConversationList,
  modifyFriendRemark,
  updatedUserPhone,
  updatedUserPassword,
  updateUserConversations,
  deleteDialog,
  userCheckIsMyFriend,
};
