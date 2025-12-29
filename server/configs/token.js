import jwt from 'jsonwebtoken'


export const createToken = async (user) => {
    const token = jwt.sign({_id:user._id, email: user.email},process.env.SECRET_KEY,{expiresIn: "1d"});
    if(token){
        return token;
    }
}