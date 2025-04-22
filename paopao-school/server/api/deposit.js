const express = require('express');
const router = express.Router();
const User = require('../models/user');

/**
 * 保证金相关API
 */

/**
 * 获取用户保证金余额
 * @route GET /api/deposit/balance
 * @group 保证金 - 保证金相关操作
 * @returns {object} 200 - 成功返回保证金余额
 * @returns {Error} 500 - 服务器错误
 */
router.get('/balance', async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('deposit');
        res.json({ code: 200, data: { balance: user.deposit } });
    } catch (err) {
        res.status(500).json({ code: 5000, message: '获取余额失败' });
    }
});

/**
 * 充值保证金
 * @route POST /api/deposit/recharge
 * @group 保证金 - 保证金相关操作
 * @param {number} amount.body.required - 充值金额(最低10元)
 * @returns {object} 200 - 成功返回支付参数
 * @returns {Error} 400 - 金额不足最低限额
 * @returns {Error} 500 - 服务器错误
 */
router.post('/recharge', async (req, res) => {
    const { amount } = req.body;
    if (amount < 10) {
        return res.status(400).json({ code: 4007, message: '最低充值10元' });
    }
    
    try {
        await User.updateOne(
            { _id: req.user.id },
            { $inc: { deposit: amount } }
        );
        
        // 这里应调用微信支付接口生成预支付订单
        const paymentParams = {
            prepay_id: '模拟支付ID',
            timeStamp: Date.now().toString(),
            nonceStr: Math.random().toString(36).substring(2),
            signType: 'MD5',
            paySign: '模拟签名'
        };
        
        res.json({ code: 200, data: { paymentParams } });
    } catch (err) {
        res.status(500).json({ code: 5000, message: '充值失败' });
    }
});

/**
 * 提现保证金
 * @route POST /api/deposit/withdraw
 * @group 保证金 - 保证金相关操作
 * @param {number} amount.body.required - 提现金额(最低20元)
 * @returns {object} 200 - 成功
 * @returns {Error} 400 - 金额不足最低限额或余额不足
 * @returns {Error} 500 - 服务器错误
 */
router.post('/withdraw', async (req, res) => {
    const { amount } = req.body;
    if (amount < 20) {
        return res.status(400).json({ code: 4008, message: '最低提现20元' });
    }
    
    try {
        const user = await User.findById(req.user.id);
        if (user.deposit < amount) {
            return res.status(400).json({ code: 4009, message: '余额不足' });
        }
        
        await User.updateOne(
            { _id: req.user.id },
            { $inc: { deposit: -amount } }
        );
        
        // 这里应调用微信企业付款接口
        res.json({ code: 200 });
    } catch (err) {
        res.status(500).json({ code: 5000, message: '提现失败' });
    }
});