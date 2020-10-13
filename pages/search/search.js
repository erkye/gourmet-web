// pages/search/search.js
// 引用封装的请求接口
import http from '../../resquent/http'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户输入的搜索内容
    searchValue: ''
  },
  // 用户点击搜索按钮
  async tapSearch(){
    console.log(this.data.searchValue);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  
})