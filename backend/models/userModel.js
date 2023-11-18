import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
       },
      email: {
        type: String,
        required: true,
        unique: true,
       },
       image:{
        type:String
       },
       rooms:[
        {
            id:{
                type:String
            },
            name:{
                type:String
            },
        }
       ],
       invitation:[
        {
            id:{
                type:String
            },
            name:{
                type:String
            },
            Inviter:{
                type:String
            }
        }
       ]
})

const User = mongoose.model("User", userSchema);
export default User;