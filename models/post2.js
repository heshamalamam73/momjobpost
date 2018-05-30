var mongoose       = require("mongoose");
//schema setup for blogs
var post2Schema = new mongoose.Schema({
  text: String,
  author:String,
  created:{type: Date,default:Date.now },
  comments : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref  : "Comment"
    }
  ]

});
module.exports = mongoose.model("Post2",post2Schema);
