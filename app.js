var express               = require("express"),
    app                   = express(),
    methodOverride        = require("method-override"),
    bodyParser            = require("body-parser"),
    expressSanitizer      = require("express-sanitizer"),
    path                  = require("path"),
    Job                   = require("./models/job"),
    passport              = require("passport"),
    Post                  = require("./models/post"),
    // Post2                 = require("./models/post2")
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
   path              = require("path"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Comment               = require("./models/comment"),
    mongoose              = require("mongoose");
    //start uploud photo
    var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'momuzio',
  api_key: "136814375265717",
  api_secret: "-PaslMt7szwG3MoZyIiIn7E5Sxk"
});
// end uploud photo

    //connect mongoose
    // mongoose.connect("mongodb://localhost/momuzio");
    mongoose.connect("mongodb://momuzio:1234@ds119350.mlab.com:19350/momuzio");


    //app config
    app.set("view engine" , "ejs");
    app.use(expressSanitizer());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static("public"));
    app.set('views', __dirname + '/views');
    app.use(methodOverride("_method"));

    //config passport
    app.use(require("express-session")({
      secret:"i love the nome of momuzio",
      resave: false,
      saveUninitialized: false
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());


//start routes
app.get("/",function(req,res){
    res.render("landing");
});
app.get("/secret",isLogedIn,function(req, res){
  res.render("secret")
})


//store routes  start
//==============================================
app.get("/store",function(req,res){
  Post.find({}).populate("comments").exec(function(err,posts){
    if (err){console.log(err);
    } else {
      res.render("post/index",{posts: posts});
     }
  });

});
app.post("/store",isLogedIn, upload.single('image'),function(req,res){
  cloudinary.v2.uploader.upload(req.file.path, function(err,result) {
     if(err) {
       return res.redirect('back');
     }
  var title = req.body.title;
  var info = req.body.info;
  var image = result.secure_url;
  var imageId = result.public_id;

  var newpost = {title :title, info:info , image:image,imageId:imageId }
  Post.create(newpost,function(err,newPost){
    if(err){console.log(err);
    } else {
      console.log("new post was added:");
      console.log(newPost);
      res.redirect("/store")
    }
  });
  });
});
app.get("/store/new",isLogedIn,function(req,res){
  res.render("post/new");
});

app.get("/store/:id", function(req,res){
  Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
    if(err){
      console.log(err);
      res.redirect("/")
    } else {
      res.render("post/show",{ post: foundPost});
    }
  });
});
//edit post
app.get("/store/:id/edit",isLogedIn,function(req,res){
  Post.findById(req.params.id,function(err,foundPost){
    if(err){
      console.log(err);
      res.redirect("/");

    }else{
        res.render("post/edit",{post: foundPost});
    }
  });
});
app.put("/store/:id", upload.single('image'), function(req,res){
  Post.findById(req.params.id, async function(err, post) {
    if(err){
      console.log(err);
      res.redirect("/store");
    } else {
      if(req.file) {
        try {
          await cloudinary.v2.uploader.destroy(post.imageId);
          var result = await cloudinary.v2.uploader.upload(req.file.path);
          post.imageId = result.public_id;
          post.image = result.secure_url;
          } catch(err) {
            return res.redirect("/store");
          }
        }
        post.title = req.body.title;
        post.info = req.body.info;
        post.save();
        res.redirect("/store/" + req.params.id);
    }
  });
});
// destroy post
app.delete("/store/:id",isLogedIn,function(req,res){
  //delete post
  Post.findById(req.params.id, async function(err, post){
    if(err){
    return  res.redirect('/store');
    }
    try {
        await cloudinary.v2.uploader.destroy(post.imageId);
        post.remove();
        res.redirect('/store');
        } catch(err) {
          if(err) {
            return res.redirect("back");
          }
    }
  });
});


//=========================================


//comment routes start
//==============================================================================
// posts comments
app.get("/store/:id/comments/new",function(req,res){
Post.findById(req.params.id,function(err,post){
  if(err){
    console.log(err);
  } else {
    res.render("comments/new",{post: post});
  }
});
});

app.post("/store/:id/comments",function(req,res){
  //lookup posts using ID
  Post.findById(req.params.id,function(err,post){
    if(err){console.log(err);
      res.redirect("/store",{post: post})
    } else {
      Comment.create(req.body.comment,function(err,comment){
        if(err){
          console.log(err);
        } else {
          post.comments.push(comment);
          post.save();
         res.redirect("/store/"+ post._id );
        }
      });
    }
  });
});
//jobs comments
app.get("/jobs/:id/comments/new",function(req,res){
Job.findById(req.params.id,function(err,job){
  if(err){
    console.log(err);
  } else {
    res.render("comments/new",{job: job});
  }
})
});

app.post("/jobs/:id/comments",function(req,res){
  //lookup posts using ID
  Job.findById(req.params.id,function(err,job){
    if(err){console.log(err);
      res.redirect("/jobs",{job: job})
    } else {
      Comment.create(req.body.comment,function(err,comment){
        if(err){
          console.log(err);
        } else {
          job.comments.push(comment);
          job.save();
         res.redirect("/jobs/"+ job._id );
        }
      });
    }
  });
});


//comments routes end
//==============================================================================

//start users routes
//==============================================================================


app.get("/register", function(req,res){

    res.render("register");
});

app.post("/register",function(req,res){
User.register(new User({username:req.body.username}),
req.body.password,function(err, user){
  if(err){
    console.log(err);
    return res.render("register");
  }
  passport.authenticate("local")(req, res, function(){
            res.redirect("/");
         });
});
});

app.get("/login", function(req,res){
res.render("login");
});
app.post("/login",passport.authenticate("local",{
  successRedirect : "/",
  failureRedirect : "/login"
}), function(req,res){

});

app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
});



//=========================end users routes====================================
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


app.post('/jobs',isLogedIn, upload.single('image'), function(req, res){
  cloudinary.v2.uploader.upload(req.file.path, function(err,result) {
     if(err) {
       return res.redirect('back');
     }
  var Position_Type = req.body.Position_Type;
  var image = result.secure_url;
  var imageId = result.public_id;
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
    datetime:datetime,
    imageId:imageId
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
});
//post new job
app.get("/jobs/newjob",isLogedIn, function(req,res){

    res.render("newjob");
});
//show job page
app.get("/jobs/:id", function(req,res){
  Job.findById(req.params.id).populate("comments").exec(function(err, foundjob){
    if(err){console.log(err);
    } else{
      res.render("show", {job: foundjob});
    }
  });

});

//finish job codes here
function isLogedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login")
}



// app.listen(3000,function(){
//     console.log("the server started at 4000");
// });






//
app.listen(process.env.PORT,process.env.ID,function(){
    console.log("the server started at 4000");
});
