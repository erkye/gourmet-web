// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户信息
    userInfo: {},
    // 用户是否登录
    isLogin:false
  },
  onShow(){
    // 从缓存中获取
    const userInfo = wx.getStorageSync('userinfo')
    // 对象判空不可以直接使用 === null来判断
    if(Object.keys(userInfo) != 0){
      // 设置用户信息 修改用户登录状态
      this.setData({
        userInfo,
        isLogin: true
      })
    }else{
      // 没有获取到用户信息
      this.setData({
        isLogin:false
      })
    }
    
  }

  
})