
const cartSchema = require('../model/cart');
const { validationResult } = require('express-validator');
exports.getCart = (req, res, next) => {
    cartSchema.getItemByUserId(req.session.userId)
        .then((items) => {
            res.render('cart', {
                validErrors: req.flash("validationErrors"),
                items: items,
                isUser: req.session.userId,
                isAdmin: req.session.isAdmin,
                
            });
        })
        .catch(err => {
            console.error('Error fetching cart items:', err);
            res.status(500).redirect('error');
        });
};

exports.postCart = (req, res, next) => {
    const { name, amount, price, productId, image } = req.body;
    
    cartSchema.AddCartItem({
        name: name,
        amount: parseInt(amount, 10), // تأكد من تحويل القيم إلى أرقام صحيحة
        price: parseFloat(price),    // تأكد من تحويل القيم إلى أرقام عشرية
        productId: productId,
        userId: req.session.userId,
        image: image
    })
    
        .then(() => {
            if(isNaN(amount)||amount<1){
        res.status(400).json({message:"Error Quantity Less Than One"})
         }
            res.redirect('/');
        })
        .catch(err => {
            console.error('Error adding item to cart:', err);
            res.redirect('/error');
        });
};

exports.deleteCartItem = (req, res, next) => {
    const productId = req.body.productId;
    console.log(productId);
    cartSchema.deleteItemByProductId(productId)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
             console.log(productId);
             
            console.error('Error deleting item from cart:', err);
            res.redirect('/error');
        });
}

exports.saveCartItem = (req, res, next) => {
    const productId = req.body.productId;
    const newAmount = req.body.amount; // Assuming you have an input field for the new amount
    console.log(productId);
    cartSchema.updateItemAmount(productId, newAmount)
        .then(() => {
            res.redirect('/cart'); // Redirect to the cart page after updating the item amount
        }) 
        .catch(err => {
            console.log(productId);
             
            console.error('Error updating item amount in cart:', err);
            res.redirect('/error');
        });
}