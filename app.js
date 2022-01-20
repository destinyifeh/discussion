const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
require('./config/Passport')(passport);


const app = express();

mongoose.Promise = global.Promise;

//Production//

if(process.env.NODE_ENV === 'production'){
    mongoose.connect(process.env.MONGO_URL, {
      useUnifiedTopology: true, useNewUrlParser: true
    })
    .then(()=>console.log('Mongodb for production connected'))
    .catch(err=>console.log(err)); 
    }else{
        mongoose.connect(process.env.LOCAL_URL, {
          useUnifiedTopology: true, useNewUrlParser: true
       })
       .then(()=>console.log('Mongodb connected'))
       .catch(err=>console.log(err));
    }; 

   
    
    


app.use(express.json());

app.use(cors());

app.use(session({
     resave: false,
     secret: 'secret',
     saveUninitialized: false,

}));


app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')));


app.use('/', require('./routes/User'));
app.use('/', require('./routes/Online'));
app.use('/', require('./routes/Feature'));

//Serving the build index react file to server//
app.use(express.static(path.join(__dirname, 'client/build')))

app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname,  'client', 'build', 'index.html'));
}); 
    

app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), ()=>console.log('Server is running on port'+ " "+ app.get('port')));

