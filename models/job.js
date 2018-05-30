var mongoose       = require("mongoose");
//schema setup for jobs
var jobSchema = new mongoose.Schema({
  Position_Type: String,
  name :String,
  image :String,
  imageId: String,
  address:String,
  CampanyName:String,
  aboutJob:String,
  phone:String,
  email:String,
  datetime:String,
  category:String,
  created:  {type: Date, default: Date.now},
  comments : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref  : "Comment"
    }
  ]


});
module.exports= mongoose.model("Job", jobSchema);
