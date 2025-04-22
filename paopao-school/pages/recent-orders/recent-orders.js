// pages/recent-orders/recent-orders.js
Page({
  data: {
    recentOrders: []
  },

  onLoad: function(options) {
    this.getRecentOrders();
  },

  getRecentOrders: function() {
    // 获取当前日期
    const now = new Date();
    // 计算7天前的日期
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // 实际开发中这里应该调用API获取数据
    // 这里使用模拟数据
    const allOrders = [
      { 
        id: 1, 
        type: '辅导', 
        title: '数学辅导', 
        description: '高中数学一对一辅导', 
        createTime: '2023-06-01 14:30', 
        status: '已完成', 
        reward: 150
      },
      { 
        id: 2, 
        type: '练习', 
        title: '英语口语练习', 
        description: '日常英语对话练习1小时', 
        createTime: '2023-06-05 09:15', 
        status: '已完成', 
        reward: 80
      },
      { 
        id: 3, 
        type: '辅导', 
        title: '编程辅导', 
        description: 'Python基础教学', 
        createTime: '2023-06-10 19:00', 
        status: '已完成', 
        reward: 200
      },
      { 
        id: 4, 
        type: '作业', 
        title: '物理作业', 
        description: '高中物理力学作业辅导', 
        createTime: '2023-06-15 16:45', 
        status: '进行中', 
        reward: 120
      },
      { 
        id: 5, 
        type: '辅导', 
        title: '化学辅导', 
        description: '高中化学实验辅导', 
        createTime: '2023-06-12 10:20', 
        status: '已完成', 
        reward: 180
      },
      { 
        id: 6, 
        type: '练习', 
        title: '钢琴练习', 
        description: '钢琴基础练习1小时', 
        createTime: '2023-06-14 15:00', 
        status: '已完成', 
        reward: 100
      },
      { 
        id: 7, 
        type: '作业', 
        title: '数学作业', 
        description: '初中数学作业辅导', 
        createTime: '2023-06-13 18:30', 
        status: '已完成', 
        reward: 90
      }
    ];
    
    // 筛选最近7天已完成的订单
    const recentCompletedOrders = allOrders.filter(order => {
      const orderDate = new Date(order.createTime);
      return order.status === '已完成' && orderDate >= sevenDaysAgo;
    });
    
    this.setData({
      recentOrders: recentCompletedOrders
    });
  }
})