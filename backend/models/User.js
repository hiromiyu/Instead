const mongoose = require('mongoose');
const validator = require('validator');
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 25,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      // required: true,
      min: 6,
      max: 50,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error('Password cannot contain "password');
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          // required: true,
        },
      },
    ],
    profilePicture: {
      type: String,
      default: '',
    },
    coverPicture: {
      type: String,
      default: '',
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 70,
    },
    city: {
      type: String,
      max: 50,
    },
  },

  { timestamps: true }
);

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

// UserSchema.statics.findByCredentials = async (email, password) => {
//     const user = await User.findOne({ email });
//     if (!user) throw new Error('Unable to login');

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) throw new Error('Unable to login');

//     return user;

// }

module.exports = mongoose.model('User', UserSchema);
