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

    // 请求参数
    const params = {
      nickName: this.data.nickName,
      menuId: this.data.menuItem.id
    };

    /* 发起请求 */
    const { data: response } = await http.get("/menu/star",{params})
    if(response.code === 1000){
      // 收藏成功后会返回true
      if(response.data){
        /* 提示用户收藏成功 */
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 2000
        })
        return
      }
    }
    /* 否则提示用户收藏失败 */
    wx.showToast({
      title: '收藏失败',
      icon: 'none',
      duration: 2000
    })

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

    /* 获取其他页面条状到该页面时携带的菜谱id参数 */
    const id = options.id;
    /* 使用菜谱id获取菜谱额数据 */
    this.getMenuData(id);
  },
  /* 根据菜谱的id获取菜谱相关的数据 */
  async getMenuData(id) {
    // 请求参数
    const params = {
      id
    }
    // 请求菜谱的数据
    const { data: menuResponse } = await http.get("/menu/query", { params });
    if (menuResponse.code === 1000) {
      // 设置返回菜谱数据
      this.setData({
        menuItem: menuResponse.data,
      });
    }
    // 请求菜谱材料列表的数据
    const { data: materialsResponse } = await http.get("/menu/materials", {params});
    if (materialsResponse.code === 1000) {
      // 设置材料列表
      this.setData({
        materialsList: materialsResponse.data,
      });
    }
  },
});
