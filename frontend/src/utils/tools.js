/**
 * 函数节流方法
 * @param {Function} fn 延时调用函数
 * @param {Number} delay 延迟多长时间
 * @param {Number} atleast 至少多长时间触发一次
 * @return {Function} 延迟执行的方法
 */
function throttle(fn, delay, atleast = 0) {
  let timer = null // 记录定时器
  let previous = 0 // 记录上一次执行时间

  return (...args) => {
    const now = +new Date() // 当前时间戳
    if (!previous) previous = now // 赋值开始时间

    if (atleast && now - previous > atleast) {
      fn.apply(this, args)
      // 重置上一次开始时间为本次结束时间
      previous = now
      timer && clearTimeout(timer)
    } else {
      timer && clearTimeout(timer) // 清除上次定时器
      timer = setTimeout(() => {
        fn.apply(this, args)
        console.log('else')
        previous = 0
      }, delay)
    }
  }
}

/**
 * 搜索关键词高亮显示
 * @param String str 要替换的关键词
 * @param String value 搜索框里面的内容
 */
const keyword = (str, value) => {
  const replaceReg = new RegExp(value, 'g')
  const replaceString = `<span style='color:red'>${value}</span>`
  str = str.replace(replaceReg, replaceString)
  return str
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const a = [year, month, day].map(formatNumber)
  return a[0] + '年' + a[1] + '月' + a[2] + '日'
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
export {
  throttle, // 函数节流
  keyword, // 搜索关键词高亮显示
  formatTime,
  formatDate,
  formatNumber
}
