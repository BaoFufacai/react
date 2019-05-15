//promise模块
(function (window) {
  //构造函数
  function Promise(excutor) {
    //设置初始化状态数据
    const self=this //保存this
    self.status='pending'//初始化状态
    self.data='undefined'//设置数据
    self.callbacks=[] //设置所有回调函数数据保存
    //回调函数
    function resolve(value) {
      //判断是否为panbing是可以修改
      if(self.status==='pending'){
        //判断获取成功数据
        self.status='resolved'//修改成成功状态
        self.data=value//获取数据
        //异步执行所有成功的回调函数
        setTimeout(()=>{
          self.callbacks.forEach((funobj)=>funobj.onResolved(value))
        })
      }
    }
    //失败回调
    function reject(reason) {
      if(self.status==='pending'){
        self.status='rejected'//修改成失败的状态
        self.data=reason//获取失败状态数据
        setTimeout(()=>{
          self.callbacks.forEach((funobj)=>funobj.onRejected(reason))
        })
      }
      //立即执行
      try {
        excutor(resolve,reject)
      }catch (error) {//捕获错误回调
        reject(error)
      }
    }
    //立即执行回调函数
    excutor()
  }


  //原型对象
  Promise.prototype.then=function (onResolved,onRejected) {
    const self=this
    const {ststus}=self//得到当前数据
    let Promise
    if(ststus==='resolved'){
      Promise=new Promise((resolve,reject)=>{
        try {
          const x=onResolved(self.data)//获取成功
          //判断是否返回一个promise对象
          if(x instanceof Promise){
            x.then(resolve,reject)
          }else {
            resolve(x)
          }
        }catch (error) {
          reject(error)

        }

      })
    }else if(ststus==='rejected'){
      Promise=new Promise((resolve,reject)=>{
        try {
          const x=onRejected(self.data)
          if(x instanceof Promise){
            x.then(resolve,reject)
          }else {
            reject(x)
          }
        }catch (error) {
          reject(error)
        }

      })
    }else {//pending
      Promise=new Promise((resolve,reject)=>{
        //将所有回调函数保存起来
        self.callbacks.push({
          onResolved(value){
            try {
              const x=onResolved(self.data)
              if(x instanceof Promise){
                x.then(resolve ,reject)
              }else {
                resolve(x)
              }

            }catch (error) {
              reject(error)
            }
          },
          onRejected(reason){
            try {
              const x=onRejected(self.data)
               if(x instanceof Promise){
                 // 将x的结果作为promise2的结果
                 x.then(resolve ,reject)
               }else {// 回调函数返回的不是promise
                 resolve(x)
               }

            }catch (error) {
              reject(error)
            }
          }
        })
      })
    }
    return Promise
  }
  Promise.prototype.catch=function (onRejected) {
    return this.then(null ,onRejected)
  }
  //函数对象
  Promise.resolve=function (value) {
    return new Promise((resolve ,reject)=>{
      //判断如果接受的是一个promise就将这个promise返回出去
      if(value instanceof Promise){
        value.then(resolve ,reject)
      }else {
        resolve(value)
      }

    })

  }
  Promise.reject=function (reason) {
    return new Promise((resolve ,reject)=>{
      reject(reason)
    })
    
  }
  //处理所有promise回调函数
  Promise.prototype.all=function (promises) {
    const length=promises.length//获取长度
    const values=Array(length)
    const adddata=0

    //返回所有promise对象
    return new Promise((resolve ,reject)=>{
      //遍历所有promise对象
      promises.forEach((P,index)=>{
       Promise.resolve().then(
         value=>{
           values[index]=value
           adddata++
         }
       )
      })

    })

  }

})(window)