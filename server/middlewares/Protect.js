import jwt from 'jsonwebtoken'

export const protect = async (req,res,next) => {
   try {
        const header = req.headers['authorization'];
            if(!header){
                return res.json({message: "Token not sended!"})
             }
        const token = header.split(' ')[1];
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decode;
        console.log("Protect route run successfully!")
        next();
   } catch (error) {
        console.log(error.message);
        return res.json({message: "Token Invalid!"});
   }
}