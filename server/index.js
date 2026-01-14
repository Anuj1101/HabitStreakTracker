const express=require('express')
const mongoose=require('mongoose')
const User=require('./models/User')
const Habit=require('./models/Habit')
const app=express();
app.use(express.json());
app.get('/',(req,res)=>{
    const habit=res
})
app.put("")
app.listen(3000,()=>{console.log('server is running at http://localhost:3000')});