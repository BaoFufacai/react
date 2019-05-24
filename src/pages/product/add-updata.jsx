import React, {Component} from 'react'

import LinkButton from '../../components/link-button/'
import {
  Card,
  Input,
  Icon,
  Form,
  Cascader,
  Button,
  message
} from 'antd'
import {reqCategorys,reqAddOrUpdateProduct} from '../../api'
import  PicturesWall from './pictures-wall'
import RichTextEdiTo from './rich-text-edito'
const {Item}=Form
const {TextArea}=Input


 class ProductUpdata extends Component {


  state={
    options:[]
  }

  constructor(props){
    super(props)
    // 创建用来保存ref标识的标签对象的容器
    this.Wall=React.createRef()
    this.RichText=React.createRef()
  }
  //提交表单,进行表单验证
   submit=()=>{
     // 进行表单验证, 如果通过了, 才发送请求
    this.props.form.validateFields(async (error, values)=>{
      if(!error){
        //进行判断验证，收集数据封装成并封装成product对象
        const {name,desc, price, categoryIds}=values
        let pCategoryId, categoryId
        //进行判断
        if(categoryIds.length===1){
          pCategoryId='0'
          categoryId=categoryIds[0]
        }else {
          pCategoryId=categoryIds[0]
          categoryId=categoryIds[1]
        }

        //得到img
        const imgs = this.Wall.current.getImgs()
        const detai =this.RichText.current.getDetail()

        //收集数据
        const product={name,desc, price,imgs,detai,pCategoryId, categoryId,}
        // 如果是更新, 需要添加_id
        if(this.isUpdate){
          product._id=this.product._id
        }
        // 2. 调用接口请求函数去添加/更新
        const result =await reqAddOrUpdateProduct(product)
        //判断根据结果提示
        if(result.status===0){
          message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`)
          this.props.history.goBack()
        }else {
          message.success(`${this.isUpdate ? '更新' : '添加'}商品失败!`)
        }
       }
     })
   }

   initOptions = async (categorys) => {
     // 根据categorys生成options数组
     const options = categorys.map(c => ({
       value: c._id,
       label: c.name,
       isLeaf: false,
     }))

     // 如果是一个二级分类商品的更新
     const {isUpdate, product} = this
     const {pCategoryId, } = product
     if(isUpdate && pCategoryId!=='0') {
       // 获取对应的二级分类列表
       const subCategorys = await this.getCategorys(pCategoryId)
       // 生成二级下拉列表的options
       const childOptions = subCategorys.map(c => ({
         value: c._id,
         label: c.name,
         isLeaf: true
       }))

       // 找到当前商品对应的一级option对象
       const targetOption = options.find(option => option.value===pCategoryId)

       // 关联对应的一级option上
       targetOption.children = childOptions
     }
     // 更新options状态
     this.setState({
       options
     })
   }


   //异步获取一级/二级分类列表, 并显示
   getCategorys = async (parentId) => {
     const result = await reqCategorys(parentId)   // {status: 0, data: categorys}
     if (result.status===0) {
       const categorys = result.data
       // 如果是一级分类列表
       if (parentId==='0') {
         this.initOptions(categorys)
       } else { // 二级列表
         return categorys  // 返回二级列表 ==> 当前async函数返回的promsie就会成功且value为categorys
       }
     }
   }

   //动态加载二级列表,用加载下一级列表的回调函数
   loadData = async selectedOptions => {
     // 得到选择的option对象
     const targetOption = selectedOptions[0]
     // 显示loading
     targetOption.loading = true

     // 根据选中的分类, 请求获取二级分类列表
     const subCategorys = await this.getCategorys(targetOption.value)
     // 隐藏loading
     targetOption.loading = false
     // 二级分类数组有数据
     if (subCategorys && subCategorys.length>0) {
       // 生成一个二级列表的options
       const childOptions = subCategorys.map(c => ({
         value: c._id,
         label: c.name,
         isLeaf: true
       }))
       // 关联到当前option上
       targetOption.children = childOptions
     } else { // 当前选中的分类没有二级分类
       targetOption.isLeaf = true
     }

     // 更新options状态
     this.setState({
       options: [...this.state.options],
     })
   }
   //验证价格表单
   validatePrice=(rule, value, callback)=>{
     if(value*1>0){
       callback()//验证通过
     }else {
       callback('价格必须大于0') // 验证没通过
     }

   }
   componentDidMount() {
     this.getCategorys('0')
   }
  componentWillMount() {
     //取出携带参数
    const product=this.props.location.state
    //保存是否更新标识
    this.isUpdate=!!product
    //保存商品有就显示没有空对象
    this.product=product||{}
  }

   render() {
     const {isUpdate, product} = this
     const {pCategoryId, categoryId, imgs,detai} = product
     // 用来接收级联分类ID的数组
     const categoryIds = []
     if(isUpdate) {
       // 商品是一个一级分类的商品
       if(pCategoryId==='0') {
         categoryIds.push(categoryId)
       } else {
         // 商品是一个二级分类的商品
         categoryIds.push(pCategoryId)
         categoryIds.push(categoryId)
       }
     }

    const {getFieldDecorator}=this.props.form;
    //设置输入框
    const formItemLayout = {
        labelCol: { span: 2 },  // 左侧label的宽度
        wrapperCol: { span: 8 }, // 右侧包裹的宽度
    };
    //右边导航
    const title=(
      <span>
        <LinkButton onClick={()=> this.props.history.goBack()}>
          <Icon type="arrow-left"></Icon>
        </LinkButton>
        <span>{isUpdate?'修改商品':'添加商品'}</span>
      </span>
    )
    return (
      <Card title={title}>
        <Form  {...formItemLayout}>
            <Item label="商品名称">
            {getFieldDecorator('name', {
              initialValue: product.name,
              rules: [
                {required: true, message: '必须输入商品名称'},
              ],
            })(<Input placeholder='请输入商品名称'/>)}
          </Item>
          <Item label="商品描述">

            {getFieldDecorator('desc', {
              initialValue: product.desc,
              rules: [
                {required: true, message: '必须输入商品描述'},
              ],
            })(<TextArea placeholder="商品描述" autosize={{minRows: 2, maxRows: 6 }}/>)}
          </Item>
          <Item label="商品价格"  type='number'>
            {getFieldDecorator('price', {
              initialValue: product.price,
              rules: [
                {required: true, message: '必须输入商品价格'},
                {validator: this.validatePrice}
              ],
            })(<Input  addonAfter="元"/>)}
          </Item>
          <Item label="商品分类" >
            {
              getFieldDecorator('categoryIds', {
                initialValue: categoryIds,
               rules: [
                 {required: true, message: '必须指定商品分类'},
                ]
              })(
                <Cascader
                  placeholder='请指定商品分类'
                  options={this.state.options}  /*需要显示的列表数据数组*/
                  loadData={this.loadData} /*当选择某个列表项, 加载下一级列表的监听回调*/
                />
              )
            }
          </Item>
          <Item label="商品图片">
            <PicturesWall ref={this.Wall} imgs={imgs}/>
          </Item>

          <Item label="商品详情" labelCol={{ span: 2 }} wrapperCol={{span: 20}}>
            <RichTextEdiTo  ref={this.RichText} detai={detai}/>
          </Item>

          <Item>
            <Button type='primary' onClick={this.submit}>提交</Button>
          </Item>
       </Form>

      </Card>
    )
  }
}
const WrappedRegistrationForm = Form.create()(ProductUpdata);
export default WrappedRegistrationForm