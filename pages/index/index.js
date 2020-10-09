//index.js
//获取应用实例
const app = getApp()

// 引用封装的请求接口
import http from '../../resquent/http'

Page({
  data: {
    // 滑动视图的数据
   swiperData:[]
  },

  // 获取滑动视图的数据
  async getSwipperData(){
    // 从后端获取数据
    const {data:response} = await http.get('/menu/recommend')
    console.log(response)
    // 获取数据成功
    if(response.code === 1000){
      // 设置滑动视图的数据
      this.setData({swiperData:response.data})
    }
  },
  
  onLoad: function () {
    // 获取滑动视图的数据
    this.getSwipperData()
  }
})
