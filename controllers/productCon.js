const productModel = require('../model/products');

exports.getProductById = (req,res,next)=>{

  const id =  req.params.id;
  productModel.getProductsById(id).then((product)=>{
    res.render('product',{
        product:product,
        isUser:req.session.userId
       

    })
  }).catch(err=>{
    console.log(err)
  })
}