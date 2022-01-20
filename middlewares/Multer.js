const multer = require('multer');
const cloudinary = require('cloudinary');
const dotenv = require('dotenv');
dotenv.config()


var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb (null, 'public/uploads')
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + "_" + file.originalname);
    }
});




cloudinary.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Api_Key,
    api_secret: process.env.Api_Secret
}); 


module.exports = multer({storage: storage});

