var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstName : String,
  lastName: String,
  email: {
    type: String,
    index: true,
    match: /.+\@.+\..+/
  },
  username : {
    type: String,
    trim: true,
    unique: true,
    required: true
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

UserSchema.statics.findOneByUsername = function(username, cb) {
  this.findOne({username: new RegExp(username, 'i')}, cb);
};

UserSchema.methods.authenticate = function(password) {
  return this.password === password;
};

UserSchema.post('save', function(next){
  if(this.isNew) {
    console.log("New user created");
  } else {
    console.log("Updated user details");
  }
});

UserSchema.set('toJSON', {getters: true, virtuals : true});

mongoose.model('User', UserSchema);