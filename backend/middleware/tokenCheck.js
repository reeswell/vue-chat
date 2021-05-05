
const tokenCheck = function () {
    return async function (ctx, next) {
      if (ctx.state.user) {
        // 如果携带有效 Token 就对 Token 进行检查（由 kow-jwt 检查 Token 有效性）
        let result = true
        // check here
        if (result) {
          await next()
        } else {
          ctx.body = {
            msg: "Token 检查未通过"
          }
        }
      } else {
        // 如果没有携带 Token 就跳过检查
        await next()
      }
    }
  }
   
  module.exports = tokenCheck