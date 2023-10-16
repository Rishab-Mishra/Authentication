import {} from 'dotenv/config'
import express from "express";
import mongoose from "mongoose";
import md5 from 'md5';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));


mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req,res)=>{
    res.render("home");
});

app.get("/login", (req, res)=>{
    res.render("login");
});

app.get("/register", (req, res)=>{
    res.render("register");
});

app.post("/register", (req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    newUser.save().then(function(){
        res.render("secrets");
    }).catch(function(err){
        console.log(err);
    });
});

app.post("/login", (req,res)=>{
    const name = req.body.username;
    const pwd = md5(req.body.password);

    User.findOne({email: name}).then((foundUser)=>{
            if(foundUser){
                if(foundUser.password === pwd){
                    res.render("secrets");
                }
            }else{
                res.redirect("/login");
            }
    }).catch(function(err){
        console.log(err);
    });
});

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});