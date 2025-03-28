# img2pdf-vue

一个基于 Vue.js 开发的图片转 PDF 工具，支持批量转换和拖拽上传。

## 功能特点

- 🖼️ 支持多种图片格式（JPG、PNG、WebP等）
- 📦 支持批量上传和转换
- 🎯 支持拖拽上传
- 📄 支持自定义输出文件名
- 🎨 简洁美观的用户界面

## 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0 或 yarn >= 1.22.0

## 项目设置

```bash
# 安装依赖
yarn install
```

### 开发环境运行

```bash
# 启动开发服务器
yarn serve
```

### 生产环境构建

```bash
# 构建生产版本
yarn build
```

### 代码检查

```bash
# 运行代码检查
yarn lint
```

## 使用说明

1. 启动应用后，可以通过拖拽或点击上传区域添加图片
2. 选择要转换的图片
3. 设置输出文件名（可选）
4. 点击转换按钮开始处理
5. 等待转换完成后自动下载生成的PDF文件

## 技术栈

- Vue.js
- Vue CLI
- Element Plus
- PDF.js

## 配置说明

更多配置信息请参考 [Vue CLI 配置文档](https://cli.vuejs.org/config/)。

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目。

## 许可证

MIT License
