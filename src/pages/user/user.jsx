import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd'
import LinkButton from '../../components/link-button'
import {formateDate} from '../../utils/dateUtils'
import {reqUsers,reqDeleteUser,reqAddOrUpdateUser} from '../../api'
import  UserForm from './user-form'

//用户界面路由
export default class User extends Component {
  state={
    users: [],//所有用户列表
    roles: [], // 所有角色列表
    isShow:false
  }

  //
  initColumns=()=>{
    this.columns=[
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },

      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: (role_id) => this.roleNames[role_id]
      },
      {
        title: '操作',
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>
        )
      },
    ]

}
//请求所有数据
  getUsers=async ()=>{
    const result=await reqUsers()
    if(result.status===0){
      const {users, roles}=result.data
      this.initRoleNames(roles)
      this.setState({
        users,
        roles
      })
    }
  }
  /*
根据role的数组, 生成包含所有角色名的对象(属性名用角色id值)
 */
  initRoleNames=(roles)=>{
    const roleNames=roles.reduce((per,role)=>{
      per[role._id]=role.name
      return per
    },{})
    //保存一下
    this.roleNames=roleNames

  }

  //删除用户
  deleteUser=(user)=>{
    Modal.confirm({
      title: `确认删除${user.username}吗?`,
      onOk: async () =>{
        const result=await reqDeleteUser(user._id)
        if(result.status===0) {
          message.success('删除成功')
          this.getUsers()
        }
      }
    });

   }
   //显示文本输入框
  showAdd=()=>{
    this.user = null // 去除前面保存的user
    this.setState({isShow:true})
  }

   //创建用户添加更新
  addOrUpdateUser=async ()=>{
    //隐藏文本框
    this.setState({isShow: false})
    console.log(this);
    //debugger
    //收集表单数据
    const user=this.form.getFieldsValue()

    this.form.resetFields()
    //如果更新给需要给user指定_id属性
    if(this.user){
      user._id=this.user._id
    }
    // 2. 提交添加的请求
    const result=await reqAddOrUpdateUser(user)
    // 3. 更新列表显示
    if(result.status===0){
      message.success(`${this.user ? '修改' : '添加'}用户成功`)
      //在重新请求列表
      this.getUsers()
    }

  }
  //显示页面保存数据
  showUpdate=(user)=>{
    this.user=user//保存数据
    this.setState({
      isShow:true
    })

  }


  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getUsers()
  }

  render() {
    const {isShow,users,roles}=this.state
    const user=this.user || {}
    const title=<Button type='primary' onClick={this.showAdd}>创建用户</Button>
    return (
      <Card title={title} >
        <Table
          bordered
          rowKey='_id'
          dataSource={users}
          columns={this.columns}
          pagination={{defaultPageSize: 2}}
        />
        <Modal
          title={user._id ? '修改用户' : '添加用户'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={() => {
            //this.form.resetFields()
            this.setState({isShow: false})
          }}
        >
          <UserForm
            setForm={form=>this.form=form}
            roles={roles}
            user={user}
          />
        </Modal>
      </Card>

    )
  }
}