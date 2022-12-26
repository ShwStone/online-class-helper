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
npm run start
```

## [releases](https://github.com/TianYuan-College/online-class-helper/releases)

暂时只有 Linux releases ，因为我没有 Windows 或 MacOS 系统，也跑不动虚拟机。（我想不会有老师用 Linux 吧）

如果你觉得不错，不妨点一个 Star 。

## 贡献方法

组织内成员：直接在 dev 分支上做改动。**不要动 master 分支。**

路过的大佬：在 master 上提交 PR。

### 构建软件包

默认方法：

```sh
npm run dev
```

跨平台构建：

```sh
npm run make -- --platform target-platform
```
