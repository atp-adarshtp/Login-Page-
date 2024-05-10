const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config")

const app = express();
// convert data into json format
app.use(express.json());

app.use(express.urlencoded({extended: false}))
// use Ejs as the view engine
app.set('view engine', 'ejs');
// static file
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

// Register User

// Register User
app.post("/signup",async (req,res) => {
   const data={
    name: req.body.username,
    email: req.body.email,
    password: req.body.password
   }
//    check if the user aleready exists in the database
const existingUser = await collection.findOne({name: data.name});
const existingEmail = await collection.findOne({email: data.email});
if (existingUser) {
    res.send("User already exists. Please choose a different username.")
}else if (existingEmail){
    res.send("User already exists. Please choose a different email.")
}else{
// hash the password using bcrypt 
const saltRounds = 10; //number of salt round for bcrypt
const hashedPassword = await bcrypt.hash(data.password, saltRounds)
// const hashedemail = await bcrypt.hash(data.email, saltRounds)

data.password = hashedPassword; //Raplace the hash password with orignal password
// data.email = hashedemail; //Raplace the hash password with orignal password

const userdata = await collection.insertMany(data);
console.log(userdata);
}

  
});

app.post("/login", async (req, res) => {
    try {
        // Find the user based on the provided email
        const user = await collection.findOne({ email: req.body.email });
        
        if (!user) {
            // Email not found
            return res.send("Email not found.");
        }

        // Compare the provided password with the hashed password stored in the database
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        
        if (isPasswordMatch) {
            // Passwords match, render the home page
            res.render("home");
        } else {
            // Passwords do not match
            res.send("Wrong password.");
        }
    } catch (error) {
        // Error occurred during login
        console.error(error);
        res.send("Error occurred during login.");
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
