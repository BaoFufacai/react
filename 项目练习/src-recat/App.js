import React, {Component} from 'react'




export default class App extends React.Component {

  //初始化数据
  state={
    count:0
  }
  constructor(props){
    super(props)
    this.numberRef=React.createRef()

  }
  increment=()=>{
    //读取数据
    const  number=this.numberRef.current.value*1
    this.setState(state=>({count:state.count+number}))

  }
  decrement=()=>{
    const number=this.numberRef.current.value*1
    this.setState(state=>({count:state.count-number}))


  }
  incrementIfOdd=()=> {
    const number=this.numberRef.current.value*1
    if (this.state.count % 2 === 1) {
      this.setState(state => ({count: state.count + number}))
    }

  }
  incrementAsync=()=>{
    setTimeout(()=>{
      const number=this.numberRef.current.value*1
      this.setState(tate=>({count: this.state.count+number}))

    },1000)

  }
  render() {
    const {count}=this.state
    return (
      <div>
        <p>click {count} times</p>
        <div>
          <select ref={this.numberRef}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select> &nbsp;&nbsp;
          <button onClick={this.increment}>+</button>&nbsp;&nbsp;
          <button onClick={this.decrement}>-</button>&nbsp;&nbsp;
          <button onClick={this.incrementIfOdd}>increment if odd</button>&nbsp;&nbsp;
          <button onClick={this.incrementAsync}>increment async</button>
        </div>

      </div>
    )
  }
}