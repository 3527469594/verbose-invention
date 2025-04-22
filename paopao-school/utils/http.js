// 封装基础请求方法
const request = (url, method, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://your-domain.com${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      },
      fail: (err) => reject(err)
    })
  })
}