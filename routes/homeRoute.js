const router = require('express').Router()
const authGuard = require('./guards/authGuard')
const homeCon = require('../controllers/homeCon')
const isAdmin = require('./guards/authGuardAdmin')
router.get('/',homeCon.getHome)
router.get('/delete-product/:id', isAdmin.isAdmin, homeCon.deleteProduct)

module.exports = router