var mongoose=require("mongoose");

var courseSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: { type: String, default: 'https://d1jnx9ba8s6j9r.cloudfront.net/imgver.1530273378/img/Blank-screen-all-course.png'},
    wistiaID: String,
    description: String,
    createdAt: {type: Date, default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            } 
        ],
    ownByStudent: [
            {
                 user:{ 
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: 'User'
                },
            }],
    totalStudents: Number        
});


module.exports = mongoose.model("Course", courseSchema);