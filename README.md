# 菜谱分享小程序开发文档

## 如何运行

### 后端运行

克隆项目之后，打开IDEA或者Ecplise，导入Maven项目（前提，本地已经安装JDK，Maven），运行Main方法即可

### 微信小程序端运行

前提：本地机器安装了Node.js

克隆完前端微信小程序的项目之后，导入到微信小程序开发者工具，修改为自己的AppId（必须）

![image-20201118102320903](https://gitee.com//lifazhan/mypics/raw/master/img/20201118102328.png)

设置不校验合法域名

![image-20201118102410986](https://gitee.com//lifazhan/mypics/raw/master/img/20201118102411.png)



构建npm

![image-20201118102524615](https://gitee.com//lifazhan/mypics/raw/master/img/20201118102524.png)

等待构建完成即可运行

默认请求的后端地址是我的服务器地址，随时可能会无法请求，如果出现构建完成页面中没有数据的情况，请在本地创建数据库，并启动本地的后端项目，并将微信小程序项目中的resquest/http.js 里面的请求地址修改为本地地址

```js
const serverIp = "http://127.0.0.1:3000/api"
```

![image-20201118103126637](https://gitee.com//lifazhan/mypics/raw/master/img/20201118103126.png)

## 项目概览

项目分为前端（微信小程序端）和后端项目，前端项目名称为 [gourmet-web](https://gitee.com/lifazhan/gourmet-web)，后端项目名称为 [gourmet-api](https://gitee.com/lifazhan/gourmet-api)。

项目结构为前后端分离结构，前后端使用json格式进行交互。

数据库使用MySQL 8.0。

### 开发环境

#### 微信小程序端

* 开发工具：微信开发者工具、Visual Studio Code

* 使用webpack管理项目
* 微信小程序端使用原生开发框架
* 使用npm管理项目依赖
* 项目开发的所有图标资源均使用[阿里巴巴矢量图库](https://www.iconfont.cn/)
* 使用axios发起服务端请求
* 调试基本库选择2.13.1
* 使用git进行版本控制

#### 服务端

* 开发语言：Java
* 开发工具：IntelliJ IDEA
* 主要框架：Spring Boot 、MyBatis
* 使用Maven管理项目
* 使用git对项目进行版本控制

#### 数据库

* 数据库类型：MySQL 8.0
* 统一字符编码：utf8mb4
* 数据库管理工具：Navicat Premium

#### 服务器

* 腾讯云服务器：1核1GB 带宽1M
* 系统：CentOS 7.5
* JDK版本：JDK8
* 管理工具：XShell、Xftp

## 数据库

**表概览**（6）

* 菜谱主表
* 用料表
* 菜谱浏览记录表
* 分类表（两级或三级分类）
* 用户表
* 用户收藏表

**表详细**

* 菜谱主表（gourmet_menu）

  | 字段名    | 类型    | 备注                     |
  | --------- | ------- | ------------------------ |
  | id        | int     | 主键，自增               |
  | img       | varchar | 菜谱图片url              |
  | title     | varchar | 菜谱标题                 |
  | introd    | varchar | 菜谱简介                 |
  | content   | text    | 菜谱内容（html）         |
  | nickname  | varchar | 作者昵称                 |
  | recommend | tinyint | 是否是推荐（首页轮播图） |

* 用料表（gourmet_materials）

  | 字段名   | 类型    | 备注                 |
  | -------- | ------- | -------------------- |
  | id       | int     | 主键，自增           |
  | menu_id  | int     | 外键（菜谱主表的id） |
  | name     | varchar | 材料名称             |
  | quantity | varchar | 用量                 |

* 菜谱浏览记录表（gourmet_menu_scan）

  | 字段名    | 类型 | 备注                 |
  | --------- | ---- | -------------------- |
  | id        | int  | 主键，自增           |
  | menu_id   | int  | 外键（菜谱主表的id） |
  | pageviews | int  | 浏览量               |
  | favorites | int  | 收藏量               |

* 分类表（gourmet_classify）

  | 字段名    | 类型    | 备注       |
  | --------- | ------- | ---------- |
  | id        | int     | 主键，自增 |
  | name      | varchar | 分类名称   |
  | parent_id | int     | 父级分类id |

* 用户表（gourmet_user）（**这个表写着写着发现好像没啥用...**）

  | 字段名    | 类型    | 备注       |
  | --------- | ------- | ---------- |
  | id        | int     | 主键，自增 |
  | nick_name | varchar | 用户昵称   |

* 用户收藏表（gourmet_star）

  | 字段名  | 类型 | 备注                         |
  | ------- | ---- | ---------------------------- |
  | user_id | int  | 双主键，用户表外键，用户表id |
  | menu_id | int  | 双主键，菜谱表外键，菜谱表id |

### 数据库创建

**数据库和服务端项目均部署到服务器上，无需创建数据库！！！**

![image-20201008191326317](https://gitee.com//lifazhan/mypics/raw/master/img/20201008191335.png)

**数据库名称：gourmet**

**字符集：utf8mb4**

**排序规则：utf8mb4_general_ci**



**数据库创建SQL语句**

* ​	用户表 gourmet_user

  ```sql
  CREATE TABLE `gourmet_user` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
    `nick_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户昵称',
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  ```

* 菜谱表 gourmet_menu

  ```sql
  CREATE TABLE `gourmet_menu` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
    `img` varchar(255) COLLATE utf8mb4_general_ci NOT NULL COMMENT '菜谱图片url',
    `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL COMMENT '菜谱标题',
    `introd` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '菜谱简介',
    `content` text COLLATE utf8mb4_general_ci NOT NULL COMMENT '菜谱内容（html）',
    `nickname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL COMMENT '作者昵称',
    `recommend` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否是推荐（首页轮播图）',
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  ```

* 分类表 gourmet_classify

  ```sql
  CREATE TABLE `gourmet_classify` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
    `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL COMMENT '分类名称',
    `parent_id` int(10) unsigned DEFAULT '0' COMMENT '父级分类id',
    PRIMARY KEY (`id`),
    KEY `fore_parentid` (`parent_id`)
  ) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  ```

* 材料表 gourmet_materials

  ```sql
  CREATE TABLE `gourmet_materials` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
    `menu_id` int(11) unsigned NOT NULL COMMENT '外键（菜谱主表的id）',
    `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL COMMENT '材料名称',
    `quantity` varchar(255) COLLATE utf8mb4_general_ci NOT NULL COMMENT '用量',
    PRIMARY KEY (`id`),
    KEY `fk_menu_materials` (`menu_id`),
    CONSTRAINT `fk_menu_materials` FOREIGN KEY (`menu_id`) REFERENCES `gourmet_menu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  ```

* 菜谱浏览记录表 gourmet_menu_scan

  ```sql
  CREATE TABLE `gourmet_menu_scan` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
    `menu_id` int(10) unsigned NOT NULL COMMENT '外键（菜谱主表的id）',
    `pageviews` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '浏览量',
    `favorites` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '收藏量',
    PRIMARY KEY (`id`),
    KEY `fk_menu_scan` (`menu_id`),
    CONSTRAINT `fk_menu_scan` FOREIGN KEY (`menu_id`) REFERENCES `gourmet_menu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
  ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  ```

## 前后端交互

#### 统一使用axios

**使用方式：**

**下面也是写报告用的，无需执行**

* 使用npm安装，目录下要有package.json，没有的话执行下面命令

  ```
  npm init
  ```

* 安装axios

  ```
  npm i axios axios-miniprogram-adapter
  ```

* 微信开发者工具点击：工具--构建npm，项目中出现miniprogram_npm文件夹表示构建成功！！

#### 写为工具类

使用axios可以极大的简化后端发起请求的方式，一般情况下服务器的请求地址有一部分时重复的（ip地址端口），如果每个页面都去创建axios对象，设置请求地址的话开发效率非常低下，因此项目中将axios封装到工具类中，需要发起请求的页面仅需要引入工具类即可！

在**resquest**目录下创建了一个**http.js** 文件，抽离出创建axios实例的方法，使用页面直接引用此文件即可使用axios

```js
import axios from 'axios'
import mpAdapter from 'axios-miniprogram-adapter'
axios.defaults.adapter = mpAdapter

// 服务器的地址 这部分请求地址都是一样的 所以提取出来
const serverIp = "http://150.158.174.106:3000/api"
// 构建axios实例
const http = axios.create({
  // 设置axios对象的基本请求地址
  baseURL: serverIp

})

// 导出实例
module.exports = {http,serverIp} 
```

**注意：小程序调试基本库需要设置为较新的版本（此处设置为 2.13.1）**

使用：

```js
// 导入刚才的工具类
import {http} from '../../resquent/http'
```

请求示例：

```js
// 获取滑动视图的数据
// async 凡是方法内有await的，方法必须声明为async 表示这是一个含有同步代码的方法
  async getSwipperData(){
    // await 因为请求都是需要时间的，而js又是异步的，也就是说下面两行代码不一行谁先执行，为了保证response已经获取到
    //  使用await修饰可以保证下面的代码必须等待执行完获到数据才能使用
    const {data:response} = await http.get('/menu/recommend')
    console.log(response)
  }
```

此处使用了 ES7 的 async/await 语法来获取异步请求的数据，小程序较新的调试基本库支持 ES7（ES7 转 ES5） 语法，{data:response} 作用是将响应数据对象中data属性映射为response

**理解**

* async 这个方法被同步了

* await 必须等我执行完

* {data:response} 返回的对象里有一个叫data的属性，我用个response接收一下 等同于下面代码

  ```js
  const res = await http.get('/menu/recommend')
  const response = res.data
  ```

  

## 资源

#### 图标资源

![image-20201028194735441](https://gitee.com//lifazhan/mypics/raw/master/img/20201028194742.png)

**使用**

* 官网挑选完图标后生成css代码，粘贴下面文件中

![image-20201012205050567](https://gitee.com//lifazhan/mypics/raw/master/img/20201012205050.png)

* 需要使用的页面在其css文件中引入

![image-20201012205129021](https://gitee.com//lifazhan/mypics/raw/master/img/20201012205129.png)

* 在html中使用text标签或者view标签，class写为“iconfont icon-user”即可，其中iconfont 必须有，icon-user对应要使用图标

![image-20201012205213405](https://gitee.com//lifazhan/mypics/raw/master/img/20201012205213.png)

* 效果

![image-20201028195230705](https://gitee.com//lifazhan/mypics/raw/master/img/20201028195230.png)

## 分页面介绍（重点）

### 首页

#### 布局

![image-20201028202343282](https://gitee.com//lifazhan/mypics/raw/master/img/20201028202343.png)

首页主要分为四个区域，分别为**搜索栏，推荐视图区域、常用分类区域，最新佳作列表区域**。

#### 分区域介绍

##### 搜索栏

![image-20201029123526129](https://gitee.com//lifazhan/mypics/raw/master/img/20201029123533.png)

搜索栏在首页和分类页面都有，因此将搜索栏提取出来为一个组件。位于components/serchInput 目录下

![image-20201028202729560](https://gitee.com//lifazhan/mypics/raw/master/img/20201028202729.png)

**searchInput.json配置文件**

```json
{
  "component": true,
  "usingComponents": {}
}
```

"component": true 表示当前页面文件时一个组件，而不是普通的微信小程序页面

*"usingComponents"*: {} 如果使用其他组件在{}中引入



**searchInput.wxml 页面文件**

```html
<!--搜索框-->
<view class="search-view">
  <navigator class="search-input" url="/pages/search/search" hover-class="navigator-hover" open-type="navigate">
    🔍 搜索
  </navigator>
</view>

```

此处的搜索栏并非是一个真正的输入框，而是用了一个navigator标签代替，通过css样式改成搜索框的模样，点击时会跳转到真正的搜索页

**searchInput.wxss 样式文件**

```css
/**包裹搜索框的样式**/
.search-view{
  /**搜索框文字居中**/
  text-align: center;
  /**搜索框外部颜色**/
  background-color: #ea5455;
  /**调整整个搜索框居中**/
  display: flex;
  justify-content: center;
}
/**搜索框的样式**/
.search-input{
  /* 调整输入框的内的字体水平和垂直居中 */
  display: flex;
  justify-content: center;
  align-items: center;
  /**设置宽高**/
  height: 35px; 
  width: 680rpx;
  /**背景颜色**/
  background-color: #fff;
  /**边框样式**/
  border: 1px solid lightgray;
  /**边框圆角**/
  border-radius: 8px;
  /**上下边距**/
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: medium;
}
```

**searchInput.js 逻辑文件**

其实没啥逻辑😂~~

```js
// components/searchInput/searchInput.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
```

回到首页的配置文件中

**index.json 首页配置文件**

```json
{
  "usingComponents": { "searchInput": "/components/searchInput/searchInput" }
}
```

"usingComponents": { "searchInput": "/components/searchInput/searchInput" } 引用刚才编写的搜索栏组件 此处的searchInput 和页面中使用标签名对应

**index.wxml 首页文件**

```html
 <!-- 输入框组件开始 使用components里面的输入框组件 -->
  <searchInput></searchInput>
```

搜索栏区域结束

##### 推荐视图区域

![image-20201029123554801](https://gitee.com//lifazhan/mypics/raw/master/img/20201029123554.png)

* 推荐视图区域使用的 [swiper](https://developers.weixin.qq.com/miniprogram/dev/component/swiper.html) 滑块组件
* 滑块组件里面是每一个滑块项 [swiper-item](https://developers.weixin.qq.com/miniprogram/dev/component/swiper-item.html)，需要使用wx-for遍历显示
* 每个滑块项点击时要可以跳转到对应菜谱的页面，使用navigator
* 每个滑块项都是显示图片，使用image标签

因此index.wxml中的结构如下：

```html
<!-- 滑块视图组件 indicator-dots 显示小点点 autoplay 开启自动播放 circular 循环衔接滑动 -->
    <swiper class="swiper" indicator-dots autoplay circular>
      <!-- 遍历data中的视图url数组 普通字符数组 所以key值是本身 -->
      <block wx:for="{{swiperData}}" wx:key="item.id">
        <swiper-item>
          <navigator url="/pages/menucontent/menucontent?id={{item.id}}">
            <!-- 遍历显示图片 src属性：图片地址 mode属性：aspectFill缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来。 -->
            <image class="swiper-img" src="{{item.img}}" mode="aspectFill"></image>
          </navigator>
        </swiper-item>
      </block>
    </swiper>
```

页面渲染需要数据，数据部分在index.js文件中

首先在data属性中定义数组

```js
data: {
    // 滑动视图的数据
    swiperData: []
  },
```

编写方法从后端获取数据

```js
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
```

数据返回格式如下：

```json
{
  "code": 1000,
  "msg": "操作成功",
  "data": [
    {
      "id": 2,
      "img": "https://images.pexels.com/photos/5419093/pexels-photo-5419093.jpeg?auto\u003dcompress\u0026cs\u003dtinysrgb\u0026dpr\u003d1\u0026w\u003d500",
      "title": "测试2",
      "introd": "这是测试2的简介",
      "nickname": "TEST",
      "recommend": true
    },
    {
      "id": 3,
      "img": "https://images.pexels.com/photos/3464543/pexels-photo-3464543.jpeg?auto\u003dcompress\u0026cs\u003dtinysrgb\u0026dpr\u003d1\u0026w\u003d500",
      "title": "测试3",
      "introd": "这是测试3的简介",
      "nickname": "TEST",
      "recommend": true
    }
  ]
}
```

返回数据说明：img为图片的地址，id为菜谱表的id，跳转到菜谱详细内容页时需要携带id

在**页面加载时就要获取该数据**，在页面加载函数中调用

```js
 onLoad: function () {
    // 获取滑动视图的数据
    this.getSwipperData();
  },
```

样式文件 略



##### 常用分类区域

![image-20201029123739422](https://gitee.com//lifazhan/mypics/raw/master/img/20201029123739.png)

* 常用分类区域放置一行分类的标签，考虑flex布局
* 每一个分类实际上都是一个navigator，点击时携带名称（早餐）跳转到搜索页
* 需要一个更多分类navigator，点击时跳转到分类页，注意，这里分类页数据tabbar中，所以要注意跳转类型的设置
* 需要使用图标，因此样式文件中需要引入上面**资源** 中提到的icon.wxss文件
* 这一块是写死的，没有从后端请求数据

**index.wxml**

```html
<!-- 分类部分 -->
  <view class="classify">
    <view class="classify-head">
      <view class="classify-title">常用分类</view>
      <!-- 跳转到分类页面 注意分类页面在tabbar中已经配置 所以open-type 需要设置为switchTab 否则无法跳转 -->
      <navigator url="/pages/classify/classify" open-type="switchTab">更多分类</navigator>
    </view>
    <view class="classify-body">
      <!-- 下面的分类项实际都是跳转到搜素页面 携带不同的查询参数key -->
      <navigator url="/pages/search/search?key=早餐" class="classify-item" style="color:#ff414d">
        <text class="iconfont icon-food"></text>
        <view>早餐</view>
      </navigator>
      <navigator url="/pages/search/search?key=午餐" class="classify-item" style="color:#0278ae">
        <text class="iconfont icon-food2"></text>
        <view>午餐</view>
      </navigator>
      <navigator url="/pages/search/search?key=晚餐" class="classify-item" style="color:#fca652">
        <text class="iconfont icon-food1"></text>
        <view>晚餐</view>
      </navigator>
      <navigator url="/pages/search/search?key=宵夜" class="classify-item" style="color:#ff4b5c">
        <text class="iconfont icon-food3"></text>
        <view>宵夜</view>
      </navigator>
    </view>
  </view>
```

要点：

* 更多分类跳转分类页（tabbar中配置了该页面）是设置的open-type="switchTab"属性
* 每个分类跳转的navigator的url属性携带参数的方式
* <text class="iconfont icon-food"></text> 使用图标的方式

**无逻辑代码**

**index.wxss 样式文件**

```css
.classify{
  padding-bottom: 20rpx;
}
/* 常用分类头部整体样式 */
.classify-head{
  display: flex;
}
/**分类标题样式**/
.classify-title{
  flex: 1;
  /**字体样式**/
  font-size: 16px;
  font-weight: 700;
  
  /**左右边距**/
  margin-top: 10px;
  position: relative;
  left: 20rpx;
  
}
/* 更多分类样式 */
.classify-head navigator{
  flex: 1;
  /**字体样式**/
  font-size: 14px;
  font-weight: 700;
  color: darkgray;
  text-align: right;

  /* 位置调整 */
  position: relative;
  right: 20rpx;

  /**左右边距**/
  margin-top: 10px;
  margin-left: 15rpx;
}
/* 分类主体样式 */
.classify-body{
  /* 距离上面 10px 距离左侧 15rpx flex 布局 */
  margin-top: 10px;
  margin-left: 15rpx;
  display: flex;
}
/* 分类菜单项样式 */
.classify-item{
  /* 每个占1/n */
  flex: 1;
  /* 居中显示 */
  text-align: center;
}
/* 分类项中那个图标的样式 */
.classify-item text{
  /* 图标大小 */
  font-size: 80rpx;
}
/* 分类项中的分类名称 早餐 午餐巴拉巴拉的 */
.classify-item view{
  /* 文字居中 文字颜色 文字大小 */
  text-align: center;
  color: #373a40;
  font-size: smaller;
}
```



##### 最新佳作列表区域（★）

![image-20201029124850869](https://gitee.com//lifazhan/mypics/raw/master/img/20201029124851.png)

* 肯定要循环渲染，需要使用wx-for
* 点击时需要跳转到对应的菜谱详情页，与上面推荐视图类似，需要携带id，使用navigator标签跳转
* 数据量可能非常大，肯定不能一次性全部查出来，因此需要**分页查询**（重点）
* 样式

**index.wxml**

```html
<!-- 最新佳作 -->
  <view>
    <view class="update-title">「 最新佳作 」</view>
    <!-- 最新佳作主体部分 -->
    <view class="update-body">
      <!-- 遍历本周佳作的数组 -->
      <view wx:for="{{latestMenu}}" wx:key="item.id" class="update-item">
        <!-- 渲染图片 -->
        <navigator url="/pages/menucontent/menucontent?id={{item.id}}">
          <image src="{{item.img}}" mode="aspectFill" />
          <!-- 头部信息 标题 作者 -->
          <view class="update-item-head">
            <!-- 标题 -->
            <view class="update-item-title">{{item.title}}</view>
            <!-- 作者 -->
            <view class="update-item-author">
                <!-- 俩空格 距离产生美 -->
              <text class="iconfont icon-user" decode>{{item.nickname}}&nbsp;&nbsp;</text>
            </view>
          </view>
          <!-- 菜谱描述 -->
          <view class="update-item-introd">
            <text decode>&nbsp;&nbsp;{{item.introd}}</text>
          </view>
          <!-- 菜谱的收藏点赞信息 -->
          <view class="update-item-scan">
            <!-- 收藏 -->
            <text class="iconfont icon-heart">{{item.favorites}}</text>
            <!-- 俩空格 距离产生美 -->
            <text decode>&nbsp;&nbsp;</text>
            <!-- 浏览量 -->
            <text class="iconfont icon-see">{{item.pageviews}}</text>
          </view>
          <!-- 小程序中不提供给 html中hr标签，自定义水平分割线 -->
          <view class="line" style="width:100%;height: 5rpx"></view>
        </navigator>
      </view>
    </view>
  </view>
</view>
```

页面渲染需要提供latestMenu数组数据，因此需要从js代码获取

**index.js**(重点)

在js文件的data属性中，不仅仅需要提供latestMenu数组，还需要提供分页的一些参数（当前的页码，每页多少个，是否还有下一页），这些参数在获取数据的方法中需要使用

```js
data: {
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
```

获取数据的代码

```js
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
```

说明：

* http.get 方法中需要携带分页的参数
* 每次请求从后端获取下一页的数据时不应该时直接设置data中的latestMenu数组，而应该时追加到latestMenu数组中，这里使用了展开符号...，效果等同于遍历两个数组合并成一个
* 获取的分页结果中含有是否有下一页，需要其更新到data属性中，setData只能设置外层对象，即只能修改latestParams对象，修改latestParams对象内部的数据无法直接修改。要想修改只能把latestParams对象全部替换，此处依然使用展开符号，将原来data属性中的latestParams对象展开，然后再下面再使用从后端获取的是否有下一页的结果来覆盖原来的hasNextPage属性。

后端返回数据格式如下：

```json
{
  "code": 1000,
  "msg": "操作成功",
  "data": {
    "total": 4,
    "list": [
      {
        "id": 11,
        "img": "http://10.178.167.88:3000/api/images/fcbec34b-8350-4548-af98-de8051b71d7c.jpg",
        "title": "清炒白菜",
        "introd": "可好吃了",
        "nickname": "java.util.Man",
        "recommend": false,
        "content": "\u003cul data-checked\u003d\"false\" wx:nodeid\u003d\"119\"\u003e\u003cli wx:nodeid\u003d\"104\"\u003e杀白菜\u003c/li\u003e\u003cli wx:nodeid\u003d\"125\"\u003e洗白菜\u003c/li\u003e\u003cli wx:nodeid\u003d\"129\"\u003e切白菜\u003c/li\u003e\u003cli wx:nodeid\u003d\"131\"\u003e炒白菜\u003c/li\u003e\u003cli wx:nodeid\u003d\"132\"\u003e吃白菜\u003c/li\u003e\u003c/ul\u003e",
        "pageviews": 11,
        "favorites": 0
      }
    ],
    "pageNum": 1,
    "pageSize": 1,
    "size": 1,
    "startRow": 1,
    "endRow": 1,
    "pages": 4,
    "prePage": 0,
    "nextPage": 2,
    "isFirstPage": true,
    "isLastPage": false,
    "hasPreviousPage": false,
    "hasNextPage": true,
    "navigatePages": 8,
    "navigatepageNums": [
      1,
      2,
      3,
      4
    ],
    "navigateFirstPage": 1,
    "navigateLastPage": 4
  }
}
```

在两种情况下需要调用获取数据的方法：

第一：在页面加载时，需要请求第一页的数据，所以data中pageNo默认为1，直接在onload方法中调用获取数据的方法

```js
 onLoad: function () {
    // 获取本周佳作的数据
    this.getLatestMenuData();
  },
```

第二：在用户往下滑，看到最后最后一条数据时，如果还有下一页就应该再次发起请求，获取获取下一页的数据，此处使用的时触底函数，当页面被滑动到最底部时会触发此函数，在此函数中调用获取数据的方法

```js
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
```

#### 其他

首页开启下拉刷新功能，需要在index.json中设置

```json
{
  "enablePullDownRefresh": true, 
  "backgroundColor": "#ea5455" ,
}
```

* "enablePullDownRefresh": true 开启下拉刷新
* "backgroundColor": "#ea5455"  下拉刷新后边的背景色

同时在index.js中需要提供下拉刷新调用的函数

```js
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
```



### 搜索页

#### 布局

![image-20201029131544668](https://gitee.com//lifazhan/mypics/raw/master/img/20201029131544.png)

搜索页页面结构比较简单，分为**搜索区域**和**搜索结果区域**两部分

#### 分区域介绍

##### 搜索区域

![image-20201029131749257](https://gitee.com//lifazhan/mypics/raw/master/img/20201029131749.png)

此处的搜索框与首页搜索组件不同，这是真正的input标签

**search.wxml**

```html
<view class="search-input">
    <!-- 搜索框 -->
    <!-- model:value双向绑定数据  confirm-type 输入框的类型（search时键盘右下方按钮会显示为搜索） -->
    <input focus model:value="{{searchValue}}" placeholder="吃点什么好呢？" confirm-type="search" />
    <view bind:tap="tapSearch">搜索</view>
</view>
```

说明：

* focus 属性使得已进入页面输入框就会获得焦点，在手机上的效果就是键盘弹出
* model:value="{{searchValue}}" 将搜索框输入的值与js data属性中的值绑定
* confirm-type="search"：手机键盘右下角的按钮变为搜索
* bind:tap="tapSearch" 搜索需要绑定点击事件

**search.js**

```js
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
```

说明：

* 搜索的结果也可能数据量非常大，因此也需要做分页处理，分页的方式与首页类似，不在赘述
* searchValue 为输入框绑定的值
* menuList 为搜索结果的数组

和首页的最新佳作区域类似，每次请求到新的分页数据时都需要追加到原来的数组中，但是搜索有一个**特殊情况**，当用户修改了搜索关键词再次点击搜索时，应该直接覆盖原来的数组，而不是追加到原来的数组。因此将获取数据的方式再次抽取，调用时需要传递一个布尔值，来标记是以覆盖的方式还是以追加的方式来处理数据。

```js
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
```

点击搜索按钮触发的函数为tapSearch（），在这个函数中再去调用获取数据的函数

```js
// 点击搜索按钮触发
  tapSearch(){
    // 调用获取数据的函数 传递参数表示是点击搜索按钮调用的
    this.getSearchList(true)
  },
```

另一种调用获取数据的场景就是页面触底时需要获取下一页的数据，和首页每周佳作部分类似，使用触底函数，此处调用获取数据的方法时传递的参数为false，表示这不是搜索按钮触发的函数，数据要以追加的方式处理

```js
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
```

此区域的样式 search.wxss

```css
.search-input{
    /**搜索框文字居中**/
  text-align: center;
  /**搜索框外部颜色**/
  background-color: #ea5455;
  /**调整整个搜索框居中**/
  display: flex;
  justify-content: center;
}
.search-input input{
    /* 调整输入框的内的字体水平和垂直居中 */
  display: flex;
  justify-content: center;
  align-items: center;
  /**设置宽高**/
  height: 35px; 
  width: 650rpx;
  /**背景颜色**/
  background-color: #fff;
  /**边框样式**/
  border: 1px solid lightgray;
  /**边框圆角**/
  border-radius: 8px;
  /**上下边距**/
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: medium;
}
/* 搜索那俩字的样式 */
.search-input view{
    /* flex布局 水平垂直居中 左边距*/
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 15rpx;
}
```

当data的menuList列表中有数据时，就需要渲染页面的搜索结果区域了

##### 搜索结果区域

![image-20201029142710486](https://gitee.com//lifazhan/mypics/raw/master/img/20201029142710.png)

获取数据和分页上面已经介绍，因此这里任务就比较简单了，只需要将menuList中的数据渲染到页面上即可

* 遍历menuList，wx-for
* 点击跳转到菜谱内容详情页 navigator，携带菜谱的id

**search.wxml**

```html
<view class="search-value">
    <!-- 遍历查询出来的菜谱列表 -->
    <view class="search-value-item" wx:for="{{menuList}}" wx:key="item.id">
        <!-- 点击时携带菜谱id跳转菜谱详细页 -->
        <navigator url="/pages/menucontent/menucontent?id={{item.id}}">
            <!-- 封面图片 -->
            <!-- aspectFill：缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。 -->
            <image src="{{item.img}}" mode="aspectFill" />
            <!-- 菜谱内容区域 -->
            <view class="item-content">
                <!-- 标题 -->
                <view class="item-title">{{item.title}}</view>
                <!-- 简介 -->
                <view class="item-introd">{{item.introd}}</view>
                <!-- 用户昵称 -->
                <view class="item-user iconfont icon-user">{{item.nickname}}</view>
                <!-- 收藏和浏览区域 -->
                <view class="item-scan">
                    <!-- 收藏 -->
                    <text class="iconfont icon-heart">{{item.favorites}}</text>
                    <!-- 俩空格 距离产生美 -->
                    <text decode>&nbsp;&nbsp;</text>
                    <!-- 浏览量 -->
                    <text class="iconfont icon-see">{{item.pageviews}}</text>
                </view>
            </view>
        </navigator>
    </view>
</view>
```

对应的样式文件 search.wxss

```css
/* 菜谱列表每一项整体的样式 */
.search-value-item {
  /* 宽度给 给满 高度20rpx */
  width: 100%;
  height: 200rpx;
}
.search-value-item navigator {
  /* flex布局 */
  display: flex;
}
/* 封面图片样式 */
.search-value-item navigator image {
  /* 宽度 高度 左侧边距 上边距 */
  width: 360rpx;
  height: 180rpx;
  padding-left: 30rpx;
  padding-top: 20rpx;
}
/* 内容部分整体 */
.item-content {
  /* 左边距 即距离左侧封面图的距离 */
  padding-left: 30rpx;
}
/* 标题 */
.item-title {
  /* 上边距 字体大小 粗细 */
  padding-top: 20rpx;
  font-size: 38rpx;
  font-weight: 700;
}
/* 简介部分 */
.item-introd {
  /* 上边距 字体大小 */
  padding-top: 15rpx;
  font-size: 24rpx;
}
/* 用户昵称部分 */
.item-user {
  /* 上边距 字体大小 */
  padding-top: 15rpx;
  font-size: 28rpx;
}
/* 浏览信息部分  .item-scan样式下 第一个 text：即收藏量*/
.item-scan text:nth-child(1) {
  padding-top: 15rpx;
  font-size: 24rpx;
  color: #bb2205;
}
/* 浏览信息部分  .item-scan样式下 最后一个 text：即浏览量*/
.item-scan text:nth-child(3) {
  padding-top: 15rpx;
  font-size: 24rpx;
  color: #2d6187;
}
```

#### 其他

**进入搜索页面的两种场景**

* 用户点击首页或者分类页的搜索组件按钮进入页面，不会携带任何参数
* 用户通过分类页，点击不同分类标签进去搜索页，携带分类标签的内容

针对这两种不同的场景，需要再页面加载函数中做出区分

```js
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
```

在页面进行加载时，会尝试从页面中获取key（分类页面跳转会携带，没有时则为空），则将其设置到data的searchValue属性中，如果key值获取到了，说明时从分类页面跳转过来的，因此直接触发获取数据函数或者触发tapSearch点击搜索按钮函数，直接查询。



**simplifyStr 简化函数**

这是在工具类中实现的一个方法，目的是在字符串超过一定长度时，将超出长度的字符替换为...，防止出现字符串过长，页面样式发生问题

utils/util.js

```js
/* 简介部分防止字符串过长导致样式出问题 */
const simplifyStr = (str,i) =>{
  if(str.length <= i){
    /* 字符串不足位数不进行任何操作 */
    return str
  }
  /* 字符串超过位数 截取前i位 后边追加... */
  return str.slice(0,i) + '...'
}
```

使用函数的页面需要引入

```js
import {simplifyStr}  from '../../utils/util'
```

### 分类页

#### 布局

![image-20201029145326543](https://gitee.com//lifazhan/mypics/raw/master/img/20201029145326.png)

分类页分为搜索区域和分类区域，分类区域又分为一级分类区域和二级分类区域，点击不同的一级分类时会切换二级分类

搜索区域

#### 分区域介绍

##### 搜索区域

此处与首页的搜索栏完全一致，使用同一个搜索组件，参照首页-分区域介绍-搜索栏部分

##### 分类区域

![image-20201029150139498](https://gitee.com//lifazhan/mypics/raw/master/img/20201029150139.png)

* 两个区域都是滚动视图，需要使用scroll-view标签
* 都需要循环渲染 wx-for
* 需要两个数组，一个一级分类，一个二级分类
* 一级分类应该有点击事件，点击时激活并修改二级分类的数组
* 二级分类点击时应该跳转到搜索页 navigator

**classify.wxml**

```html
<view class="menu_container">
    <!-- 遍历渲左侧一级菜单 scroll-y ：设置滚动方向为竖向y轴-->
        <scroll-view class="leftMenu" scroll-y>
        <!-- 根据当前的激活索引设置激活的一级菜单 设置点击事件handleItemTap 传递参数当前一级菜单对应的索引 data-index="{{index}}" -->
            <!-- 激活索引显示激活样式的原理：js中存储一个激活的索引，当前菜单的索引===激活索引时，当前菜单项添加激活样式 -->
            <view class="left_menu_item {{index===activeIndex?'active':''}}" wx:for="{{leftMenuList}}" wx:key="*this"
             bindtap="handleItemTap" data-index="{{index}}">
            {{item}}
            </view>
        </scroll-view>
        <!-- 遍历显示右侧二级菜单 scroll-y ：设置滚动方向为竖向y轴 -->
        <scroll-view class="rightMenu" scroll-y>
        <view class="rightMenuContianer">
            <view class="right_menu_item" wx:for="{{rightMenuList}}" wx:key="*this">
            <!-- 点击二级菜单项时直接携带二级菜单的名称跳转到搜索页面 携带参数为二级分类的名称搜素页面使用 -->
            <navigator url="/pages/search/search?key={{item}}">
                {{item}}
            </navigator>
            </view>
        </view>
        </scroll-view>
    </view>
```

说明：

* bindtap="handleItemTap" 一级分类点击事件 data-index="{{index}}" 传递参数一级菜单的id
* <navigator url="/pages/search/search?key={{item}}"> 二级分类点击携带二级分类标签的内容跳转到搜索页面

**样式文件 classify.wxss**

```css
page{
    height: 100%;
}

.classify{
    height: 100%;
}
/* 分类菜单容器样式 */
.menu_container{
    /* 高度需要设置为全屏幕高度-输入框组件的高度 */
    height: calc(100vh - 55px);
    display: flex;
}
/* 左侧菜单样式 占屏幕的大小 2/7 */
.leftMenu{
    flex:2;
}
/* 右侧菜单的样式 5/7 */
.rightMenu{
    flex:5;
}
/* 右侧菜单的样式 flex布局 竖向排列 */
.rightMenuContianer{
    display: flex;
    flex-wrap: wrap;
}
/* 👈侧一级菜单每一个菜单项的样式 flex布局 字体大小高度 文字水平垂直居中 */
.left_menu_item{
    display: flex;
    height: 80rpx;
    justify-content: center;
    align-items: center;
    font-size: 30rpx;
}
/* 👉侧二级菜单的样式 */
.right_menu_item{
    /* 边框 */
    border: 1px solid darkgray;
    /* 宽度 居中 圆角 */
    width: 120rpx;
    text-align: center;
    border-radius: 20rpx;
    /* 中间字体离边框的位置 左右4px 上下 4px */
    padding: 4px 4px;
    /* 两个菜单项的相隔的位置 左右 8px 上下 0px */
    margin: 8px 0 0 8px;
    color: darkgrey;
}
/* 激活菜单的样式 */
.active{
    color: #ea5455;
    /* 右侧边框显示 */
    border-left: 5px solid currentColor;
}
```

样式文件只关注最后的激活样式即可！

**classify.js 逻辑文件**

首先需要在data属性中准备数据，分别为两个分类区域的数组、一级分类激活的索引、菜单整体的数据

```js
 /**
   * 页面的初始数据
   */
  data: {
    // 左侧一级菜单
    leftMenuList:[],
    // 右侧二级菜单
    rightMenuList:[],
    // 激活的菜单
    activeIndex: 0,
    // 菜单数据
    CatesData: []

  },
```

其中菜单整体的数据CatesData的作用是将后端返回所有的分类数据都保存起来，当用户点击不同的一级分类时，无需再次从后端获取，从CatesData中获取即可

获取分类数据方法

```js
 /* 获取分类信息 */
  async getMenuData(){
    // 发起请求
    const {data:response} = await http.get('/classify/all')
    if(response.code === 1000){
      //console.log(response.data)
      // 将一级菜单映射为字符串数组
      let leftMenuData = response.data.map(v=>v.name)
      // 一级菜单中的第一项映射为字符串数组
      let rightMenuData = response.data[0].childs.map(v=>v.name)
      this.setData({
        // 设置左侧一级菜单数据
        leftMenuList: leftMenuData,
        // 设置右侧二级菜单数据
        rightMenuList: rightMenuData,
        // 将完整的后端返回数据保存到data中，方便后面切换事件使用
        CatesData: response.data
      })
    }
  },
```

数据格式如下：

```json
{
  "code": 1000,
  "msg": "操作成功",
  "data": [
    {
      "id": 2,
      "name": "肉类",
      "parentId": 0,
      "childs": [
        {
          "id": 15,
          "name": "猪肉",
          "parentId": 2
        },
        {
          "id": 16,
          "name": "排骨",
          "parentId": 2
        },
        ...
      ]
    },
    {
      "id": 3,
      "name": "蛋类",
      "parentId": 0,
      "childs": [
        {
          "id": 32,
          "name": "鸡蛋",
          "parentId": 3
        },
        {
          "id": 33,
          "name": "鸭蛋",
          "parentId": 3
        },
        ...
      ]
    },
   ...
  ]
}
```

说明：

* response.data.map(v=>v.name) map函数

  response.data是一个数组，map函数可以将括号内的方法再数组每一项中都执行一次效果等同于下面代码

  ```js
  let leftMenuData = []
  for(let i=0; i<response.data.length; i++){
      const name = response.data[i].name
      leftMenuData.push(name)
  }
  ```

获取数据的方法需要在页面加载时就调用

```js
/**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取分类信息
    this.getMenuData()
  },
```

从代码中就可以看出，默认激活的一级菜单时第一项（index为0）,二级菜单数组也是使用的一级菜单第一项对应的数组

当用户点击不同的一级分类时，在页面上绑定了一个单击事件handleItemTap，对应的代码如下：

```js
// 左侧一级分类点击事件
  handleItemTap(e){
    //console.log(e);
    // 获取点击的索引
    const index = e.currentTarget.dataset.index
    // 根据索引和后端返回的完整数据设置左侧菜单的数据
    let rightMenuData = this.data.CatesData[index].childs.map(v=>v.name)
    this.setData({
      // 修改当前的激活索引
      activeIndex: index,
      // 修改右侧的数据
      rightMenuList: rightMenuData
    })
  }
```



### 菜谱详细内容页

#### 布局

![image-20201029155420409](https://gitee.com//lifazhan/mypics/raw/master/img/20201029155420.png)

![image-20201029155531695](https://gitee.com//lifazhan/mypics/raw/master/img/20201029155531.png)

菜谱详细内容页分为四个区域，分别为菜谱信息区域、用料区域、做法区域、按钮区域。

详细页面无论时从那个页面跳转过来的，都会携带菜谱的id，在菜谱详细页里需要使用菜谱id作为参数去后端请求完整的菜谱数据，因此页面加载函数如下：

menucontent.js

```js
/**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 获取其他页面条状到该页面时携带的菜谱id参数 */
    const id = options.id;
    /* 使用菜谱id获取菜谱额数据 */
    this.getMenuData(id);
  },

```

getMenuData函数如下：

```js
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
```

返回数据格式如下：

// 请求菜谱的数据
    const { data: menuResponse } = await http.get("/menu/query", { params });

```json
{
  "code": 1000,
  "msg": "操作成功",
  "data": {
    "id": 11,
    "img": "http://10.178.167.88:3000/api/images/fcbec34b-8350-4548-af98-de8051b71d7c.jpg",
    "title": "清炒白菜",
    "introd": "可好吃了",
    "nickname": "java.util.Man",
    "recommend": false,
    "content": "\u003cul data-checked\u003d\"false\" wx:nodeid\u003d\"119\"\u003e\u003cli wx:nodeid\u003d\"104\"\u003e杀白菜\u003c/li\u003e\u003cli wx:nodeid\u003d\"125\"\u003e洗白菜\u003c/li\u003e\u003cli wx:nodeid\u003d\"129\"\u003e切白菜\u003c/li\u003e\u003cli wx:nodeid\u003d\"131\"\u003e炒白菜\u003c/li\u003e\u003cli wx:nodeid\u003d\"132\"\u003e吃白菜\u003c/li\u003e\u003c/ul\u003e",
    "pageviews": 12,
    "favorites": 0
  }
}
```

// 请求菜谱材料列表的数据
    const { data: materialsResponse } = await http.get("/menu/materials", {params});

```json
{
  "code": 1000,
  "msg": "操作成功",
  "data": [
    {
      "id": 29,
      "menuId": 11,
      "name": "大白菜",
      "quantity": "10棵"
    },
    ...
  ]
}
```

获取的数据设置到data属性中

```js
/**
   * 页面的初始数据
   */
  data: {
    // 菜谱
    menuItem: {},
    // 用料数组
    materialsList: [],
  },
```

#### 分区域介绍

##### 菜谱信息区域

![image-20201029161241575](https://gitee.com//lifazhan/mypics/raw/master/img/20201029161241.png)

此区域需要设置封面大图、标题、作者、浏览信息、收藏信息、简介，页面结构如下：

menucontent.wxml

```html
<!-- 头部图片 -->
<image class="head-image" src="{{menuItem.img}}" mode="aspectFill"></image>
<view class="item-body">
    <!-- 标题作者 -->
    <view class="item-head">
        <view class="item-title">{{menuItem.title}}</view>
        <text class="item-user iconfont icon-user" decode>{{menuItem.nickname}}&nbsp;&nbsp;</text>
    </view>
    <view class="item-scan">
        <text>{{menuItem.pageviews}}次浏览·{{menuItem.favorites}}次收藏</text>
    </view>
    <!-- 菜谱描述 -->
    <view class="item-introd">
        <text decode>&nbsp;&nbsp;{{menuItem.introd}}</text>
    </view>
```

样式如下：

menucontent.wxss

```css
/* 头部图片 */
.head-image{
    /* 宽度给满 */
    width: 100%;
}
/* 菜谱主题部分 */
.item-body{
    /* 距离左右都20rpx */
    padding-left: 20rpx;
    padding-right: 20rpx;
}
/* 头部信息样式 */
.item-head{
    /* 居中 flex布局 两头分布 宽度 */
    align-items: center;
    display: flex;
    justify-content: space-between;
    height: 120rpx;
}
/* 标题样式 */
.item-title{
    /* 文字大小 粗细 相对定位 距离上面15rpx */
    font-size: x-large;
    font-weight: 600;
    position: relative;
    top: 15rpx;
}
/* 作者样式 */
.item-user{
    /* 相对定位 距离上面15rpx 颜色 */
    position: relative;
    top: 15rpx;
    color: darkgray;
}
/* 简介部分样式 */
.item-introd{
    /* 离上面的距离 文字大小 粗细 字体 */
    padding-top: 30rpx;
    font-size: large;
    font-weight: 520;
    font-family: sans-serif;
}
/* 浏览量样式 */
.item-scan{
    color: darkgray;
    font-size: x-small;
}
```

只是将js中的数据显示到页面，无逻辑代码

##### 用料区域

![image-20201029161652582](https://gitee.com//lifazhan/mypics/raw/master/img/20201029161652.png)

* 用料存放在数组中，肯定要循环遍历渲染 wx-for

页面结构如下：

```html
<!-- 用料表 -->
    <view class="item-maxterials">
        <view class="maxterials-title">用料</view>
        <view class="maxterials-item" wx:for="{{materialsList}}" wx:key="item.id">
            <view>{{item.name}}</view>
            <view>{{item.quantity}}</view>
        </view>
    </view>
```

样式文件：

```css
/* 材料展示部分样式 */
.item-maxterials{
    /* 离上面的距离 */
    padding-top: 40rpx;
}
/* 材料 标题样式 大的加粗的那个 */
.maxterials-title{
    font-size: larger;
    font-weight: 600;
}
/* 每一个材料项的样式 */
.maxterials-item{
    /* flex布局 两头靠 字体大小 离上面多远 底部带...那种的边框 */
    display: flex;
    justify-content: space-between;
    font-size: medium;
    padding-top: 20rpx;
    border-bottom: 1px dotted #ececec;
}
```

只是将js中的数据显示到页面，无逻辑代码

##### 做法区域 

![image-20201029161953364](https://gitee.com//lifazhan/mypics/raw/master/img/20201029161953.png)

* 做法部分在编辑时时通过富文本编辑器，因此菜谱的实际内容时html，这部分渲染需要用到 rich-text，来渲染html代码

页面结构如下：

```html
<!-- 做法 -->
    <view class="item-do">
        <view class="do-title">做法</view>
        <view class="do-body">
            <!-- 使用富文本渲染页面 -->
            <!-- 添加几个<br/>换行符，不然最下面的会被底部按钮挡住 -->
            <rich-text nodes="{{menuItem.content}}<br/><br/></br><br/>"></rich-text>
        </view>
    </view>
```

说明：

* rich-text 标签的nodes属性可以接受一个对象或者一个html样式的字符串，这里使用的时字符串

样式文件

```css
/* 做法部分整体样式 */
.item-do{
    /* 离上面多远 */
    padding-top: 40rpx;
}
/* 做法那俩字的样式 */
.do-title{
    font-size: larger;
    font-weight: 600;
    padding-bottom: 40rpx;
}
```

只是将js中的数据显示到页面，无逻辑代码

##### 按钮区域

![image-20201029162356156](https://gitee.com//lifazhan/mypics/raw/master/img/20201029162356.png)

* 两个按钮要始终悬浮在页面底部
* 实现收藏和分享功能

页面结构如下：

```html
<!-- 最下面的俩按钮 -->
<view class="bottom-btn">
<!-- 绑定点击触发事件 handleStarMeun-->
    <button class="btn btn-star" bind:tap="handleStarMeun">收藏</button>
    <!-- 分享按钮不用设置触发事件 将open-type设置为share即可 -->
    <button class="btn btn-share"  open-type="share">分享</button>
</view>
```

说明：

* bind:tap="handleStarMeun" 收藏按钮绑定了一个点击事件，收藏功能需要自己实现
* open-type="share" 分享按钮无需自己实现，有微信原生框架提供，指定open-type即可

样式文件如下：

```css
/* 底部俩按钮的整体样式 */
.bottom-btn{
    width: 100%;
    position: fixed;
    bottom: 20rpx;
    display: flex;
}
/* 按钮的样式 */
.btn{
    border-radius: 40rpx;
    color: #fff;
    font-weight: 200;
}
/* 俩按钮颜色分开设置 */
.btn-star{
    background-color: #bb2205;
}
.btn-share{
    background-color: #f6830f;
}
```

说明：

* position: fixed; 实现两个按钮悬浮在页面上

收藏逻辑实现：

```js
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
```

因为收藏必须要知道当前登录用户是谁，点击收藏按钮的收藏成功前提必须已经登录。因此在方法开头从本地Storage中获取登录信息，获取不到则跳转到登录页面，获取成功则使用用户昵称作为参数发起收藏请求到后端。

同时我们需要在页面data属性添加一个用户（登录用户）昵称的属性，同时在页面加载时尝试从本地Storage获取一次用户信息，获取不到页没有关系，因为用户不一定点击收藏按钮！

data 属性如下：

```js
/**
   * 页面的初始数据
   */
  data: {
    // 用户昵称
    nickName: "",
  },
```

页面加载函数添加下面代码:

```js
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
  },
```



### 发布/编辑页

太丑了，略

### 个人中心页

#### 布局

个人中心分为两种状态，一是已登录状态下，效果如下：

![image-20201030145532595](https://gitee.com//lifazhan/mypics/raw/master/img/20201030145539.png)

二是未登录状态下，效果如下：

![image-20201030145724621](https://gitee.com//lifazhan/mypics/raw/master/img/20201030145724.png)

两种状态虽然页面不同，然是均属mine页面，因此，页面的实现思路如下：

* 不同状态显示不同页面效果 ，wx-if 条件渲染
* 头像区域样式
* 点击功能跳转对应的页面 navigator

#### 分区域介绍

##### 未登录状态页面

![image-20201030150414509](https://gitee.com//lifazhan/mypics/raw/master/img/20201030150414.png)

在未登录状态下页面只是显示一个登录按钮，点击该登录按钮时，会跳转到登录授权页面，页面代码如下：

mine.wxml

```html
<!-- wx:else 当用户没有登录时显示 -->
<view class="user-nonlogin-warp" wx:else>
    <view class="user-info">
        <view class="user-icon">
            <!-- 登录按钮 点击时跳转到登录页面 -->
            <navigator url="/pages/login/login">登录</navigator>
        </view>
    </view>
</view>
```

说明：

* wx:else 时与上面登录显示区域的 wx:if 一起使用的，请看完整页面代码

需要将登录按钮样式修改为小按钮的样子，样式大代码如下：

mine.wxss

```css
/* 用户未登录时存放用户登录按钮组件的外部样式 */
.user-nonlogin-warp {
  /* 不写了 太多了... */
  width: 100%;
  height: 40vh;
  background-color: ghostwhite;
}
/* 未登录的按钮外部样式 */
.user-nonlogin-warp .user-info {
  /* 距离上面20% */
  top: 20%;
}
/* 登录按钮样式 */
.user-nonlogin-warp .user-info .user-icon navigator {
  /* 边框 圆角 背景色 */
  border: 2px solid #ea5455;
  border-radius: 20rpx;
  background-color: #ea5455;
}
```

无逻辑代码~

##### 登录状态-头像显示区域

![image-20201030150439565](https://gitee.com//lifazhan/mypics/raw/master/img/20201030150439.png)

此处需要使用用户的头像和用户的名称，因此必须现在js代码中获取到用户信息的对象

mine.js

首先在data中定义用户对象和是否登录

```js
/**
   * 页面的初始数据
   */
  data: {
    // 用户信息
    userInfo: {},
    // 用户是否登录
    isLogin:false
  },
```

在页面显示时(onShow函数)尝试从Storage中获取用户对象，并已是否获取到判断用户是否登录

```js
  onShow(){
    // 从缓存中获取
    const userInfo = wx.getStorageSync('userinfo')
    // 对象判空不可以直接使用 === null来判断
    if(Object.keys(userInfo) != 0){
      // 设置用户信息 修改用户登录状态
      this.setData({
        userInfo,
        isLogin: true
      })
    }else{
      // 没有获取到用户信息
      this.setData({
        isLogin:false
      })
    }
```

**特别注意：**

此处使用onShow函数而不是onLoad函数，onLoad函数只是页面加载时才会执行，用户未登录的话跳转到登录授权页面登录，此时个人中心页面并不时关闭状态，类似于后台运行状态，在登录成功后返回到个人中心页时，无需再次加载，因此onLoad不会执行，即便已经登录成功个人中心页面的数据也不会刷新，还是未登录状态。而onShow函数只要页面显示就会执行！

用户信息格式如下：

```json
{
	"nickName": "java.util.Man",
	"gender": 1,
	"language": "zh_CN",
	"city": "Linyi",
	"province": "Shandong",
	"country": "China",
	"avatarUrl": "https://thirdwx.qlogo.cn/mmopen/vi_32/S7r59dLHPO0Xo5fO14HhAP6ibsicziaAC8UkTLKt7e7wtu6XJia6A7WickLegse78Ye33dKHtwBicMviauwjPSGuiacHJg/132"
}
```

获取到用户对象后，就可以在页面渲染

```html
<!-- 用户头像和昵称展示区域 -->
<!-- wx:if="{{isLogin}}"只有已经登录时该区域才会显示 -->
<view class="user-info-wrap" wx:if="{{isLogin}}">
    <view class="user-img-warp">
        <!-- 背景图片 使用用户头像 -->
        <image class="user-bg" src="{{userInfo.avatarUrl}}" />
        <!-- 用户信息部分 -->
        <view class="user-info">
            <!-- 中间小的头像 -->
            <image class="user-icon" src="{{userInfo.avatarUrl}}"></image>
            <!-- 用户昵称 -->
            <view class="user-name">{{userInfo.nickName}}</view>
        </view>
    </view>
</view>
```

这里只是简单的把data中的数据填充到页面上，难点在与样式上

```css
/* 用户头像大的背景图片后边的区域样式 */
.user-info-wrap {
  /* 宽度给满 高度给40%的屏幕高度 */
  width: 100%;
  height: 40vh;
  /* 此处设置背景色的原因时稍后对背景图片进行模糊时，图片边缘区域会露出背景颜色 */
  background-color: black;
}
/* 用户头像 背景头像 用户昵称整体部分 */
.user-img-warp {
  /* 相对定位 */
  position: relative;
}
/* 背景图片样式 */
.user-bg {
  /* 宽度给满 高度40%屏幕高度 */
  width: 100%;
  height: 40vh;
  /* 此出使用css3提供的过滤器 模糊 传入参数越大越模糊 */
  filter: blur(10rpx);
}
/* 用户小头像和用户昵称整体样式 */
.user-info {
  /* 绝对定位 */
  position: absolute;
  /* 距离左侧50%（注意以组件的左上角为坐标点 
  因此实际上组件的中心位置并未居中而是向右多移动组件一半的距离） */
  left: 50%;
  /* 将组件在x轴（水平）向左回调组件的一半 此时才真正的水平居中 */
  transform: translateX(-50%);
  /* 距离上面30% */
  top: 30%;
  /* 里面的内容居中 */
  text-align: center;
}
/* 小头像样式 */
.user-icon {
  /* 高度宽度一致 正方形 */
  width: 150rpx;
  height: 150rpx;
  /* 圆角为50% 变为圆形 */
  border-radius: 50%;
}
/* 用户昵称区域 */
.user-name {
  /* 外部离上面的距离 字体颜色 */
  margin-top: 30rpx;
  color: #fff;
}
```

说明：

样式中重点注意背景模糊实现，以及给背景图片下面填充背景色的目的



##### 登陆状态-功能区域

![image-20201030151857489](https://gitee.com//lifazhan/mypics/raw/master/img/20201030151857.png)

这部分比较简单，只要使用navigator，点击时跳转到对应的页面即可，也是需要登录后才能显示

```html
<!-- 用户登录显示功能栏 -->
<!-- wx:if="{{isLogin}}"只有已经登录时该区域才会显示 -->
<view class="mine-menu" wx:if="{{isLogin}}">
    <!-- 我的收藏 -->
    <navigator url="/pages/mystar/mystar"  class="mine-menu-item">
        <view>我的收藏</view>
        <view>></view>
    </navigator>
    <!-- 我的发布区域 -->
    <navigator url="/pages/mypublish/mypublish" class="mine-menu-item">
        <view>我的发布</view>
        <view>></view>
    </navigator>
</view>
```

样式代码

```css
/* 菜单功能区域整体样式 */
.mine-menu{
  /* 距离上面大图片组件的距离 */
    margin-top: 20rpx;
}
/* 每一项菜单的样式 */
.mine-menu-item{
  /* flex布局 两边靠 高度 垂直居中 背景色 底部边框 字体大小 粗细 */
    display: flex;
    justify-content: space-between;
    height: 100rpx;
    align-items: center;
    background-color: ghostwhite;
    border-bottom: 1px solid #ececec;
    font-size: medium;
    font-weight: 500;
}
/* 每个菜单项里面的第一个view标签样式 就是我的发布 我的收藏那个字 */
.mine-menu-item view:first-child{
  /* 距离左侧 */
    margin-left: 30rpx;
}
/* 每个菜单项里面的最后一个view标签的样式 就是 > */
.mine-menu-item view:last-child{
  /* 字体样式 距离右侧的距离 */
    color: darkgray;
    margin-right: 30rpx;
}
```

无逻辑代码~

### 登录授权页



![image-20201030152311867](https://gitee.com//lifazhan/mypics/raw/master/img/20201030152312.png)

就一按钮....

所以页面代码就一行

```html
<!-- 真的就一个按钮.... open-type="getUserInfo"：点击获取用户的信息 handleGetUserInfo：点击触发事件-->
<button size="default" open-type="getUserInfo" type="primary" bindgetuserinfo="handleGetUserInfo">登录</button>

```

而且获取用户信息功能也是由微信原生框架提供，指定open-type="getUserInfo"即可

绑定事件bindgetuserinfo="handleGetUserInfo"，在这个函数中可以获取到用户信息

```js
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
```

获取到用户信息后需要将用户信息存储到Storage中，方便其他页面使用！

用户信息数据格式如下：

```json
{
	"nickName": "java.util.Man",
	"gender": 1,
	"language": "zh_CN",
	"city": "Linyi",
	"province": "Shandong",
	"country": "China",
	"avatarUrl": "https://thirdwx.qlogo.cn/mmopen/vi_32/S7r59dLHPO0Xo5fO14HhAP6ibsicziaAC8UkTLKt7e7wtu6XJia6A7WickLegse78Ye33dKHtwBicMviauwjPSGuiacHJg/132"
}
```

还有样式代码👇

```css
page{
    /* flex 布局 水平垂直居中 */
    display: flex;
    justify-content: center;
    align-items: center;
}
```



### 我的发布页 & 我的收藏页

这俩页面基本上一样，一块说（其实拿的搜索那的代码😂）

**此处参考 分页面介绍-搜索页-分区域介绍-搜索结果页，那个更详细**！！！

#### 布局

![image-20201030153218791](https://gitee.com//lifazhan/mypics/raw/master/img/20201030153218.png)

![image-20201030153235583](https://gitee.com//lifazhan/mypics/raw/master/img/20201030153235.png)

两个页面进入是布局完全一致，在对菜谱列表中的项目长按时会不一样

![image-20201030153334728](https://gitee.com//lifazhan/mypics/raw/master/img/20201030153334.png)

![image-20201030153356174](https://gitee.com//lifazhan/mypics/raw/master/img/20201030153356.png)

#### 分区域介绍

##### 列表显示

两个页面列表显示代码基本一致，唯一的区别就是数据不同，我的收藏页面是当前用户收藏的菜谱列表，我的发布页面时当前用户发布的菜谱列表

因此在页面代码和样式代码上，两个也买你没有区别

页面代码：

```html
<view class="search-value">
    <!-- 循环渲染出列表的每一项 handleLongPress：绑定的长按事件 data-id="{{item.id}}：传递参数菜谱id-->
    <view class="search-value-item" wx:for="{{menuList}}" wx:key="item.id" bind:longpress="handleLongPress" data-id="{{item.id}}">
        <!-- 单击跳转 -->
        <navigator url="/pages/menucontent/menucontent?id={{item.id}}">
            <!-- 菜谱封面图  -->
            <!-- aspectFill：缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。 -->
            <image src="{{item.img}}" mode="aspectFill" />
            <!-- 菜谱内容部分 -->
            <view class="item-content">
                <!-- 标题 -->
                <view class="item-title">{{item.title}}</view>
                <!-- 简介 -->
                <view class="item-introd">{{item.introd}}</view>
                <!-- 用户昵称 -->
                <view class="item-user iconfont icon-user">{{item.nickname}}</view>
                <!-- 浏览收藏信息部分 -->
                <view class="item-scan">
                    <!-- 收藏 -->
                    <text class="iconfont icon-heart">{{item.favorites}}</text>
                    <!-- 俩空格 距离产生美 -->
                    <text decode>&nbsp;&nbsp;</text>
                    <!-- 浏览量 -->
                    <text class="iconfont icon-see">{{item.pageviews}}</text>
                </view>
            </view>
        </navigator>
    </view>
</view>
```

样式代码：

```css
/* pages/mypublish/mypublish.wxss */
/* pages/mypublish/mypublish.wxss */
/* 菜谱列表每一项整体的样式 */
.search-value-item {
  /* 宽度给 给满 高度20rpx */
  width: 100%;
  height: 200rpx;
}
.search-value-item navigator {
  /* flex布局 */
  display: flex;
}
/* 封面图片样式 */
.search-value-item navigator image {
  /* 宽度 高度 左侧边距 上边距 */
  width: 360rpx;
  height: 180rpx;
  padding-left: 30rpx;
  padding-top: 20rpx;
}
/* 内容部分整体 */
.item-content {
  /* 左边距 即距离左侧封面图的距离 */
  padding-left: 30rpx;
}
/* 标题 */
.item-title {
  /* 上边距 字体大小 粗细 */
  padding-top: 20rpx;
  font-size: 38rpx;
  font-weight: 700;
}
/* 简介部分 */
.item-introd {
  /* 上边距 字体大小 */
  padding-top: 15rpx;
  font-size: 24rpx;
}
/* 用户昵称部分 */
.item-user {
  /* 上边距 字体大小 */
  padding-top: 15rpx;
  font-size: 28rpx;
}
/* 浏览信息部分  .item-scan样式下 第一个 text：即收藏量*/
.item-scan text:nth-child(1) {
  padding-top: 15rpx;
  font-size: 24rpx;
  color: #bb2205;
}
/* 浏览信息部分  .item-scan样式下 最后一个 text：即浏览量*/
.item-scan text:nth-child(3) {
  padding-top: 15rpx;
  font-size: 24rpx;
  color: #2d6187;
}

```

两个页面的区别都集中在js文件中，如下：

* 页面加载时获取的数据不同
* 长按事件绑定的bind:longpress="handleLongPress" 函数的实现不同

##### 我的收藏页（数据加载和长按功能）

在data对象中准备页面需要使用的数据

```js
/**
   * 页面的初始数据
   */
  data: {
    // 查询到菜谱数组
    menuList: [],
    // 用户昵称
    nickName: ''
  },
```

编写页面获取我的收藏数据的函数

```js
  /**
   * 获取用户收藏的列表
   */
  async getMyStarList(){
    /* 查询参数 用户昵称 */
    const params = {
      nickName : this.data.nickName
    }

    /* 发起请求 */
    const {data:response} = await http.get('/mine/star',{params})
    console.log(response);
    if(response.code === 1000){
      // 标题简介部分 太长了就用... 代替
      response.data.map(item => {
        /* 简介最多为8个字符 */
        item.introd = simplifyStr(item.introd,8);
        /* 标题最多为7个字符 */
        item.title = simplifyStr(item.title,7)
      })
      /* 设置数据 */
      this.setData({
        menuList:response.data
      })
    }
  },
```

参考搜索页部分

获取函数需要在页面加载时就执行，因此onLoad函数如下：

```js
/**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    const userinfo = wx.getStorageSync("userinfo")
    /* 获取设置用户昵称 */
    const nickName = userinfo.nickName
    this.setData({
      nickName
    })

    // 查找用户收藏列表
    this.getMyStarList()
  },
```

用户在长按某一菜谱时，提示用户是否取消收藏

![image-20201030160020443](https://gitee.com//lifazhan/mypics/raw/master/img/20201030160020.png)

```js
// 用户长按某一菜谱时触发
  handleLongPress(e){
    // 用户长按的菜谱id
    const menuId = e.currentTarget.dataset.id
    /* 在下面的回调函数中使用原来的this时改为that */
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否确认取消收藏该菜谱？',
      success (res) {
        if (res.confirm) {
          // 调用取消收藏
          const result = that.cancelStar(menuId)
          if(result){
            // 删除成功
            that.showToast('取消收藏成功')
          }else{
            // 删除失败
            that.showToast('取消收藏失败')
          }
        } else if (res.cancel) {
        }
      }
    })
  },
```

* showToast 函数时定义的一个简单的显示提示框的函数，代码如下：

  ```js
    // 展示提示
    showToast(title){
      wx.showToast({
        title,
        icon: 'none',
        duration: 2000
      })
    },
  ```

* cancelStar(menuId) 函数时在用户点击确定时向后端发起取消收藏的方法，代码如下：

  ```js
  // 取消收藏
    async cancelStar(menuId){
      /* 请求参数 */
      const params = {
        menuId,
        nickName:this.data.nickName
      }
  
      /* 发起请求 */
      const {data:response} = await http.get('/mine/cancelStar',{params})
      console.log(response);
        // 成功取消时 response.data 为true
      if(response.code === 1000){
        if(response.data)// 成功取消收藏刷新列表
              this.getMyStarList()
        return response.data
      }
  
      return false
  
    },
  ```

##### 我的发布页（数据加载和长按功能）

在data对象中准备页面需要使用的数据

```js
/**
   * 页面的初始数据
   */
  data: {
    // 查询到的数组
    menuList: [],
    // 用户昵称
    nickName: ''
  },
```

编写页面获取我的发布数据的函数

```js
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
```

参考搜索页部分

获取函数需要在页面加载时就执行，因此onLoad函数如下：

```js
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
```

用户在长按某一菜谱时，显示可以操作的功能

![image-20201030160039194](https://gitee.com//lifazhan/mypics/raw/master/img/20201030160039.png)

```js
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
```

用户点击编辑时，会携带菜谱的id跳转到发布页面

用户点击删除时，执行 deletePublishMenu(menuId) 方法，向后端发起删除请求

```js
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
```

## 其他

### 项目运行注意

**不能运行再看，应该不会出现**

![image-20201030161022027](https://gitee.com//lifazhan/mypics/raw/master/img/20201030161022.png)

![image-20201030161249144](https://gitee.com//lifazhan/mypics/raw/master/img/20201030161249.png)