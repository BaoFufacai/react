//封账通用ajax请求
//返回的是promise对象

import axios from 'axios'
import {message} from 'antd'
export default function ajax(url,data={},type='GET') {
  return new Promise((resolve,reject)=>{
    //定义一个promis
    let Promise
    if(type==='GET'){
      Promise= axios.get(url,{
        params:data
      })
    }else {
     Promise= axios.post(url, data)
    }
    Promise.then(response=>{
      resolve(response.data)
    }).catch(error=>{
      message.error('请求出错了: ' + error.message)
    })
  })
}