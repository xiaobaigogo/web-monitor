const http = require('http');

// 创建一个server,当监听到请求时，会触发回调函数
const server = http.createServer((req, res) => {
  const bufs = [];
  // 当监听到发出请求的数据时，会触发回调函数，buf就是body里面的东西
  req.on('data', (buf) => {
    bufs.push(buf);
  })
  console.log(req.url)
  console.log(decodeURIComponent(req.url))
  // 当监听到请求结束时，就会触发回调函数
  req.on('end', () => {
    const buf = Buffer.concat(bufs).toString('utf8') // 这个bfs里面的数据是一片一片的，需要整合起来
    let msg = 'happy';    // 设置返回的信息
    try {
      const ret = JSON.parse(buf); // buf是一堆序列化数据，因此需要反序列化
      console.log(ret)
    } catch (error) { // 如果产生错误
      // res.end('invalid json')
    }

    const responseJSON = {
      msg: `receive: ${msg}`
    }
    // res.setHeader('Content-Type', 'application/json') // 设置头部，这样浏览器发现是json数据时，可能底层会帮我们做一些事情
    res.setHeader('Access-Control-Allow-Origin', '*') // 设置头部
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-with') // 设置头部
    res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS') // 设置头部
    res.end(JSON.stringify(responseJSON))
  })
})

// 创建一个端口
const port = 3000;

// 当服务端成功监听端口时，调用回调函数
server.listen(port, () => {
  console.log('listening')
})