// pages/user/index.js
import { chooseAddress,getSetting,getUserInfo } from "../../utils/asyncWx.js";
import { request } from"../../request/promise.js"
import { showToast } from"../../utils/asyncWx.js"
import regeneratorRuntime, { async } from"../../lib/runtime/runtime.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    deviceid:"",
    showActionsheet: false,
    groups: []
  },
  handleChangedevMode(){
    this.setData({
      showActionsheet: true,
    })
  },
  close: function () {
    this.setData({
        showActionsheet: false
    })
  } ,
  async changeRunModel(e) {
    const {value} = e.detail
    console.log(e);
    this.close()
    await this.changeRunModelAsync(value)
  },
  async changeRunModelAsync(value){
    const token = wx.getStorageSync('token')
    if(!token){
      showToast({title:"没有权限"}); 
      return
    }
    const header = {Authorization:token};
    const {msg} = await request({
      customBaseUrl:"https://fresh-air.zhipu-china.com:20111",
      url:"/api/device/changeRunMode",
      method:"post",
      data:{
        RunMode:value,
        DevCode:this.data.deviceid
      },
      header
    })
    showToast({title:"变更"+msg});
  },
  handleNavDeviceList(){
    console.log("导航到设备管理页面");
    if(this.data.userInfo.nickName){
      wx.navigateTo({
      url: '/pages/user/device/devlist'
      });
    }else{
      showToast({
        title:"请先登录"
      })
    }
  },
  async handleChooseAddress() {
    //获取用户权限 状态
    try{
     const address = await chooseAddress();
     wx.setStorageSync("address", address); 
    }catch(error){
      console.log(error);
    }
  },
  async handleCloseDev(){
    await this.changeRunModelAsync(201)
  },
  async getRunModelList(){
    //console.log("getRunModelList");
    /* const {runModeList} = await request({
      url:"/public/runmodelist"
    }); */
    const runModeList = wx.getStorageSync('run_model_list')
    if(!runModeList){
      return
    }
    //console.log("getRunModelList");
    this.setData({
      groups:runModeList.map(v=>({
        ...v,
        type: v.warn? "warn" : "default"
      }))
    })
    console.log("getRunModelList");
  },
  handleSetNoAutoLogin(){
    wx.setStorageSync('autoLogin', false)
    const userInfo = {}
    this.setData({
      userInfo
    })
  },
  async init(){
    // 查看是否授权
    const res1 = await getSetting();
    const deviceid = wx.getStorageSync('device_id')
    if (res1.authSetting['scope.userInfo'] && wx.getStorageSync('autoLogin')){
      // 已经授权，可以直接调用 getuserInfo 获取头像昵称
      const {userInfo} = await getUserInfo();
      this.setData({
        userInfo,
        deviceid
      })
    }
    this.getRunModelList();
    //todo 查询是否存在token值，不存在则wx.login 再请求token
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onPageScroll(){

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    /* const userInfo=wx.getStorageSync('user_info')
    this.setData({userInfo}) */
    this.init();
    
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
    wx.stopPullDownRefresh();
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