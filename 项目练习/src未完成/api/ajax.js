//封账通用ajax请求
//返回的是promise对象

import axios from 'axios'
import {message} from 'antd'
//暴露出去
export default function Promise(url,data={},type='GTE') {
  return new Promise((resolve,reject)=>{
    //定义一个promise
    let promise
    //判断是否为get请求
    if(type==='GTE'){
      promise=axios.get(url,{
        params:data
      })
    }else {
      promise=axios.post(url,data)
    }
    promise.then(response=>{
      resolve(response.data)
    }).catch(error=>{
      message.error('请求出错'+message.error)
    })


  })
}