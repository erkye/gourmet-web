// 引用封装的请求接口
import {http} from '../../resquent/http'
import {simplifyStr} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 查询到的数组
    menuList: [],
    // 用户昵称
    nickName: ''
  },

  /**
   * 获取用户收藏的列表
   */
  async getMyStarList(){
    const params = {
      nickName : this.data.nickName
    }

    const {data:response} = await http.get('/mine/star',{params})
    console.log(response);
    if(response.code === 1000){
      // 简化简介部分 太长了就用... 代替
      response.data.map(item => {item.introd = simplifyStr(item.introd)})
      this.setData({
        menuList:response.data
      })
    }
  },
  // 用户长按某一菜谱时触发
  handleLongPress(e){
    // 用户长按的菜谱id
    const menuId = e.currentTarget.dataset.id
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否确认取消收藏该菜谱？',
      success (res) {
        if (res.confirm) {
          // 调用取消收藏
          const result = that.cancelStar(menuId)
          if(result){
            // 删除成功
            that.showToast('取消收藏成功')
          }else{
            // 删除失败
            that.showToast('取消收藏失败')
          }
        } else if (res.cancel) {
        }
      }
    })
  },
  // 取消收藏
  async cancelStar(menuId){
    const params = {
      menuId,
      nickName:this.data.nickName
    }

    const {data:response} = await http.get('/mine/cancelStar',{params})
    console.log(response);
    if(response.code === 1000){
      if(response.data)// 刷新列表
            this.getMyStarList()
      return response.data
    }

    return false

  },
  // 展示提示
  showToast(title){
    wx.showToast({
      title,
      icon: 'none',
      duration: 2000
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    const userinfo = wx.getStorageSync("userinfo")
    const nickName = userinfo.nickName
    this.setData({
      nickName
    })

    // 查找用户收藏列表
    this.getMyStarList()
  },

 
})