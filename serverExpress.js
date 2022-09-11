const express = require('express')
//引入本地测试数据(也就是接返回的json数据)
const listData = require('./data/list.json')
// const loginData = require('./data/login.json')
//创建服务
const app = express()
//允许跨域
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-with")
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
  next()
})
// 配置app服务器实例对象的body-parser，通过配置后，可以在request请求对象的body属性拿到post提交的数据
const bodyParser = require('body-parser')
// post请求体中的Content—Type为：application/x-www-form-urlencoded，则配置如下：
app.use(bodyParser.urlencoded({ extended: false }))

// post请求体中的Content-Type为：application/json，则配置如下：
app.use(bodyParser.json())

//接口处理函数(可以写多个请求)
// get请求
app.get('/list', (req, res) => {
  console.log(req)
  console.log(111)
  res.json(listData) //相应json格式数据
  res.end()
})

app.post('/', (req, res) => {
  
  console.log(req.body)
})


app.get('/', (req, res) => {
  console.log(222)
  // res.json(loginData)
  res.end()
})

// post请求
app.post('/login', (req, res) => {
  console.log(222)
  // res.json(loginData)
  res.end()
})

//监听3000端[ 7
app.listen(3000, () => {
  console.log("服务启动成功")
})

