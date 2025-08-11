const validator = require('express-validator').validationResult;
const ordersSchema = require("../model/orders");
exports.getOrders = (req, res, next) => {
    const userId = req.session.userId;
  
    ordersSchema
      .getOrders(userId)
      .then((orders) => {
        res.render("orders", {
          validErrors: req.flash("validationErrors"),
          isUser: req.session.userId,
          orders: orders, // تمرير جميع الطلبات إلى القالب
          isAdmin: req.session.isAdmin, // تمرير حالة المسؤول 
        });
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        res.status(500).send("Failed to fetch orders.");
      });
  };
  

exports.postOrder = (req, res, next) => {
  const name = req.body.name; // الحصول على اسم المستخدم من الطلب
  const email = req.body.email; // الحصول على البريد الإلكتروني من الطلب
  const userId = req.session.userId;
  const items = JSON.parse(req.body.items); // تحويل النص JSON إلى كائن
  const totalPrice = req.body.totalPrice;
  const address = req.body.address; // الحصول على عنوان التسليم من الطلب
  const city = req.body.city; // الحصول على المدينة من الطلب
  const phone = req.body.phone; // الحصول على رقم الهاتف من الطلب 
  const errors = validator(req);
if (errors.isEmpty()) {
  ordersSchema
    .createOrder({ name,email,userId, items, totalPrice, address,city, phone }) // تمرير جميع البيانات المطلوبة
    .then((order) => {
      console.log('Order created');

      res.redirect("/orders"
        
      );
    })
    .catch((err) => {
      console.error("Error creating order:", err);
      res.redirect("/");
    });
}else{
  req.flash("validationErrors", errors.array());
  res.redirect("/cart"); // إعادة توجيه المستخدم إلى صفحة السلة في حالة وجود أخطاء
}};

exports.getOrders = (req, res, next) => {
  const userId = req.session.userId;

  ordersSchema
    .getOrders(userId)
    .then((orders) => {
      res.render("orders", {
        isUser: req.session.userId,
        validErrors: req.flash("validationErrors"),
        orders: orders, // تمرير جميع الطلبات إلى القالب
        isAdmin: req.session.isAdmin, // تمرير حالة المسؤول 
      });
    })
    .catch((err) => {
      console.error("Error fetching orders:", err);
      res.status(500).redirect('/error');
    });
}

exports.deleteOrder = (req, res, next) => {
  const orderId = req.body.orderId; // الحصول على معرف الطلب من الطلب
  ordersSchema.delelteOrderById(orderId) // استخدام الدالة المناسبة لحذف الطلب
    .then(() => {
      console.log("Order deleted successfully");
      res.redirect("/orders"); // إعادة توجيه المستخدم إلى صفحة الطلبات بعد الحذف
    })
    .catch((err) => {
      console.error("Error deleting order:", err);
      res.status(500).redirect('/error');
    });
};

    
 