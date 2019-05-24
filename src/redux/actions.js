/*
包含n个action creator函数的模块
同步action: 对象 {type: 'xxx', data: 数据值}
异步action: 函数  dispatch => {}
 */

import {SET_HEAD_TITLE ,RECEIVE_USER,SHOW_ERROR_MSG,RESET_USER}from './actions-types'
import {reqLogin} from '../api'

import storageUtils from '../utils/storageUtils'
//暴露
export const setHeadTitle=(headTitle)=>({type:SET_HEAD_TITLE,data:headTitle})

/*
接收用户的同步action
 */
export const receiveUse=(user)=>({type:RECEIVE_USER,data:user})
//显示错误信息
export const showErrorMsg=(errorMsg)=>({type:SHOW_ERROR_MSG,data:errorMsg})

//退出登录
export const logout=()=>{
  //删除用户信息
  storageUtils.removeUser()
  //返回action对象
  return{type:RESET_USER}
}

//登录异步action
export const login=(username, password)=>{
  return async dispatch=>{
    //发送请求，接收数据
    const result=await reqLogin(username, password)
    // 2.1. 如果成功, 分发成功的同步action
    if(result.status===0){
      const user=result.data
      // 保存local中
      storageUtils.setUser(user)
      // 分发接收用户的同步action
      dispatch(receiveUse(user))
    }else {
      //.2. 如果失败, 分发失败的同步action
      const msg=result.msg
      // message.error(msg)分发
      dispatch(showErrorMsg(msg))
    }

  }

}