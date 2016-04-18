var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstName : String,
  lastName: String,
  email: {
    type: String,
    index: true,
    match: [/.+\@.+\..+/, "Enter valid email"]
  },
  username : {
    type: String,
    trim: true,
    unique: true,
    required: 'Username is required'
  },
  role : {
    type : String,
    enum : ['Admin', 'User']
  },
  password: {
     type : String,
     validate : [
        function(password) {
          return password.length >= 5;
        },
        'Passwords must be at least 6 characters'
     ]
  },
  salt : {
    type: String
  },
  provider : {
    type: String,
    required: "Provider required"
  },
  providerId: String,
  providerData: {},
  created : {
    type: Date,
    default: Date.now
  }
});

UserSchema.virtual('fullName').get(function(){
  return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {
  var s = fullName.split(' ');
  this.firstName = s[0] || '';
  this.lastName = s[1] || '';
});

UserSchema.pre("save", function(next) {
  if(this.password) {
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }
  next();
});

UserSchema.methods.hashPassword = function(password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

UserSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};

UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
  var _this = this;
  var possible = username + (suffix || '');

  _this.findOne({
    username: possible
  }, function(err, user) {
    if(!err) {
      if(!user) {
        callback(possible);
      } else {
        return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
      }
    } else {
      callback(null);
    }
  });
};

UserSchema.set('toJSON', {
  getters: true,
  setters: true
})

UserSchema.statics.findOneByUsername = function(username, cb) {
  this.findOne({username: new RegExp(username, 'i')}, cb);
};


UserSchema.post('save', function(next){
  if(this.isNew) {
    console.log("New user created");
  } else {
    console.log("Updated user details");
  }
});


mongoose.model('User', UserSchema);