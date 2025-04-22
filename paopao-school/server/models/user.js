const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    openid: { type: String, required: true, unique: true },
    nickname: { type: String, default: '新用户' },
    avatar: { type: String, default: '/default-avatar.png' },
    score: { type: Number, default: 5.0, min: 0, max: 5 },
    deposit: { type: Number, default: 0, min: 0 },
    createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

const db = require('../config/database');

module.exports = mongoose.model('User', userSchema);

module.exports = {
  // 获取用户信息（带字段过滤）
  getSafeInfo: async (userId) => {
    const [rows] = await db.getConnection().query(`
      SELECT 
        id, 
        openid, 
        avatar, 
        nickname, 
        deposit, 
        FLOOR(TIMESTAMPDIFF(HOUR, created_at, NOW())/24) AS reg_days 
      FROM users 
      WHERE id = ?
    `, [userId]);
    return rows[0];
  },

  // 更新保证金（事务安全）
  updateDeposit: async (userId, amount) => {
    const [result] = await db.getConnection().query(
      'UPDATE users SET deposit = deposit + ? WHERE id = ?',
      [amount, userId]
    );
    return result.affectedRows;
  }
};