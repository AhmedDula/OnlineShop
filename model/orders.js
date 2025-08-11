const mongoose = require("mongoose");
const cartSchema = require("./cart");
const userSchema = require("./users");
const { name } = require("ejs");
const { resolve } = require("path");
// تعريف مخطط الطلبات
const ordersSchema = mongoose.Schema(
  {
    name: { type: String ,require:true}, // اسم المستخدم
    email: { type: String,require:true }, // البريد الإلكتروني
    userId: { type: String, required: true }, // معرف المستخدم
    items: [
      {
        name: { type: String, required: true }, // اسم المنتج
        price: { type: Number, required: true }, // سعر المنتج
        amount: { type: Number, required: true }, // الكمية
        image: { type: String }, // رابط الصورة
        productId: { type: String, required: true }, // معرف المنتج
      },
    ],
    totalPrice: { type: Number, required: true }, // إجمالي السعر
    status: { type: String, default: "Pending" }, // حالة الطلب
    address: { type: String,required:true }, // عنوان التسليم
    city: { type: String,required:true }, // المدينة
    phone: { type: String ,required:true}, // رقم الهاتف
    
  },
  { timestamps: true }
); // إضافة الطوابع الزمنية (createdAt, updatedAt)

// تعريف نموذج الطلب
const orderItem = mongoose.model("order", ordersSchema);

// دالة لإنشاء طلب جديد
exports.createOrder = ({ name,email ,userId, items, totalPrice,address,city,phone }) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.DATABASE_URI).then(() => {
      if (
        !userId ||
        !Array.isArray(items) ||
        items.length === 0 ||
        !totalPrice
      ) {
        return reject(new Error("Invalid order data"));
      }

      // إنشاء طلب جديد
      const newOrder = new orderItem({
        name:name,
        email:email,
        userId: userId,
        items: items,
        totalPrice: totalPrice,
        status: "Pending", // الحالة الافتراضية
        address: address, // عنوان افتراضي
        city:city, // مدينة افتراضية
        phone:phone, // رقم هاتف افتراضي
      });

      // حفظ الطلب في قاعدة البيانات
      newOrder
        .save()
        .then((order) => {
          console.log("Order created successfully:", order);
          
          cartSchema.deleteCart(userId).then((order)=>{
            
            mongoose.disconnect(); // فصل الاتصال بعد حفظ الطلب
            resolve(order); // إرجاع الطلب المحفوظ`
          })
        })
        .catch((err) => {
          console.error("Error creating order:", err);
          reject(err); // إرجاع الخطأ في حالة الفشل
        });
    });
   
  });
};

exports.getOrders = (userId) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.DATABASE_URI)
      .then(() => {
        return orderItem.find(
          { userId: userId },
          {},
          { sort: { createdAt: -1 } }
        );
      })
      .then((items) => {
        mongoose.disconnect();
        resolve(items);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

exports.delelteOrderById = (orderId) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.DATABASE_URI)
      .then(() => {
        return orderItem.deleteOne({ _id: orderId });
      })
      .then(() => {
        mongoose.disconnect();
        resolve();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
}

exports.getAllOrders = ()=>{
  return new Promise ((resolve, reject) => {
    mongoose.connect(process.env.DATABASE_URI).then(() => {
      orderItem.find().then((orders) => {
        mongoose.disconnect();
        resolve(orders);
      });
  })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
}

exports.getOrderById = (orderId) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.DATABASE_URI)
      .then(() => {
        return orderItem.findById(orderId);
      })
      .then((order) => {
        mongoose.disconnect();
        resolve(order);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
}

exports.UpdateStatus = (orderId, newStatus) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.DATABASE_URI)
      .then(() => {
        return orderItem.updateOne(
          { _id: orderId },
          { $set: { status: newStatus, updatedAt: new Date() } }
        );
      })
      .then((newOrder) => {
        mongoose.disconnect();
        resolve(newOrder);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
}

