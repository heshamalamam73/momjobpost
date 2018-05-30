var mongoose       = require("mongoose");
//schema setup for blogs
var postSchema = new mongoose.Schema({
  info: String,
  title:String,
  image:String,
  imageId: String,
  created:{type: Date,default:Date.now },
  comments : [
    {
      type : mongoose.Schema.Types.ObjectId,
      ref  : "Comment"
    }
  ]

});
module.exports = mongoose.model("Post",postSchema);
