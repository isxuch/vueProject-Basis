![![image]](https://github.com/MMS-Daniel/Webpack4Start/raw/master/src/images/logo.jpg)

Vue-cil3.0单页面项目构建基础框架。
=====================================
- Vant
- Sentry
- Axios/qs
- Vuex
- Vue-router
- less
- ES6/7语法兼容
- 移动端低版本兼容


## 安装依赖 ##

	$ cnpm install

## 目录结构 ##

``` js
    .
    ├── public                     # 容器
    │   ├── index.html                  # 单页面容器
    │   ├── favicon.ico                 # icon
    ├── src                       # 源码目录
    │   ├── api/
    │   │   ├── index.js            # API存放声明
    │   ├── img/               # 图片资源
    │   ├── css                # 样式
    │   ├── view/               #页面
    │   ├── components/         #组件库
    ├── .env                      # 生产/开发通用环境变量
    ├── .env.analyz               # 可视化包管理
    ├── .env.cdn                  # cdn分包环境变量
    ├── babel.config.js           # babel配置
    ├── babel.config.js           # babel配置
    ├── babel.config.js           # babel配置
    ├── package.json              # 依赖配置
    ├── README.md                 # 说明
    ├── vue.config.js             # 工程配置

```
## VUE UI ##

vue-cil 图形化界面


## 可视化包管理  ##

    $ npm run analyz

## 编译（测试/dev环境） ##

    $ npm run dev

## 编译（生产环境） ##

生产环境会对js混淆压缩，对css、html进行压缩，字符替换等处理

    $ npm run build

生产环境CDN分包模式
    npm run build-cdn

You can build projects directly for development. If you can help, please click Star.
--------------------------------------------------------------------------------------