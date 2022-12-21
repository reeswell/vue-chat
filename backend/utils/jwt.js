const jwt = require("jsonwebtoken");

//  密钥
const JWT_SECRET = "chat_jwt";

// 创建 Token

const createToken = (userInfo) => {
  // JWT 格式 token | 有效时间 1 小时
  return jwt.sign(userInfo, JWT_SECRET, { expiresIn: "24h" });
};

//  验证 token 结果 (验证 secret 和 检查有效期 exp)

const authJwt = async (ctx,next) => {
  const token = ctx.header.authorization || ''
  if (token.startsWith('Bearer ')) {
    const tokenStr = token.substring(7)
    try {
      const user = await jwt.verify(tokenStr, JWT_SECRET)
      ctx.state.user = user
    }
    catch (err) {
      ctx.throw(401, 'Invalid token')
    }
  }
  else {
    ctx.throw(401, 'Invalid token')
  }
  await next()
}


module.exports = {
  createToken,
  authJwt,
};
