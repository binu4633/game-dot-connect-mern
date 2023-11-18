import mongoose from'mongoose';

const connectDB = async()=>{
    
    try {

     let uri ;
     
     if(process.env.NODE_ENV = 'development'){
        uri = await process.env.MONGO_URI
     }else{
        uri = await process.env.MONGO_URI2
     }
      
      const conn = await mongoose.connect(process.env.MONGO_URI) 
      
     console.log(`Mongodb connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`mongoose Error ${error.message}`);
        process.exit(1)
    }
}

export default connectDB;