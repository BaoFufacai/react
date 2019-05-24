import React,{Component} from 'react'
//映射路由组价
import {BrowserRouter,Route,Switch} from 'react-router-dom'
//引入组件
import Login from './pages/login/login'
import Admin from './pages/admin/admin'



export default class App extends Component{
  render() {
    return (
      <BrowserRouter>
        <Switch>
        <Route path='/login' component={Login}></Route>
        <Route path='/' component={Login}/>
        </Switch>
      </BrowserRouter>
    )
  }

}