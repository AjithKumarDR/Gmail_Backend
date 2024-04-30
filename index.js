import express from'express'
import dotenv from 'dotenv'
import cors from 'cors'
import Approutes from './src/routes/index.js'
dotenv.config()

const app =express()
app.use(cors())
app.use(express.json())
app.use(Approutes )
app.listen(process.env.PORT,()=>console.log("SERVER IS RUNNING PORT IS :  "+process.env.PORT))