const express = require('express');

const mongoose = require('mongoose')
const dotenv = require('dotenv');


dotenv.config();

const app = express();

const multer = require('multer')
app.use(express.json());
const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')

const postRoute = require('./routes/post')



if (!process.env.MONGO_URI) {
    console.error("Error: MONGO_URL is not defined in your .env file");
    process.exit(1); // Exit the app if MONGO_URL is missing
  }

mongoose.connect(process.env.MONGO_URI , {
}).then (console.log("connected"))
.catch((err) => console.log(err) );


const storage = multer.diskStorage({
    destination:(req , file , cb) => {
        cb(null , "images")
    }, filename:(req, file , cb)=> {
        cb(null, req.body.name);
    }
}) ;


const upload = multer({storage : storage});

app.post("api/upload" , upload.single('file'),(req , res) => {
    res.status(200).json("done")
})

app.use("/api/auth" , authRoute);

app.use("/api/users" , userRoute);

app.use("/api/posts" , postRoute);


app.listen("5000" , () => {
    console.log("Backend is running")
})