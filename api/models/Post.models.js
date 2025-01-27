const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema(
    {
        title : {
            type : String ,
            unique : true,
            required: true

        },
        desc : {
            type : String  ,
            required  : false
        } ,

        userName : {
            type : String , 
            required : true 
        },

        categories : {
            type : Array ,
            required : false
        },

    },{
    

    timestamps : true 
});

module.exports = mongoose.model("Post.model" , PostSchema);
