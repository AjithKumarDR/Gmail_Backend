import mongoose from './index.js'

const EmailSchema = new mongoose.Schema({
    to: { type: String, required: true },
    from: { type: String, required: true },
    subject: { type: String },
    body: { type: String },
    date: {type: Date, required: true,},
    image: { type: String },
    name: { type: String, required: true,},    
  });
  
  const emailModel = mongoose.model("emails", EmailSchema);

  
export default emailModel