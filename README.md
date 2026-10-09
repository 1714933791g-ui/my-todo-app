# My Todo

一个适合初学者的中文待办清单网页，使用 HTML、CSS 和原生 JavaScript 编写。无需安装依赖、无需服务器，任务保存在当前浏览器的 `localStorage` 中。

## 功能

- 添加待办、标记完成、删除单条事项
- 按全部、未完成、已完成筛选
- 一键清除已完成事项
- 显示完成进度和空列表提示
- 按 Enter 快速添加，支持键盘和屏幕阅读器
- 桌面与手机自适应布局
- 刷新或重新打开页面后恢复任务

## 运行

直接用浏览器打开 `index.html` 即可。也可以在 Visual Studio Code 中安装 Live Server，再通过右键菜单启动本地预览。

## 文件结构

```text
my-todo-app/
├── index.html  # 页面结构与无障碍标签
├── style.css   # 视觉样式与响应式布局
├── app.js      # 待办交互、筛选和本地保存
└── README.md   # 项目介绍与运行说明
```

## 数据说明

事项只保存在当前浏览器和当前设备的本地存储中，不会上传到服务器，也不会自动同步到其他浏览器或设备。清除浏览器站点数据会一并删除保存的事项。

## GitHub 参考

本项目借鉴了开源待办项目常用的轻量方案：将页面结构、样式和交互拆分为三个文件，以原生浏览器 API 管理任务并保存到 `localStorage`。界面、文案和实现由本项目独立编写。

- [iamsuvodevnath/to-do-list](https://github.com/iamsuvodevnath/to-do-list)：HTML/CSS/原生 JavaScript，支持任务管理、`localStorage` 和响应式页面。
- [devshaheerx/todo-list-app](https://github.com/devshaheerx/todo-list-app)：HTML/CSS/原生 JavaScript，展示简洁的任务交互和移动端布局。

## 后续练习

可以继续添加任务编辑、截止日期、暗色模式，或按计划使用 Git 逐步提交并推送到自己的 GitHub 仓库。GitHub Pages 可用于发布这个静态网页。

