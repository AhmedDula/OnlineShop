const mongoose = require("mongoose");



const cartSchema = mongoose.Schema(
  {
    name: String,
    amount:String,
    price: String,
    productId: String,
    userId: String,
    image:String,
    
  },
  { timestamps: true }
);

const cartItem = mongoose.model('cart', cartSchema);

exports.deleteCart= (userId) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.DATABASE_URI).then(() => {
            return cartItem.deleteMany({ userId: userId });
        }
).then((item)=>{
    mongoose.disconnect();
    resolve (item)
}).catch(err=>{
    mongoose.disconnect();
//   console.log(item)

    reject (err)

})})}

exports.getItemByUserId = userId =>{
    return new Promise((resolve, reject) => {
       
        mongoose.connect(process.env.DATABASE_URI).then(()=>{
         return    cartItem.find({userId:userId},{},{sort:{createdAt:-1}})
        }).then((items)=>{
        //   console.log(items)
            mongoose.disconnect();
            resolve (items)
        }).catch(err=>{
            mongoose.disconnect();
            reject (err)
        })
    })
}

exports.deleteItemByProductId = productId =>{
    return new Promise((resolve, reject) => {
        
        mongoose.connect(process.env.DATABASE_URI).then(()=>{
         return    cartItem.deleteOne({productId:productId})
        }).then((item)=>{
            mongoose.disconnect();
            resolve (item)
        }).catch(err=>{
            mongoose.disconnect();
        //   console.log(item)

            reject (err)
        })
    })
}

exports.updateItemAmount = (productId, newAmount) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.DATABASE_URI).then(()=>{
         return cartItem.updateOne({productId: productId}, { amount: newAmount })
        }).then((item)=>{
            mongoose.disconnect();
            resolve (item)
        }).catch(err=>{
            mongoose.disconnect();
        //   console.log(item)

            reject (err)
        })
    })
}


exports.AddCartItem = (data) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.DATABASE_URI).then(() => {
            // البحث عن العنصر باستخدام النموذج cartItem
            return cartItem.findOne({ productId: data.productId });
        }).then((itemFound) => {
            if (itemFound) {
                // إذا تم العثور على العنصر، قم بتحديث الكمية
                itemFound.amount = parseInt(itemFound.amount) + parseInt(data.amount);
                return itemFound.save();
            } else {
                // إذا لم يتم العثور على العنصر، قم بإنشاء عنصر جديد
                let item = new cartItem(data);
                return item.save();
            }
        }).then(() => {
            mongoose.disconnect();
            resolve();
        }).catch((err) => {
            mongoose.disconnect();
            reject(err);
        });
    }).catch((err) => {
        mongoose.disconnect();
        reject(err);
    });
};