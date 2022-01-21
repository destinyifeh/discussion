const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const cloudinary = require('cloudinary');
const {detect} = require('detect-browser');
const browser = detect();
const dotenv = require('dotenv');
dotenv.config()

const upload = require('../middlewares/Multer');

require('../models/User');

router.post('/api/user/register', upload.single('photo'), async(req, res)=>{
    console.log(req.body);
    let username = req.body.username.toLowerCase();
      let setPassword = await bcrypt.genSalt(10);
      let securePassword = await bcrypt.hash(req.body.password, setPassword);
   cloudinary.v2.uploader.upload(req.file.path, {folder: 'zenith', resource_type: 'auto'}, (err, result)=>{
     if(err) return console.log(err);
    let newUser = {
         username: req.body.username.toLowerCase(),
         email: req.body.email,
         password: securePassword,
         isVerified: false,
         emailToken: Math.random().toString().substr(2, 6),
         photo: result.secure_url,
         cloudinary_id: result.public_id,
        }
        if(req.body.email == process.env.isAdmin){
            newUser.isAdmin=true;
        }else{
            newUser.isAdmin=false;
        }
         
         console.log(newUser)
          User.findOne({username:username})
          .then(user=>{
            console.log(user)
            if(user){
              console.log('user exist')
              return res.send('user exist')
            }else{
             let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                      user: process.env.GMAIL_EMAIL,
                      pass: process.env.GMAIL_PASS
                    },
                    tls:{
                      rejectUnauthorized:false,
                    }
                });
                var mailOptions = {
                    to: newUser.email,
                    from: 'Discussion <noreply.'+process.env.GMAIL_EMAIL+'>',
                    subject: 'Discussion - verify your email',
                    text: 'You are receiving this because you (or someone else) have created an account on discussion forum.\n\n' +
                    'Please copy the following verification code, to complete the process:\n\n' +
                    'Verification code: '+ " " + newUser.emailToken + '\n\n' +
                    'If you did not create this, please ignore this email.\n',
        
                    
                    };
                 
                  transporter.sendMail(mailOptions, function(err, info){
                    if(err){
                        console.log(err)
                        return res.status(400).send('Error:'+ " "+err);
                    }else{

                         User.create(newUser)
                         .then(user=>res.status(200).json('Verification email has been sent to your email:'+ " "+info.response+ " " +user))
                         .catch(err=>res.status(400).json('Error:'+ " "+err))
                        console.log('Verification email sent' + info.response)
                        
                    }
                })
                //Verification email end
              }
            })
            //check username end
            })
         
            });  
       

 
      //Verification route//

      router.post('/api/email-verification', async(req, res)=>{
             
             let user = await User.findOne({emailToken: req.body.emailToken})
              console.log(user)
             if(!user){
                 res.status(404).send('No user found');
             }else{
                 user.emailToken = null;
                 user.isVerified = true;
                 await user.save()
                .then(user=>res.status(200).send('Email verified'+ " "+user))
                 .catch(err=>res.status(400).json('Error:'+" "+err));
                console.log(user)
               
             };
      }) ;   


//Login route//

  router.post('/api/user/login', (req, res, next)=>{
    passport.authenticate('local', (err, user)=>{
        console.log(user)
        if(err) return res.send(err);
        if(!user){
           return res.send('Incorrect password');
        }else{
          

         let browserName = browser.name;
         let browserVersion = browser.version;
         let browserOS = browser.os;
         req.login(user, (err)=>{
            if(err) return res.status(400).send('Error:'+ " "+ err);

           let transporter = nodemailer.createTransport({
               host: 'smtp.gmail.com',
               port: 465,
               secure: true,
               auth: {
                  user: 'alpacino7889@gmail.com',
                  pass: 'wonder5555'
               },
               tls:{
                 rejectUnauthorized:false,
               }
           });
           var mailOptions = {
               to: user.email,
               from: 'Discussion <noreply.'+process.env.GMAIL_EMAIL+'>',
               subject: 'Discussion - logged in info',
               text: 'You are receiving this because you (or someone else) have created an account on discussion forum.\n\n' +
               'Please copy the following verification code, to complete the process:\n\n' +
               'Browser Name: '+ " " + browserName + '\n\n' +
               'Browser Version: '+ " " + browserVersion + '\n\n' +
               'Browser OS: '+ " " + browserOS + '\n\n' +

               'If you did not create this, please ignore this email.\n',
   
               
               };
            
             transporter.sendMail(mailOptions, function(err, info){
               if(err){
                   console.log(err)
               }else{
                
                  console.log(info.response)
              }
           })
           //Logged in email end
           res.send(user);

        })
        }
    })(req, res, next)
}); 



