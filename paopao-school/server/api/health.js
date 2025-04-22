const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('../middlewares/auth');

/**
 * @route GET /api/health/db
 * @group 系统监控 - 系统健康检查
 * @returns {object} 200 - 数据库连接状态
 * @returns {Error} 503 - 服务不可用
 */
// 移除鉴权中间件
router.get('/db', checkDB);

module.exports = router;