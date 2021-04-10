const app = require("express")()
const server = require("http").createServer(app)
const io = require("socket.io")(server)
const jwt = require('jsonwebtoken')

io.on("connection", socket => {
    socket.on('detected_faces',(data)=>{
      console.log(data)
    })
})

const PORT = process.env.PORT || 8000
server.listen(PORT,()=>{
  console.log(PORT)
})
