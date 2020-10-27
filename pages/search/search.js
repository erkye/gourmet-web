// pages/search/search.js
// 引用封装的请求接口
import {http} from '../../resquent/http'
import {simplifyStr}  from '../../utils/util'
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
  // 获取数据 isTapSearchFlag 用来标记是点击搜索按钮触发的还是页面触底函数触发的搜索
  // 如果是搜索按钮触发的函数 不应该是以追加的方式添加新的数据
  // 如果是页面触底函数触发的，表示获取下一页的数据 应该在原来数组的基础上进行追加数据
  async getSearchList(isTapSearchFlag){
    //console.log(this.data.searchValue);
    // 查询参数
    const params = {
      'key' : this.data.searchValue,
      'pageNo': this.data.pageNo,
      'pageSize': this.data.pageSize
    }

    const {data:response} = await http.get('/search/query',{params:params})
    console.log(response);

    if(response.code === 1000){
      // 标题简化简介部分 太长了就用... 代替
      response.data.list.map(item => {
        item.introd = simplifyStr(item.introd,8);
        item.title = simplifyStr(item.title,7)
      })
      // 新的搜索结果列表
      let newList = []
      if(isTapSearchFlag){
        // 如果是搜索函数触发 不用追加数据
        newList = response.data.list
      }else{
        // 如果是由触底函数触发 追加数据
        newList = [...this.data.menuList,...response.data.list]
      }
      this.setData({
        // 追加数据
        menuList: newList,
        // 修改是否还有下一页
        hasNextPage: response.data.hasNextPage
      })
    }

  },
  // 点击搜索按钮触发
  tapSearch(){
    // 调用获取数据的函数 传递参数表示是点击搜索按钮调用的
    this.getSearchList(true)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 获取从分类页面传递的key
    const key = options.key
    this.setData({
      searchValue: key
    })

    // 当页面参数中有传递的值时直接触发搜索点击事件
    if(key != null && key != ''){
      this.getSearchList(true)
    }
    

  },
  // 页面触底函数
  onReachBottom:function() {
    if(this.data.hasNextPage){
      this.setData({
        // 页数+1
        pageNo: this.data.pageNo+1
      })
      // 发起请求 传递参数false 表示不是点击搜索按钮调用的函数 而是页面触底函数发生的调用
      this.getSearchList(false)
    }else{
      wx.showToast({
        title: '已经到底了' ,
        icon: 'none'  
      });
    }
  }

  
})