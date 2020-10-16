// 引用封装的请求接口
import http from '../../resquent/http'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧一级菜单
    leftMenuList:[],
    // 右侧二级菜单
    rightMenuList:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取分类信息
    this.getMenuData()
  },

  /* 获取分类信息 */
  async getMenuData(){
    const {data:response} = await http.get('/classify/all')
    if(response.code === 1000){
      //console.log(response.data)
      let leftMenuData = response.data.map(v=>v.name)
      let rightMenuData = response.data[0].childs.map(v=>v.name)
      this.setData({
        leftMenuList: leftMenuData,
        rightMenuList: rightMenuData
      })
    }
  }

  
})