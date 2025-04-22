// pages/my-posts/my-posts.js
Page({
  data: {
    posts: [
      {
        id: 1,
        pickupLocation: '校门口麦当劳',
        deliveryLocation: '宿舍3号楼201',
        reward: 5,
        status: '未接取',
        createTime: '2023-05-01 10:00'
      },
      {
        id: 2,
        pickupLocation: '快递点A',
        deliveryLocation: '宿舍5号楼302',
        reward: 8,
        status: '已接取',
        createTime: '2023-05-02 14:30'
      },
      {
        id: 3,
        pickupLocation: '图书馆',
        deliveryLocation: '宿舍1号楼101',
        reward: 10,
        status: '已送达',
        createTime: '2023-05-03 09:15'
      },
      {
        id: 6,
        pickupLocation: '教学楼',
        deliveryLocation: '宿舍6号楼401',
        reward: 9,
        status: '已送达',
        createTime: '2023-05-05 15:20'
      },
      {
        id: 4,
        pickupLocation: '食堂',
        deliveryLocation: '宿舍2号楼305',
        reward: 6,
        status: '未接取',
        createTime: '2023-05-04 08:00'
      },
      {
        id: 5,
        pickupLocation: '超市',
        deliveryLocation: '宿舍4号楼102',
        reward: 7,
        status: '已接取',
        createTime: '2023-05-04 12:30'
      },
      {
        id: 7,
        pickupLocation: '体育馆',
        deliveryLocation: '宿舍7号楼503',
        reward: 12,
        status: '已送达',
        createTime: '2023-05-06 11:45'
      }
    ]
  },

  onLoad() {
    // 实际开发中这里应该调用API获取数据
    // this.getMyPosts();
    
    // 对初始数据进行排序
    this.sortPosts();
  },
  
  sortPosts() {
    const sortedPosts = this.data.posts.sort((a, b) => {
      // 状态优先级：未接取 > 已接取 > 已送达
      const statusOrder = { '未接取': 1, '已接取': 2, '已送达': 3 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      
      // 相同状态按创建时间倒序排列
      return new Date(b.createTime) - new Date(a.createTime);
    });
    
    this.setData({ posts: sortedPosts });
  },

  getMyPosts() {
    wx.request({
      url: 'https://your-actual-domain.com/getMyPosts',
      success: (res) => {
        if(res.data) {
          this.setData({
            posts: res.data
          })
        }
      },
      fail: (err) => {
        console.error('获取我的发布失败', err)
      }
    })
  },

  cancelPost(e) {
    const postId = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认取消',
      content: '确定要取消这个发布吗？',
      success: (res) => {
        if (res.confirm) {
          // 本地模拟取消发布
          const updatedPosts = this.data.posts.filter(post => post.id !== postId)
          this.setData({
            posts: updatedPosts
          })
          wx.showToast({
            title: '取消成功',
            icon: 'success'
          })
        }
      }
    })
  }
})