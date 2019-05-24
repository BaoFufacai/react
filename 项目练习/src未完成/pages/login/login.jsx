import React, {Component} from 'react'
import { Form, Icon, Input, Button, } from 'antd';
import './login.less'
import login from './images/logo.png'
const Item=Form.Item


 class Login extends Component {

   handleSubmit=(e)=>{
     e.preventDefault();
     this.props.form.validateFields((err, values) => {
       if (!err) {
         //获取数据
         const {username,password}=values
         console.log('登录成功',username,password);
       }else {
         console.log('校验失败')
       }
     });


   }
   validato=(rule, value, callback)=>{
     //获取当前用户信息长度
     const values = value&&!value.length
     //正则验证
     const pattern=/^[a-zA-Z0-9_]+$/

     if(!value){
       callback('密码不能为空')
     }else if(values>4){
       callback('密码必须大于四位')
     }else if(values<6){
       callback('密码必须小于6位')
     }else if(!pattern.test(value)){
       callback('密码必须是英文、数组或下划线组成')
     }else {
       callback()
     }
   }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className='login' >
        <header className='login-header'>
          <img src={login}/>
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className='login-content'>
          <h2>用户登陆</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {getFieldDecorator('username', {
                rules: [
                  {required: true, message: 'Please input your username!' },
                  {min:4,message:'用户名必须大于四位'},
                  {max:12,message:'用户名必须小于十二位'},
                  {pattern:/^[a-zA-Z0-9_]+$/,message:'用户名必须是英文、数组或下划线组成'}
                  ],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                />,
              )}
            </Item>
            <Item>
              {getFieldDecorator('password', {
                rules: [{ validator:this.validato}],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="密码"
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
const WrappedNormalLoginForm = Form.create( )(Login);
  export default WrappedNormalLoginForm