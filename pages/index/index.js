//index.js
//获取应用实例
const app = getApp();

// 引用封装的请求接口
import { http } from "../../resquent/http";

Page({
  data: {
    // 滑动视图的数据
    swiperData: [],
    // 最新佳作的数据
    latestMenu: [],
    //获取最新佳作时需要向后台传递的参数
    latestParams: {
      // 当前页码
      pageNo: 1,
      // 每页大小
      pageSize: 5,
      //是否还有下一页
      hasNextPage: true,
    },
  },

  // 获取滑动视图的数据
  async getSwipperData() {
    // 从后端获取数据
    const { data: response } = await http.get("/index/recommend");
    //console.log(response)
    // 获取数据成功
    if (response.code === 1000) {
      // 设置滑动视图的数据
      this.setData({ swiperData: response.data });
    }
  },

  // 分页获取
  async getLatestMenuData() {
    // 后端请求数据 get传参方式如下：
    const { data: response } = await http.get("/index/latest", {
      params: this.data.latestParams,
    });
    // console.log(response);
    if (response.code === 1000) {
      // 追加最新佳作的数据
      // ...是展开符号，可以数组或者对象展开

      this.setData({
        // 这里使用... 将原数组和新获得的数组数据展开，创建为一个新的数组
        latestMenu: [...this.data.latestMenu, ...response.data.list],
        // 使用setData赋值一个对象时，需要将其所有的属性都重新写一遍，否则对象会被覆盖为只有指定属性的对象
        latestParams: {
          // 将原对象展开
          ...this.data.latestParams,
          // 修改原对象的某一属性
          hasNextPage: response.data.hasNextPage,
        },
      });
    }
    console.log(this.data.latestMenu);
  },
  /* 下拉加载 */
  onPullDownRefresh() {
    /* 显示加载图标 */
    wx.showNavigationBarLoading(); 
    /* 先将原来数据清空 */
    this.setData({
      swiperData:[],
      latestMenu:[]
    })
    // 获取滑动视图的数据
    this.getSwipperData();
    // 获取本周佳作的数据
    this.getLatestMenuData();
    // 隐藏加载图标
    wx.stopPullDownRefresh();

  },

  onLoad: function () {
    // 获取滑动视图的数据
    this.getSwipperData();
    // 获取本周佳作的数据
    this.getLatestMenuData();
  },
  // 页面触底函数
  onReachBottom: function () {
    // 如果还有下一页
    if (this.data.latestParams.hasNextPage) {
      this.setData({
        latestParams: {
          // 将原对象展开
          ...this.data.latestParams,
          // 设置请求页面+1
          pageNo: this.data.latestParams.pageNo + 1,
        },
      });
      // 发起请求
      this.getLatestMenuData();
    } else {
      // 没有下一页了
      wx.showToast({
        title: "已经到底了",
        icon: "none",
      });
    }
  },
});
