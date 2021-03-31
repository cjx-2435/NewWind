// pages/login/index.js
import { request } from"../../request/promise.js"
import { getSetting,getUserInfo,checkSession,login, showToast } from"../../utils/asyncWx.js"
import regeneratorRuntime, { async } from"../../lib/runtime/runtime.js"

Page({
  handlegetUserInfo(e){
    console.log(e)
    this.autoLogin(e.detail);
    //wx.setStorageSync('user_info', userInfo);  
  },
  setUserInfo(userInfo){
    this.setData({userInfo});
    wx.setStorageSync('user_info', this.data.userInfo);
  },
  async handleLogin(){
    const res = await login()
    console.log(res.code)
    this.data.code = res.code
  },
  async autoLogin(args){
    console.log(args);
    const {userInfo}=args;
    const startTime = new Date().getTime()
    let res;
    try{
        res = await request({
        //customBaseUrl:"https://test.zhipu-china.com:20201/wx",
        customBaseUrl:"http://localhost:20201/wx",
        url:"/login2",
        method:"POST",
        data:{
          //user_rawData:this.data.user_rawData,
          //user_signature:this.data.user_signature,
          encryptedData:args.encryptedData,
          iv:args.iv,
          code:this.data.code 
        }
      });
    }catch(e){
      console.log(e);
    }
    console.log(res);
    console.log(new Date().getTime() - startTime);
    //这里应该能获得到token
    if(res && res.token){
      console.log(res.token);
      wx.setStorageSync("token", res.token);
    }else{
      showToast({title: res.msg})
      return
    }
    //todo 应该在登录时获取token
    this.setUserInfo(userInfo);
    if(res.hasPhoneNum){
      wx.setStorageSync('autoLogin', true)
      wx.switchTab({
        url: '/pages/user/index',
      });
    }
  },
  async handlegetPhoneNumber(e){
    console.log(e);
    try{
      console.log("handlegetPhoneNumber内trycatch");
      const res = await checkSession()
      console.log(res);
      const {detail} = e
      console.log(detail);
      if(detail.errMsg === "getPhoneNumber:ok"){
        const token = wx.getStorageSync("token");
        const header = { Authorization: token };
        const res2 = await request({
        method:"POST",
        customBaseUrl:"https://test.zhipu-china.com:20201/wx",
        url:"/register",
        data:{
          encryptedData:detail.encryptedData,
          iv:detail.iv
        },
        header
      })
      console.log(res2)
  
      if(res2.msg === "success"){
        wx.setStorageSync('autoLogin', true)
        wx.switchTab({
        url: '/pages/user/index',
      });
      }
      }
     }catch(error){
      console.log(error)
      this.handleLogin()
    } 
  },
  async init(){
    // 查看是否授权
    console.log("start init")

    const res = await login()
    console.log(res.code)
    this.data.code = res.code

    const res1 = await getSetting();
    console.log(res1)
    if (res1.authSetting['scope.userInfo']){
      // 已经授权，可以直接调用 getUserInfo 获取头像昵称
      const res2 = await getUserInfo();
      this.setUserInfo(res2.userInfo);
    }
  },
  
  
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    code : String,
    userInfo: {},
    //user_rawData: String,
    //user_signature: String,
    user_encryptedData: String,
    user_iv: String,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
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
    // console.log("登陆页销毁");
    //   wx.switchTab({
    //     url: '/pages/user/index',
    //   })
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