// 引用封装的请求接口
import {http} from '../../resquent/http'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧一级菜单
    leftMenuList:[],
    // 右侧二级菜单
    rightMenuList:[],
    // 激活的菜单
    activeIndex: 0,
    // 菜单数据
    CatesData: []

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
    // 发起请求
    const {data:response} = await http.get('/classify/all')
    if(response.code === 1000){
      //console.log(response.data)
      // 将一级菜单映射为字符串数组
      let leftMenuData = response.data.map(v=>v.name)
      // 一级菜单中的第一项映射为字符串数组
      let rightMenuData = response.data[0].childs.map(v=>v.name)
      this.setData({
        // 设置左侧一级菜单数据
        leftMenuList: leftMenuData,
        // 设置右侧二级菜单数据
        rightMenuList: rightMenuData,
        // 将完整的后端返回数据保存到data中，方便后面切换事件使用
        CatesData: response.data
      })
    }
  },
  // 左侧一级分类点击事件
  handleItemTap(e){
    //console.log(e);
    // 获取点击的索引
    const index = e.currentTarget.dataset.index
    // 根据索引和后端返回的完整数据设置左侧菜单的数据
    let rightMenuData = this.data.CatesData[index].childs.map(v=>v.name)
    this.setData({
      // 修改当前的激活索引
      activeIndex: index,
      // 修改右侧的数据
      rightMenuList: rightMenuData
    })
  }

  
})