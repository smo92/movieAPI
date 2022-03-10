const mongoose = require('mongoose');

let moviesSchema = mongoose.Schema({
    Title:{type: String,required:true},
    Description:{type: String, required: true},
    Genre:{
        Name:String,
        Description: String
    },
    Director:{
        Name: String,
        Bio: String
    },
    Actors:[String],
    ImagePath: String,
    Featured: Boolean
});

let userSchema = mongoose.Schema({
    Username: {type:String, require: true},
    Password:{type:String, require: true},
    Email:{type:String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref:'Movies'}]
});

let Movie = mongoose.model('Movie', moviesSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;