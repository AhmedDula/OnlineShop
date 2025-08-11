const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const { isAuth } = require("../routes/guards/authGuard");
const { name } = require("ejs");


const usersSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const user = mongoose.model('usert', usersSchema);

exports.createNewUser = async (name, email, password) => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);

        const existingUser = await user.findOne({ email: email });
        if (existingUser) {
            throw new Error('Email already exists!');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new user({
            name: name,
            email: email,
            password: hashedPassword,
           
        });

        await newUser.save();
        mongoose.disconnect();
    } catch (err) {
        mongoose.disconnect();
        throw err;
    }
};

exports.login = (email, password) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.DATABASE_URI).then(() => {
            return user.findOne({ email: email });
        }).then((user) => {
            if (!user) {
                mongoose.disconnect();
                reject('not a user!');
            } else {
                bcrypt.compare(password, user.password).then(same => {
                    if (!same) {
                        mongoose.disconnect();
                        reject('wrong!');
                    } else {
                        mongoose.disconnect();
                        resolve({
                            id: user._id,
                            isAdmin: user.isAdmin
                        });
                    }
                });
            }
        }).catch(err => {
            mongoose.disconnect();
            reject(err);
        });
    });
};



exports.UpdateUser = (userId, newName, newEmail, OldPassword, newPassword) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.DATABASE_URI)
      .then(() => user.findById(userId))
      .then(userDoc => {
        if (!userDoc) {
          mongoose.disconnect();
          return reject('User Not Found');
        }
        return bcrypt.compare(OldPassword, userDoc.password)
          .then(same => {
            if (!same) {
              mongoose.disconnect();
              return reject('incorrect old password');
            }
            return bcrypt.hash(newPassword, 10)
              .then(hashedPassword => {
                return user.updateOne(
                  { _id: userId },
                  {
                    name: newName,
                    email: newEmail,
                    password: hashedPassword
                  }
                );
              });
          });
      })
      .then(result => {
        mongoose.disconnect();
        resolve(result);
      })
      .catch(err => {
        mongoose.disconnect();
        reject(err);
      });
  });
};



exports.getUser = (userId) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.DATABASE_URI)
      .then(() => user.findById(userId))
      .then(userData => {
        mongoose.disconnect();
        
        resolve(userData);
      })
      .catch(err => {
        mongoose.disconnect();
        reject(err);
      });
  });
};


