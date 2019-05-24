import React, {Component} from 'react'
import { Card,Table,Button,Icon,message, Modal} from 'antd';
import LinkButton from "../../components/link-button";
import {reqCategorys, reqUpdateCategory, reqAddCategory} from '../../api'
import AddForm from './add-form'
import  UpdataForm from './updata-form'

export default class Category extends Component {
  state={
    categorys:[],//数据列表
    parentId:'0',//当前需要显示的分类列表的父分类ID
    parentName:'',
    loading:false,//获取数据中
    subCategorys:[],//二级分类列表
    showStatus: 0,
  }

  //动态显示一级列表之后获取二级列表动态显示
  getCategorys=async (parentId)=>{
    //再发请求前显示
    this.setState({loading:true})
    //获取数据判断
    parentId = parentId || this.state.parentId
    //发送请求
    const result=await reqCategorys(parentId)
    this.setState({loading:false})//获取到数据关闭状态
    //判断是否显示一级分类
    if(result.status===0){
      //取出分类列表
      const categorys=result.data
      if(parentId==='0'){
        this.setState({categorys})//更新一级分类
      }else {
        //更新二级分类
        this.setState({
          subCategorys:categorys

        })
      }
    }else {
      message.error('获取失败')
    }
  }
  //初始 columns 初始化Table所有列的数组
  initColumns=()=>{
   this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        width: 300,
        render: (category) => (
          <span>
            <LinkButton onClick={()=>this.showUpdate(category)}>修改分类列表</LinkButton>
            {
              this.state.parentId==='0'?<LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton>:null
            }

          </span>
        )
      }
    ];
  }

  //显示指定一级分类对象的二子列表
  showSubCategorys=(category)=>{
    //更新idname状态
    this.setState({
      parentId :category._id,
      parentName:category.name
    },()=>{//回调函数在状态更新后执行
      //显示二列表
      this.getCategorys()
    })
  }
  //显示指定的一级分类对象的子列表
  subCategorys=()=>{
    //更新为显示一级列表状态
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }
  //隐藏确认框
  handleCancel=()=>{
    // 清除输入数据
    this.form.resetFields()
    this.setState({
      showStatus:0
    })

  }
  //显示添加确认框
  shouowAdd=()=>{
    this.setState({
      showStatus:1
    })
  }
  //添加分类
  addCategory= ()=>{
    this.form.validateFields(async(err,values)=>{
      if(!err){
        //隐藏确认框
        this.setState({
          showStatus:0
        })
        // 收集数据, 并提交添加分类的请求
        const {parentId, categoryName} = values

        const result = await reqAddCategory(categoryName, parentId)
        if(result.status===0){
          if(parentId===this.state.parentId){
            // 重新获取当前分类列表显示
            this.getCategorys()
          }else if(parentId==='0'){
            // 重新获取当前分类列表显示
            this.getCategorys('0')
          }
        }
      }
    })
  }

  /*
显示修改的确认框
 */
  showUpdate=(category)=>{
    //保存分类信息
   this.category = category
    this.setState({
      showStatus:2
    })
  }


  //更新分类
  updateCategory= ()=>{
    this.form.validateFields(async(err,values)=>{
      if(!err){
        //隐藏确认框
        this.setState({
          showStatus:0
        })
        //获取数据准备数据
        const categoryId = this.category._id
        const {categoryName} = values
        // 清除输入数据
        this.form.resetFields()
        //发送请求
        const result=await reqUpdateCategory({categoryId, categoryName})
        if(result.status===0){
          //重新显示列表
          this.getCategorys()
        }

      }

    })

  }
  componentWillMount() {
    this.initColumns()
  }
  //异步发送AJAX请求
  componentDidMount() {
    //获取一级分类类表显示
    this.getCategorys()
  }

  render() {
    //获取初始数据显示
    const {categorys,parentId,loading,parentName,subCategorys, showStatus}=this.state
    // 读取指定的分类
    const category = this.category || {} // 如果还没有指定一个空对象


    let title=parentId==='0'?'一级分类':(
      <span>
          <LinkButton onClick={this.subCategorys}>一级分类列表</LinkButton>
          <Icon type='arrow-right' style={{marginRight: 5}}></Icon>
          <span>{parentName}</span>
      </span>
    )
    //card右侧导航
    const extra=(
      <Button type='primary' onClick={this.shouowAdd}>
        <Icon type='plus'></Icon>
        添加
      </Button>
    )
    return (
      <div>
        <Card title={title} extra={extra}>
        <Table
          loading={loading}
          bordered//带边框的
          pageSizeOptions={{defaultCurrent:10,hideOnSinglePage:true}}
          rowKey='_id'
          dataSource={parentId==='0'? categorys:subCategorys}
          columns={this.columns} />;
          <Modal
            title="添加分类"
            visible={showStatus===1}
            onOk={this.addCategory}
            onCancel={this.handleCancel}
          >
            <AddForm
              categorys={categorys}
              parentId={parentId}
              setForm={(form) => {this.form = form}}
            />
          </Modal>
          <Modal
            title="更新分类"
            visible={showStatus===2}
            onOk={this.updateCategory}
            onCancel={this.handleCancel}
          >
            <UpdataForm
              categoryNam={category.name}
              setForm={(form) => {this.form = form}}/>
          </Modal>
        </Card>
      </div>
    )
  }
}