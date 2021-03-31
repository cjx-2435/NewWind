/**
 * promise 形式的getSetting
 */
export const getSetting=()=>{
    return new Promise((resolve,reject)=>{
       wx.getSetting({
           success:(result)=>{
               resolve(result);
           },
           fail:(err)=>{
               reject(err);
           }
       });
    })
}

export const getUserInfo=()=>{
    return new Promise((resolve,reject)=>{
       wx.getUserInfo({
           success:(result)=>{
               resolve(result);
           },
           fail:(err)=>{
               reject(err);
           }
       });
    })
}

export const checkSession=()=>{
    return new Promise((resolve,reject)=>{
       wx.checkSession({
           success:(result)=>{
               resolve(result);
           },
           fail:(err)=>{
               reject(err);
           }
       });
    })
}

export const login=()=>{
    return new Promise((resolve,reject)=>{
       wx.login({
           success:(result)=>{
               resolve(result);
           },
           fail:(err)=>{
               reject(err);
           }
       });
    })
}

export const showToast=(params)=>{
    return new Promise((resolve,reject)=>{
       wx.showToast({
           ...params,
           success:(result)=>{
               resolve(result);
           },
           fail:(err)=>{
               reject(err);
           }
       });
    })
}

export const chooseAddress=()=>{
    return new Promise((resolve,reject)=>{
       wx.chooseAddress({
           success:(result)=>{
               resolve(result);
           },
           fail:(err)=>{
               reject(err);
           }
       });
    })
}

export const showModal=(params)=>{
    return new Promise((resolve,reject)=>{
        wx.showModal({
            ...params,
            title:'提示',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {
                resolve(result);
            },
            fail:(err)=>{
                reject(err);
            }
          });
    })
}