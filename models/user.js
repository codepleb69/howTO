var mongoose    =   require("mongoose");
var passportLocalMongoose   = require("passport-local-mongoose")

var UserSchema  =   new mongoose.Schema ({
    username: String,
    password: String,
    email: String,
    avatar: String,
    firstName: String,
    lastName: String,
    tokens: Array,
    description: String,
    isAdmin: {type: Boolean, default:false},
    coursesTaken: [{
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course'}
    }],
    coursesTeach: [{
    	course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course'}
    }]

});

UserSchema.plugin(passportLocalMongoose);

module.exports  = mongoose.model("User", UserSchema);