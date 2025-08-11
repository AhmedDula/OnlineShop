const router = require('express').Router();
const adminGuard = require('./guards/authGuardAdmin');
const adminCon = require('../controllers/adminCon');
const { body } = require('express-validator');

const bodyParser = require('body-parser');
const check = require('express-validator').check;

router.get('/add-product', adminGuard.isAdmin, adminCon.getAddProduct);
router.post('/add-product', bodyParser.urlencoded({ extended: true }),
    adminGuard.isAdmin, 
    [
        check('name').notEmpty().withMessage('Name is required'),
        check('image').notEmpty().withMessage('Image URL is required'),
        check('price').isNumeric().withMessage('Price must be a number'),
        check('category').notEmpty().withMessage('Category is required')
    ], 
    adminCon.postAddProduct);

router.get('/ManageOrders', adminGuard.isAdmin, adminCon.ManageOrders);    
router.get('/OrderDetails/:id', adminGuard.isAdmin, adminCon.OrderDetails);
router.post('/orderUpdate/:id', adminGuard.isAdmin, adminCon.orderUpdate);
router.delete('/DeleteOrder/:id', adminGuard.isAdmin, adminCon.deleteOrder);


module.exports = router;
// عرض لوحة التحكم للمشرف