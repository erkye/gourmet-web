// 引用封装的请求接口
import {http} from '../../resquent/http'
import {simplifyStr} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 查询到菜谱数组
    menuList: [],
    // 用户昵称
    nickName: ''
  },

  /**
   * 获取用户收藏的列表
   */
  async getMyStarList(){
    /* 查询参数 用户昵称 */
    const params = {
      nickName : this.data.nickName
    }

    /* 发起请求 */
    const {data:response} = await http.get('/mine/star',{params})
    console.log(response);
    if(response.code === 1000){
      // 标题简介部分 太长了就用... 代替
      response.data.map(item => {
        /* 简介最多为8个字符 */
        item.introd = simplifyStr(item.introd,8);
        /* 标题最多为7个字符 */
        item.title = simplifyStr(item.title,7)
      })
      /* 设置数据 */
      this.setData({
        menuList:response.data
      })
    }
  },
  // 用户长按某一菜谱时触发
  handleLongPress(e){
    // 用户长按的菜谱id
    const menuId = e.currentTarget.dataset.id
    /* 在下面的回调函数中使用原来的this时改为that */
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
    /* 请求参数 */
    const params = {
      menuId,
      nickName:this.data.nickName
    }

    /* 发起请求 */
    const {data:response} = await http.get('/mine/cancelStar',{params})
    console.log(response);
    if(response.code === 1000){
      if(response.data)// 成功取消收藏刷新列表
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
    /* 获取设置用户昵称 */
    const nickName = userinfo.nickName
    this.setData({
      nickName
    })

    // 查找用户收藏列表
    this.getMyStarList()
  },

 
})