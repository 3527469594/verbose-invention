Page({
  data: {
    serviceTypes: ['外卖代取', '快递代取'],
    currentServiceType: 0,
    pickupLocation: '',
    deliveryLocation: '',
    trackingNumber: '',
    phone: '',
    description: '',
    reward: ''
  },
  
  onServiceTypeChange: function(e) {
    this.setData({
      currentServiceType: e.detail.value
    });
  },
  
  onDescriptionChange: function(e) {
    this.setData({
      description: e.detail.value
    });
  },
  
  onRewardChange: function(e) {
    this.setData({
      reward: e.detail.value
    });
  },
  
  onPickupLocationChange: function(e) {
    this.setData({
      pickupLocation: e.detail.value
    });
  },
  
  onDeliveryLocationChange: function(e) {
    this.setData({
      deliveryLocation: e.detail.value
    });
  },
  
  onTrackingNumberChange: function(e) {
    this.setData({
      trackingNumber: e.detail.value
    });
  },
  
  onPhoneChange: function(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  
  onSubmit: function() {
    if (!this.data.pickupLocation) {
      wx.showToast({
        title: '请填写取件地点',
        icon: 'none'
      });
      return;
    }
    
    if (!this.data.deliveryLocation) {
      wx.showToast({
        title: '请填写收件地点',
        icon: 'none'
      });
      return;
    }
    
    if (!this.data.phone) {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none'
      });
      return;
    }
    
    if (!this.data.description) {
      wx.showToast({
        title: '请填写需求描述',
        icon: 'none'
      });
      return;
    }
    
    if (!this.data.reward) {
      wx.showToast({
        title: '请设置报酬金额',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({ title: '发布中...' });
    
    // 实际开发中这里应该调用API提交数据
    setTimeout(() => {
      wx.hideLoading();
      
      // 获取当前页面栈
      const pages = getCurrentPages();
      // 获取index页面实例
      const indexPage = pages.find(page => page.route === 'pages/index/index');
      if (indexPage) {
        // 生成新订单数据
        const newOrder = {
          id: Date.now(),
          type: this.data.serviceTypes[this.data.currentServiceType],
          description: this.data.description,
          distance: '0.5', // 默认距离
          reward: this.data.reward
        };
        // 更新index页面的orderList
        indexPage.setData({
          orderList: [newOrder, ...indexPage.data.orderList]
        });
      }
      
      // 创建新订单对象
      const newOrder = {
        id: Date.now(),
        type: this.data.serviceTypes[this.data.currentServiceType],
        description: this.data.description,
        distance: 0,
        reward: this.data.reward,
        pickupLocation: this.data.pickupLocation,
        deliveryLocation: this.data.deliveryLocation,
        trackingNumber: this.data.trackingNumber,
        phone: this.data.phone
      };
      
      // 获取前一个页面实例（index页面）
      const prevPage = pages[pages.length - 2];
      if (prevPage) {
        // 将新订单添加到订单列表顶部
        prevPage.setData({
          orderList: [newOrder, ...prevPage.data.orderList]
        });
      }
      
      wx.showToast({
        title: '发布成功',
        icon: 'success'
      });
      
      // 返回上一页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 1000);
  }
})