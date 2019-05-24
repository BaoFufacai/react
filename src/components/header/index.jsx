import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {formateDate} from '../../utils/dateUtils'

import {reqWeather} from '../../api/index'
import menuList from '../../config/menuConfig'
import LinkButton from '../link-button'
import './index.less'
import { Modal } from 'antd';
import {connect} from 'react-redux'
import {logout} from '../../redux/actions'
const confirm = Modal.confirm;


class Header extends Component {
  state={
    currentTime:formateDate(Date.now()),//获取当前时间
    dayPictureUrl:'',//天气图片地址获取
    weather: '', // 天气的文本
  }
  //获取当前时间更新
  getTime=()=>{
    this.intervalId=setInterval(()=>{
    //获取当前时间
    const currentTime=formateDate(Date.now())
    //更新时间
    this.setState({currentTime})
  },1000)
}
//获取当前天气更新
  getWeather=async ()=>{
    // 调用接口请求异步获取数据
    const {dayPictureUrl,weather}=await reqWeather('北京')

    //更新状态
    this.setState({dayPictureUrl,weather})
  }
  //获取当前路由路径的更新

  getTitle=()=>{
    //先得到当前路径
   const  path=this.props.history.location.pathname
    let title
    menuList.forEach(item=>{
      //判断是否有子路径
      if(item.key===path){
        //如果当前item对象的key与path一样,item的title就是需要显示的title
        item=item.title
      }else if(item.children){
        //在所有子分类中查找匹配的
        const cItem=item.children.find(cItem=>cItem.key===path)
        // 如果有值才说明有匹配的
        if(cItem){
          //取出cItem的值
          item=cItem.title
        }
      }
    })
    return title
  }

  //退出登录页面
  logout=()=>{
    confirm({
      title: 'Do you Want to delete these items?',
      content: 'Some descriptions',
      onOk:()=> {

        this.props.logout()
        console.log('OK');
      },
    });
}

  componentDidMount () {
    // 获取当前的时间
    this.getTime()
    // 获取当前天气
    this.getWeather()
  }
  componentWillUnmount () {
    // 清除定时器
    clearInterval(this.intervalId)
  }

  render() {
    //读取数据
    const {currentTime,dayPictureUrl,weather}=this.state
    //取出用户数据
    const username=this.props.user.username
    // 得到当前需要显示的title
    //const title = this.getTitle()
    const title = this.props.headTitle
    return (
        <div className='header'>
          <div className='header-top'>
            <span>欢迎，{username}</span>
            <LinkButton onClick={this.logout}>退出</LinkButton>
          </div>
          <div className='header-bottom'>
            <div className='header-bottom-left'>{title}</div>
            <div className='header-bottom-right'>
              <span>{currentTime}</span>
              <img src={dayPictureUrl} alt="weather"/>
              <span>{weather}</span>
            </div>
          </div>
        </div>
    )
  }
}
export default connect(
  state => ({headTitle: state.headTitle,user: state.user}),
  {logout}
)(withRouter(Header))