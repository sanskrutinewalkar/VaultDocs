const mongoose = require ("mongoose");

const db = async()=>{
    try{
       await mongoose.connect (process.env.MONGO_URI);
    } catch (error)
    {
        console.log("MongoDb connection failed",error.message);
    }
};

module.exports = db;