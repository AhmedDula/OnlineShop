const router = require('express').Router();

const authGuard = require('./guards/authGuard');
const ordersCon = require('../controllers/orderCon');
const check = require('express-validator').check;
const bodyParser = require('body-parser');

// إضافة طلب جديد
router.post('/order', bodyParser.urlencoded({ extended: true }), authGuard.isAuth,
check('name').notEmpty().withMessage('Please enter your name'), // التحقق من صحة الاسم
check('email').isEmail().withMessage('Please enter a valid email').toLowerCase(), // التحقق من صحة البريد الإلكتروني  
check('city').notEmpty().withMessage('Please enter your city'), // التحقق من صحة المدينة 
check('address').notEmpty().withMessage('Please enter your address'), // التحقق من صحة العنوان
check('phone').notEmpty().withMessage('Please enter your phone number').isMobilePhone().isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits'), // التحقق من صحة رقم الهاتف
ordersCon.postOrder);

// عرض جميع الطلبات الخاصة بالمستخدم
router.get('/', authGuard.isAuth, ordersCon.getOrders);

router.post('/delete',authGuard.isAuth,ordersCon.deleteOrder);


module.exports = router;