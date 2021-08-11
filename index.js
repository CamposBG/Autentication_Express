const express = require("express");
const mongoose = require("mongoose");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");

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
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        password: hash
    })
    await user.save();
    res.redirect("/")
})

// login routes
app.get("/login", (req, res) => {
    res.render("login")
})
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    //find the user on the DB
    const user = await User.findOne({ username });
    //compare the passwords
    const validPassword = await bcrypt.compare(password, user.password)
    if (validPassword) {
        res.send("Welcome")
    } else {
        res.send("Try again")
    }
})

app.get("/secret", (req, res) => {
    res.send("this is secret, you need to login to see me")
})


app.listen(3000, () => {
    console.log("SERVING ON PORT 3000")
})

