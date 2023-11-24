import path from "path";
import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import http from "http";
import connectDB from "./backend/db/db.js";
import userRoute from "./backend/routes/userRoutes.js";
import {
  addToRoom,
  removeFromRoom,
  addMembersToRoom,
  addToGround,
  isPlaying,
  removeFromGround,
  getMembers,
} from "./backend/utils/room.js";
dotenv.config();

const app = express();
app.use(bodyParser.json());
const server = http.createServer(app);
const clientUrl =
  process.env.NODE_ENV === "production"
    ? process.env.PRO_URL_CLIENT
    : process.env.DEV_URL_CLIENT;
console.log("client url", clientUrl);
const io = new Server(server, {
  cors: {
    // origin: "http://localhost:3000",
    origin: clientUrl,
    credentials: true,
  },
});
connectDB();

app.use(express.json({ limit: "150mb" }));
app.use("/api/v1/user", userRoute);
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

export const getIo = () => io;

const PORT = 5000;
io.on("connection", (socket) => {
  socket.on("joinRoom", (obj) => {
    const name = obj.name;
    const roomName = obj.roomName;
    const id = socket.id;
    addToRoom(id, roomName);
    const memberSnapShot = addMembersToRoom(id, roomName, name);

    socket.join(roomName);
    io.to(roomName).emit("connectedRoom", memberSnapShot);
    // io.sockets.broadcast.to(roomName).emit('connectedRoom', `${socket.id} is connected to ${roomName}`)
    // socket.emit('connectedRoom', `${socket.id} is connected to ${roomName}`)
  });

  socket.on("leaveRoom", () => {
    const removedSnapShot = removeFromRoom(socket.id);
    if (removedSnapShot && removedSnapShot.room) {
      io.to(removedSnapShot.room).emit("connectedRoom", removedSnapShot);
      io.to(removedSnapShot.room).emit("disConnectedRoom", removedSnapShot);
    }
  });

  socket.on("gameStart", async (obj) => {
    console.log("obj game start", obj);
    const roomName = obj.roomName;
    const snapShot = obj.snapShot;
    const members = getMembers(obj.roomName);
    console.log("memebetsss", members);
    if (!members) return;

    // socket.to(members[0].id).timeout(5000).emit('areUplaying','data',(err,res)=>{
    //   if(err)console.log('erroroooor',  err)
    //    console.log(members[0].id, res)
    //  })
    // socket.to(members[1].id).timeout(5000).emit('areUplaying','data',(res)=>{
    // console.log(members[1].id, res)
    //  })

    // const response = await io.to(members[0].id).timeout(5000).emitWithAck('areUplaying','data')
   try {
    const response = await io
    .to(roomName)
    .timeout(5000)
    .emitWithAck("areUplaying", "data");
  console.log("the response", response);
  if (response) {
    const memFilter = response.filter((m) => m.isPlaying === true);
    if (memFilter.length === 0) {
      io.to(roomName).emit("letsStart", snapShot);
    } else {
      const players = memFilter.map((m) => m.name);
      console.log("players", players);
      io.to(roomName).emit("playing", players);
    }
  }
   } catch (error) {
     if(error) return
   }
  
   
  });

  socket.on("gameOn", (obj) => {
    io.to(obj.roomName).emit("gameDots", obj.circleJoints);
  });

  socket.on("resume", (name) => {
    io.to(name).emit("resumeGame", "resume ");
  });

  socket.on("finishGame", () => {
    //  const groundRoom =   removeFromGround(socket.id);
    //  io.to(groundRoom.room).emit('playing', groundRoom.members);
  });

  socket.on("peerEmit", (obj) => {
    const peerId = obj.peerId;
    const room = obj.roomId;
    io.to(room).emit("peerRecieve", peerId);
  });

  socket.on("disconnect", function () {
    const removedSnapShot = removeFromRoom(socket.id);

    if (removedSnapShot && removedSnapShot.room) {
      io.to(removedSnapShot.room).emit("connectedRoom", removedSnapShot);
      io.to(removedSnapShot.room).emit("disConnectedRoom", removedSnapShot);
    }
  });
});
server.listen(PORT, () => {
  console.log(`app listeing port ${PORT} and running `);
});

// binu4633 mongo username
// Pt1xHdHpQZ6jXLh8  password
// mongodb+srv://binu4633:<password>@cluster0.t5ujwqe.mongodb.net/



 // members.map((m,i)=>{
    //     io.to(m.id).timeout(5000).emit('areUplaying','data',(err,res)=>{
    //         if(err)console.log('erroroooor',  err)
    //         console.log(m.id, res)
    //         // .timeout(1000)
    //         if(!err){
    //           members[i] = {...members[i],...res[0]}
    //         }
    //       })

    //      })

    //  const mapPromise = async()=> await Promise.all(mapResult)

    //  setTimeout(()=>{
    //   console.log('mme', members)
    // const memFilter=  members.filter(m=>m.isPlaying === true);
    // console.log('mem filter', memFilter)
    //    if(memFilter.length === 0){
    //       io.to(roomName).emit('letsStart', snapShot);
    //    }else{
    //       const players = memFilter.map(m=>m.name);
    //       console.log('players', players)
    //       io.to(roomName).emit('playing', players);
    //    }
    //  },1000)
    //  io.to(obj.roomName).emit('isPlaying', Date.now());
    // const playing = isPlaying(obj.snapShot);
    // if(playing.playing){

    //   io.to(obj.roomName).emit('playing', playing.players);
    // }else{
    //   addToGround(obj.snapShot)
    //   io.to(obj.roomName).emit('letsStart', obj.snapShot);
    // }
