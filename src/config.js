const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/Login-tut");

// check database connected ro not
connect.then(()=>{
    console.log("Database connected Successfully");
});
connect.catch(()=>{
    console.log("Database cannot be connected");
});

// Create a schema
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Collection part
const collection = new mongoose.model("users",LoginSchema);

module.exports = collection;