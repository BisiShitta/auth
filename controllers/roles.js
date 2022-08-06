const User = require('../model/users');
const Token = require('../model/exptoken');
const helpers = require('../helpers');
const {tokenCheck}= require('../helpers');

//view all staff members
exports.staff = async (req,res) => {
    let response = await tokenCheck(req);
    if(!response) return res.status(440).json({ message: "Session expired. Kindly login"});
    if(response.userRole == 'admin' || 'manager'){
        let staff = await User.find({userRole : 'staff'});
        return res.status(200).json({ message: 'Access granted', data:staff});
    }
    return res.status(403).json({ message: "Unauthorized. You cannot access this page"});
    
}

//view all managers
exports.manager = async (req,res) => {
    let response = await tokenCheck(req);
    if(!response) return res.status(440).json({ message: "Session expired. Kindly login"});
    if(!response.isAdmin) return res.status(403).json({ message: "Unauthorized. You cannot access this page"});
    let managers = await User.find({userRole : 'manager'});
    return res.status(200).json({ message: 'Access granted', data:managers});
}


//view all users
exports.user = async (req,res) => {
    let response = await tokenCheck(req);
    if(!response) return res.status(440).json({ message: "Session expired. Kindly login"});
    if(response.isUser) return res.status(403).json({ message: "Unauthorized. You cannot access this page"});
    let users = await User.find({isUser : true});
    return res.status(200).json({ message: 'Access granted', data:users});
}

//assign managers and staff
exports.assign = async (req,res) => {
    let response = await tokenCheck(req);
    if(!response) return res.status(440).json({ message: "Session expired. Kindly login"});
    if(!response.isAdmin) return res.status(403).json({ message: "Unauthorized. You cannot access this page"});
    const {email,role} = req.body;
    let user = await User.findOne({email});
    user.updateOne({userRole:role, isUser : false}, (err,update) => {
        if(err) return res.status(400).json({ message: "Server error "});
        return res.status(200).json({ message: "Successfully assigned role"});
    });
}

//find another user
exports.specificUser = async (req,res) => {
    let response = await tokenCheck(req);
    if(!response) return res.status(440).json({ message: "Session expired. Kindly login"});
    const email = req.body.email;
    let user = await User.findOne({email});
    if(!user) return res.status(440).json({ message: "User not found"});
    let data;
    if(response.isUser) {
        data = {
            firstname : user.firstname,
            lastname : user.lastname,
            email : user.email
        }
    }
    else data = user;
    return res.status(200).json({ message: 'Access granted', data:data});
    
}
