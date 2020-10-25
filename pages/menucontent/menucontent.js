// 引用封装的请求接口
import { http } from "../../resquent/http";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 菜谱
    menuItem: {},
    // 用料数组
    materialsList: [],
    // 用户昵称
    nickName: "",
  },
  // 用户点击收藏菜谱
  async handleStarMeun() {
    /* 先确保用户已经登录 */
    // 从缓存中获取
    const userInfo = wx.getStorageSync("userinfo");
    // 对象判空不可以直接使用 === null来判断
    if (Object.keys(userInfo) != 0) {
      // 设置用户信息 修改用户登录状态
      this.setData({
        nickName: userInfo.nickName,
      });
    } else {
      // 用户未登录 先登录
      wx.navigateTo({
        url: "/pages/login/login",
      });
    }

    const params = {
      nickName: this.data.nickName,
      menuId: this.data.menuItem.id
    };

    const { data: response } = await http.get("/menu/star",{params})
    if(response.code === 1000){
      if(response.data){
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 2000
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 从缓存中获取
    const userInfo = wx.getStorageSync("userinfo");
    // 对象判空不可以直接使用 === null来判断
    if (Object.keys(userInfo) != 0) {
      // 设置用户信息 修改用户登录状态
      this.setData({
        nickName: userInfo.nickName,
      });
    }


    const id = options.id;
    this.getMenuData(id);
  },
  async getMenuData(id) {
    const params = {
      id,
    };
    const { data: menuResponse } = await http.get("/menu/query", { params });
    if (menuResponse.code === 1000) {
      this.setData({
        menuItem: menuResponse.data,
      });
    }
    const { data: materialsResponse } = await http.get("/menu/materials", {
      params,
    });
    if (materialsResponse.code === 1000) {
      this.setData({
        materialsList: materialsResponse.data,
      });
    }
  },
});
