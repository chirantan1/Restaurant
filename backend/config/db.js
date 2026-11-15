const mongoose = require('mongoose');
const colors = require('colors');

const connectDB=async()=>{
    try{
       await mongoose.connect(process.env.MONGODB_URI)
        console.log(
  `Connected to database: ${mongoose.connection.host}`.green.bold
);
    } catch(error){
        console.log("DB Error",error,colors.red.bold);
    }
};


module.exports=connectDB;