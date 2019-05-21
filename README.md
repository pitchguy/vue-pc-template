# pc-vue

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```
## 技术概览
```
# 使用UI库
[element-ui](https://vux.li/)
````
```
#主要技术
vue2,vuex,webpack4 ,babel7,vue-router,element-ui,axios,echarts--图表，scss

```

#### 项目结构

```text
├── build //webpack各种环境打包配置
├── dist //打包后文件存放文件夹
├── src //项目的主要目录
│     │     │     ├── api //接口声明文件
│     │     │     ├── public //静态总文件夹
│     │     │     │     ├── assets //此应用对应的静态资源
│     │     │     │     │   ├── img //全局静态图片目录
│     │     │     │     │   ├── style //全局样式地址
│     │     │     │     │   ├── fonts //全局字体目录
│     │     │     │     │   ├── libs //全局js类库地址
│     │     │     │     ├── config //不同环境的默认值
│     │     │     │     ├── mock //mock接口文件夹
│     │     │     ├── pages //页面
│     │     │     ├── tpls //模板页面
│     │     │     ├── components //全局公用组件
│     │     │     ├── constants //本地json文件
│     │     │     ├── utils //提供一些小工具
│     │     │     ├── index.js //应用的入口
│     │     │     └── router //路由
│     │     ├── index.html //wepack打包模板文件
├── .babelrc //babel相关配置
└── package.json //node相关环境的配置文件

```