const router = require('express').Router()
const authGuard = require('./guards/authGuard')
const bodyParser = require('body-parser');
const check = require('express-validator').check;
const authCon = require('../controllers/authCon')

router.get('/signup',authGuard.isNotAuth,authCon.getSignUp)

router.post('/signup',authGuard.isNotAuth,
    bodyParser.urlencoded({extended:true}),
    check("name").notEmpty().withMessage(" enter your name").trim(),
    check('email').notEmpty().withMessage(" enter your email").isEmail().toLowerCase().trim(),
    check('password').notEmpty().withMessage("enter password").isLength({min:8}).withMessage("password must be at least 8 characters"),
    check("confirmPassword").custom((value, {req})=>{
        if (value === req.body.password) return true
        else throw 'passwords do not match'
    }),
    authCon.postSignUp
)

router.get('/login',authGuard.isNotAuth,authCon.getLogin)
router.post('/login',
    check('email').notEmpty().withMessage('please enter your email').isEmail().withMessage("not email").trim(),
    check('password').notEmpty().withMessage('please enter your password'),
    authCon.postLogin
    
)
router.all('/logout',authGuard.isAuth,authCon.logout)

module.exports = router;