// 引用封装的请求接口
import {http} from '../../resquent/http' 
/* 引用工具类的 */
import {simplifyStr} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 查询到的数组
    menuList: [],
    // 用户昵称
    nickName: ''
  },

  /**
   * 获取用户发布的列表
   */
  async getMyPublishList(){
    /* 请求参数 */
    const params = {
      /* 用户昵称 */
      nickName : this.data.nickName
    }
    /* 发起请求 */
    const {data:response} = await http.get('/mine/publish',{params})
    console.log(response);
    if(response.code === 1000){
      // 标题和简介部分 太长了就用... 代替，否则会产生样式问题
      response.data.map(item => {
        /* 处理简介 只保留8个字符 */
        item.introd = simplifyStr(item.introd,8);
        /* 处理标题 只保留7个字符*/
        item.title = simplifyStr(item.title,7)
      })
      /* 设置菜谱列表 */
      this.setData({
        menuList:response.data
      })
    }
  },
  // 用户长按某一菜谱时触发
  handleLongPress(e){
    // 用户长按的菜谱id
    const menuId = e.currentTarget.dataset.id
    /* 下面在回调函数中使用原来this的方法时改用that */
    let that = this
    /* 展示下方功能选择框 */
    wx.showActionSheet({
      itemList: ['删除', '编辑'],
      success (res) {
        console.log(res.tapIndex)
        // 根据索引判断用户点击的那个选项
        if(res.tapIndex === 0){
          // 执行删除询问
          wx.showModal({
            title: '提示',
            content: '确认删除您发布的该菜谱吗？',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                // 用户选择确认删除，调用删除方法
                that.deletePublishMenu(menuId)
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }else{
          // 执行编辑逻辑
          // 携带菜谱的id跳转到菜谱编辑页面
          // 跳转的目标页时tabbar里面的 要用reLaunch
          wx.reLaunch({
            url: '/pages/publish/publish?menuId='+menuId
          });
        }
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  },
  // 删除发布的菜谱
  async deletePublishMenu(menuId){
    /* 请求参数 */
    const params = {
      /* 菜谱id */
      menuId
    }
    /* 发起请求 */
    const {data:response} = await http.get('/mine/deletePublish',{params})

    if(response.code === 1000){
      /* 删除成功data为true */
      if(response.data){
        /* 展示成功提示 */
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000
        })
        // 刷新列表
        this.getMyPublishList()
        return
      }
    }

    wx.showToast({
      title: '删除失败',
      icon: 'none',
      duration: 2000
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    const userinfo = wx.getStorageSync("userinfo")
    /* 获取并设置用户名 */
    const nickName = userinfo.nickName
    this.setData({
      nickName
    })

    // 查找用户发布列表
    this.getMyPublishList()
  },

 
})