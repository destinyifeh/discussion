const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const OnlineSchema = new Schema({
           
              loginUsername:{type: String},
               photo:{type: String},
               createdAt:{type: Date, default: Date.now}

   });

   module.exports = Online = mongoose.model('online', OnlineSchema);