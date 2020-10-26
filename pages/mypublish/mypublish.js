// 引用封装的请求接口
import {http} from '../../resquent/http'
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
    const params = {
      nickName : this.data.nickName
    }

    const {data:response} = await http.get('/mine/publish',{params})
    console.log(response);
    if(response.code === 1000){
      // 简化简介部分 太长了就用... 代替
      response.data.map(item => {item.introd = simplifyStr(item.introd)})
      this.setData({
        menuList:response.data
      })
    }
  },
  // 用户长按某一菜谱时触发
  handleLongPress(e){
    // 用户长按的菜谱id
    const menuId = e.currentTarget.dataset.id
    let that = this
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
    const params = {
      menuId
    }
    const {data:response} = await http.get('/mine/deletePublish',{params})

    if(response.code === 1000){
      if(response.data){
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
  // 展示提示
  showToast(title){
    wx.showToast({
      title,
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
    const nickName = userinfo.nickName
    this.setData({
      nickName
    })

    // 查找用户发布列表
    this.getMyPublishList()
  },

 
})