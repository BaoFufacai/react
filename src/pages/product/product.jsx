import React, {Component} from 'react'
import {Route ,Redirect,Switch} from 'react-router-dom'

import ProductDetail from './detail'
import ProductHome from './home'
import ProductUpdata from './add-updata'

import './product.less'
//商品路由
export default class Product extends Component {
  render() {
    return (
      <Switch>
        <Route path='/product' component={ProductHome} exact/> {/*路径完全匹配*/}
        <Route path='/product/addupdate' component={ProductUpdata}/>
        <Route path='/product/detail' component={ProductDetail}/>
        <Redirect to='/product'/>
      </Switch>
    )
  }
}