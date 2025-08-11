const productModel = require('../model/products');
const isAdmin = require('../routes/guards/authGuardAdmin');
const userModel = require('../model/users')

exports.getHome = (req,res,next)=>{

    
    let category = req.query.category ;


 const   validCategory = ['protein','mass','creatine','pre-workout','test']
    if (category && validCategory.includes(category)) {
        
        productModel.getProductsByCategory(category).then(products=>{
            res.render('index',{
                products:products,
                category:category,
                isUser:req.session.userId,
                isAdmin: req.session.isAdmin
            })
        })
    } else {
        
        productModel.getAllproducts().then(products=>{
            res.render('index.ejs',{
                products:products,
                category:category,
                isUser:req.session.userId,
                isAdmin: req.session.isAdmin
            })
        })
    }
}

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.id;
  
  productModel.deleteProduct(productId)
    .then(() => {
      res.redirect('/'); // Redirect to home after deletion
    })
    .catch(err => {
      console.error('Error deleting product:', err);
      res.status(500).send('Internal Server Error');
    });
}


