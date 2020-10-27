// pages/login/login.js
Page({

  /* 点击登录按钮触发的函数 因为按钮类型为 open-type="getUserInfo" 会将用户的信息存放在该登录按钮的detail中 */
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