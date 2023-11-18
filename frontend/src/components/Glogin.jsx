import React from "react";
import { GoogleLogin } from "@moeindana/google-oauth";
import {useSelector,useDispatch} from 'react-redux';
import {googleAuth,logout} from '../redux/userSlice'
import axios from "axios";
function Glogin() {
    const dispatch = useDispatch()
    const onSucess = async (response) => {
        const token = response.credential;
        console.log('token', token)

        // const res = await axios.post('/api/v1/user/googleAuth',{token:token});
        const res = await dispatch(googleAuth(token));
        
      
        //  const userInfo = res.data.userInfo || null
        // if(userInfo){
        //   localStorage.setItem('userInfo',JSON.stringify(userInfo));
        // }
        
    }

  return (
    <>
    
      <GoogleLogin
        onSuccess={onSucess}
        onError={(e) => {
          console.log("Login Failed",e);
        }}
        // redirect_uri='http://127.0.0.1:3000'
        redirect_uri={window.location.origin}
        SECURE_REFERRER_POLICY="no-referrer-when-downgrade"
      />
    </>
  );
}

export default Glogin;
