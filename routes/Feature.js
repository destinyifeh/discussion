const express = require('express');
const cloudinary = require('cloudinary');
const router = express.Router();
const upload = require('../middlewares/Multer');
require('../models/Feature');


router.post('/api/feature/new', upload.single('image'), async(req, res)=>{
    try{

  cloudinary.v2.uploader.upload(req.file.path, {folder: 'zenith', resource_type: 'auto'}, (err, result)=>{  
      if(err){
          console.log(err);
      }else{

       let newFeature = {
            title: req.body.title,
            description : req.body.description,
            username : req.body.username,
            photo : req.body.photo,
            image: result.secure_url,
            cloudinary_id: result.public_id,
       }
       console.log(newFeature)

       Feature.create(newFeature)
       .then(feature=>res.status(200).json(feature))
       .catch(err=>res.status(400).json('Error:' +" "+err))
    }

    })
}
catch(err){
    console.log(err.message)
}
     
});



router.get('/api/features', async(req, res)=>{
          
       Feature.find({}).sort({createdAt:-1}).limit(4)
      .then(feature=>res.status(200).json(feature))
      .catch(err=>res.status(400).json('Error:' +" "+err))

});

//For recent posts//


router.get('/api/features/recent', async(req, res)=>{
          
    Feature.find({}).sort({createdAt:1}).limit(4)
   .then(feature=>res.status(200).json(feature))
   .catch(err=>res.status(400).json('Error:' +" "+err))

});

//For search results//


router.get('/api/features/search', async(req, res)=>{
          
    Feature.find({}).sort({createdAt:-1})
   .then(feature=>res.status(200).json(feature))
   .catch(err=>res.status(400).json('Error:' +" "+err))

});



//ViewedBy route//


router.post('/api/feature/views/:slug', async(req, res)=>{

    try{
       console.log(req.body.username)
       Feature.findOne({slug: req.params.slug})
        .then(feature=>{
            console.log(feature)

        feature.updateOne({$addToSet: {viewedBy: req.body.username}})
        .then(feature=>res.status(200).json(feature))
        .catch(err=>res.status(400).json('Error:' +" "+err))
      })
   

    }

    catch(err){
        console.log(err.message)
    }
});
       
      
    




router.get('/api/feature/:slug', async(req, res)=>{

     try{

       
        
         Feature.findOne({slug: req.params.slug})
         .then(feature=>res.status(200).json(feature))
         .catch(err=>res.status(400).json('Error:' +" "+err))
        
     

        }

        catch(err){
            console.log(err.message)
        }
   });
   
        
       
   


router.get('/api/edit/feature/:slug', async(req, res)=>{
       try{
           console.log(req.params)
           Feature.findOne({slug: req.params.slug})
           .then(feature=>res.status(200).json(feature))
           .catch(err=>res.status(400).json('Error:'+ " "+err))
       }
       catch(err){
           console.log(err.message)
       }
});


router.put('/api/update/feature/:slug', upload.single('image'), async(req, res)=>{
    try{
           if(req.file){
               console.log(req.file)
         let feature = await Feature.findOne({slug: req.params.slug})
          cloudinary.v2.uploader.destroy(feature.cloudinary_id)
          cloudinary.v2.uploader.upload(req.file.path, {folder: 'zenith', resource_type: 'auto'}, (err, result)=>{
              if(err){
                  console.log(err)
              }else{
               
                    feature.title = req.body.title,
                    feature.description = req.body.description,
                    feature.image  = result.secure_url,
                    feature.cloudinary_id = result.public_id,
                    console.log(feature)
                     feature.save()
                    .then(feature=>res.status(200).json(feature))
                    .catch(err=>res.status(400).json('Error:'+ " "+ err))
                
              }
        
        })
    }else{
         Feature.findOne({slug: req.params.slug})
        .then(feature=>{
          feature.title = req.body.title,
          feature.description = req.body.description,
            console.log(feature)
           feature.save()
          .then(feature=>res.status(200).json(feature))
          .catch(err=>res.status(400).json('Error:'+ " "+ err))
      })
    }
    }
    catch(err){
        console.log(err.message)
    }
});



router.delete('/api/delete/feature/:slug', async(req, res)=>{
    try{
          Feature.findOneAndDelete({slug: req.params.slug})
          .then(()=>res.status(200).json('Post deleted'))
          .catch(err=>res.status(400).json('Error:' + " "+err))
    }
    catch(err){
        console.log(err.message)
    }
});


router.post('/api/comment/feature/:slug', async(req, res)=>{
      try{
         Feature.findOne({slug: req.params.slug})
         .then(feature=>{
             let newComment = {
                 commentBody: req.body.commentBody,
                 commentUser: req.body.commentUser,
                 commentPhoto: req.body.commentPhoto,

             }

             console.log(newComment)
             feature.comments.unshift(newComment)
             feature.save()
             .then(feature=>res.status(200).json(feature))
             .catch(err=>res.status(400).json('Error:'+ " "+err))
         })
      }
      catch(err){
          console.log(err.message)
      }
});


router.get('/api/comments/feature/:slug', async(req, res)=>{
         
    try{
           Feature.findOne({slug: req.params.slug})
          .then(comment=>res.status(200).json(comment))
          .catch(err=>res.status(400).json('Error: '+ " "+err))
    }
    catch(err){
        console.log(err.message)
    }
})



module.exports = router;