const validator = require('express-validator').validationResult;
const usersSchema = require("../model/users");
const { isAdmin } = require('../routes/guards/authGuardAdmin');
exports.getSignUp = (req, res, next) => {
  res.render("signup",
    {
      password23: '',  
      err: null,
     validErrors : req.flash("validationErrors"),
     isUser:false,
      isAdmin: req.session.isAdmin, // إضافة حالة المشرف
    }
  );
};


exports.postSignUp = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = validator(req);

  if (errors.isEmpty()) {
    usersSchema
      .createNewUser(name, email, password)
      .then(() => {
        res.redirect("/login");
      })
      .catch((err) => {
        // استخدم res.render بدلاً من res.redirect
        res.render("signup", {
          password23: password,
          err: err.message, // تمرير رسالة الخطأ إلى القالب
          validErrors: [],
          isUser: false,
          isAdmin: req.session.isAdmin
        });
        console.log(err);
      });
  } else {
    req.flash("validationErrors", errors.array());
    res.redirect("/signup");
  }
};




exports.getLogin = (req,res,next)=>{
  res.render('login',{
    validErrors : req.flash("validationErrors"),
    isUser:false,
    isAdmin: req.session.isAdmin, // إضافة حالة المشرف

  })
}

exports.postLogin = (req,res,next)=>{
  const errors = validator(req);
  // return console.log(validator(req));
  if (errors.isEmpty()){
    usersSchema.login(req.body.email, req.body.password).then((result)=>{
      req.session.userId =result.id;
      req.session.isAdmin =result.isAdmin ; // Set the authentication status
      res.redirect('/')
    }).catch(err=>{
      req.flash('authErr' , err)
      console.log(err)
      res.redirect('/login')
    })
  }else{
    req.flash("validationErrors", errors.array());

    res.redirect('/login')
  }

 
}

exports.logout =(req,res,next)=>{
  req.session.destroy(()=>{
    console.log("logout !");
    
    res.redirect('/')
  })
}