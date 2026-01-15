const express=require('express')
import verifyToken from '../server/middlewares/auth'
const bcrypt=require('bcryptjs')
const dotenv=require('dotenv')
const mongoose=require('mongoose')
dotenv.config()
//mongo connect
mongoose.connect(process.env.URI).then(()=>{console.log("database connected succesfully")}).catch((err)=>{console.log('got some error',err)});

const User=require('./models/User')
const Habit=require('./models/Habit')
const port=process.env.PORT || 3000
const app=express();
app.use(express.json());
app.post('/register',async(req,res)=>{
    try{
        //checking if field empty
        const{name,email,password}=req.body;
        if(!name || !email || !password ){
            return res.status(400).json({
                message:'all fields required'
            });
        }
        //checking if user exist
        const existingUser= await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message:'user already exists'
            });
        }
        //hashing password
        const hashedPassword=await bcrypt.hash(password,process.env.HASHCODE);
        //saving username
        const user=new User({
            userName:name,
            email:email,
            password:hashedPassword
        });
        await user.save();
        //status updated
        res.status(201).json({
            message:'user registered successfully'
        })
    }
    catch(err){
        res.status(500).json({
            message:'got some error',
            error:err.message
        });
    }
});
app.post('/login',async(req,res)=>{
    try{
    const {email,passwd}=req.body;
    if(!email || !passwd)return res.status(400).json({ message:'email and password are required'});
    const user=User.findOne({email});
    if(!user)return res.status(400).json({message:'Invalid credential(User not Found)'})
    const isMatch=bcrypt.compare(passwd,user.password)
    if(!isMatch){
        return res.status(400).json({message:'Invalid Credential(Invalid password'});}
    const token=jwt.sign(
        {id:user._id},
        process.env.JWT_SECRET,
        {expiresIn:'24h'}
    );
    //success response
    res.status(200).json({
        message:'Login successful',
        token:token,
        user:{
            id:user._id,
            name:user.userName,
            email:user.email
        }                            
})}
    catch(err){
        res.status(500).json({
            message:'server error during login',
            error:err.message
        })
    }
});
app.post('/tasks',(req,res)=>{

})
app.get('/tasks',verifyToken,(req,res)=>{

})
app.put('/tasks/:id',(req,res)=>{

})
app.delete('/delete',(req,res)=>{

})
app.listen(port,()=>{console.log('server is running at http://localhost:3000')});