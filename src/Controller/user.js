import userModel from '../Models/user.js'
import emailModel from '../Models/Email.js'
import emailStatusModel from '../Models/EmailStatus.js'
import emailService from '../utils/emailService.js'
import Auth from '../utils/auth.js'

const getAllUsers = async(req,res)=>{
  try {
      let users = await userModel.find({},{password:0})
      res.status(200).send({
          message:"Data Fetch Successful",
          users
      })
  } catch (error) {
      res.status(500).send({
          message:error.message || "Internal Server Error"
      })
  }
}

const signUp = async(req,res)=>{
    try {
        let user = await userModel.findOne({email:req.body.email})
        if(!user)
        {
            req.body.password = await Auth.hashPassword(req.body.password)
            await userModel.create(req.body)
            res.status(201).send({
                message:"User Sign Up Successfull"
            })
        }
        else
        {
            res.status(400).send({
                message:`User with ${req.body.email} already exists`
            })
        }

    } catch (error) {
        res.status(500).send({
            message:error.message || "Internal Server Error"
        })
    }
}

const login = async(req,res)=>{
    try {
        let user = await userModel.findOne({email:req.body.email})
        if(user)
        {
            if(await Auth.hashCompare(req.body.password,user.password))
            {
                let token = await Auth.createToken({
                    name:user.name,
                    email:user.email,
                    id:user._id,                    
                })

                res.status(200).send({
                    message:"Login Successfull",
                    name:user.name,                                
                    id:user._id,
                    token
                })
            }
            else
            {
                res.status(400).send({
                    message:"Incorect Password"
                })
            }
        }
        else
        {
            res.status(400).send({
                message:`User with ${req.body.email} does not exists`
            })
        }
    } catch (error) {
        res.status(500).send({
            message:error.message || "Internal Server Error"
        })
    }
}

const ForgotMail = async(req,res)=>{
  try {
      let user = await userModel.findOne({email:req.body.email})
      if (user){ 
        res.status(200).send({
          message:"Email Is Available",
        
      })

      } else {
        res.status(400).send({
          message:`${req.body.email} does not exists`
      })
      }
      
  } catch (error) {
      res.status(500).send({
          message:error.message || "Internal Server Error"
      })
  }
}

const RecoveryMail = async(req, res) => {
  try {
    let user = await userModel.findOne({email:req.body.email,name:req.body.UserName,DOB:req.body.DOB})
    if (user){ 


    
    const payload = {
      to: user.Recoveryemail,    
      from: "no-reply@accounts.google.com" ,     
      subject: "Recovery Mail",
     
      body:"<h5><b>Reset Password Link Received From "+user.email +"  </b></h5>  <h6>Hello,</h6> <h6> He  requested to reset  password. Please click the link below to reset your password. This link is valid for one-time use only, </h6> <h6> URL: <a href="+req.body.URL+"/Reset/"+user.password +" target='_blank'>Click to RESET</a> If you did not request a password reset, you can ignore this email. Your account remains secure. </h6> <h6>Best regards, <h6> <h5><b>Google</b><h5>",
      date: new Date(),
      image: "",      
      name: "Google",    
      
    };

    const email = new emailModel(payload);
    email.save();
    await emailService.sendRealMail(payload)
    const Emailid =email.id;
    if(Emailid){
    let reciveuser = await userModel.findOne({email:user.Recoveryemail})
    if(reciveuser){
    const statuspayload = {
             userID: reciveuser.id,
             mailID: Emailid,    
             starred:  false, 
             imporrtant: false, 
             bin:  false,
             type: "sent",
    }
    const reciveemailstatus = new emailStatusModel(statuspayload);
    reciveemailstatus.save();
  }
  else{
    res.status(400).send({
      message:`${user.Recoveryemail} does not exists`
  })
  }
     }

      res.status(200).send({
        message:"Gmail request sent to recovery mail Pls check"
      
    })

    } else {
      res.status(400).send({
        message:`${req.body.email} does not exists`
    })
    }
    
       console.log(req.body.email)

  } catch (error) {
    
    res.status(500).send({message:error.message || "Internal Server Error"})
  }
};

