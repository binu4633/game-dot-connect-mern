import mongoose from'mongoose';

const connectDB = async()=>{
    
    try {

     let uri ;
     
     if(process.env.NODE_ENV === 'production'){
        // console.log('does development workkssss')
        uri = await process.env.MONGO_URI2
     }else{
        uri = await process.env.MONGO_URI
     }
      console.log('uri', uri)
    //   const conn = await mongoose.connect(process.env.MONGO_URI) 
      const conn = await mongoose.connect(uri) 
      
     console.log(`Mongodb connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`mongoose Error ${error.message}`);
        process.exit(1)
    }
}

export default connectDB;