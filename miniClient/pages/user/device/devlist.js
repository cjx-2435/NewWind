// pages/user/device/devlist.js
import { request } from"../../../request/promise.js"
import { showToast } from"../../../utils/asyncWx.js"
import regeneratorRuntime, { async } from"../../../lib/runtime/runtime.js"


Page({
  /**
   * 页面的初始数据
   */
  data: {
    devList:[],
    showActionsheet: false,
    groups: [],
    hiddenPswInput: true
  },
  deviceId:"",
  changeModelDevId:"",
  timeId:-1,
  //输入框
  handleInput(e){
    const {value} = e.detail;
    const {deviceid} = e.currentTarget.dataset
    console.log(deviceid);
    console.log(value);
    if(!value.trim()){
      return;
    }
    clearTimeout(this.timeId);
    this.timeId = setTimeout(()=>{
      this.changeRemark(deviceid,value);
    },1000) 
  },
  async changeRemark(device_id,value){
    const token = wx.getStorageSync('token')
    if(!token){
      return
    }
    const header = {Authorization:token};
    const res = await request({
      url:"/private/my/editremark",
      method:"post",
      data:{
        device_id,
        value
      },
      header
    }) 
  },
  close: function () {
    this.setData({
        showActionsheet: false
    })
  },
  async changeRunModel(e) {
    const {value} = e.detail
    console.log(e);
    this.close()
    const token = wx.getStorageSync('token')
    if(!token){
      showToast({title:"没有权限"});
      return
    }
    const header = {Authorization:token};
    const {msg} = await request({
      customBaseUrl:"https://fresh-air.zhipu-china.com:20111",
      url:"/api/device/changeRunMode",
      data:{
        RunMode:value,
        DevCode:this.changeModelDevId
      },
      header
    })
    showToast({title:"变更"+msg});
    if(msg==="success"){
      const devList = this.data.devList;
      const index = devList.findIndex(v=>v.device_id===this.changeModelDevId);
      devList[index].running_mode = value;
      devList[index].running_mode_text = this.data.groups[value-1].text;
      this.setData({devList})
    }
    this.changeModelDevId="";
  },
  handleChangeDev(e){
    console.log("handleChangeDev");
    const {deviceid} = e.currentTarget.dataset
    if(deviceid === this.deviceId){
      return
    }else{
      const devList = this.data.devList;
      devList.forEach((v)=>v.isActive=(v.device_id===deviceid));
      this.refreshDevice(devList,deviceid);
    }
  },
  refreshDevice(devList,deviceid){
    this.setData({
        devList
      })
    wx.setStorageSync("device_id", deviceid);
    this.deviceId = deviceid
  },
  handleChangedevMode(e){
    const {deviceid} = e.currentTarget.dataset
    console.log(deviceid);
    this.changeModelDevId = deviceid;
    this.setData({
      showActionsheet: true,
    })
  },
  handleWatchData(e){
    const {deviceid} = e.currentTarget.dataset;
    wx.setStorageSync("device_id", deviceid);
    wx.switchTab({
      url: '/pages/console/index',
    });
  },
  async handleRemoveDevice(e){
    let {deviceid} = e.currentTarget.dataset;
    const token = wx.getStorageSync('token')
    const header = {Authorization:token};
    const {msg} = await request({
      url:"/private/my/removedev",
      method:"post",
      data:{
        device_id:deviceid
      },
      header
    })
    showToast({title:"解绑"+msg})
    if(msg === "success"){
      const devList = this.data.devList
      const index = devList.findIndex(v=>v.device_id===deviceid);
      devList.splice(index,1);
      if(devList.length != 0 ){
        /* const noActive = devList.every(v=>!v.isActive);
        if(noActive){
          devList[0].isActive = true;
        } */
        if(deviceid === this.deviceId){
          devList[0].isActive = true;
          deviceid = devList[0].device_id;
        }
      }
      this.refreshDevice(devList,deviceid);
    }
  },
  catch(){
    //阻止事件冒泡e
  },
  async switch1Change(e){
    let {deviceid} = e.currentTarget.dataset;
    console.log(e);
    const token = wx.getStorageSync('token')
    const header = {Authorization:token};
    const {value} = e.detail;
    console.log(value);
    const {msg} = await request({
      url:"/private/my/switchdev",
      method:"post",
      data:{
        device_id:deviceid,
        switch:value
      },
      header
    })
    showToast({title:msg}) 
  },
  async getDevList(token){
    console.log("获取列表开始");
    await this.getRunModelList();
    console.log("获取列表结束");
    const header = {Authorization:token};
    const deviceId = wx.getStorageSync("device_id");
    if(!deviceId){
      console.log("return");
      return;
    }
    this.deviceId = deviceId
    const {devList} = await request({
      url:"/private/my/devlist",
      method:"post",
      header
    })
    console.log(devList);
    this.setData({
      devList:devList.map(v=>({
        ...v,
        isActive:deviceId===v.device_id,
        device_bind_date_zh:new Date(v.device_bind_date*1000).toISOString().substring(0,19).replace("T"," "),
        running_mode_text: this.data.groups[v.running_mode -1].text
      }))
    })
  },
  async getRunModelList(){
    console.log("getRunModelList");
    const {runModeList} = await request({
      url:"/public/runmodelist"
    });
    console.log("getRunModelList");
    this.setData({
      groups:runModeList.map(v=>({
        ...v,
        type: v.warn? "warn" : "default"
      }))
    })
    console.log("getRunModelList");
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  handleCheckPsw(e){
    console.log(e.detail.value);
    if(e.detail.value==="cp@123"){
      wx.setStorageSync('token', "XXXXXXXXXXXXXtest");
      const token = wx.getStorageSync('token')
      this.getDevList(token);
      this.setData({
        hiddenPswInput:true
      })
      showToast({title:"添加成功"})
    }else{
      showToast({title:"添加失败"})
    }
  },
  scan(){
    /* wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode'],
      success: (result)=>{
        console.log(result.result);
      }
    }); */
    //wx.setStorageSync('device_id', result.result);
    //test todo 向服务器发起绑定设备请求
    this.setData({
      hiddenPswInput:!this.data.hiddenPswInput
    })
    /* wx.setStorageSync('device_id', "864333046279881");
    const token = wx.getStorageSync('token')
    this.getDevList(token) */
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
    /*
    const token = wx.getStorageSync('token')
    if(!token){
      wx.navigateTo({
        url: '/pages/login/index',
      })
     return;
    } */
    const token = wx.getStorageSync('token')
    if(token){
      this.getDevList(token)
    }
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