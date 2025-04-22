// pages/withdraw/withdraw.js
Page({
  data: {
    amount: 0,
    balance: 0
  },

  onLoad: function(options) {
    // 获取当前余额
    this.getBalance();
    
    // 从profile页面获取保证金余额
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    if(prevPage && prevPage.route === 'pages/profile/profile') {
      this.setData({
        balance: prevPage.data.depositAmount
      });
    }
  },

  getBalance: function() {
    // 实际开发中这里应该调用API获取数据
    // 这里使用模拟数据
    const balance = 1000;
    this.setData({
      balance: balance
    });
  },

  inputAmount: function(e) {
    this.setData({
      amount: e.detail.value
    });
  },

  submitWithdraw: function() {
    if(!this.data.amount || this.data.amount <= 0) {
      wx.showToast({
        title: '请输入有效金额',
        icon: 'none'
      });
      return;
    }
    
    if(this.data.amount > this.data.balance) {
      wx.showToast({
        title: '余额不足',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({ title: '提现中...' });
    
    // 实际开发中这里应该调用API提交数据
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '提现成功',
        icon: 'success'
      });
      
      // 返回上一页并刷新数据
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      if(prevPage.route === 'pages/profile/profile') {
        prevPage.updateDeposit(this.data.amount, 'withdraw');
        prevPage.onShow();
      }
      
      wx.navigateBack();
    }, 1000);
  }
})