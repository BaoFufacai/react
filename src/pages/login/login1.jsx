import React,{Component} from 'react'
import login from "./images/logo.png";
import { Form, Icon, Input, Button, message } from 'antd';

import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {reqLogin} from '../../api/index'
import LOGIN from './images/logo.png'
import './login.less'



const Item=Form.Item
//登录login页面
class Login extends Component {
  handleSubmit=(e)=>{
    //阻止默认行为
    e.preventDefault()
    this.props.form.validateFields((err,values)=>{
      if(!err){
        //获取数据
        const {username,password}=values
        const result=reqLogin(username,password)//接收数据
        //判断是否登录成功
        if(result.status===0){
          //登录成功
          message.success('登录成功')
          //保存数据
          const user=memoryUtils.user
          memoryUtils.user=user//保存用户信息
          storageUtils.setUser(user)//浏览器中保存

          //跳转到登录页面
          this.props.history.replace('/')
        }else {
          //错误提示
          message.error(result.msg)
        }

      }else {
        //登录失败校验失败
        console.log('校验失败')
      }
    })
  }
  //自动收集表单数据
  validato=(rule, value, callback)=>{
    //获取数据
    const length= value &&value.length
    const pwdReg = /^[a-zA-Z0-9_]+$/
    if(!value){
      callback('必须密码')
    }else if(value.length<4){
      callback('密码必须大于4位')
    }else if(value.length>12){
      callback('密码必须小于12位')
    }else if(!pwdReg.test(value)){
      callback('密码必须中文英文')
    }else {
      callback()
    }
  }
  render() {
    const {getFieldDecorator}=this.props.form
    return (
      <div className='login'>
        <header className='login-header'>
          <img src={LOGIN} alt="login"/>
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className='login-content'>
          <h2>用户登陆</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {getFieldDecorator('username', {
                rules: [
                  { required: true, message: 'Please input your username!' },
                  {min:4,message:'用户名必须大于4位'},
                  {max:12,message:'用户名必须小于12位'},
                  {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数组或下划线组成'}
                ],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username"
                />,
              )}
            </Item>
            <Item>
              {getFieldDecorator('password', {
                rules: [{ validator:this.validato },],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
                />,
              )}
            </Item>
            <Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Item>
          </Form>

        </section>
      </div>
    )
  }
}

const WrappedNormalLoginForm=Form.create()(Login)

export default WrappedNormalLoginForm