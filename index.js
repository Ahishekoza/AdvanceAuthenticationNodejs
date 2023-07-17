import express from 'express';
const app = express();
import morgan from 'morgan'
import cors from 'cors'
import { connect } from './database/connect.js';
import userRouter from './routes/userRouter.js'


app.use(express.json())
app.use(morgan('dev'));
app.use(cors());




app.use('/api',userRouter);


connect().then(()=>{
    app.listen(8080,()=>{
        console.log('listening on port 8080');
    })
    
}).catch((err)=>{
    console.log("Unable to connect database")
})
