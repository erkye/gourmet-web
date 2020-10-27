const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/* 简介部分防止字符串过长导致样式出问题 */
const simplifyStr = (str,i) =>{
  if(str.length <= i){
    /* 字符串不足位数不进行任何操作 */
    return str
  }
  /* 字符串超过位数 截取前i位 后边追加... */
  return str.slice(0,i) + '...'
}
module.exports = {
  formatTime: formatTime,
  simplifyStr
}
