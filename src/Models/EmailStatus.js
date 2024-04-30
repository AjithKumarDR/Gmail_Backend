import mongoose from './index.js'

const EmailSchema = new mongoose.Schema({    
    userID: { type: String,required: true },
    mailID: { type: String,required: true },    
    starred: {type: Boolean,required: true,default: false, },
    imporrtant: {type: Boolean,required: true,default: false, },
    bin: {type: Boolean, required: true, default: false,},
    type: {type: String,required: true,},
  });
  
  const emailStatusModel = mongoose.model("emailstatus", EmailSchema);

  
export default emailStatusModel