//forgot password//



      router.post('/api/forgot/password', async(req, res)=>{
          try{

            let user = await User.findOne({email: req.body.email})
               console.log(user)
              if(!user){
                  console.log('no user')
              }else{

               let token = Math.random().toString().substr(2, 6);
                user.resetPasswordToken = token;
                user.resetPasswordExpires =  Date.now() + 3600000; // 1 hour
                  
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                      user: process.env.GMAIL_EMAIL,
                      pass: process.env.GMAIL_PASS
                    },
                    tls:{
                      rejectUnauthorized:false,
                    }
                });
                var mailOptions = {
                    to: user.email,
                    from: 'Discussion <noreply.'+process.env.GMAIL_EMAIL+'>',
                    subject: 'Discussion - Password Reset',
                    text: 'You are receiving this because you (or someone else)  have requested the reset of the password for your account on discussion forum.\n\n' +
                    'Please copy the following password reset code, to complete the process:\n\n' +
                    'Password reset code: '+ " " + user.resetPasswordToken + '\n\n' +
                    'If you did not create this, please ignore this email.\n',
        
                    
                    };
                 
                  transporter.sendMail(mailOptions, function(err, info){
                    if(err){
                        console.log(err)
                        return res.status(400).send('Error:'+ " "+err);
                    }else{

                         user.save()
                         .then(user=>res.status(200).json('Password reset email has been sent to your email:'+ " "+info.response+ " " +user))
                         .catch(err=>res.status(400).json('Error:'+ " "+err))
                        console.log('Password reset email sent' + info.response)
                        
                    }
                })
                //Reset password email end

              }
              }
              catch(err){
                  console.log(err.message)
              }
            
            });



       //password reset code route//
       
       router.post('/api/reset-password-code', async(req, res)=>{
           let user = await User.findOne({resetPasswordToken: req.body.resetPasswordToken, resetPasswordExpires: { $gt: Date.now() }})
           console.log(user)
           if (!user) {
            return res.send( 'Password reset token is invalid or has expired');
             
          }else{
              let resetPasswordToken = req.body.resetPasswordToken;
              console.log(resetPasswordToken)
              res.status(200).send(user);
          }
       });


       
       // New password route //
       
  router.post('/api/reset-password/:id', async(req, res)=>{
    try{
        console.log(req.body)
        console.log(req.params)
        let user = await User.findOne({_id: req.params.id, resetPasswordExpires: { $gt: Date.now() }})
        if (!user) {
         return res.send( 'Password reset token is invalid or has expired');
          
       }else{
           
           let setPassword = await bcrypt.genSalt(10);
           let securePassword = await bcrypt.hash(req.body.password, setPassword);
         
           user.password = securePassword;
           user.resetPasswordToken = undefined;
           user.resetPasswordExpires = undefined;
             
            await user.save( async(err)=>{
                 if(err) return res.status(400).send('Error:'+ err)
                 req.login(user, async(err)=>{
                    if(err) return res.status(400).send('Error:'+ err)
                    res.status(200).send('Password changed')
          
                 let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                  user: process.env.GMAIL_EMAIL,
                  pass: process.env.GMAIL_PASS
                },
                tls:{
                  rejectUnauthorized:false,
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'Discussion <noreply.'+process.env.GMAIL_EMAIL+'>',
                subject: 'Password Successfully Changed',
                text: 'Hello,\n\n' +
                  'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
              };
             
              transporter.sendMail(mailOptions, function(err, info){
              if(err) {
                console.log(err);
              }else{
               console.log('Password reset email sent' + info.response)
              }         
                              
            })
            //New password email end     
         })   
         
        })  
           
       }
    }
    catch(err){
        console.log(err.message)
    }
 });
  
      
          
 router.get('/api/users', async(req, res)=>{
    await User.find({})
   .then(users=>res.status(200).json(users))
   .catch(err=>res.status(400).json('Error:'+ " "+err))
});



/*router.post('/api/user/login', (req, res, next)=>{
    passport.authenticate('local', (err, user)=>{
        console.log(user)
        if(err) return res.send(err);
        if(!user){
           return res.send('Incorrect password');
        }else{

            req.login(user, (err)=>{
                if(err) return res.status(400).send('Error:'+ " "+ err);
                res.send(user);
             

         })

        
    }
})(req, res, next)
  })
          
*/





 /*router.post('/api/user/register', upload.single('photo'), async(req, res)=>{
    console.log(req.body);
   
      let setPassword = await bcrypt.genSalt(10);
      let securePassword = await bcrypt.hash(req.body.password, setPassword);
      cloudinary.v2.uploader.upload(req.file.path, {folder: 'zenith', resource_type: 'auto'}, async(err, result)=>{
          if(err) return console.log(err);
    let newUser = {
        browser: browser.version,
         username: req.body.username,
         email: req.body.email,
         password: securePassword,
         isVerified: false,
         emailToken: Math.random().toString().substr(2, 6),
         photo: result.secure_url,
        }
        if(req.body.email == 'ask4menow247@gmail.com'){
            newUser.isAdmin=true;
        }else{
            newUser.isAdmin=false;
        }
          console.log(newUser)

          await User.create(newUser)
          .then(user=>res.status(200).json(user))
          .catch(err=>res.status(400).json('Error:'+" "+err))

        })
    }) */


    router.get('/api/user/:username', async(req, res)=>{
         try{
              console.log(req.params.username)
              await User.findOne({username: req.params.username}) 
              .then(user=>res.status(200).json(user))
              .catch(err=>res.status(400).json('Error:'+" "+err))
         }
         catch(err){
             console.log(err.message)
         }
    });


    
