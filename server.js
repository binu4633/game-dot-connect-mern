import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import bodyParser from 'body-parser'
import http from 'http';
import connectDB from "./backend/db/db.js";
import  userRoute from './backend/routes/userRoutes.js';
import {addToRoom, removeFromRoom,addMembersToRoom,addToGround,isPlaying,removeFromGround } from './backend/utils/room.js'
dotenv.config();


const app = express();
app.use(bodyParser.json());
const server = http.createServer(app)
const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000"
      }
});
connectDB();  



app.use('/api/v1/user',userRoute);

export const getIo = ()=>io

const PORT = 5000;
io.on('connection',(socket)=>{
  
    socket.on('joinRoom', (obj)=>{
     
        const name = obj.name;
        const roomName = obj.roomName;
        const id = socket.id;
        addToRoom(id,roomName);
        const memberSnapShot = addMembersToRoom(id,roomName,name);
       
        socket.join(roomName);
        io.to(roomName).emit('connectedRoom', memberSnapShot)
        // io.sockets.broadcast.to(roomName).emit('connectedRoom', `${socket.id} is connected to ${roomName}`)
        // socket.emit('connectedRoom', `${socket.id} is connected to ${roomName}`)
    });

    socket.on('leaveRoom',()=>{
   
      const removedSnapShot =  removeFromRoom(socket.id);
      if(removedSnapShot && removedSnapShot.room){

        io.to(removedSnapShot.room).emit('connectedRoom', removedSnapShot)
        io.to(removedSnapShot.room).emit('disConnectedRoom', removedSnapShot)
      }

    });

    socket.on('gameStart',(obj)=>{
     
      const playing = isPlaying(obj.snapShot);
      if(playing.playing){
    
        io.to(obj.roomName).emit('playing', playing.players);
      }else{
        addToGround(obj.snapShot)
        io.to(obj.roomName).emit('letsStart', obj.snapShot);
      }
   
    })

    socket.on('gameOn',(obj)=>{
     
      io.to(obj.roomName).emit('gameDots', obj.circleJoints)
    })

    socket.on('resume',(name)=>{
      io.to(name).emit('resumeGame', 'resume ')
    })

    socket.on('finishGame', ()=>{
     const groundRoom =   removeFromGround(socket.id);
     
     io.to(groundRoom.room).emit('playing', groundRoom.members);
    })

    socket.on('peerEmit',(obj)=>{
      const peerId = obj.peerId;
      const room = obj.roomId;
      io.to(room).emit('peerRecieve', peerId)
    })

    socket.on("disconnect", function (){
      const removedSnapShot =  removeFromRoom(socket.id);
    
      if(removedSnapShot && removedSnapShot.room){

        io.to(removedSnapShot.room).emit('connectedRoom', removedSnapShot);
        io.to(removedSnapShot.room).emit('disConnectedRoom', removedSnapShot)
      }
    })
 
})
server.listen(PORT, () => {
  console.log(
    `app listeing port ${PORT} and running `
  );
});