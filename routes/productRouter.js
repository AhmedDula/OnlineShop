const router = require('express').Router()

const productCon = require('../controllers/productCon')

router.get('/product/:id',productCon.getProductById)

module.exports = router