import axios from 'axios'
import mpAdapter from 'axios-miniprogram-adapter'
axios.defaults.adapter = mpAdapter

// 构建axios实例
const http = axios.create({
  baseURL: 'http://localhost:3000/api'
  /* baseURL: 'http://243769da24.wicp.vip/api' */

})

// 到处实例
module.exports = http 