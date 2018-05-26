var express        = require("express"),
    app            = express(),
    methodOverride = require("method-override"),
    bodyParser     = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    path           = require("path"),
    mongoose       = require("mongoose");




    //app config
    app.set("view engine" , "ejs");
    app.use(expressSanitizer());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static("public"));
    app.set('views', __dirname + '/views');
    app.use(methodOverride("_method"));




//connect mongoose
// mongoose.connect("mongodb://localhost/momuzio");
mongoose.connect("mongodb://momuzio:1234@ds119350.mlab.com:19350/momuzio");





//schema setup for jobs
var jobSchema = new mongoose.Schema({
  Position_Type: String,
  name :String,
  image :String,
  address:String,
  CampanyName:String,
  aboutJob:String,
  phone:String,
  email:String,
  datetime:String,
  category:String,
  created:  {type: Date, default: Date.now}

});
var Job = mongoose.model("Job", jobSchema);

//schema setup for blogs
var blogSchema = new mongoose.Schema({
  info: String,
  title:String,
  image:String,
  created:{type: Date,default:Date.now }
});
var Blog = mongoose.model("BLOG",blogSchema);

// Blog.create({
//   body: "this is the first photo i uploud here ",
//   title:"my photo",
//   image:"https://images.pexels.com/photos/159299/graphic-design-studio-tracfone-programming-html-159299.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
//
// });








//start routes
app.get("/",function(req,res){
    res.render("landing");
});

//store routes  start
app.get("/store",function(req,res){
  Blog.find({},function(err,blogs){
    if (err){console.log(err);
    } else {
      res.render("store",{blogs: blogs});
     }
  });

});
app.post("/store",function(req,res){
  var title = req.body.title;
  var info = req.body.info;
  var image = req.body.image;
  var newpost = {title :title, info:info , image:image }
  Blog.create(newpost,function(err,newPost){
    if(err){console.log(err);
    } else {
      console.log("new post was added:");
      console.log(newPost);
      res.redirect("/store")
    }
  });
});
app.get("/store/new",function(req,res){
  res.render("newblog");
});

app.get("/store/:id", function(req,res){
  Blog.findById(req.params.id,function(err, foundblog){
    if(err){
      console.log(err);
      res.redirect("/")
    } else {
      res.render("showblog",{ blog: foundblog});
    }
  });
});
//edit post
app.get("/store/:id/edit",function(req,res){
  Blog.findById(req.params.id,function(err,foundblog){
    if(err){
      console.log(err);
      res.redirect("/");

    }else{
        res.render("editblog",{blog: foundblog});
    }
  });
});
app.put("/store/:id", function(req,res){
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,
    foundblog) {
    if(err){
      console.log(err);
      res.redirect("/store");
    }else {
      res.redirect("/store/" + req.params.id);
    }
  });
});
// destroy post
app.delete("/store/:id",function(req,res){
  //delete post
  Blog.findByIdAndRemove(req.params.id,function(err,deletepost){
    if(err){
      res.redirect('/store')
    }else {
        res.redirect('/store');
    }
  });

});



app.get("/login", function(req,res){

    res.render("login");
});


app.get("/signin", function(req,res){

    res.render("signin");
});
////// start jobs code here
app.get("/jobs", function(req,res){
  // get all jobs from Db
Job.find({}, function(err, jobs){
  if(err){ console.log(err);
  } else {
    res.render("index",{jobs: jobs});
    }
  });
});


app.post('/jobs', function(req, res){
  var Position_Type = req.body.Position_Type;
  var image = req.body.image;
  var address = req.body.address;
  var CampanyName = req.body.Campany_name;
  var aboutJob = req.body.about_job;
  var name = req.body.name2;
  var phone = req.body.number;
  var email = req.body.email;
  var datetime = new Date();



  var newjob = {
    Position_Type: Position_Type ,
    image: image,
    address:address,
    CampanyName:CampanyName,
    aboutJob:aboutJob,
    name:name,
    phone:phone,
    email:email,
    datetime:datetime
  };
  Job.create(newjob, function(err,job){
    if(err){
      console.log(err);
    } else {
      console.log("jast added a new job");
      console.log(job);
      res.redirect("/jobs");
    }
  });

});
//post new job
app.get("/jobs/newjob", function(req,res){

    res.render("newjob");
});
//show job page
app.get("/jobs/:id", function(req,res){
  Job.findById(req.params.id,function(err, foundjob){
    if(err){console.log(err);
    } else{
      res.render("show", {job: foundjob});
    }
  });

});

//finish job codes here









app.listen(process.env.PORT,process.env.ID,function(){
    console.log("the server started at 4000");
});
