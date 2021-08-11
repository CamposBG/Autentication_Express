# Authentication_Express
Basic Authentication using JS and Express

# Bcrypt for Auth
## [Installing](https://www.npmjs.com/package/bcrypt)
```sh
npm i bcryptjs
```
At the Js file we import the bcrypt:
```js
const bcryot = require ("bcrypt")
```
### Important methods to Hash a password:
* To Generate the password salt for us:
* To Hash the password
```js
bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash("myPlaintextPassword", salt, function(err, hash) {
        // Store hash in your password DB.
    });
});
```
the saltRounds is like a difficult level for the salt (the lower the number -> faster the hash, it increases exponentially), this days the recommended is 12. The goal is to slow down the process.

 the example above is using the callback form. The library also supports promises so we can use **async/await**:
 ```js
async function checkUser(username, password){
    //... fetch user form a db etc.
    const match = await bcryot.compare(password, user.passwordHash);
    if(match){
        //logging
    }
    //...
}
```
At Js lets create the salt and hash the password:
```js
const hashPassword = async (pw) => {
    //1st generate the salt
    const salt = await bcrypt.genSalt(12);
    //hashing the password
    const hash = await bcrypt.hash(pw, salt)
}
hashPassword("badpassword");
```
Now that we have the hashed password saved somewhere, lets verify somebody's login information:
* Method **.compare()**
```js
// Load hash from your password DB.
bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
    // res === true
});
```
At JS lets compare:
```js
const login = async (pw, hashedPw) => {
    const result = await bcrypt.compare(pw. hashedPw)
    if (result){
        console.log("LOGGED YOU IN")
    } else {
        console.log("INCORRECT")
    }
}
login("badPassword", "jdsahfilh234243hsaiudgodiu1432412421ihdhsafds124")
```
If we want we can generate the salt and hash the pw at the same time by:
```js
bcrypt.hash('myPlaintextPassword', saltRounds, function(err, hash) {
    //Store hash in your password DB.
});
```
to use that code at our JS we need to await it:
```js
const hashPassword = async (pw) => {
    const hash = await bcrypt.hash(pw,12);
}
```