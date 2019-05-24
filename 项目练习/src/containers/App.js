import React, {Component} from 'react'
import {connect} from 'react-redux'
import Counter from '../components/Counter'
import {increment,decrement} from '../redux/actions'


function mapStateToProps(state) {
  return{
    count:state
  }
  
}

function mapDispatchToProps(dispatch) {
  return{
    increment:(number)=>dispatch(increment(number)),
    decrement:(number)=>dispatch(decrement(number))
  }
}
//容器组件，通过countct包装组件
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter)





