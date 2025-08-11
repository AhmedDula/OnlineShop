const router = require('express').Router()

const authGuard = require('./guards/authGuard')
const cartCon = require('../controllers/cartCon')
const bodyParser = require('body-parser')


router.post('/',bodyParser.urlencoded({extended:true}),authGuard.isAuth,cartCon.postCart)
router.get('/',cartCon.getCart)
router.post('/delete',cartCon.deleteCartItem)
router.post('/save',cartCon.saveCartItem)       

module.exports = router
