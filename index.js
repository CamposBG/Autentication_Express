const express = require("express");
const mongoose = require("mongoose");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");
const session = require("express-session")



mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongo connection open!")
    })
    .catch(err => {
        console.log("Mongo connection error:")
        console.log(err)
    })

app.set("view engine", "ejs");
app.set("views", "views")

//parsing the req.body
app.use(express.urlencoded({ extended: true }));

//using session to stay logged in 
app.use(session({ secret: "notagoodsecret" })) // secret should be stored safely 

//basic routes
app.get("/", (req, res) => {
    res.send("This is the home page")
})

app.get("/register", (req, res) => {
    res.render("register");
})

//rout to submit the form
app.post("/register", async (req, res) => {
    const { password, username } = req.body;
    const user = new User({ username, password })
    await user.save();
    req.session.user_id = user.user_id;
    res.redirect("/")
})

// login routes
app.get("/login", (req, res) => {
    res.render("login")
})
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findAndValidate(username, password)
    if (foundUser) {
        req.session.user_id = foundUser._id; // if the user successfully login we gonna store it's id in the session to keep the user logged in
        res.redirect("/secret")
    } else {
        res.redirect("/login")
    }
})

//logout rout 
app.post("/logout", (req, res) =>{
    req.session.user_id = null;
    //req.session.destroy(); //another option
    res.redirect("/login")
})

// lets protect this route 
app.get("/secret", (req, res) => {
    if (!req.session.user_id) {
        return res.redirect("/login")
    } else {
        res.render("secret")
    }

})

app.listen(3000, () => {
    console.log("SERVING ON PORT 3000")
})

//teste 2
