Page({
  data: {
    currentTab: 0,
    orderList: [
      {
        id: 1,
        type: "外卖代取",
        description: "帮取校门口麦当劳的外卖",
        createTime: "2023-05-15 10:30",
        reward: 5,
        status: "进行中"
      },
      {
        id: 2,
        type: "快递代取",
        description: "帮取快递点的小件包裹",
        createTime: "2023-05-14 16:45",
        reward: 3,
        status: "已完成"
      }
    ],
    filteredOrders: []
  },
  
  onLoad: function() {
    // 页面加载时获取订单数据
    this.getOrderList();
  },
  
  getOrderList: function() {
    // 实际开发中这里应该调用API获取数据
    // 这里使用模拟数据
    wx.showLoading({ title: '加载中...' });
    setTimeout(() => {
      wx.hideLoading();
    }, 500);
  },
  
  switchTab: function(e) {
    const tab = parseInt(e.currentTarget.dataset.tab);
    const filteredOrders = this.data.orderList.filter(order => 
      tab === 0 ? order.status === "进行中" : order.status === "已完成"
    );
    this.setData({
      currentTab: tab,
      filteredOrders: filteredOrders
    });
  },
  
  cancelOrder: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认取消',
      content: '确定要取消这个订单吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '处理中...' });
          // 实际开发中这里应该调用API取消订单
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
              title: '取消成功',
              icon: 'success'
            });
            // 刷新订单列表
            this.getOrderList();
          }, 1000);
        }
      }
    });
  },
  
  cancelOrder: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '取消订单',
      content: '确定要取消该订单吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '处理中...' });
          // 实际开发中这里应该调用API取消订单
          setTimeout(() => {
            const order = this.data.orderList.find(item => item.id === id);
            if (order) {
              order.status = '已取消';
              this.setData({
                orderList: this.data.orderList.filter(item => item.id !== id),
                filteredOrders: this.data.filteredOrders.filter(item => item.id !== id)
              });
              // 触发事件通知首页更新订单列表
              this.triggerEvent('orderCanceled', order);
            }
            wx.hideLoading();
            wx.showToast({
              title: '操作成功',
              icon: 'success'
            });
          }, 1000);
        }
      }
    });
  },
  
  confirmOrder: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认完成',
      content: '确定订单已完成吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '处理中...' });
          // 实际开发中这里应该调用API确认订单完成
          setTimeout(() => {
            const order = this.data.orderList.find(item => item.id === id);
            if (order) {
              order.status = '已完成';
              this.setData({
                orderList: this.data.orderList.filter(item => item.id !== id),
                filteredOrders: this.data.filteredOrders.filter(item => item.id !== id)
              });
            }
            wx.hideLoading();
            wx.showToast({
              title: '操作成功',
              icon: 'success'
            });
          }, 1000);
        }
      }
    });
  }
})