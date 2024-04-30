import Auth from '../utils/auth.js'
import userModel from '../Models/user.js'
import jwt from 'jsonwebtoken'
const Validate = async(req,res,next)=>{
    try { 
        let token = req?.headers?.authorization?.split(" ")[1]

        if(token)
        {
           
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token is valid:', decoded);
                
            let payload = await Auth.decodeToken(token)
            let userData = await userModel.findById(payload.id)            
            if(Math.round(+new Date()/1000)<payload.exp ) {next()}           
            else {res.status(402).send({message:"Token Expired"})}                  
        }
        else
        {
            res.status(402).send({ message:"Token Not Found" })
            // next(); 
        }
        
    } catch (error) {
        if(error.name=="JsonWebTokenError"){
            res.status(402).send({ message:" Invalid Token " })
            // next(); 
        }
        else{
            res.status(500).send({
                message:"Internal Server Error",
                error: error.message
            })
        }
        
    }
}

export default Validate