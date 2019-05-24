/*
包含n个用来创建action的工厂函数(action creator)
 */
/*
增加的action
 */
import {INCREMENT, DECREMENT} from './action-types'
export const increment=number=>({type:INCREMENT,data:number})
//减少action
export const  decrement=number=>({type:DECREMENT,data:number})