router.put('/api/update/user/:username', upload.single('photo'), async(req, res)=>{
    try{
           if(req.file){
         let user = await User.findOne({username: req.params.username})
          cloudinary.v2.uploader.destroy(user.cloudinary_id)
          cloudinary.v2.uploader.upload(req.file.path, {folder: 'zenith', resource_type: 'auto'}, (err, result)=>{
              if(err){
                  console.log(err)
              }else{
                User.findOne({username: req.params.username})
                  .then(user=>{
                   
                    user.photo  = result.secure_url,
                    user.cloudinary_id = result.public_id,
                    console.log(user)
                     user.save()
                    .then(user=>res.status(200).json(user))
                    .catch(err=>res.status(400).json('Error:'+ " "+ err))
                })
              }
        
        })
    }else{
         User.findOne({username: req.params.username})
        .then(user=>{
          user.email = req.body.email,
           user.isVerified = false,
           user.emailToken = Math.random().toString().substr(2, 6),
            console.log(user)

            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                  user: process.env.GMAIL_EMAIL,
                  pass: process.env.GMAIL_PASS
                },
                tls:{
                  rejectUnauthorized:false,
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'Discussion <noreply.'+process.env.GMAIL_EMAIL+'>',
                subject: 'Discussion - verify your email',
                text: 'You are receiving this because you (or someone else) have updated your user account email on discussion forum.\n\n' +
                'Please copy the following verification code, to complete the process:\n\n' +
                'Verification code: '+ " " + user.emailToken + '\n\n' +
                'If you did not create this, please ignore this email.\n',
    
                
                };
             
              transporter.sendMail(mailOptions, function(err, info){
                if(err){
                    console.log(err)
                    return res.status(400).send('Error:'+ " "+err);
                }else{

                      user.save()
                     .then(user=>res.status(200).json('Verification email has been sent to your email:'+ " "+info.response+ " " +user))
                     .catch(err=>res.status(400).json('Error:'+ " "+err))
                    console.log('Verification email sent' + info.response)
                    
                }
            })
            //Verification email end
    
        
      })
    }
    }
    catch(err){
        console.log(err.message)
    }
});


router.post('/api/user/message', async(req,res)=>{
            console.log(req.body)
  try{
    

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASS
      },
      tls:{
        rejectUnauthorized:false,
      }
  });
  var mailOptions = {
      to: req.body.receiver,
      from: req.body.sender_email,
      subject: 'Discussion - You have a message from user'+" "+req.body.sender_name,
      text: req.body.messageBody,
      
      };
   
    transporter.sendMail(mailOptions, function(err, info){
      if(err){
          console.log(err)
          return res.status(400).send('Error:'+ " "+err);
      }else{
             console.log('Message sent' + info.response)
        return res.status(200).json('Message sent:'+ " "+info.response)
      
          
      }
  })
  //Message email end

  }
  catch(err){
    console.log(err.message)
  }
});


//get number of verified registered//

router.get('/api/verified/users', async(req, res)=>{
    try{
         User.find({isVerified: true})
         .then(user=>res.status(200).json(user))
         .catch(err=>res.status(400).json('Error'+ " "+err))
    }
    catch(err){
      console.log(err.message)
    }
});




router.post('/api/feature/report', async(req, res)=>{
     console.log(req.body);

     try{
    

      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAIL_EMAIL,
          pass: process.env.GMAIL_PASS
        },
        tls:{
          rejectUnauthorized:false,
        }
    });
    var mailOptions = {
        to: process.env.GMAIL_EMAIL,
        from: req.body.reporter_email,
        subject: 'Discussion -  Report message from user'+" "+req.body.reporter_name,
        text: req.body.report,
        
        };
     
      transporter.sendMail(mailOptions, function(err, info){
        if(err){
            console.log(err)
            return res.status(400).send('Error:'+ " "+err);
        }else{
               console.log('Message sent' + info.response)
          return res.status(200).json('Message sent:'+ " "+info.response)
        
            
        }
    })
    //report email end
  
    }
    catch(err){
      console.log(err.message)
    }
  });
  

  
module.exports = router;