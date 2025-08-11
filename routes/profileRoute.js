const router = require('express').Router();
const auth = require('./guards/authGuard')
const bodyParser = require('body-parser')
const check = require('express-validator').check;
const profileCon = require('../controllers/profileCon');


router.get('/profile',auth.isAuth,profileCon.getProfile)
router.post('/profile',auth.isAuth,profileCon.postProfile)
module.exports = router;