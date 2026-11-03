<div align="center">
    <h1>coblog-vite</h1>
    <p>个人博客前端 · vite + vue3 + ts</p>
</div>

## 线上

- 站点：[https://coblog.fun](https://coblog.fun)
- 后端 API：[W-David/coblog](https://github.com/W-David/coblog)（默认 `https://coblog.fun:8990/api/v1`）
- 评论：[W-David/coblog-waline](https://github.com/W-David/coblog-waline)（`https://coblog-waline.vercel.app`）

本仓是从旧前端迁移到 **Vue3 + Vite + Pinia + TypeScript** 的版本（基于 [tov-template](https://github.com/dishait/tov-template)），不是后端仓的 fork。

## 环境变量

见 `.env` / `.env.development` / `.env.production`：

| 变量 | 说明 |
|------|------|
| `VITE_APP_TITLE` | 站点标题 |
| `VITE_APP_BASE_URL` | 后端 API 根路径，如 `https://coblog.fun:8990/api/v1` |
| `VITE_APP_WALINE_API` | Waline 服务地址，现为 `https://coblog-waline.vercel.app` |

## 开发

```bash
pnpm install
pnpm dev
```

```bash
pnpm build
pnpm preview
```

## 仓库关系

```
coblog-vite   ← 本仓（前端 SPA）
coblog        ← 后端 Koa API
coblog-waline ← 评论（Waline on Vercel）
```

旧仓 [coblog-frontend](https://github.com/W-David/coblog-frontend) 已被本仓取代。

## License

[MIT](./LICENSE)
