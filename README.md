# 基于 vue-element-template 的修改点

[![Build Status](https://github.com/ibotplus/ibothub-ui/actions/workflows/maven.yml/badge.svg)](https://github.com/ibotplus/ibothub-ui/actions)
![license](https://img.shields.io/github/license/mashape/apistatus.svg)

## 修改点

### 修改体统标题 settings.js

### 修改地址栏图标 fav.ico

### 修改左侧logo Sidebar

### devServer

### request.js 
```
config.headers['Authorization'] = getToken()
```

### 密码 md5 加密

### utils/request 拦截后端请求

### 登录调试通过后，移除 mockserver，整体切换至后端服务接口

### 菜单权限对接

1、permission.js 登录成功后加载菜单

2、菜单从 vuex 模块中加载

3、Sidebar/index.vue 中路由通过 vuex 获取

[router.addRoutes 无效](https://github.com/PanJiaChen/vue-element-admin/issues/2370)

[Remove existing routes](https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465)

### 分页
详见 `components/Pageable`

### 面包屑导航修改 breadcrumb