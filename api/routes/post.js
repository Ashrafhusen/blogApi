const router = require('express').Router();

const User = require('../models/User.js');




const  Post = require('../models/Post.models.js');





router.post("/" , async(req , res) => {

    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
   
}); 


router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.userName === req.body.userName) {
            try {

                const updatedUser = await Post.findByIdAndUpdate(
                    req.params.id,{
                        $set : req.body,
                    } ,{
                        new : true
                    }
                );

                res.status(200).json(updatedUser);
                
            } catch (error) {
                res.status(401).json("Error")
                
            }
        } else {
            res.status(401).json("Only Yours")
        }
        
    } catch (error) {
        res.status(500).json(error);
        
    }
    
});


router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id); // Find the post by ID
        if (!post) {
            return res.status(404).json({ message: "Post not found" }); // If post doesn't exist
        }

        if (post.userName !== req.body.userName) {
            return res.status(403).json({ message: "You can delete only your posts" }); // Unauthorized
        }

        await Post.findByIdAndDelete(req.params.id); // Directly delete by ID
        res.status(200).json({ message: "Post has been deleted successfully" }); // Success response
    } catch (error) {
        res.status(500).json({ 
            message: "Error deleting the post", 
            error: error.message || "Unknown error" 
        }); // Internal error
    }
});


router.get('/:id?' , async (req , res) => {
    try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
    }
 catch(err) { 
    res.status(401).json(err)

 }});


 router.get('/', async (req, res) => {
    const username = req.query.user; // Get username from query params
    const catName = req.query.cat; // Get category name from query params

    console.log("Query Params:", { username, catName }); // Debugging query parameters

    try {
        let posts;

        if (username) {
            posts = await Post.find({ username }); // Fetch posts by username
        } else if (catName) {
            posts = await Post.find({
                categories: {
                    $in: [catName], // Find posts with categories that include the given category name
                },
            });
        } else {
            posts = await Post.find(); // Fetch all posts
        }

        console.log("Posts Retrieved:", posts); // Debugging database response

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        }

        res.status(200).json(posts); // Return the posts
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message }); // Proper error handling
    }
});





module.exports = router;