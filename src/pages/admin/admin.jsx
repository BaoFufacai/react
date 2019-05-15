import React,{Component} from "react";
import {Redirect,Route,Switch} from 'react-router-dom'
import { Layout } from 'antd';
import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav/left-nav'
import Category from '../category/category'
import Line from '../charts/line'
import Header from '../../components/header'

import Pie from '../charts/pie'
import Bar from '../charts/bar'
import Product from '../product/product'
import Home from '../home/home'
import Role from '../role/role'
import User from '../user/user'
const {  Footer, Sider, Content } = Layout

//
export default class Admin extends Component{
  render() {
    //读取用户数据
    const user=memoryUtils.user
    //判断有内有登录
    if(!user||!user._id){
      return <Redirect  to='/login'/>
    }
    return (
        <Layout style={{height:'100%'}}>
          <Sider>
            <LeftNav/>
          </Sider>
          <Layout>
            <Header>Header</Header>
            <Content style={{backgroundColor: '#fff'}}>
              <Switch>
                <Route path='/home' component={Home}/>
                <Route path='/category' component={Category}/>
                <Route path='/product' component={Product}/>
                <Route path='/role' component={Role}/>
                <Route path='/user' component={User}/>
                <Route path='/charts/bar' component={Bar}/>
                <Route path='/charts/line' component={Line}/>
                <Route path='/charts/pie' component={Pie}/>
                <Redirect to='/home'/>
              </Switch>
            </Content>
            <Footer  style={{textAlign: 'center', color: '#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
          </Layout>
        </Layout>
    )
  }

}