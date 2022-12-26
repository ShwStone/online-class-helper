# 网课助手
本项目旨在提供一些网课时实用的小工具。

## Feature
基于学生的 Excel 名单，（目前）支持签到、随机点名和倒计时功能，并将签到结果写入 Excel 表。

将一些配置存储在 `config.txt` 中。

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

### 构建软件包

默认方法：

```sh
npm run make
```

跨平台构建：

```sh
npm run make -- --platform target-platform
```