const ResetPass = async(req,res)=>{
  try {
        const OldPass=req.body.URL.split('/ForgotMail/Reset/')[1]
       console.log("test"+req.body)
      let user = await userModel.findOne({password:OldPass})
      if (user){ 
        req.body.password = await Auth.hashPassword(req.body.password)
        let passupdate= await userModel.updateOne({_id:user.id},{$set:{password:req.body.password }})
        if (passupdate){ 
          res.status(200).send({
            message:"Password Reset Successfully",
          
        })
        }
        else{
          res.status(400).send({
            message:`Something wrong`
        })
        }

        

      } else {
        res.status(400).send({
          message:`URL does not exists OR Already  USED `
      })
      }
      
  } catch (error) {
      res.status(500).send({
          message:error.message || "Internal Server Error"
      })
  }
}

const saveSentEmails = async(req, res) => {
    try {
      req.body.id!=""?
      await emailModel.deleteMany(  { _id: { $in: req.body.id } }):"";
      
      const email = new emailModel(req.body.payload);
      email.save();
      await emailService.sendRealMail(req.body.payload)
      const Emailid =email.id;
      let sentuser = await userModel.findOne({email:req.body.payload.from})
      let reciveuser = await userModel.findOne({email:req.body.payload.to})
  if(Emailid){
    req.body.payload.userID=sentuser.id;
    req.body.payload.mailID=Emailid;
    await emailStatusModel.deleteMany(  { _id: { $in: Emailid },userID: sentuser.id});

    const sentemailstatus = new emailStatusModel(req.body.payload);
    sentemailstatus.save();
    if (req.body.payload.type!="drafts" && reciveuser){
    req.body.payload.userID=reciveuser.id;
    await emailStatusModel.deleteMany(  { _id: { $in: Emailid },userID: reciveuser.id});

    const reciveemailstatus = new emailStatusModel(req.body.payload);
    reciveemailstatus.save();
  }

  }




     
      res.status(200).send({message:"emailed saved successfully"})
    } catch (error) {
     
      res.status(500).send({message:error.message || "Internal Server Error"})
    }
  };
  
 const getEmails = async (req, res) => {
    try {
      let emails;
      let emailstatus;
      let user = await userModel.findOne({email:req.params.mailid})
      if (req.params.type === "bin") {
        emails = await emailModel.find( {$or: [ { from: req.params.mailid },{ to: req.params.mailid } ]} );
        emailstatus = await emailStatusModel.find( {bin: true,  userID:  user.id} );
      } else if (req.params.type === "allmail") {
        emails = await emailModel.find( {$or: [ { from: req.params.mailid },{ to: req.params.mailid } ]});
        emailstatus = await emailStatusModel.find( {type:"sent",  userID:  user.id} );
      } else if (req.params.type === "starred") {
        emails = await emailModel.find({ $or: [ { from: req.params.mailid },{ to: req.params.mailid } ]} );
        emailstatus = await emailStatusModel.find( {starred: true, bin: false ,  userID:  user.id} );
      } 
      else if (req.params.type === "important") {
        emails = await emailModel.find({ $or: [ { from: req.params.mailid },{ to: req.params.mailid } ]} );
        emailstatus = await emailStatusModel.find( {imporrtant: true, bin: false ,  userID:  user.id} );
      } else if (req.params.type === "inbox") {
        emails = await emailModel.find({  to:req.params.mailid });
        emailstatus = await emailStatusModel.find( {type:"sent",  userID:  user.id} );
      } 
      else {
        emails = await emailModel.find({ from:req.params.mailid});
        emailstatus = await emailStatusModel.find( {type:req.params.type,  userID:  user.id} );
      }
      

    const formattedEmails = emailstatus.map(statusmail => ({
      _id:  emails.find(status => status._id.toString() === statusmail.mailID.toString() )?._id || "" ,
      to:   emails.find(status => status._id.toString() === statusmail.mailID.toString() )?.to || "" ,
      from: emails.find(status => status._id.toString() === statusmail.mailID.toString() )?.from || "" ,
      subject: emails.find(status => status._id.toString() === statusmail.mailID.toString() )?.subject || "" ,
      body: emails.find(status => status._id.toString() === statusmail.mailID.toString() )?.body || "" ,
      date:   emails.find(status => status._id.toString() === statusmail.mailID.toString() )?.date.toISOString() || ""   , 
      image: emails.find(status => status._id.toString() === statusmail.mailID.toString() )?.image || "" ,
      name: emails.find(status => status._id.toString() === statusmail.mailID.toString() )?.name || "" ,
      starred: statusmail.starred,
      imporrtant:   statusmail.imporrtant,
      bin: statusmail.bin,
      type: statusmail.type ,
      __v: emails.find(status => status._id.toString() === statusmail.mailID.toString() )?.__v || "" 
  }));




      return res.  status(200).json(formattedEmails.filter((type)=> type._id!=""));
     
    } catch (error) {
      console.log(error);
      
      res.status(500).send({message:error.message || "Internal Server Error"})
      
    }
  };
  

  
  const toggleStarredEmails = async (req, res) => {
    try {
      let user = await userModel.findOne({email:req.body.usermail})
      await emailStatusModel.updateOne(
        { mailID: req.body.id ,userID:user.id },
        { $set: { starred: req.body.value } }
      );
     
      return res.status(200).send({message:"email is starred mark"})
    } catch (error) {
      console.log(error);
    
      res.status(500).send({message:error.message || "Internal Server Error"})
    }
  };
  
  const toggleImportantEmails = async (req, res) => {
    try {
      let user = await userModel.findOne({email:req.body.usermail})
      await emailStatusModel.updateOne(
        { mailID: req.body.id,userID:user.id },
        { $set: { imporrtant: req.body.value } }
      );
    
      return res.status(200).send({message:"email is important mark"})
    } catch (error) {
      console.log(error);
      
      res.status(500).send({message:error.message || "Internal Server Error"})
    }
  };
  const moveEmailsToBin = async (req, res) => {
    try {
      let user = await userModel.findOne({email:req.body.Email})
      await emailStatusModel.updateMany(
          { mailID: { $in: req.body.selectedEmails }, userID:user.id},
               { $set: { bin: true, starred: false,imporrtant: false, type: "" } }
      );
           return res.status(200).send({message:"emails moved to bin successfully"})
    } catch (error) {
      console.log(error);
      
      res.status(500).send({message:error.message || "Internal Server Error"})
    }
  };
  const deleteEmails = async (req, res) => {
    try {
      let user = await userModel.findOne({email:req.body.Email})


      const emailIDsToDelete = await emailStatusModel.aggregate([
        {
            $group: {
                _id: "$mailID",
                count: { $sum: 1 }
            }
        },
        {
            $match: {
                count: 1
            }
        },
        {
            $project: {
                _id: 1
            }
        }
    ]);

    const emailIDs = emailIDsToDelete.map(({ _id }) => _id);
    const matchingData = emailIDs.filter(item => req.body.selectedEmails.includes(item));
     
      await emailModel.deleteMany(
        { _id: { $in: matchingData} });
        await emailStatusModel.deleteMany(
          { mailID: { $in: req.body.selectedEmails },userID:user.id });
        

     
      return res.status(200).send({message:"emails deleted successfully"})
    } catch (error) {
      console.log(error);
    
      return res.status(500).send({message:error.message || "Internal Server Error"})
    }
  };

export default {
  getAllUsers,
    signUp,
    login,
    ForgotMail,
    RecoveryMail,
    ResetPass,
    saveSentEmails,
    getEmails,
    moveEmailsToBin,
    toggleStarredEmails,
    toggleImportantEmails,
    deleteEmails
}