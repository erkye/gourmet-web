import { http, serverIp } from "../../resquent/http";

Page({
  data: {
    // 菜谱id ,新发布是为-1 ，编辑菜谱是为菜谱的真实id
    id: -1,
    // 标题
    title: "",
    // 简介
    introd: "",
    // 封面
    img: "",
    // 用户昵称
    nickName: '',
    // 是否推荐
    recommend:false,
    // 内容
    content:'',
    /* 材料部分需要的数据 */
    /* 材料列表 */
    materialsList: [
      // 格式如下
      /* {
        name: "猪肉",
        quantity: "1斤",
      }, */
    ],

    /* 下面时富文本编辑器需要的数据 */
    formats: {},
    readOnly: false,
    placeholder: "请输入菜谱的步骤~",
    editorHeight: 800,
    keyboardHeight: 0,
    isIOS: false,
  },
  /* 用户点击选择封面 */
  handleSelectImage() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: function (res) {
        /* 上传图片到服务器 */
        wx.uploadFile({
          url: serverIp + "/img/upload",
          filePath: res.tempFilePaths[0],
          name: "pic",
          formData: {},
          success: (result) => {
            const data = JSON.parse(result.data);
            /* 成功上传 */
            if (data.code === 1000) {
              /* 获取该图片的url */
              const url = data.data;
              // 设置封面图片的url
              that.setData({
                img: url,
              });
            }
          },
          fail: () => {
            wx.showToast({
              title: "图片上传失败",
              icon: "none",
              duration: 1000,
            });
          },
          complete: () => {},
        });
      },
    });
    /* wx.showActionSheet({
      itemList: ['相机', '选择图片'],
      success (res) {
        console.log(res.tapIndex)
      },
      fail (res) {
        console.log(res.errMsg)
      }
    }) */
  },
  /* 点击菜谱材料中的添加按钮处理的事件 */
  handleMaterialsAdd() {
    /* 创建一个空的材料的对象 */
    const newItem = {
      name: "",
      quantity: "",
    };
    /* 获取data中材料的列表 */
    let newList = this.data.materialsList;
    /* 将新的空列表添加进去 */
    newList.push(newItem);
    /* 将data中的材料列表数组的值更新为新的添加空元素的值 */
    this.setData({
      materialsList: newList,
    });
  },
  /* 点击菜谱材料中每一项的删除按钮的处理事件 */
  handleMaterialsDel(e) {
    /* 获取点击的索引 */
    const index = e.currentTarget.dataset.index;
    /* 获取data中的材料列表数组 */
    let newList = this.data.materialsList;
    /* 删除点击索引位置的数据 */
    newList.splice(index, 1);
    /* 更新数据 */
    this.setData({
      materialsList: newList,
    });
  },
  /* 材料名称输入框失去焦点时触发事件 */
  handleUpdateMaterialsName(e) {
    /* 获取输入框中的值 */
    const name = e.detail.value;
    /* 获取组件中携带的数据索引 */
    const index = e.currentTarget.dataset.index;
    /* 获取data中的材料列表数组 */
    let newList = this.data.materialsList;
    /* 修改对应索引的name值 */
    newList[index].name = name;
    /* 更新数据 */
    this.setData({
      materialsList: newList,
    });
  },
  handleUpdateMaterialsQuantity(e) {
    /* 获取输入框中的值 */
    const quantity = e.detail.value;
    /* 获取组件中携带的数据索引 */
    const index = e.currentTarget.dataset.index;
    /* 获取data中的材料列表数组 */
    let newList = this.data.materialsList;
    /* 修改对应索引的name值 */
    newList[index].quantity = quantity;
    /* 更新数据 */
    this.setData({
      materialsList: newList,
    });
  },
  /* 点击发布按钮 */
  async handelPublish() {
    if(this.data.title.trim()===''){
      this.showTip('标题不能为空！')
      return;
    }
    if(this.data.introd.trim()===''){
      this.showTip('简介不能为空！')
      return;
    }
    if(this.data.img.trim()===''){
      this.showTip('请选择封面！')
      return;
    }

    const {html:steps,text} = await this.editorCtx.getContents()
    if(text.trim()===''){
      this.showTip('步骤不能为空！')
      return;
    }


    let params = {
      title: this.data.title,
      introd: this.data.introd,
      img:this.data.img,
      nickname:this.data.nickName,
      materials:this.data.materialsList,
      content:steps
    }
    if(this.data.id === -1){
      // 新发布菜谱，菜谱的id为-1，走发布逻辑
      const {data:response} = await http.post('/menu/publish',params)
      if(response.code === 1000){
        if(response.data === 'ok'){
          /* 发布成功跳转到我的发布页面 */
          this.showTip('发布成功')
          wx.redirectTo({url:'/pages/mypublish/mypublish'})
          return;
        }
      }
  
      this.showTip('发布失败，请重试')
    }else{
      // 菜谱的id不为-1，编辑菜谱 走更新逻辑
      // 传递的参数中添加id
      params = {
        ...params,
        id: this.data.id,
        recommend:this.data.recommend
      }
      const {data:response} = await http.post('/menu/update',params)
      console.log(response);
      if(response.code === 1000){
        if(response.data){
          /* 发布成功跳转到我的发布页面 */
          this.showTip('修改成功')
          wx.redirectTo({url:'/pages/mypublish/mypublish'})
          return;
        }
      }
      this.showTip('编辑失败，请重试')

    }

    
    
  },

  /* 显示输入合法的提示 */
  showTip(tip){
    wx.showToast({
      title: tip,
      icon: 'none',
      duration: 1000
    })
  },

  /* 下面是富文本编辑器需要的方法 */
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly,
    });
  },
  // 编辑菜谱是获取菜谱的信息
  async getMenuContent(){
    // 请求参数
    const params = {
      id:this.data.id
    }
    // 请求菜谱的数据
    const { data: menuResponse } = await http.get("/menu/query", { params });
    if (menuResponse.code === 1000) {
      const menu  = menuResponse.data
      // 设置返回菜谱数据
      this.setData({
        title: menu.title,
        introd:menu.introd,
        img:menu.img,
        nickname:menu.nickName,
        recommend:menu.recommend,
        content:menu.content
      });
      // TODO 设置菜谱的内容 不妥 有概率出现富文本还未初始化就赋值
      // 啊啊啊  很🐕的办法，当赋值时富文本编辑器还未初始化时，等2秒再次尝试
       try{
          this.editorCtx.setContents({html:menu.content})
          console.log("1111");
       }catch(e){
        setTimeout(()=>{this.editorCtx.setContents({html:menu.content})},2000)
       }
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
  onLoad(option) {
     // 从缓存中获取
     const userInfo = wx.getStorageSync('userinfo')
     // 对象判空不可以直接使用 === null来判断
     if(Object.keys(userInfo) != 0){
       // 设置用户信息 修改用户登录状态
       this.setData({
        nickName: userInfo.nickName
       })
     }else{
       // 用户未登录 先登录
       wx.navigateTo({
         url: '/pages/login/login'
       });
     }

     // 获取我的发布页面编辑菜谱时传递过来的菜谱id
     const menuId = option.menuId
     if(menuId){
       // 有menuId参数时 表示编辑菜谱
       this.setData({
         id:menuId
       })
       // 获取菜谱信息
       this.getMenuContent()
     }

    const platform = wx.getSystemInfoSync().platform;
    const isIOS = platform === "ios";
    this.setData({ isIOS });
    const that = this;
    this.updatePosition(0);
    let keyboardHeight = 0;
    wx.onKeyboardHeightChange((res) => {
      if (res.height === keyboardHeight) return;
      const duration = res.height > 0 ? res.duration * 1000 : 0;
      keyboardHeight = res.height;
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight);
            that.editorCtx.scrollIntoView();
          },
        });
      }, duration);
    });
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50;
    const { windowHeight, platform } = wx.getSystemInfoSync();
    let editorHeight =
      keyboardHeight > 0
        ? windowHeight - keyboardHeight - toolbarHeight
        : windowHeight;
    this.setData({ editorHeight, keyboardHeight });
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync();
    const { statusBarHeight, platform } = systemInfo;
    const isIOS = platform === "ios";
    const navigationBarHeight = isIOS ? 44 : 48;
    return statusBarHeight + navigationBarHeight;
  },
  onEditorReady() {
    const that = this;
    wx.createSelectorQuery()
      .select("#editor")
      .context(function (res) {
        that.editorCtx = res.context;
      })
      .exec();
  },
  blur() {
    this.editorCtx.blur();
  },
  format(e) {
    let { name, value } = e.target.dataset;
    if (!name) return;
    // console.log('format', name, value)
    this.editorCtx.format(name, value);
  },
  onStatusChange(e) {
    const formats = e.detail;
    this.setData({ formats });
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log("insert divider success");
      },
    });
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success");
      },
    });
  },
  removeFormat() {
    this.editorCtx.removeFormat();
  },
  insertDate() {
    const date = new Date();
    const formatDate = `${date.getFullYear()}/${
      date.getMonth() + 1
    }/${date.getDate()}`;
    this.editorCtx.insertText({
      text: formatDate,
    });
  },
  insertImage() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: function (res) {
        /* 上传图片到服务器 */
        wx.uploadFile({
          url: serverIp + "/img/upload",
          filePath: res.tempFilePaths[0],
          name: "pic",
          formData: {},
          success: (result) => {
            const data = JSON.parse(result.data);
            /* 成功上传 */
            if (data.code === 1000) {
              /* 获取该图片的url */
              const url = data.data;
              that.editorCtx.insertImage({
                /* 替换imgage标签的src属性 */
                src: url,
                data: {
                  id: "abcd",
                  role: "god",
                },
                width: "80%",
                success: function () {
                  /* 提示用户上传成功 */
                  wx.showToast({
                    title: "图片上传成功",
                    icon: "success",
                    duration: 1000,
                  });
                },
              });
            }
          },
          fail: () => {
            wx.showToast({
              title: "图片上传失败",
              icon: "none",
              duration: 1000,
            });
          },
          complete: () => {},
        });
      },
    });
  },
});
