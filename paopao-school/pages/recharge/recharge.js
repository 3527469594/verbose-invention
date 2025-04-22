// pages/recharge/recharge.js
Page({
  data: {
    amount: 0
  },

  onLoad: function(options) {
    
  },

  inputAmount: function(e) {
    this.setData({
      amount: e.detail.value
    });
  },

  submitRecharge: function() {
    if(!this.data.amount || this.data.amount <= 0) {
      wx.showToast({
        title: '请输入有效金额',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({ title: '充值中...' });
    
    // 实际开发中这里应该调用API提交数据
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '充值成功',
        icon: 'success'
      });
      
      // 返回上一页并刷新数据
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      if(prevPage.route === 'pages/profile/profile') {
        prevPage.updateDeposit(this.data.amount, 'recharge');
        prevPage.onShow();
      }
      
      wx.navigateBack();
    }, 1000);
  }
})