//引入接口
import ajax from './ajax'
const BASE = ''
//用户信息
export const reqLogin=(username,password)=>ajax(BASE +'/login',{username,password},'POST')

export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')