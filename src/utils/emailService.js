import sgMail from '@sendgrid/mail'

const sendEmail = async(from,to,subject,html)=>
{
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const msg = {
  to: to, // Change to your recipient
  from: from, // Change to your verified sender
  subject: subject,
  text: html,
  html: html,
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
return 0
}

const sendRealMail = async(data)=>{
    try {
        let subject = data.subject
        let html = data.body
    await sendEmail(process.env.VERIFIED_Email,data.to,subject,html)
    } catch (error) {
        
    }
}




export default {
sendRealMail
}