import express from 'express'
import UserController from '../Controller/user.js' 
import Validate from '../middleware/Validate.js'
const router = express.Router()

//Backend Check User Details
router.get('/allusers', UserController.getAllUsers)

//Login Routes
router.post('/signup',UserController.signUp)
router.post('/login',UserController.login)
router.post('/ForgotMail',UserController.ForgotMail)
router.post('/RecoveryMail',UserController.RecoveryMail) 
router.post('/ResetPass',UserController.ResetPass) 

//Email Routes
router.post('/save', Validate,UserController.saveSentEmails)
router.get('/emails/:type/:mailid', Validate,UserController.getEmails)
router.post('/save-draft', Validate,UserController.saveSentEmails)
router.post('/bin', Validate,UserController.moveEmailsToBin)
router.post('/starred',Validate, UserController.toggleStarredEmails)
router.post('/important',Validate, UserController.toggleImportantEmails)
router.post('/delete', Validate,UserController.deleteEmails);  


export default router