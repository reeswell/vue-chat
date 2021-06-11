/* 合法手机号*/
export function checkPhone(value) {
  const reg = /^1[34578]\d{9}$/
  return reg.test(value)
}

export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  )
}

export function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

export function check_user_name(str) {
  let str2 = '该用户名合法'
  if ('' == str) {
    str2 = '用户名为空'
    return str2
  } else if (str.length < 6 || str.length > 20) {
    str2 = '用户名必须为6 ~ 20位'
    return str2
  } else if (check_other_char(str)) {
    str2 = '不能含有特殊字符'
    return str2
  }
  return str2
}
// 验证用户名是否含有特殊字符
function check_other_char(str) {
  let arr = ['&', '\\', '/', '*', '>', '<', '@', '!']
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < str.length; j++) {
      if (arr[i] == str.charAt(j)) {
        return true
      }
    }
  }
  return false
}
