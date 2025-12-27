const express = require('express');
const cors = require('cors');
const { initDatabase, testConnection } = require('./db');
const gameRoutes = require('./routes/game');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors({
    origin: [
        'http://localhost:8000',
        'http://localhost:3000',
        /\.github\.io$/,  // GitHub Pages
        /\.vercel\.app$/,  // Vercel
        /\.netlify\.app$/  // Netlify
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/game', gameRoutes);

// 健康检查
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: '服务器运行正常' });
});

// 捕获所有未定义的路由并返回 404
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

// 启动服务器
async function startServer() {
    try {
        // 测试数据库连接
        const connected = await testConnection();
        if (!connected) {
            console.error('数据库连接失败，请检查配置');
            process.exit(1);
        }
        
        // 初始化数据库表
        await initDatabase();
        
        // 启动服务器（监听所有网络接口，允许手机访问）
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`服务器运行在 http://localhost:${PORT}`);
            console.log(`健康检查: http://localhost:${PORT}/health`);
            console.log(`手机访问: http://192.168.3.60:${PORT}/health`);
        });
    } catch (error) {
        console.error('启动服务器失败:', error);
        process.exit(1);
    }
}

startServer();

