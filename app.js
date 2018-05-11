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

app.get("/about",function(req,res){
    res.render("about");
});
app.get("/login", function(req,res){
    
    res.render("login");
});






app.listen(process.env.PORT,process.env.IP,function(){
    console.log("the server started at 4000");
});