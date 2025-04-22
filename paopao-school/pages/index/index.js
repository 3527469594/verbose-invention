Page({
  data: {
    orderList: [
      {
        id: 1,
        type: "外卖代取",
        description: "帮取校门口麦当劳的外卖",
        distance: 0.5,
        reward: 5
      },
      {
        id: 2,
        type: "快递代取",
        description: "帮取快递点的小件包裹",
        distance: 0.8,
        reward: 3
      }
    ]
  },
  
  onLoad: function(options) {
    this.getOrderList();
    // 通过页面栈获取取消的订单
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    if(prevPage && prevPage.route === 'pages/orders/orders') {
      this.setData({
        orderList: [...this.data.orderList, prevPage.data.canceledOrder]
      });
    }
  },
  
  getOrderList: function() {
    // 实际开发中这里应该调用API获取数据
    // 这里使用模拟数据
    wx.showLoading({ title: '加载中...' });
    setTimeout(() => {
      wx.hideLoading();
    }, 500);
  },
  
  navigateToPublish: function() {
    wx.showModal({
      title: '发布需求',
      editable: true,
      showCancel: true,
      cancelText: '取消',
      confirmText: '发布',
      inputs: [
        {
          name: 'pickupLocation',
          placeholder: '取件地点（必填）\n例如：校门口麦当劳、快递点名称'
        },
        {
          name: 'deliveryLocation',
          placeholder: '收件地点（必填）\n例如：宿舍楼号+房间号'
        },
        {
          name: 'reward',
          placeholder: '报酬金额（必填）\n单位：元，建议5-20元',
          type: 'number'
        },
        {
          name: 'trackingNumber',
          placeholder: '快递单号/取件码（选填）'
        },
        {
          name: 'phone',
          placeholder: '手机号（必填）\n用于联系，11位数字',
          type: 'number'
        },
        {
          name: 'description',
          placeholder: '详细描述（必填）\n例如：外卖备注、包裹大小/特征'
        }
      ],
      success: (res) => {
        if (res.confirm) {
          const inputs = res.values || {};
          if (!inputs || Object.values(inputs).some(item => !item)) {
            wx.showToast({
              title: '请填写完整信息',
              icon: 'none'
            });
            return;
          }
          
          wx.showLoading({ title: '发布中...' });
          
          // 实际开发中这里应该调用API提交数据
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
              title: '发布成功',
              icon: 'success'
            });
            
            // 添加到订单列表
            const newOrder = {
              id: Date.now(),
              type: '自定义需求',
              pickupLocation: inputs.pickupLocation,
              deliveryLocation: inputs.deliveryLocation,
              reward: parseFloat(inputs.reward) || 0,
              trackingNumber: inputs.trackingNumber,
              phone: inputs.phone,
              description: inputs.description,
              distance: 0
            };
            this.setData({
              orderList: [newOrder, ...this.data.orderList]
            });
          }, 1000);
        }
      }
    });
  },
  
  acceptOrder: function(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认接单',
      content: '确定要接取这个订单吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '接单中...' });
          
          // 实际开发中这里应该调用API更新订单状态
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
              title: '接单成功',
              icon: 'success'
            });
            
            // 更新订单列表状态
            const updatedOrders = this.data.orderList.map(order => {
              if (order.id === orderId) {
                return { ...order, accepted: true };
              }
              return order;
            });
            
            this.setData({ orderList: updatedOrders });
          }, 800);
        }
      }
    });
  }
})