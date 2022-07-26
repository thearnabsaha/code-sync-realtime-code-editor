//in server.js
import express from 'express'
import http from 'http'
const app = express()
// const path = require('path')
const port = process.env.PORT || 3001
const server = http.createServer(app)

import {Server} from 'socket.io'
import ACTIONS from './src/utils/Actions.js'
const io = new Server(server)
const userSocketMap={}
const getAllClients=(roomId)=>{
    //map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || [] ).map((socketId)=>{
        return{
            socketId,
            username:userSocketMap[socketId]
        }
    })
}

io.on("connection",(socket)=>{
    socket.on(ACTIONS.JOIN,({roomId,username})=>{
        console.log("new user connected!!"+roomId)
        userSocketMap[socket.id]=username
        socket.join(roomId)
        const clients=getAllClients(roomId)
        clients.forEach((e)=>{
            io.to(e.socketId).emit(ACTIONS.JOINED,{
                clients,username,socketId:socket.id
            })
        })
    })
    socket.on(ACTIONS.CODE_CHANGE,({roomId,code})=>{
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{code})
    })
    socket.on(ACTIONS.SYNC_CODE,({code,socketId})=>{
        io.to(socketId).emit(ACTIONS.CODE_CHANGE,{code})
    })
    socket.on("disconnecting",()=>{
        const rooms=[...socket.rooms]
        rooms.forEach((e)=>{
            socket.in(e).emit(ACTIONS.DISCONNECTED,{
                socketId:socket.id,
                username:userSocketMap[socket.id]
            })
        })
        delete userSocketMap[socket.id]
        socket.leave()
    })
    socket.on("disconnect",()=>{
        console.log("user disconnected!!");
    })
})

app.get('/' , (req , res)=>{res.send("hi")})
server.listen(port , ()=> console.log('> Server is up and running on port : ' + port))