// pages/introduce/detail.js
/* var base64 = require("../../images/base64") */
import CustomPage from '../../base/CustomPage'
import { request } from"../../request/promise.js"
import regeneratorRuntime, { async } from"../../lib/runtime/runtime.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    faq:{}
  },
  async getFaqText(uuid){
    const res = await request({
      url:"/public/faqtext",
      data:{
        uuid
      }
    })
    this.setData({
      faq:res
    })
    wx.setStorageSync('uuid', res)
    wx.stopPullDownRefresh()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {uuid,date} = options;
    const faq = wx.getStorageSync("uuid");
    if(faq && date === faq.faq_date){
      this.setData({
        faq
      })
    }else{
      this.getFaqText(uuid);
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})