const mongoose = require("mongoose");

const { initGridFS } = require('./gridfs');



const db = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDb Atlas connection successful.");

        initGridFS();   // ← ADD THIS LINE

    } catch (error) {

        console.log("MongoDb connection failed", error.message);

    }

};



module.exports = db;