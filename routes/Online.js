const express = require('express');
const router = express.Router();

require('../models/Online');





router.post('/api/online-users', async(req, res)=>{
             
    console.log(req.body.loginUsername)
    try{
        let onlineUser = {
             loginUsername: req.body.loginUsername.toLowerCase(),
             photo: req.body.photo,
        }

        console.log(onlineUser)

        let checkUser = await Online.findOne({loginUsername: req.body.loginUsername})
        console.log('checking' + " " +checkUser)

        if(checkUser){
            console.log('This user is already saved to database')
            res.send('Online user exist already')
        }else{
          
         Online.create(onlineUser)
        .then(users=>res.status(200).json(users))
        .catch(err=>res.status(400).json('Error:'+ " "+ err))
        
        }
    }

    catch(err){
        console.log(err.message)
    }

});


router.get('/api/online-users', async(req, res)=>{
      try{
            await Online.find({}).sort({createdAt:-1})
            .then(users=>res.status(200).json(users))
            .catch(err=>res.status(400).json('Error:'+ " "+err))
      }
      catch(err){
          console.log(err.response)
      }
})


router.delete('/api/delete/online-user/:loginUsername', async(req, res)=>{
       try{
           console.log(req.params)
          Online.findOneAndDelete({loginUsername: req.params.loginUsername})
           .then(()=>res.status(200).json('deleted'))
           .catch(err=>res.status(400).json('Error:'+ " "+err))
       }
       catch(err){
           console.log(err.message)
       }
});




module.exports = router;