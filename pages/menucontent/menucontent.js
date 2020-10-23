// 引用封装的请求接口
import {http} from '../../resquent/http'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 菜谱
    menuItem: {},
    // 用料数组
    materialsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id
    this.getMenuData(id)
  },
  async getMenuData(id){
    const params = {
      id
    }
    const {data:menuResponse} = await http.get('/menu/query',{params})
    if(menuResponse.code === 1000){
      this.setData({
        menuItem: menuResponse.data
      })
    }
    const {data:materialsResponse} = await http.get('/menu/materials',{params})
    if(materialsResponse.code === 1000){
      this.setData({
        materialsList: materialsResponse.data
      })
    }
  }

})