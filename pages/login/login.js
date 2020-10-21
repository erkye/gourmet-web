// pages/login/login.js
Page({

  handleGetUserInfo(e){
    //console.log(e);
    const {userInfo} = e.detail
    // 用户登录信息保存到缓存中
    wx.setStorage({
      key: 'userinfo',
      data: userInfo
    })
    // 返回上一个页面
    wx.navigateBack({
      delta: 1
    })
  }

  
})