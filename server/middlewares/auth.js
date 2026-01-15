import jwt from 'jsonwebtoken';
const verifyToken=(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    const token=authHeader&&authHeader.split(' ')[1];
    if(!token)return res.status(401).json({message:'no access because no token'});
    try{
        const verified=jwt.verify(token,process.env.JWT_SECRET);
        req.user=verified;
        next();
    }
    catch(err){
        res.status(500).json({
            message:'Invalid or expired token!'
        })
    }
}
module.exports=verifyToken
