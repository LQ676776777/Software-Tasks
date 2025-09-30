const db = wx.cloud.database()
Page({
  data: { title: '', description: '', price: 0, images: [] },
  onTitle(e) { this.setData({ title: e.detail.value }) },
  onDesc(e) { this.setData({ description: e.detail.value }) },
  onPrice(e) { this.setData({ price: Number(e.detail.value) }) },
  async chooseImgs() {
    const res = await wx.chooseMedia({ count: 3, mediaType: ['image'] })
    const uploads = await Promise.all(
      res.tempFiles.map((f, i) =>
        wx.cloud.uploadFile({ cloudPath: `products/${Date.now()}-${i}.jpg`, filePath: f.tempFilePath })
      )
    )
    this.setData({ images: uploads.map(u => u.fileID) })
  },
  async submit() {
    await db.collection('products').add({
      data: {
        title: this.data.title,
        description: this.data.description,
        price: this.data.price,
        images: this.data.images,
        created_at: Date.now(),
        status: 'pending'
      }
    })
    wx.showToast({ title: '已提交审核' })
    wx.navigateBack()
  }
})
