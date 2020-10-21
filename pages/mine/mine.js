// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户信息
    userInfo: {}
  },
  onShow(){
    // 从缓存中获取
    const userInfo = wx.getStorageSync('userinfo')
    this.setData({
      userInfo
    })
  }

  
})