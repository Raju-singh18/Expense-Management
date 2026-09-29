
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        rewuired:true,
    },
},{
    timestamps:true,
})

module.exports = mongoose.model("User", userSchema);
