const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config")

const app = express();
// convert data into json format
app.use(express.json());

app.use(express.urlencoded({ extended: false }))
// use Ejs as the view engine
app.set('view engine', 'ejs');
// static file
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("login");
});
app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

// Register User
app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        email: req.body.email,
        password: req.body.password
    }
    //    check if the user aleready exists in the database
    const existingEmail = await collection.findOne({ email: data.email });
    if (existingEmail) {
        return res.send(errorEmail)
    } else {
        // hash the password using bcrypt 
        const saltRounds = 10; //number of salt round for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds)
        // const hashedemail = await bcrypt.hash(data.email, saltRounds)

        data.password = hashedPassword; //Raplace the hash password with orignal password
        // data.email = hashedemail; //Raplace the hash password with orignal password

        const userdata = await collection.insertMany(data);
        res.render("login");
        console.log(userdata);
    }

});

app.post("/login", async (req, res) => {
    try {
        // Find the user based on the provided email
        const user = await collection.findOne({ email: req.body.email });

        if (!user) {
            // Email not found
            return res.send((errorLoginEmail));
        }


        // Compare the provided password with the hashed password stored in the database
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

        if (isPasswordMatch) {
            // Passwords match, render the home page
            res.render("home");
        } else {
            // Passwords do not match
            return res.send((errorLoginPassword));
        }
    } catch (error) {
        // Error occurred during login
        console.error(error);
        res.send("Error occurred during login.");
    }
});


const errorEmail = `
<script>
// Function to open the popup when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function() {
let popup = document.querySelector(".popup");
popup.classList.add("open-popup");
});
</script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
    integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
    crossorigin="anonymous" referrerpolicy="no-referrer" />
  <div class="container">
    <div class="popup">
    
      <h5 class="i"><i class="fa-sharp fa-solid fa-circle-xmark" style="font-size: 100px; color: red;"></i></h4>
    
      <h2>User already exists</h2>
    
      <p>Please choose a different email</p>
    
      <a href="/signup"><button type="button">TRY AGAIN</button></a>
    
    </div>
    </div>
        
    <style>
    .container {
      width: 100%;
      height: 100vh;
      background: #333333;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .popup {
      width: 400px;
      background: #fff;
      border-radius: 6px;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.1);
      text-align: center;
      padding: 0 30px 30px;
      color: #333;
      visibility: hidden;
      transition: transform 0.9s, top 0.9s;
    }
    
    .open-popup {
      visibility: visible;
      top: 50%;
      transform: translate(-50%, -50%) scale(1);
    }
    
    .popup i {
      width: 100px;
      margin-top: -50px;
      border-radius: 50%;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
    
    .popup h2 {
      font-size: 38px;
      font-weight: 500;
      margin: 30px 0 10px;
    }
    
    .popup button {
      width: 100%;
      margin-top: 50px;
      padding: 10px 0;
      background: #333333;
      color: #fff;
      border: 0;
      outline: none;
      font-size: 18px;
      border-radius: 4px;
      cursor: pointer;
      box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
    }
    </style>
`;


function generateErrorPopup(errorType) {
    return `
    <script>
      document.addEventListener("DOMContentLoaded", function() {
        let popup = document.querySelector(".popup");
        popup.classList.add("open-popup");
      });
    </script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
      <div class="container">
        <div class="popup">
        <a href="/login"> <h5 class="i"><i class="fa-sharp fa-solid fa-circle-xmark" style="font-size: 100px; color: red;"></i></h4></a>
          <h2>${errorType}</h2>
          <a href="/login"><button type="button">TRY AGAIN</button></a>
        </div>
      </div>
    <style>
      .container {
        width: 100%;
        height: 100vh;
        background: #333333;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .popup {
        width: 400px;
        background: #fff;
        border-radius: 6px;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.1);
        text-align: center;
        padding: 0 30px 30px;
        color: #333;
        visibility: hidden;
        transition: transform 0.9s, top 0.9s;
      }
      
      .open-popup {
        visibility: visible;
        top: 50%;
        transform: translate(-50%, -50%) scale(1);
      }
      
      .popup i {
        width: 100px;
        margin-top: -50px;
        border-radius: 50%;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      }
      
      .popup h2 {
        font-size: 38px;
        font-weight: 500;
        margin: 30px 0 10px;
      }
      
      .popup button {
        width: 100%;
        margin-top: 50px;
        padding: 10px 0;
        background: #333333;
        color: #fff;
        border: 0;
        outline: none;
        font-size: 18px;
        border-radius: 4px;
        cursor: pointer;
        box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
      }
    </style>`;
}

const errorLoginEmail = generateErrorPopup("Email not found.");
const errorLoginPassword = generateErrorPopup("Password not found.");


const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
