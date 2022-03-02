# GetX 项目代码生成工具

这个插件是和 [flutter_ducafecat_news_getx](https://github.com/ducafecat/flutter_ducafecat_news_getx) 配套使用的

https://github.com/ducafecat/flutter_ducafecat_news_getx

## 功能

- 根据 x3 图片自动生成 x1 x2 图片
- 生成规范目录
- 生成 GetBuilder + GetView 的代码
- 生成 完整的代码

## 使用说明

## 功能

![](https://ducafecat.oss-cn-beijing.aliyuncs.com/podcast/20220302165447.png)

### 1. 根据 x3 图片自动生成 x1 x2 图片

请讲你的 `图片`、`Svg` 放到目录

```
assets/images/
assets/svgs/
```

- 准备好你的 `assets/images/3.0x` 图片

![](https://ducafecat.oss-cn-beijing.aliyuncs.com/podcast/20220302165624.png)

- 右键点击菜单 `Assets: Images x1 x2 Generate`

![](https://ducafecat.oss-cn-beijing.aliyuncs.com/podcast/20220302165708.png)

- 成功生成了 `2.0x` 文件夹，和 `1x` 的图片

![](https://ducafecat.oss-cn-beijing.aliyuncs.com/podcast/20220302165742.png)

- 生成 `files.txt` 常量列表

![](https://ducafecat.oss-cn-beijing.aliyuncs.com/podcast/20220302233654.png)

- 如果你把 `svg` 放到 `assets/svgs` 这个目录下，也会生成常量列表

![](https://ducafecat.oss-cn-beijing.aliyuncs.com/podcast/20220302234502.png)

### 2. 生成规范目录

图片放到 `assets/images/`

![](https://ducafecat.oss-cn-beijing.aliyuncs.com/podcast/20220302174919.png)

Svg 放到 `assets/svgs/`

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

### 3. 生成 GetBuilder + GetView 的代码

![](https://ducafecat.oss-cn-beijing.aliyuncs.com/podcast/20220302175006.png)

![](README/2022-02-23-18-46-05.png)

只有 controller、view 两个文件

推荐用这种，简单快速，自带自动释放控制器，GetBuilder 方式对性能也好。

### 4. 生成 StatefulWidget + GetBuilder + GetView 的代码

![](https://ducafecat.oss-cn-beijing.aliyuncs.com/podcast/20220302175042.png)

这种是在 GetBuilder + GetView 的基础上，再加入了 StatefulWidget 包裹，比如你需要 mixin 一些功能的时候需要（AutomaticKeepAliveClientMixin、wantKeepAlive）。

### 5. 生成 完整的代码

![](README/vscode-getx.gif)

鼠标右键你的视图目录，输入名称生成代码

![](README/2022-02-23-18-45-12.png)

这种方式，包含了全部的 controller、view、widgets、bindings、state 拆分的很细致

---

© 猫哥

- 微信 ducafecat

- [博客 ducafecat.tech](https://ducafecat.tech/)

- [github](https://github.com/ducafecat)

- [bilibili](https://space.bilibili.com/404904528)

![订阅号](https://ducafecat.oss-cn-beijing.aliyuncs.com/podcast/20220302165922.png)
