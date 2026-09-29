
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async()=>{
    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDb Atlas Connected.");
    } catch (error) {
        console.log("MongoDb Connection Failed.");
        console.log(error.message);

        process.exit(1);
    }
}

module.exports = connectDB;
