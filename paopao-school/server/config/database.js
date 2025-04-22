// 新增环境变量校验
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
  throw new Error('缺少必要的数据库环境变量配置');
}

// 主连接池（默认）
const mainPool = mysql.createPool({
  connectionLimit: process.env.DB_MAX_CONN || 20,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionTimeout: 10000,
  queueLimit: 50
});

// 订单模块独立连接池
const orderPool = mysql.createPool({
  connectionLimit: 15,
  host: process.env.DB_HOST,
  user: process.env.DB_ORDER_USER || process.env.DB_USER,
  password: process.env.DB_ORDER_PWD || process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true
});

// 新增健康检查方法
const healthCheck = async () => {
  const conn = await mainPool.getConnection();
  try {
    await conn.query('SELECT 1');
    const [version] = await conn.query('SELECT @@version AS version');
    if (!version[0].version.startsWith('8.')) {
      console.warn('建议使用MySQL 8.0及以上版本');
    }
    return true;
  } finally {
    conn.release();
  }
};

// 修改事务执行器支持多连接池
const executeTransaction = async (callback, pool = mainPool) => {
  const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await callback(conn);
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
};

// 用户模块独立连接池
const userPool = mysql.createPool({
  connectionLimit: 15,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  timezone: '+08:00'
});

// 修改导出对象
module.exports = {
  mainPool,
  orderPool,
  userPool,
  healthCheck,
  executeTransaction,
  getConnection: () => mainPool.getConnection()
};