//同时发送异步代码的次数
let ajaxTimes = 0;
export const request=(params)=>{
    ajaxTimes++;
    wx.showLoading({
        title: '加载中',
        mask:true
    });

    //定义公共的url
    const {customBaseUrl} = params
    console.log(customBaseUrl);
    let baseUrl =""
    if(customBaseUrl){
        baseUrl = customBaseUrl
    }else{
        baseUrl="https://test.zhipu-china.com:20111"
    } 
    return new Promise((resolve,reject)=>{
        
        wx.request({
          ...params,
          url:baseUrl+params.url,
          success:(result)=>{
              console.log(result.data);
              resolve(result.data.message);
          },
          fail:(err)=>{
              reject(err);
          },
          complete:()=>{
              ajaxTimes--;
              if(ajaxTimes===0){
                 wx.hideLoading(); 
              }
          }
        });
    })
}