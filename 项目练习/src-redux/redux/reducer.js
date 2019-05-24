import {INCREMENT, DECREMENT} from './action-types'

export default function count(state=1,action) {
  console.log('11244',state,action)
  switch (action.type) {
    case INCREMENT:
      return state+action.data
    case DECREMENT:
      return state-action.data
    default:
      return state

    
  }

}