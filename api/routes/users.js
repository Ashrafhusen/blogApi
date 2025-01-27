const router = require('express').Router();

const User = require('../models/User.js');

const bcrypt = require ('bcrypt')


const  Post = require('../models/Post.models.js');





router.put("/:id" , async(req , res) => {
    if(req.body.userId === req.params.id){
        if (req.body.password) {
         const salt = await bcrypt.genSalt(10);
         req.body.password = await bcrypt.hash(req.body.password , salt);
        }
    
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true } 
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
} else {
    res.status(401).json("You can only update your own account!");
}
}); 


router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id) {
        try {
           
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json("User not found!");
            }

            
            await Post.deleteMany({ username: user.username });

            
            await User.findByIdAndDelete(req.params.id);

            res.status(200).json("User and associated posts have been deleted!");
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(401).json("You can only delete your own account!");
    }
});


router.get('/', async (req, res) => {
    const { user: username, cat: catName } = req.query;

    try {
        let posts;

        // Check if both username and catName are undefined or invalid
        if (!username && !catName) {
            // No query parameters, return all posts
            posts = await Post.find();
        } else {
            const query = {};  // Initialize the query object

            // If username is provided, add it to the query
            if (username && typeof username === 'string' && username.trim().length > 0) {
                query.username = username;
            }

            // If catName is provided, add it to the query
            if (catName && typeof catName === 'string') {
                query.categories = { $in: [catName] };
            }

            // Fetch posts based on the constructed query
            posts = await Post.find(query);
        }

        res.status(200).json(posts);
    } catch (err) {
        // Check for CastError
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid query parameter provided' });
        }
        // Handle other errors
        res.status(500).json(err);
    }
});





module.exports = router;