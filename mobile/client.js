import {io} from "socket.io-client"
const socket = io('http://127.0.0.1:8000',{query:{
  test:'ok'
}})

socket.on("ok", data => {
  console.log(data.message)
})
