const validator = require('express-validator').validationResult;
const usersSchema = require("../model/users");

exports.getProfile = (req, res, next) => {
    const userId = req.session.userId; // أو req.session.user._id حسب تخزينك
    usersSchema.getUser(userId).then(userinfo => {
       
        res.render("profile", {
            user: req.session.user,
            isUser: true,
            isAdmin: req.session.isAdmin,
            userinfo: userinfo
        });
    }).catch(next);
}

exports.postProfile = (req,res,next)=>{
    const userId = req.session.userId;
    const {name,email,oldPassword,newPassword}= req.body;
    usersSchema.UpdateUser(userId,name,email,oldPassword,newPassword).then(userInfo=>{
        res.redirect('/profile')
    })
}