// pages/search/search.js
// 引用封装的请求接口
import http from '../../resquent/http'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户输入的搜索内容
    searchValue: '',
    pageNo: 1,
    pageSize: 10,
    //是否还有下一页
    hasNextPage: true,
    // 查询到的数组
    menuList: []
  },
  // 用户点击搜索按钮
  async tapSearch(){
    //console.log(this.data.searchValue);
    // 查询参数
    const params = {
      'key' : this.data.searchValue,
      'pageNo': this.data.pageNo,
      'pageSize': this.data.pageSize
    }

    const {data:response} = await http.get('/index/search',{params:params})
    console.log(response);

    if(response.code === 1000){
      this.setData({
        // 追加数据
        menuList: [...this.data.menuList,...response.data.list],
        // 修改是否还有下一页
        hasNextPage: response.data.hasNextPage
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 页面触底函数
  onReachBottom:function() {
    if(this.data.hasNextPage){
      this.setData({
        // 页数+1
        pageNo: this.data.pageNo+1
      })
      // 发起请求
      this.tapSearch()
    }else{
      wx.showToast({
        title: '已经到底了' ,
        icon: 'none'  
      });
    }
  }

  
})