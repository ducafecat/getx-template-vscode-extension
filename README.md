# getx-template

这个插件是和 [flutter_ducafecat_news_getx](https://github.com/ducafecat/flutter_ducafecat_news_getx) 配套使用的

https://github.com/ducafecat/flutter_ducafecat_news_getx

## 使用说明

### 鼠标右键你的视图目录，输入名称生成代码

![](README/vscode-getx.gif)

## 功能

![](https://ducafecat.oss-cn-beijing.aliyuncs.com/podcast/20220302094420.png)

### 生成规范目录

![](https://ducafecat.oss-cn-beijing.aliyuncs.com/podcast/20220302094553.png)

自动创建开发目录

```
- common
  - api
    - index.dart
  - i18n
  - models
  - routers
  - services
  - style
  - utils
  - widgets
- pages
  - index.dart
```

### 生成 完整的代码

![](README/2022-02-23-18-45-12.png)

这种方式，包含了全部的 controller、view、widgets、bindings、state 拆分的很细致

### 生成 GetBuilder + GetView 的代码

![](README/2022-02-23-18-46-05.png)

只有 controller、view 两个文件

推荐用这种，简单快速，自带自动释放控制器，GetBuilder 方式对性能也好。

### 生成 StatefulWidget + GetBuilder + GetView 的代码

这种是在 GetBuilder + GetView 的基础上，再加入了 StatefulWidget 包裹，比如你需要 mixin 一些功能的时候需要（AutomaticKeepAliveClientMixin、wantKeepAlive）。

---

© 猫哥

- 微信 ducafecat

- [博客 ducafecat.tech](https://ducafecat.tech/)

- [github](https://github.com/ducafecat)

- [bilibili](https://space.bilibili.com/404904528)

![订阅号](https://ducafecat.tech/img/banner-gzh.png)
