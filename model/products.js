const mongoose = require("mongoose");

const productsSchema = mongoose.Schema(
  {
    name: String,
    image: String,
    price: String,
    description: String,
    category: String,
  },
  { timestamps: true }
);

const product = mongoose.model("product", productsSchema);


exports.createNewProduct = (name, image, price ,category) => {
  return new Promise((resolve, reject) => { 
    
    mongoose
      .connect(process.env.DATABASE_URI)
      .then(() => {
        const newProduct = new product({
          name: name,
          image: image,
          price: price,
          
          category: category,
        });

        return newProduct.save();
      })
      .then(() => {
        mongoose.disconnect();
        resolve("Product created successfully");
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};



exports.getAllproducts = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.DATABASE_URI)
      .then(() => {
        product.find().then((products) => {
          mongoose.disconnect();
          resolve(products);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};




exports.getProductsByCategory = (category) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.DATABASE_URI)
      .then(() => {
        product.find({category:category}).then((products) => {
          mongoose.disconnect();
          resolve(products);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};



exports.getProductsById = (id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.DATABASE_URI)
      .then(() => {
        product.findById(id).then((product) => {
          mongoose.disconnect();
          resolve(product);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.deleteProduct = (id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.DATABASE_URI)
      .then(() => {
        product.findByIdAndDelete(id).then(() => {
          mongoose.disconnect();
          resolve("Product deleted successfully");
        });
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
}