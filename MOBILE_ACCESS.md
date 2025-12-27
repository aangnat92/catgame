# 手机访问指南

## 前提条件
1. 确保手机和电脑连接在**同一个 WiFi 网络**下
2. 确保电脑的防火墙允许 3000 和 8000 端口的访问

## 快速开始

### 1. 修改配置文件（已自动配置）

配置文件 `front/config.js` 已经设置为手机访问模式：
```javascript
const API_BASE_URL = 'http://192.168.3.60:3000/api';  // 手机访问模式
```

如果你的电脑IP地址不是 `192.168.3.60`，请修改这个文件中的IP地址。

### 2. 启动后端服务器

在 `server` 目录下运行：
```bash
cd /d F:\code\witchcoding\server
npm start
```

服务器会显示：
```
服务器运行在 http://localhost:3000
手机访问: http://192.168.3.60:3000/health
```

### 3. 启动前端服务器

**方法一：使用 Python（推荐）**
```bash
cd F:\code\witchcoding\front
python -m http.server 8000 --bind 0.0.0.0
```

**方法二：使用 Node.js http-server**
```bash
cd F:\code\witchcoding\front
npx http-server . -p 8000 -a 0.0.0.0
```

### 4. 在手机上访问

在手机浏览器中输入：
```
http://192.168.3.60:8000
```

## 切换模式

### 手机访问模式
在 `front/config.js` 中：
```javascript
const API_BASE_URL = 'http://192.168.3.60:3000/api';  // 手机访问模式
// const API_BASE_URL = 'http://localhost:3000/api';  // 本地开发模式（注释掉）
```

### 本地开发模式
在 `front/config.js` 中：
```javascript
// const API_BASE_URL = 'http://192.168.3.60:3000/api';  // 手机访问模式（注释掉）
const API_BASE_URL = 'http://localhost:3000/api';  // 本地开发模式
```

## 获取电脑IP地址

如果IP地址变了，在 CMD 中执行：
```bash
ipconfig | findstr /i "IPv4"
```

然后修改 `front/config.js` 中的IP地址。

## 故障排除

如果手机无法访问：
1. ✅ 检查手机和电脑是否在同一 WiFi 网络
2. ✅ 检查电脑防火墙是否允许端口访问
3. ✅ 检查IP地址是否正确
4. ✅ 确保后端和前端服务器都在运行

