import mongoose from './index.js'


const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

//create schema
let userSchema = new mongoose.Schema({
    name:{type:String, required:[true,'Name is required'] },
    email:{type:String,required:[true,'Email is required'],
         validate:{
            validator: (value)=>validateEmail(value)
        }
    },
    Recoveryemail:{type:String,required:[true,'Recovery is required'],
        validate:{
            validator: (value)=>validateEmail(value)
        }
    },
    DOB:{type:String, required:[true,'Date of Birth is required'],},
    password:{type:String,required:[true,'Password is required'], },
    status:{type:Boolean, default:true},    
    createdAt:{type:Date,default:Date.now()}
},{
    collection:'users',
    versionKey:false
})

//create model
const userModel = mongoose.model('users',userSchema)




export default userModel