---
title: issues(问题记录)
date: 2022年05月08日16:22:52
tags:
---

### 搭建

1.  搭建 prettierrc 时， 新建文件名应为.prettierrc, 不应该为.prettierrc.js。

2.  优先本地.vscode/setting.json 中配置。其次是 vscode 本地配置。

3.  setting.json "editor.formatOnSave": true, 为自动保存。

### Fastify

1.  fastify/autoload 自动注入路由。 路由前缀为配置路径'routes'层级目录名称。
    /routes/bot / localhost:3000/bot
    /routes/bot /xx localhost:3000/bot/xx
2.  import.meta.url: 指明模块的基本 URL。也可以是外部脚本的 URL，还可以是内联脚本所属文档的 URL。

### Bot

1.  扫码微信需绑定微信支付，才可扫码登录。
