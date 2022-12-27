# 网课助手
本项目旨在提供一些网课时实用的小工具。

## Feature
基于学生的 Excel 名单，（目前）支持签到、随机点名和倒计时功能，并将签到结果写入 Excel 表。

将一些配置存储在 `config.ini` 中。

## 食用方法

获取最新的版本：

```sh
git clone https://github.com/TianYuan-College/online-class-helper
npm install
npm run dev
```

## [releases](https://github.com/TianYuan-College/online-class-helper/releases)

下载安装包进行安装，或者直接下载并解压 `zip` 文件，然后运行 `online-class-helper`。

如果你觉得不错，不妨点一个 Star 。

## 贡献方法

组织内成员：直接在 dev 分支上做改动。**不要动 master 分支。**

路过的大佬：在 master 上提交 PR。

### 遵循的规则

不要使用 remote 模块。它已被弃用。

尽量将数据存在主进程中，渲染器进程只负责从主进程读取数据并显示。来自渲染器进程的更改操作也应该发送给主进程执行。

### 你可以做什么

如果你不会编写 electron 软件，不妨修改一下 UI 界面，优化 css。

如果你可以进行前端开发，考虑下列目标：

- 学生分组（随机分组或导入），支持在点名后为小组加分。
- 教案管理。
- 写一个爬虫，读取某个题库，并实现随机出题。

### 构建软件包

注意，如果你执行过 `npm run dev` 或 `npm run start` ，工作目录下会有 `config.ini` 生成，打包时它将会被一起打包。

你应该删除 `config.ini` 后再进行构建。

默认方法：

```sh
npm run make
```

跨平台构建：

```sh
npm run make -- --platform target-platform
```
