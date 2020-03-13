var express=require('express'),
    mongoose=require("mongoose"),
    passport=require("passport"),
    bodyParser=require('body-parser'),
    localStrategy=require('passport-local'),
    passportLocalMongoose=require("passport-local-mongoose"),
    User=require("./models/user");

mongoose.connect("mongodb://loclhost/auth_demo_app");

var app=express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
    secret:"Rusty is a beautiful dog",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
    res.render("home");
})
app.get("/secret",isLoggedIn,function(req,res){
    res.render("secret");
})
//auth routes
app.get("/register",function(req,res){
    res.render("register");
})
//handling sign up
app.post("/register",function(req,res){
    req.body.username;
    req.body.password;
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secret");
            })
        }
    })
})
//login routes
app.get("/login",function(req,res){
    res.render("login");
})
//login logic
//middleware
app.post("/login",passport.authenticate("local",{
    successRedirect:"/secret",
    failureRedirect:"/login"
}),function(rq,res){

})
app.get("/logout",function(req,res){
    req.logOut();
    res.redirect("/");
})
function isLoggedIn(req,res,next){
    if(res.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
app.listen(3000,function(){
    console.log("server is started");
})