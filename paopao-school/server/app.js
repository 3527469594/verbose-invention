const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const upload = require('./middlewares/upload');
const auth = require('./middlewares/auth');

const app = express();

// MySQL连接池配置
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 路由
app.use('/api/user', require('./api/user'));
app.use('/api/orders', auth, require('./api/order'));
app.use('/api/deposit', auth, require('./api/deposit'));

// 错误处理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ code: 5000, message: '服务器错误' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});