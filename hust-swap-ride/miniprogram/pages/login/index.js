Page({
  data: { email: '', code: '' },
  onEmail(e) { this.setData({ email: e.detail.value }) },
  onCode(e) { this.setData({ code: e.detail.value }) },
  sendCode() {
    wx.cloud.callFunction({ name: 'sendEmailCode', data: { email: this.data.email } })
  },
  verify() {
    wx.cloud.callFunction({ name: 'verifyEmailCode', data: { email: this.data.email, code: this.data.code } })
      .then(res => {
        if (res.result.ok) wx.reLaunch({ url: '/pages/home/index' })
      })
  }
})
