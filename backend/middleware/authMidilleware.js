import User from "../models/userModel.js";
// import {Jwt} from "jsonwebtoken";
import  Jwt  from "jsonwebtoken";
// import pkg from 'jsonwebtoken';
// const {Jwt} = pkg;



const protect = async (req, res, next) => {
  
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
     
      try {
        const token = req.headers.authorization.split(" ")[1];
  
       
       
  
        const isCustomeAuth = token.length > 500;
      
        let decodedData;
       // 171 is the normal token length
        if (token && isCustomeAuth) {
         
  
         
          decodedData =   Jwt.verify(token,process.env.JWT_SECRET); 
          // decodedData =   Jwt.verify(token); 
        
          if(!decodedData){
            next()
            // return
          }
  
       
          const freshUser = await User.find({email:decodedData.email});
          req.user = freshUser;
       
          // req.user = await User.findById(decodedData.id).select("-password");
          // decodedData = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
          next()
        } else {
           
          // decodedData =   Jwt.decode(token,process.env.JWT_SECRET); 
          decodedData =   Jwt.verify(token,process.env.JWT_SECRET); 
          // decodedData =   Jwt.verify(token); 
        
          if(!decodedData){
            next()
            return
          }
          
       
        
          // decodedData = await promisify(jwt.decode)(token)
          // decodedData = await promisify(jwt.decode(token))
  
  
          const freshUser = await User.findById(decodedData.id);
          req.user = freshUser;
       
          if(freshUser){
            next()
          }
         
        }
  
       
        // next();
      } catch (error) {
      
        req.error = error.message
        next()
        // res.status(401);
       
        // throw new Error("Not Autherized token failed");
      }
    
    }
  
    // checking token
  // varifyiing token
  // check if the user still exist 
  // check if user changed password after the token was issued
  
    //   if (!token) {
    //     res.status(401);
    //     throw new Error("not authorized");
    //   }
  
    // next();
  };
  
  export {protect};