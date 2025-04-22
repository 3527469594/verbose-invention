const express = require('express');
const router = express.Router();
const Order = require('../models/order');

/**
 * 订单相关API
 */

/**
 * 获取订单列表
 * @route GET /api/order
 * @group 订单 - 订单相关操作
 * @param {string} type.query - 订单类型(可选)
 * @param {string} status.query - 订单状态(可选)
 * @param {number} page.query - 页码(默认1)
 * @param {number} pageSize.query - 每页数量(默认10)
 * @returns {object} 200 - 成功返回订单列表和总数
 * @returns {Error} 500 - 服务器错误
 */
router.get('/', async (req, res) => {
    const { type, status, page = 1, pageSize = 10 } = req.query;
    const query = { userId: req.user.id };
    
    if (type) query.type = type;
    if (status) query.status = status;

    try {
        const orders = await Order.find(query)
            .skip((page - 1) * pageSize)
            .limit(parseInt(pageSize))
            .sort('-createdAt');
            
        const total = await Order.countDocuments(query);
        
        res.json({
            code: 200,
            data: { list: orders, total }
        });
    } catch (err) {
        res.status(500).json({ code: 5000, message: '获取订单失败' });
    }
});

/**
 * 创建新订单
 * @route POST /api/order
 * @group 订单 - 订单相关操作
 * @param {string} type.body.required - 订单类型
 * @param {string} pickupLocation.body.required - 取货地点
 * @param {string} deliveryLocation.body.required - 送货地点
 * @param {number} reward.body.required - 报酬金额
 * @param {string} description.body - 订单描述(可选)
 * @returns {object} 200 - 成功返回创建的订单
 * @returns {Error} 500 - 服务器错误
 */
router.post('/', async (req, res) => {
    const { type, pickupLocation, deliveryLocation, reward, description } = req.body;
    
    try {
        const order = await Order.create({
            type,
            pickupLocation,
            deliveryLocation,
            reward: parseFloat(reward),
            description,
            userId: req.user.id,
            status: 'PENDING'
        });
        
        res.json({ code: 200, data: order });
    } catch (err) {
        res.status(500).json({ code: 5000, message: '创建订单失败' });
    }
});

// 更新订单状态
router.put('/:id/status', async (req, res) => {
    const { status } = req.body;
    const validStatus = ['ACCEPTED', 'DELIVERING', 'COMPLETED', 'CANCELLED'];
    
    if (!validStatus.includes(status)) {
        return res.status(400).json({ code: 4002, message: '无效状态' });
    }
    
    try {
        const order = await Order.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { status } },
            { new: true }
        );
        
        res.json({ code: 200, data: order });
    } catch (err) {
        res.status(500).json({ code: 5000, message: '状态更新失败' });
    }
});