import React, {Component} from 'react'
import { Menu, Icon, Button } from 'antd';
import {Link,withRouter} from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import MenuLit from '../../config/menuConfig'
import './index.less'
const SubMenu = Menu.SubMenu;




 class LeftNav extends React.Component {

  getMenuNodes=(MenuLit)=>{
    // 得到当前请求的路由路径
    const path = this.props.location.pathname
    return MenuLit.reduce((pre, item)=>{
      //判断是否有子分类
      if(!item.children){
        pre.push((
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon}/>
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        ))
      }else {
            //当前路径
         const  cItem=item.children.find(cItem=>cItem.key===path)
        // 如果存在, 说明当前item的子列表需要打开
        if(cItem){
          //// 如果存在, 说明当前item的子列表需要打开
          this.openKey = item.key
        }

            pre.push((
              <SubMenu
                key={item.key}
                title={
                  <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
                }
              >
                {this.getMenuNodes(item.children)}
              </SubMenu>

            ))
      }
      return pre
    },[])

  }
      //让他只渲染一次
      componentWillMount() {
       this.menuNodes =this.getMenuNodes(MenuLit)
      }
  render() {
        //得到当前路径
    const path=this.props.location.pathname
    // 得到需要打开菜单项的key
    const openKey = this.openKey


    return (
        <div className='left-nav'>
          <header className='left-nav-header'>
            <img src={logo}/>
            <h1>硅谷后台</h1>
          </header>
          <Menu
            defaultOpenKeys={[openKey]}
            selectedKeys={[path]}
            mode="inline"
            theme="dark"
          >
            {
              this.menuNodes
            }
          </Menu>
      </div>
    )
  }
}
export default withRouter(LeftNav)