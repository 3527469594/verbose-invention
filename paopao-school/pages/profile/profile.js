// pages/profile/profile.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {
            avatar: '../../assets/icons/profile.png',
            nickname: '用户名',
            score: 5.0
        },
        orderCount: 0,
        publishCount: 0,
        depositAmount: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getOrderCount();
        this.getPublishCount();
        this.getDepositAmount();
    },
    
    getOrderCount: function() {
        // 实际开发中这里应该调用API获取数据
        // 这里使用模拟数据
        const completedOrders = 2; // 从orders.js中可以看到有1个已完成订单
        this.setData({
            orderCount: completedOrders
        });
    },
    
    getPublishCount: function() {
        // 实际开发中这里应该调用API获取数据
        // 这里使用模拟数据
        const publishedOrders = 3; // 模拟3个已发布订单
        this.setData({
            publishCount: publishedOrders
        });
    },
    
    navigateToOrders: function() {
        console.log('正在跳转到订单页面');
        wx.switchTab({
            url: '/pages/orders/orders',
            fail: (err) => {
                console.error('跳转到订单页面失败', err);
                wx.showToast({
                    title: '跳转失败，请重试',
                    icon: 'none'
                });
            }
        });
    },
    
    navigateToPublish: function() {
        console.log('正在跳转到我的发布页面');
        wx.navigateTo({
            url: '/pages/my-posts/my-posts',
            fail: (err) => {
                console.error('跳转到我的发布页面失败', err);
                wx.showToast({
                    title: '跳转失败，请重试',
                    icon: 'none'
                });
            }
        });
    },
    
    navigateToPublishDemand: function() {
        console.log('正在跳转到发布需求页面');
        wx.switchTab({
            url: '/pages/publish/publish',
            fail: (err) => {
                console.error('跳转到发布需求页面失败', err);
                wx.showToast({
                    title: '跳转失败，请重试',
                    icon: 'none'
                });
            }
        });
    },
    
    navigateToRecentOrders: function() {
        console.log('正在跳转到最近订单页面');
        wx.navigateTo({
            url: '/pages/recent-orders/recent-orders',
            fail: (err) => {
                console.error('跳转到最近订单页面失败', err);
                wx.showToast({
                    title: '跳转失败，请重试',
                    icon: 'none'
                });
            }
        });
    },
    
    changeAvatar: function() {
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                const tempFilePaths = res.tempFilePaths
                this.setData({
                    'userInfo.avatar': tempFilePaths[0]
                })
                // 上传头像到服务器
                wx.uploadFile({
                    url: 'https://your-domain.com/api/user/avatar',
                    filePath: tempFilePaths[0],
                    name: 'avatar',
                    header: { 'Authorization': `Bearer ${wx.getStorageSync('token')}` },
                    success: (res) => {
                        const data = JSON.parse(res.data);
                        if (data.code === 200) {
                            this.setData({ 'userInfo.avatar': data.data.avatar });
                        }
                    },
                    fail: (err) => {
                        console.error('头像上传失败', err)
                    }
                })
            }
        })
    },
    
    // 修改getDepositAmount方法
    getDepositAmount: async function() {
        try {
            const res = await wx.request({
                url: 'https://your-domain.com/api/deposit/balance',
                header: { 'Authorization': `Bearer ${wx.getStorageSync('token')}` }
            });
            if (res && res.data && res.data.code === 200) {
                this.setData({ depositAmount: res.data.data.balance || 0 });
            } else {
                this.setData({ depositAmount: 0 });
                console.error('获取保证金失败', res);
            }
        } catch (err) {
            console.error('获取保证金失败', err);
            this.setData({ depositAmount: 0 });
        }
    },
    

    
    updateDeposit: function(amount, type) {
        console.log('更新保证金:', type, '金额:', amount);
        let newAmount = parseFloat(this.data.depositAmount);
        amount = parseFloat(amount);
        if(type === 'recharge') {
            newAmount += amount;
        } else if(type === 'withdraw') {
            newAmount -= amount;
        }
        this.setData({
            depositAmount: newAmount
        });
        console.log('更新后保证金:', newAmount);
    },
    
    navigateToRecharge: function() {
        wx.navigateTo({
            url: '/pages/recharge/recharge',
            fail: (err) => {
                console.error('跳转到充值页面失败', err);
                wx.showToast({
                    title: '跳转失败，请重试',
                    icon: 'none'
                });
            }
        });
    },
    
    navigateToWithdraw: function() {
        wx.navigateTo({
            url: '/pages/withdraw/withdraw',
            fail: (err) => {
                console.error('跳转到提现页面失败', err);
                wx.showToast({
                    title: '跳转失败，请重试',
                    icon: 'none'
                });
            }
        });
    },
    
    changeNickname: function() {
        wx.showModal({
            title: '修改用户名',
            content: '请输入新的用户名',
            editable: true,
            placeholderText: this.data.userInfo.nickname,
            success: (res) => {
                if (res.confirm && res.content) {
                    this.setData({
                        'userInfo.nickname': res.content
                    })
                    // 更新用户名到服务器
                    wx.request({
                        url: 'https://your-actual-domain.com/updateNickname',
                        method: 'POST',
                        data: {
                            nickname: res.content
                        },
                        success: (uploadRes) => {
                            console.log('用户名更新成功', uploadRes.data)
                        },
                        fail: (err) => {
                            console.error('用户名更新失败', err)
                        }
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        // 从服务器获取最新头像
        wx.request({
            url: 'https://your-actual-domain.com/getUserInfo', // 请替换为小程序后台配置的合法域名
            success: (res) => {
                if(res.data && res.data.avatar) {
                    this.setData({
                        'userInfo.avatar': res.data.avatar
                    })
                }
            },
            fail: (err) => {
                console.error('获取用户信息失败', err)
            }
        })
        this.getPublishCount();
        this.getDepositAmount();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})