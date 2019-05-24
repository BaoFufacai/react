import React, {Component} from 'react'
import {Button, Card, Modal, Table,message} from 'antd'
import{ PAGE_SIZE} from '../../utils/constants'
import {reqRoles,reqAddRole,reqUpdateRole} from '../../api'
import AddForm from "./Add-form";
import AuthForm from './auth-form'
import {connect} from 'react-redux'
import {formateDate} from '../../utils/dateUtils'
import storageUtils from '../../utils/storageUtils'


import {logout} from '../../redux/actions'




 class Role extends Component {

  state={
    roles:[],//获取角色初始化列表
    role:{},//menu对象
    isShowAdd:false,// 显示隐藏确认框
    isShowAuth: false//设置权限
  }
  constructor(props){
    super(props)
    this.auth=React.createRef()
  }

  initColumn=()=>{
    this.columns=[
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (create_time) => formateDate(create_time)
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: formateDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      },
    ]
  }
  //记录当前角色
  onRow=(role)=>{
    return{
      onClick: event => {//点击当前的行
        this.setState({
          role
        })

      }
    }

  }
  //获取所有角色请求函数
  getRoles=async ()=> {
    //获取数据
    const result = await reqRoles()
    //判断成功失败
    if (result.status === 0) {
      const roles = result.data
      this.setState({
        roles
      })
    }
  }
  //添加角色
  addRole=()=>{
    //收集数据
    this.form.validateFields((err,values)=>{
      //重置数据不让显示上次默认数据
      this.form.resetFields()
      //没有值验证通过
      if(!err){
        //收集表当数据
        const {roleName}=values
        this.setState({isShowAdd:false})
        //发送请求
        const result=reqAddRole(roleName)
        // 根据结果提示/更新列表显示
        if(result.status===0){
          message.success('添加角色成功')
          // 新产生的角色，只限是重新回去
          const role=result.data
          //更新状态：基于原本状态数据更新
          this.setState(state=>({
            roles:[...state.roles,role]
          }))

        }else {
          message.error('添加角色失败')
        }

      }
    })
  }
  //更新状态
  updateRole=()=>{
    //得到menu对象
  const role= this.state.role

    // 得到最新的menus
    const menus = this.auth.current.getMenus()
    //接收新的
    role.menus=menus
    role.auth_time = Date.now()
    role.auth_name = this.props.user.username
    //隐藏确认框
    this.setState({isShowAuth: false})
    //请求更新
    const result=reqUpdateRole(role)
    //判断成功失败
    if(result.status===0){
      //如果更新修改自己数据强制退出
      if(role._id===this.props.user.role._id){
        this.props.user={}

        message.success('当前用户角色权限修改了, 重新登陆')
      }else {
        message.success('设置角色权限成功')
        //更新状态：权限数据
        this.setState({
          roles: [...this.state.roles]
        })
       }
      }
    }




  componentWillMount() {
    this.initColumn()
  }
  componentDidMount() {
    this.getRoles()
  }

  render() {
    const {roles,role,isShowAdd,isShowAuth}=this.state

    const title=(
     <span>
        <Button type="primary" onClick={()=>this.setState({isShowAdd:true})}>添加角色</Button> &nbsp;&nbsp;
        <Button type="primary" disabled={!role._id} onClick={()=>this.setState({isShowAuth: true})}>设置角色权限</Button>
     </span>
    )

    return (
      <Card title={title}>
        <Table
          bordered//带边框的
          pageSizeOptions={{defaultCurrent: PAGE_SIZE}}
          rowKey='_id'
          rowSelection={{type: 'radio', selectedRowKeys:[role._id]}}
          dataSource={roles}
          columns={this.columns}
          onRow={this.onRow}
        />
        <Modal
          title="添加分类"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={()=>{
            this.setState({isShowAdd:false})
            this.form.resetFields()//去掉数据
          }}
        >
          <AddForm
            setForm={(form) => {this.form = form}}
          />
        </Modal>
        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={()=>{
            this.setState({isShowAuth: false})

          }}
        >
          <AuthForm ref={this.auth} role={role}/>
        </Modal>

      </Card>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {logout}
)(Role)
//把form存起来父组件就可以看见form