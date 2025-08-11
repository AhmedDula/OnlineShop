const validator = require('express-validator').validationResult;
const productsSchema = require("../model/products");
const OrdersSchema = require("../model/orders");
const { isAdmin } = require('../routes/guards/authGuardAdmin');
exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    validErrors: req.flash("validationErrors"),
    isUser: true,
    isAdmin: req.session.isAdmin,
  });
}

exports.postAddProduct = (req, res, next) => {
  const { name, image, price, category } = req.body;
  const errors = validator(req);
  
  if (errors.isEmpty()) {
    productsSchema.createNewProduct(name, image, price,category)
      .then(() => {
        res.redirect('/admin/add-product');
      })
      .catch(err => {
        console.error('Error creating product:', err);
        res.redirect('/error');
      });
  } else {
    req.flash("validationErrors", errors.array());
    res.redirect('/admin/add-product');
  }
};

exports.ManageOrders = (req, res, next) => {
  OrdersSchema.getAllOrders()
    .then(orders => {
      res.render('admin/ManageOrders', {
        orders: orders, // Assuming you have a method to get all orders
        isUser: true,
        isAdmin: req.session.isAdmin,
      });
    })
    .catch(err => {
      console.error('Error fetching products:', err);
      res.redirect('/error');
    });
}

exports.OrderDetails = (req, res, next) => {
  const orderId = req.params.id;
  OrdersSchema.getOrderById(orderId)
    .then(order => {
      if (!order) {
        return res.status(404).render('error', { message: 'Order not found' });
      }
      res.render('admin/OrderDetails', {
        order: order,
        isUser: true,
        isAdmin: req.session.isAdmin,
      });
    })
    .catch(err => {
      console.error('Error fetching order details:', err);
      res.redirect('/error');
    });
}

exports.orderUpdate = (req, res, next) => {
  const orderId = req.params.id;
  const newStatus = req.body.orderStatus; // إذا كنت ترسل الحالة من فورم

  OrdersSchema.UpdateStatus(orderId, newStatus)
    .then(() => {
      return OrdersSchema.getOrderById(orderId); // جلب الطلب بعد التحديث
    })
    .then(order => {
      res.render('admin/OrderDetails',{
        order:order,
        isUser:true,
        isAdmin:req.session.isAdmin
      });
    })
    .catch(err => {
      console.error('Error updating order:', err);
      res.redirect('/error');
    });
};

exports.deleteOrder = (req, res, next) => {
  const orderId = req.params.id;
  OrdersSchema.delelteOrderById(orderId)
    .then(() => {
    
      res.redirect('/admin/ManageOrders')
      console.log('Order Is Deleted Succesfully')
    })
    .catch(err => {
      console.error('Error deleting order:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
};


