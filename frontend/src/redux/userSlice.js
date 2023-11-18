import { createSlice,createAsyncThunk} from '@reduxjs/toolkit';

import axios from 'axios';


let  userInfo;
if(localStorage.getItem('userInfo') === undefined){
    // console.log('undefined works');
    localStorage.removeItem('userInfo');
    userInfo = null
}else{
    // console.log('undefined not  works');
     userInfo = localStorage.getItem('userInfo') 
     && localStorage.getItem('userInfo') !== undefined 
     && localStorage.getItem('userInfo') !== 'undefined'
    ?  JSON.parse( localStorage.getItem('userInfo'))
    : null
}  


const initialState = {
    status:'idle',
    // userInfo:null, // for user object
    userInfo:userInfo||null, // for user object
    rooms:null,
    myRoom:null,
    invitaions:[],
    // isAuthenticated:false,
    // forgetPassResult:null,
    // forgetResetTokenResult:null,
    // loginError: null,
    // signInError:null,
    // forgetPassError:null,
    // forgetResetError:null,
    // success: false, // for monitoring the registration process.
  }


  export const googleAuth = createAsyncThunk('user/googleAuth', async(token)=>{
    try {
      
        const response = await axios.post("/api/v1/user/googleAuth", {
            token
          });
           //  console.log(response)
            return response.data
        } catch (error) {
            if(error.response.data){
                return error.response.data
            }else{
                return error.message
            }
        }
 })
  export const createRooms = createAsyncThunk('user/createRooms', async(roomName)=>{
    try {
      
        const response = await axios.post("/api/v1/user/createRooms", {
            roomName
          },{
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`,
              
              },
          });
           //  console.log(response)
            return response.data
        } catch (error) {
            if(error.response.data){
                return error.response.data
            }else{
                return error.message
            }
        }
 })
  export const getRooms = createAsyncThunk('user/getRooms', async()=>{
    try {
      
        const response = await axios.get("/api/v1/user/getRooms",{
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`,
              
              },
          });
           //  console.log(response)
            return response.data
        } catch (error) {
            if(error.response.data){
                return error.response.data
            }else{
                return error.message
            }
        }
 })
  export const addFriendToRooms = createAsyncThunk('user/inviteToRooms', async(obj)=>{
    try {
      
        const response = await axios.post("/api/v1/user/inviteFriend",obj,{
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`,
              
              },
          });
         
            return response.data
        } catch (error) {
            if(error.response.data){
                return error.response.data
            }else{
                return error.message
            }
        }
 })
  export const leaveRoom = createAsyncThunk('user/leaveRoom', async(id)=>{
    try {
      
        const response = await axios.post("/api/v1/user/leaveRoom",{id},{
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`,
              
              },
          });
         
            return response.data
        } catch (error) {
            if(error.response.data){
                return error.response.data
            }else{
                return error.message
            }
        }
 })

 export const findInvitaions = createAsyncThunk('user/findInvitations', async()=>{
    try {
      
        const response = await axios.get("/api/v1/user/findInvitaions",{
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`,
              
              },
          });
           //  console.log(response)
            return response.data
        } catch (error) {
            if(error.response.data){
                return error.response.data
            }else{
                return error.message
            }
        }
 })

 export const acceptInvite = createAsyncThunk('user/acceptInvite', async(obj)=>{
    try {
      
        const response = await axios.post("/api/v1/user/acceptInvitaion",obj,{
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`,
              
              },
          });
           //  console.log(response)
            return response.data
        } catch (error) {
            if(error.response.data){
                return error.response.data
            }else{
                return error.message
            }
        }
 })
 export const declineInvite = createAsyncThunk('user/declineInvitaion', async(obj)=>{
    try {
      
        const response = await axios.post("/api/v1/user/declineInvitaion",obj,{
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`,
              
              },
          });
           //  console.log(response)
            return response.data
        } catch (error) {
            if(error.response.data){
                return error.response.data
            }else{
                return error.message
            }
        }
 })

 export const getTheRoom = createAsyncThunk('user/getTheRoom', async(id)=>{
    try {
      
        const response = await axios.get(`/api/v1/user/getMyRoom/${id}`,{
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`,
              
              },
          });
           //  console.log(response)
            return response.data
        } catch (error) {
            if(error.response.data){
                return error.response.data
            }else{
                return error.message
            }
        }
 })

 const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
          localStorage.removeItem('userInfo') // deletes token from storage
          state.loading = false
          state.userInfo = null
          // state.userToken = null
          // state.error = null
        },
        addToMyRoom:(state,action)=>{
            const room = action.payload;
           
            // state.myRoom = room
        }
      },
    extraReducers:(builder)=>{
        builder
        .addCase( googleAuth.pending,(state,action)=>{
            state.status= 'loading'
        })
        .addCase( googleAuth.fulfilled,(state,action)=>{
            state.status= 'succeeded';
            
            state.userInfo= action.payload.userInfo;
            state.error = action.payload.error;
          
            localStorage.setItem('userInfo',JSON.stringify(action.payload.userInfo))
         
        })
        .addCase( googleAuth.rejected,(state,action)=>{
            state.status= 'rejected';
            state.error = action.error.message

        })
        .addCase( createRooms.pending,(state,action)=>{
            state.status= 'loading'
        })
        .addCase( createRooms.fulfilled,(state,action)=>{
            state.status= 'succeeded';
          
            state.rooms= action.payload.rooms;
            // state.error = action.payload.error;
          
            
         
        })
        .addCase( createRooms.rejected,(state,action)=>{
            state.status= 'rejected';
            state.error = action.error.message

        })
        .addCase( getRooms.pending,(state,action)=>{
            state.status= 'loading'
        })
        .addCase( getRooms.fulfilled,(state,action)=>{
            state.status= 'succeeded';
            // console.log('payload', action.payload)
            state.rooms= action.payload.rooms;
            // state.error = action.payload.error;
          
            
         
        })
        .addCase( getRooms.rejected,(state,action)=>{
            state.status= 'rejected';
            state.error = action.error.message

        })
        .addCase( findInvitaions.pending,(state,action)=>{
            state.status= 'loading'
        })
        .addCase( findInvitaions.fulfilled,(state,action)=>{
            state.status= 'succeeded';
            // console.log('payload', action.payload)
            state.invitaions= action.payload.result;
            // state.error = action.payload.error;
          
            
         
        })
        .addCase( findInvitaions.rejected,(state,action)=>{
            state.status= 'rejected';
            state.error = action.error.message

        })
        .addCase( acceptInvite.pending,(state,action)=>{
            state.status= 'loading'
        })
        .addCase( acceptInvite.fulfilled,(state,action)=>{
            state.status= 'succeeded';
       
            state.invitaions= action.payload.result;
            // state.error = action.payload.error;
          
            
         
        })
        .addCase( acceptInvite.rejected,(state,action)=>{
            state.status= 'rejected';
            state.error = action.error.message

        })
        .addCase( declineInvite.pending,(state,action)=>{
            state.status= 'loading'
        })
        .addCase( declineInvite.fulfilled,(state,action)=>{
            state.status= 'succeeded';
         
            state.invitaions= action.payload.result;
            // state.error = action.payload.error;
          
            
         
        })
        .addCase( declineInvite.rejected,(state,action)=>{
            state.status= 'rejected';
            state.error = action.error.message

        })
        .addCase( getTheRoom.pending,(state,action)=>{
            state.status= 'loading'
        })
        .addCase( getTheRoom.fulfilled,(state,action)=>{
            state.status= 'succeeded';
           
            state.myRoom= action.payload.room;
        })
        .addCase( getTheRoom.rejected,(state,action)=>{
            state.status= 'rejected';
            state.error = action.error.message

        })
        .addCase( leaveRoom.pending,(state,action)=>{
            state.status= 'loading'
        })
        .addCase( leaveRoom.fulfilled,(state,action)=>{
            state.status= 'succeeded';
           
            state.rooms= action.payload.rooms;
        })
        .addCase( leaveRoom.rejected,(state,action)=>{
            state.status= 'rejected';
            state.error = action.error.message

        })
    }
 })
 export const { logout,addToMyRoom } = userSlice.actions;
 export default  userSlice.reducer