import React,{Component} from 'react'
import { Form, Icon, Input, Button,message } from 'antd';
import memoryUtil from '../../utils/memoryUtils'
import storageUtils  from '../../utils/storageUtils'

//引入图片
import login from './images/logo.png'
import {reqLogin} from '../../api'
import './login.less'

const Item=Form.Item

//登录页面
class Login extends Component {
  handleSubmit=(e)=>{
    //阻止浏览器默认行为
    e.preventDefault()
    //进行表单控制
    this.props.form.validateFields(async (err,values)=>{
      if(!err){
        //获取教研成功数据验证
        const {username,password}=values
        //接收请求
        const result=await reqLogin(username,password)
        //判断是否登录成功
        if(result.status===0){
          //提示成功
          message.success('登录成功')
          //保存用户
          const usre=result.data
          memoryUtil.user=usre//保存用户数据
          storageUtils.setUser(usre)//保存到浏览器中

          this.props.history.replace('/')
        }else {
          //错误提示
          message.error(result.msg)
        }
      }else {
        console.log('校验失败')
      }
    })
  }
  //自动收集表单验证
  validato=(rule, value, callback)=>{
    //先获取value长度
    const length=value && value.length
    //正则验证
    const pwdReg = /^[a-zA-Z0-9_]+$/
    if(!value){
      callback('必须输入密码')
    }else if(length<4){
      callback('密码必须长度大于4')
    }else if(length>12){
      callback('密码必须小于12位')
    }else if(!pwdReg.test(value)){
      callback('密码必须中文英文')
    }else {
      callback()
    }
  }
  render() {
    //获取form表单方法
    const { getFieldDecorator } = this.props.form;
    return (
      <div className='login'>
        <header className='login-header'>
          <img src={login} alt="login"/>
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className='login-content'>
          <h2>用户登陆</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {getFieldDecorator('username', {
                rules: [
                  { required: true, message: 'Please input your username!' },
                  { min:4,message:'密码必须大于4位'},
                  { max:12,message:'密码必须小于12位'},
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数组或下划线组成'}
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
                rules: [{validator: this.validato}],
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
                Log in
              </Button>
            </Item>
          </Form>
        </section>

      </div>
    )
  }
}

const WrappedNormalLoginForm = Form.create()(Login);
export default  WrappedNormalLoginForm
