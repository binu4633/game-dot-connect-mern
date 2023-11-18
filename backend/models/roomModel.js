import mongoose from "mongoose";

const roomSchema = mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
 
  members:[
   {
      name: {
      type:String
      },
      email: {
      type:String
      }
   }
  ]

})

const Room = mongoose.model("Room", roomSchema);
export default Room;