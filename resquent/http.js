import axios from 'axios'
import mpAdapter from 'axios-miniprogram-adapter'
axios.defaults.adapter = mpAdapter

// 构建axios实例
const http = axios.create({
  /* 本地测试环境使用 */
  baseURL: 'http://localhost:3000/api'
  /* 真机调试使用 */
  /* baseURL: 'http://243769da24.wicp.vip/api' */
  /* 生产环境使用 */
  /* baseURL: 'http://243769da24.wicp.vip/api' */

})

// 到处实例
module.exports = http 