var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    path        = require("path")




app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));
app.set('views', __dirname + '/views');






app.get("/",function(req,res){
    res.render("landing");
});


app.get("/gallery",function(req,res){
    res.render("gallery");
});



app.get("/about",function(req,res){
    res.render("about");
});
app.get("/login", function(req,res){
    
    res.render("login");
});
app.get("/contact", function(req,res){
    
    res.render("contact");
});

app.get("/signin", function(req,res){
    
    res.render("signin");
});





app.listen(process.env.PORT,process.env.IP,function(){
    console.log("the server started at 4000");
});