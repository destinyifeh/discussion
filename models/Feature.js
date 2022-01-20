const mongoose = require('mongoose');
const slugify = require('slugify');
const Schema = mongoose.Schema;

const FeatureSchema = new Schema({
       
              title:{type: String},
              description:{type: String},
              image:{type: String},
              cloudinary_id:{type: String},
              createdAt:{type: Date, default: Date.now},
               viewedBy:[],
               slug: {type: String, unique: true, required: true},
               username:{type: String},
               photo:{type: String},

               comments:[{
                commentBody:{
                    type: String,
                },
                commentUser:{
                    type: String,
                },
                commentPhoto:{
                    type: String,
                },
                commentDate:{
                    type: Date,
                    default: Date.now
                }
            }],
            });

            FeatureSchema.pre('validate', function(){
                if(this.title){
                    this.slug = slugify(this.title, {lower: true, strict: true})
                }
            });
            
        module.exports = Feature = mongoose.model('features', FeatureSchema); 