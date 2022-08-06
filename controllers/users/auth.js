const User = require('../../model/users');
const Token = require('../../model/exptoken');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const helpers = require('../../helpers');
const secret = process.env.JWT_SECRET;


exports.login = async(req,res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        const userExist = await User.findOne({ email: email });

        if(!userExist) return res.status(401).json({ message: 'Invalid details' });
        let match = await bcrypt.compare(password, userExist.password)
        if(!match) return res.status(401).json({ message: 'Invalid details' });
    
        const payload = {
            user: {
                id: userExist._id,
                email: userExist.email
            }
        };
        jwt.sign(
            payload, 
            secret,
            {
                expiresIn : 864000
            }, (err, token) => {
                if(err) throw err;
                res.json({
                    statusCode : 200,
                    message : "Logged In Successfully",
                    token
                })
            })
    }
    catch (error){
        console.log(error);
        return res.status(400).json({ error : error });
    }
}

exports.logout = async(req,res) => {
    const token = req.body.token || req.query.token || req.headers["x-auth-token"];
    const user = await User.findOne({ _id : req.user.id});
    const userCheck = await User.findOne({ _id : req.user.user.id});
    if(user || userCheck){
        const newToken = new Token({token});
        newToken.save();
        return res.json({
            statusCode : 200,
            message : "Logged Out Successfully",
        })
    }
    return res.status(400).json({ error : 'Server error' });
    
}

exports.loggedIn = async(req,res) => {
    let response = await helpers.tokenCheck(req);
    if(response) {
        return res.json({
            statusCode : 200,
            message : "User logged in",
            data : {
                id: response.id,
                email: response.email
            }
        })
    }
    else {
        return res.status(440)
        .json({ message: "Session expired. Kindly login"});
    }
}

exports.signup = async(req,res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userExist = await User.findOne({ email: req.body.email });
        if (userExist) return res.status(409).json({ message: "This email is already registered to an account"});

        await bcrypt.hash(req.body.password, 10, (err, hash)=>{
            if(err) throw err;
            req.body.password = hash;
            const newUser = new User(req.body);
            newUser.save((err, newEntry) => {
                if(err) throw err;
                jwt.sign(
                    {
                        id: newEntry._id,
                        email: newEntry.email
                    }, secret, { expiresIn : 864000}, 
                    (err, token) => {
                        if(err) throw err;
                        res.json({
                            statusCode : 200,
                            message : "User Registered successfully",
                            token
                        })
                    })
            });
        });
    }
    catch (error) 
    {
        console.log(error);
        return res.status(400).json(err);
   }
}

exports.adminSignup = async(req,res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userExist = await User.findOne({ email: req.body.email });
        if (userExist) return res.status(409).json({ message: "This email is already registered to an account"});

        req.body.isUser = 0;
        req.body.isAdmin = 1;
        req.body.userRole = 'admin';

        await bcrypt.hash(req.body.password, 10, (err, hash)=>{
            if(err) throw err;
            req.body.password = hash;
            const newUser = new User(req.body);
            newUser.save((err, newEntry) => {
                if(err) throw err;
                jwt.sign(
                    {
                        id: newEntry._id,
                        email: newEntry.email
                    }, secret, { expiresIn : 864000}, 
                    (err, token) => {
                        if(err) throw err;
                        res.json({
                            statusCode : 200,
                            message : "User Registered successfully",
                            token
                        })
                    })
            });
        });
    }
    catch (error) 
    {
        console.log(error);
        return res.status(400).json(err);
   }
}