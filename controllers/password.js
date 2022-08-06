const User = require('../model/users');
const Token = require('../model/exptoken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const helpers = require('../helpers');
const path = require("path");
const nodemailer = require("nodemailer");
const secret = process.env.RESET_PASSWORD_KEY;


exports.reset = async (req,res) => {
    let activeUser = await helpers.tokenCheck(req);
    if(!activeUser) return res.status(440).json({ message: "Session expired. Kindly login"});
    else {
        try{
            const {oldpassword, newpassword, confirmpassword} = req.body;
            let match = await bcrypt.compare(oldpassword, activeUser.password);
            if(!match) return res.status(401).json({ message: 'Incorrect password' });
            if(newpassword !== confirmpassword) res.status(401).json({ message: 'Password does not match' });
            else {
                await bcrypt.hash(newpassword, 10, (err, hash)=>{
                    if(err) throw err;
                    let query = {_id: activeUser._id};
                    User.updateOne(query, {password:hash}, (err, update) =>{
                        if(err) throw err;
                        const token = req.body.token || req.query.token || req.headers["x-auth-token"];
                        const newToken = new Token({token});
                        newToken.save();
                        return res.status(200).json({ message: 'Password reset successfully. Kindly login', data:update });
                    })
                })
            }
            
        }
        catch(err){
            console.log(err);
            return res.status(400).json(err);
        }
    }
}

exports.sendMail = async (req,res) => {
    const email = req.body.email;
    let user = await User.findOne({email})
    if(!user) res.status(401).json({ message: 'Account does not exist' });
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            }, 
            secret,
            {
            expiresIn : 1200
            } 
        )
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_NAME,
              pass: process.env.PASSWORD
            }
        });
    
        //ngrok was used to create an accessible link
        let data = {
            from: 'noreply@app.com',
            to: email,
            subject: 'Reset Account Password Link',
            html: `
            <h3>Kindly click the link below to reset your password</h3>
            <p>${process.env.CLIENT_URL}/change-password?id=${token}</p>
            `,
          };
          try{
            await user.updateOne({email}, {forgot_password_token:token}, (err, user) => {
                if (err) return res.status(400).json({ message: 'Reset password error' });
                transporter.sendMail(data, (error, info) => {
                    if(error) return res.json({message: 'Email not sent', data: error.message});
                    else return res.json({message: 'Email sent successfully', code: 200, data: info.response});    
                  });
            })
          }
          catch(err){
            console.log(err);
          }

        
    }

exports.getPassword = async(req,res) => {
    res.sendFile(path.join(__dirname+'/index.html'));
}

exports.updatePassword = async (req,res) => {
    const token = req.query.id;
    const password = req.body.newpassword;
    if (!token) return res.status(401).json({error: "Authentication Error"});
    jwt.verify(token, secret, function(error, decodedData) {
        if(error) return res.status(400).json({error: 'Incorrect or expired token'});
        //put in a function so await can be used
        let response = helpers.updatePassword(decodedData, password, token);
        if(!response) return res.status(400).json({error: 'Reset Password Error'});
        return res.status(200).json({ message: 'Password changed successfully. Kindly login'});
    })
}

