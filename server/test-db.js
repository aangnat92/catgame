// 数据库连接测试脚本
require('dotenv').config();
const { Pool } = require('pg');

console.log('=== 数据库配置检查 ===');
console.log('DB_USER:', process.env.DB_USER || '未设置（使用默认值: postgres）');
console.log('DB_HOST:', process.env.DB_HOST || '未设置（使用默认值: localhost）');
console.log('DB_NAME:', process.env.DB_NAME || '未设置（使用默认值: catgame）');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***已设置***' : '未设置（使用默认值: postgres）');
console.log('DB_PORT:', process.env.DB_PORT || '未设置（使用默认值: 5432）');
console.log('');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'catgame',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

async function testConnection() {
    console.log('=== 正在测试数据库连接 ===');
    try {
        const result = await pool.query('SELECT NOW(), current_database()');
        console.log('✅ 数据库连接成功！');
        console.log('当前时间:', result.rows[0].now);
        console.log('当前数据库:', result.rows[0].current_database);
        
        // 测试查询表
        const tablesResult = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log('数据库中的表:', tablesResult.rows.map(r => r.table_name).join(', ') || '无');
        
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ 数据库连接失败！');
        console.error('错误信息:', error.message);
        console.error('');
        console.log('=== 排查建议 ===');
        
        if (error.message.includes('password authentication failed')) {
            console.log('1. 密码错误 - 请检查 .env 文件中的 DB_PASSWORD 是否正确');
        } else if (error.message.includes('database') && error.message.includes('does not exist')) {
            console.log('1. 数据库不存在 - 请确认数据库名称是否正确（应该是 catgame）');
            console.log('2. 可以使用 pgAdmin 或 psql 创建数据库: CREATE DATABASE catgame;');
        } else if (error.message.includes('ECONNREFUSED') || error.message.includes('connect')) {
            console.log('1. 无法连接到 PostgreSQL 服务器');
            console.log('2. 请检查 PostgreSQL 服务是否正在运行');
            console.log('3. 检查 .env 文件中的 DB_HOST 和 DB_PORT 是否正确');
        } else if (error.message.includes('role') && error.message.includes('does not exist')) {
            console.log('1. 用户不存在 - 请检查 .env 文件中的 DB_USER 是否正确');
        }
        
        console.log('');
        console.log('请检查：');
        console.log('- .env 文件是否在 server 目录下');
        console.log('- .env 文件中的配置是否正确');
        console.log('- PostgreSQL 服务是否正在运行（可以在 Windows 服务中查看）');
        
        await pool.end();
        process.exit(1);
    }
}

testConnection();

