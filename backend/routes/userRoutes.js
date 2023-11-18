import express from 'express';
import jwt from "jsonwebtoken";
import User from '../models/userModel.js';
import Room from '../models/roomModel.js';
import { protect } from '../middleware/authMidilleware.js';
const router = express.Router();

const generateToken = (id)=>{
   return jwt.sign({id},process.env.JWT_SECRET,{
       expiresIn:'90d'
       // expiresIn:'5m'
   })
}

router.post('/googleAuth',async(req,res)=>{
   try {

  
    const token = req.body.token;

    const newUser = jwt.decode(token);
   
   
      const user = await User.findOne({ email: newUser.email });

      if(user){
         res.status(200).send({
            status: "success",
            userInfo: {
              name: user.name,
              email: user.email,
              image: user.image,
           
              // token,
              token: generateToken(user._id),
            },
          });
      }else{
         const createdUser = await new User({
            name: newUser.name,
            email: newUser.email,
            image: newUser.picture,
          });
          const newCreatedUser = await createdUser.save();
          res.status(200).send({
            status: "success",
            userInfo: {
              name: newCreatedUser.name,
              email: newCreatedUser.email,
              image: newCreatedUser.image,
           
              // token,
              token: generateToken(newCreatedUser._id),
            },
          });
      }

  
   } catch (error) {
   
    res.status(500).send(error.message)
   }
});

router.post('/createRooms',protect, async(req,res)=>{
  
  try {
    const user = req.user;
    if(!user){

    }

    const roomName = req.body.roomName;
    const email = req.user.email;
    const name = req.user.name;

    

    const newRoom = await new Room ({
      name:roomName,
      members:[{name,email}]
    });

  const roomm =  await newRoom.save();

  user.rooms = [...user.rooms,{name:roomm.name,id:roomm._id}];
  user.save();

  res.status(200).send({
    rooms:user.rooms
  })


//  const rooms = await Room.

  } catch (error) {
   
    res.status(500).send({
      error:'something went wrong'
    })
  }
})

router.get('/getRooms',protect,async(req,res)=>{

  try {
    const user = req.user;
    if(!user){

    }else{
      res.status(200).send({
        rooms:user.rooms
      })
    }
  } catch (error) {
    res.status(500).send({
      error
    })
  }
})
router.get('/getMyRoom/:id',protect,async(req,res)=>{

  try {
    const user = req.user;
    if(!user) return
    const id = req.params.id;
    if(!id) return
     const room = await Room.findById(id);
    
     res.status(200).send({
      room
     })
  } catch (error) {
    res.status(500).send({
      error
    })
  }
})

router.post('/inviteFriend',protect, async(req,res)=>{
    try {
     const user = req.user;
   
     const roomId = req.body.roomId;
     const friendEmail = req.body.emailId;

  

     const friendUser = await User.findOne({email :friendEmail});

    
     if(!user){
      res.status(200).send({
        result:'no user found this mail id'
      })
     return
     }

     const room = await Room.findById(roomId);
     if(room.members.find((r=>r.email === friendEmail))){
      return
     }
     if(room.members.length >= 4){
      res.status(200).send({
        result:'only allow four members in the room'
      })
     return
     }
    
     friendUser.invitation = [...friendUser.invitation,{name:room.name,id:room._id,Inviter:user.name}];
     await friendUser.save()

    } catch (error) {
     
      res.status(500).send({
        result:'sorry something went wrong'
      })
    }
})

router.post('/leaveRoom',protect,async(req,res)=>{
   try {
    const roomId = req.body.id;
   const user = req.user;
    const room = await Room.findById(roomId);

    user.rooms = user.rooms.filter(r=>r.id !== roomId);
    await user.save();
    room.members =  room.members.filter(m=>m.email !== user.email);
    room.save();
    if(room.members.length === 0){
      await Room.findByIdAndDelete(room._id)
    }
    res.status(200).send({
      rooms:user.rooms
    })
   } catch (error) {
    res.status(500).send({
      error
    })
   }
})

router.get('/findInvitaions',protect,async(req,res)=>{
  try {
    const user = req.user;
    const invitaions = user.invitation;
    res.status(200).send({
      result:invitaions
    })
  } catch (e) {
    res.status(500).send({
      error:'something went wrong'
    })
  }
})

router.post('/acceptInvitaion',protect, async(req,res)=>{
  try {
    
    const roomId = req.body.id;
    const user = req.user;
    const room = await Room.findOne({_id:roomId});
    if(!user)return
    if(!room){
      return
    }
    if(room.members.length >= 4){
      return
    }
    if(room.members.find(r=>r.email===user.email)){
      return
    }
    room.members = [...room.members,{name:user.name,email:user.email}];
    await room.save()
    user.rooms = [...user.rooms,{name:room.name,id:room._id}];
    user.invitation = user.invitation.filter(inv=>inv.id !== roomId);
     await user.save();
   
    res.status(200).send({
      result:user.invitation 
    })
  } catch (e) {
    console.log(e)
    res.status(500).send({
      error:e.message
    })
  }
})
router.post('/declineInvitaion',protect,async(req,res)=>{
  try {
    const roomId = req.body.id;
    const user = req.user;
    const room = await Room.findOne({_id:id});
    if(!user) return
    if(!room){
      return
    }
   
    user.invitation = user.invitaions.filter(inv=>inv.id !== roomId);
   await user.save();
    res.status(200).send({
      result:user.invitation 
    })
  } catch (e) {
    res.status(500).send({
      error:e.message
    })
  }
})

export default router;