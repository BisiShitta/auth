const User = require('./model/users');
const Token = require('./model/exptoken');
const bcrypt = require('bcrypt');


//check if token has been logged out
exports.tokenCheck = async (req) => {
    const userToken = req.body.token || req.query.token || req.headers["x-auth-token"];
    const token = await Token.findOne({token : userToken})
    if (token) return false;
    const user = await User.findOne({_id : req.user.id});
    if(user) return user;
    const usercheck = await User.findOne({_id : req.user.user.id});
    if(usercheck) return usercheck;
    return false;
}

exports.updatePassword = async(decodedData, password, token) => {
    let user = await User.findOne({_id: decodedData.id});
    if(!user) return res.status(400).json({error: 'User with this token does not exist'});
    bcrypt.hash(password, 10, (err, hash)=>{
        if(err) throw err;
        let newUpdate = {
            password : hash,
            forgot_password_token : ''
        }
        User.updateOne({_id: decodedData.id}, newUpdate, (err, update) =>{
            if(err) return false;
            const newToken = new Token({token});
            newToken.save();
            return update;
        })
    })
}