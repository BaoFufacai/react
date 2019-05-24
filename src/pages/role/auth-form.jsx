import React, {Component} from 'react'
import {
  Form,
  Input,
  Tree
} from 'antd'

import menuList from '../../config/menuConfig'
import PropTypes from 'prop-types'
const Item=Form.Item
const { TreeNode } = Tree;

export default class AuthForm extends Component {
  static propTypes = {
    role: PropTypes.object
  }
  constructor(props) {
    super(props)

    //const {menus}=this.props.role


    this.state={
      checkedKeys:[]//初始化路径列表
    }
  }
  //// 选中某个node时的回调,更新所有数组
  onCheck = checkedKeys => {
    //console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };

  /*
为父组件提交获取最新menus数据的方法
*/
  getMenus=()=>this.state.checkedKeys

    getTreeNodes=(menuList)=>{
    //进行遍历显示权限列表
    return menuList.reduce((pre, item)=>{
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      )
      return pre
    },[])

    }


  componentDidMount() {
    this.treeNodes=this.getTreeNodes(menuList)

  }
//根据新传入的role来更新checkedKeys状态
  /*
  当组件接收到新的属性时自动调用
   */
  componentWillReceiveProps (nextProps){
    const menus=nextProps.role.menus
    //更新状态
    this.setState({
      checkedKeys: menus
    })
  }


  render() {
    const {role}=this.props
    const {checkedKeys} = this.state

    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }

    return (
      <div>
        <Item label="角色名称" {...formItemLayout}>
          <Input value={role.name}/>
        </Item>
        <Tree
          checkable
          defaultExpandAll={true}//张开所有节点
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        >
          <TreeNode title="平台权限" key="all">
            {this.treeNodes}
          </TreeNode>
        </Tree>
      </div>
    )
  }
}

