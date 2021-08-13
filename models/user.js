const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username cannot be blank"]
    },
    password: {
        type: String,
        required: [true, "Password cannot be blank"]
    }
})

//defining a new method to be used in the user classes
userSchema.statics.findAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ username })//this refers to the particular schema

    const isValid = await bcrypt.compare(password, foundUser.password)
    return isValid ? foundUser : false;
}

//before saving a new user lets hash its password ans save the hashed one
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // is the password was not modified, returns next
    this.password = await bcrypt.hash(this.password, 12); //refers to the particular instance of the user, in this case.
    next(); //will call save
})

// creating and exporting the module
module.exports = mongoose.model("User", userSchema);