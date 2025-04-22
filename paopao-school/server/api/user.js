const express = require('express');
const router = express.Router();
const User = require('../models/user');

/**
 * 获取用户信息
 * @route GET /api/user/info
 * @group 用户 - 用户相关操作
 * @returns {object} 200 - 成功返回用户信息
 * @returns {Error} 500 - 服务器错误
 */
router.get('/info', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id })
            .select('avatar nickname score deposit createdAt');
        res.json({
            code: 200,
            data: user
        });
    } catch (err) {
        res.status(500).json({ code: 5000, message: '服务器错误' });
    }
});

/**
 * 更新用户头像
 * @route POST /api/user/avatar
 * @group 用户 - 用户相关操作
 * @param {file} avatar.formData.required - 头像文件
 * @returns {object} 200 - 成功返回头像URL
 * @returns {Error} 500 - 服务器错误
 */
router.post('/avatar', upload.single('avatar'), async (req, res) => {
    try {
        const avatarUrl = `/uploads/${req.file.filename}`;
        await User.updateOne(
            { _id: req.user.id },
            { $set: { avatar: avatarUrl } }
        );
        res.json({ code: 200, data: { avatar: avatarUrl } });
    } catch (err) {
        res.status(500).json({ code: 5000, message: '头像更新失败' });
    }
});

/**
 * 更新用户昵称
 * @route POST /api/user/nickname
 * @group 用户 - 用户相关操作
 * @param {string} nickname.body.required - 新昵称
 * @returns {object} 200 - 成功
 * @returns {Error} 400 - 昵称为空
 * @returns {Error} 500 - 服务器错误
 */
// 新增参数验证中间件
const { body, validationResult } = require('express-validator');

router.post('/nickname', 
  body('nickname')
    .trim()
    .isLength({ min: 2, max: 20 }).withMessage('昵称长度2-20字符')
    .matches(/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/).withMessage('含非法字符'),
  async (req, res) => {
    // 统一错误处理
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        code: 4001,
        message: errors.array()[0].msg 
      });
    }

    try {
      const [result] = await db.getConnection().query(
        'UPDATE users SET nickname = ? WHERE id = ?',
        [req.body.nickname, req.user.id]
      );
      
      res.json({ 
        code: 200, 
        data: { updated: result.affectedRows } 
      });
    } catch (err) {
      res.status(500).json({ 
        code: 5000, 
        message: '服务器内部错误' 
      });
    }
  }
);
router.post('/nickname', async (req, res) => {
    const { nickname } = req.body;
    if (!nickname) {
        return res.status(400).json({ code: 4000, message: '昵称不能为空' });
    }
    
    try {
        await User.updateOne(
            { _id: req.user.id },
            { $set: { nickname } }
        );
        res.json({ code: 200 });
    } catch (err) {
        res.status(500).json({ code: 5000, message: '昵称更新失败' });
    }
});