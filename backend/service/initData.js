const UserModel = require("../models/user");

const initUser = async () => {
  try {
    const officialAccount = await new UserModel({
      userName: "vueChat",
      password: "666666",
      avatar: "/img/vchat.png",
      signature: "官方",
      nickname: "官方推送",
    });
    await officialAccount.save();
    console.log("初始化官方账号成功");
  } catch (error) {
    console.error(error);
  }
};
module.exports = initUser;
