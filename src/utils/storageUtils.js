import store from 'store'

const USER_KEY= 'user_key'
//保存用户数据
export default {
  //保存数据
  setUser(user){
    store.set(USER_KEY,user)
  },

  //读取数据
  getUser(){
    return store.get(USER_KEY)
  },
  //删除数据
  removeUser(){
    store.remove(USER_KEY)
  }
}