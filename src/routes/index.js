import express from 'express'
import UserRoutes from './user.js'
const router=express.Router()



router.get('/',(req,res)=>{
    res.status(200).send(`<h1>Welcome To Gmail Backend </h1>`
    +'<h3> "http:// _Your_URL_ /allusers" to get User Details in this url <h3>'
    +'<h3> USE GMAIL Front End for Get better experience  <h3>'
    +'<h3> you can make create account ,signup, recovery mail,reset password  <h3>'
    +'<h3> make star,important,bin,mail sent,receive mails,draft , open draft mails and sent ,  <h3>'
    +'<h3> delete mail,delete bin mails permanently more operations in inclueded  <h3>'
    +'<h3> Thank you  <h3>'




)
})


router.use('/',UserRoutes)

export default router