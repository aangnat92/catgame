# 部署指南

## 部署方案

### 方案一：使用 Vercel（推荐，免费且简单）

Vercel 可以同时部署前端和后端，非常适合全栈应用。

#### 1. 安装 Vercel CLI
```bash
npm install -g vercel
```

#### 2. 在项目根目录创建 `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "front/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "front/$1"
    }
  ]
}
```

#### 3. 部署
```bash
vercel
```

#### 4. 修改前端 API 地址
部署后，Vercel 会给你一个域名（如 `your-app.vercel.app`），修改 `front/config.js`：
```javascript
const API_BASE_URL = 'https://your-app.vercel.app/api';
```

---

### 方案二：使用 Netlify + Heroku/Railway

#### 前端部署到 Netlify（免费）

1. 在项目根目录创建 `netlify.toml`：
```toml
[build]
  publish = "front"
  command = "echo 'No build needed'"

[[redirects]]
  from = "/api/*"
  to = "https://your-backend.herokuapp.com/api/:splat"
  status = 200
  force = true
```

2. 在 Netlify 网站：
   - 连接 GitHub 仓库
   - 设置构建目录为 `front`
   - 部署

#### 后端部署到 Heroku 或 Railway

**Heroku:**
1. 在 `server` 目录创建 `Procfile`：
```
web: node server.js
```

2. 安装 Heroku CLI 并部署：
```bash
cd server
heroku create
git push heroku main
```

**Railway（更简单）:**
1. 访问 https://railway.app
2. 连接 GitHub 仓库
3. 选择 `server` 目录
4. 自动部署

---

### 方案三：使用云服务器（VPS）

#### 1. 购买云服务器
- 阿里云、腾讯云、AWS、DigitalOcean 等

#### 2. 在服务器上安装环境
```bash
# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PostgreSQL
sudo apt-get install postgresql postgresql-contrib
```

#### 3. 部署后端
```bash
# 克隆代码
git clone your-repo
cd witchcoding/server

# 安装依赖
npm install

# 配置环境变量
nano .env

# 使用 PM2 运行（保持后台运行）
npm install -g pm2
pm2 start server.js
pm2 save
pm2 startup
```

#### 4. 部署前端
```bash
# 安装 Nginx
sudo apt-get install nginx

# 配置 Nginx
sudo nano /etc/nginx/sites-available/default
```

Nginx 配置示例：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/witchcoding/front;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 5. 配置域名和 SSL
使用 Let's Encrypt 免费 SSL 证书：
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### 方案四：使用 GitHub Pages（仅前端，需要单独部署后端）

#### 1. 修改前端配置
在 `front/config.js` 中设置后端 API 地址（需要单独部署后端）

#### 2. 部署到 GitHub Pages
1. 在 GitHub 仓库设置中启用 Pages
2. 选择 `front` 目录作为源
3. 访问 `https://your-username.github.io/witchcoding`

---

## 推荐方案

**最简单：Vercel**
- 免费
- 自动 HTTPS
- 同时支持前后端
- 部署简单

**最灵活：云服务器**
- 完全控制
- 可以自定义配置
- 适合长期运行

## 部署前检查清单

- [ ] 修改 `front/config.js` 中的 API 地址为生产环境地址
- [ ] 确保 `.env` 文件中的数据库配置正确
- [ ] 确保后端服务器可以访问数据库
- [ ] 测试所有功能是否正常
- [ ] 检查 CORS 配置是否正确

## 需要帮助？

如果遇到问题，可以：
1. 查看各平台的部署文档
2. 检查服务器日志
3. 测试 API 端点是否可访问

