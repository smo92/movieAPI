
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

const port = 8080;


mongoose.connect('mongodb://127.0.0.1:27017/FlixFansDB',
  {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('common'));

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

//Responds by taking you to index
app.get('/',(req,res) =>{
  res.send('Welcome to FlixFans!!');
});



//responds with list of all movies
app.get('/movies', passport.authenticate('jwt',{session:false}), (req,res)=>{
  Movies.find()
  .then((movies) => {
    res.status(200).json(movies);
  })
  .catch((err) => {
    res.status(500).send('Error: '+ err);
  });

});


//Responds with a specific movie by title
app.get('/movies/:Title', passport.authenticate('jwt',{session:false}),(req,res) =>{
  Movies.findOne({Title: req.params.Title})
  .then ((movie)=>{
    res.json(movie);
  })
  .catch((err)=>{
    console.error(err);
    res.status(500).send('Error' + err);
  });
});


//Respond with all movies in specified genre
app.get('/movies/genres/:Name', passport.authenticate('jwt',{session:false}), (req, res) => {
  Movies.find({'Genre.Name': req.params.Name})
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch ((err) => {
      console.error(err);
      res.status(500).send('Error' + err);
    });
});


//Responds with json data about specified director
app.get('/movies/director/:Name', passport.authenticate('jwt',{session:false}), (req,res) => {
 Movies.findOne({'Director.Name': req.params.Name})
  .then((movie)=>{
    if(movie){
      res.status(200).json(movie.Director);
    }else{
    res.status(404).send('Director not found!');
  };
})
.catch((err)=>{
  console.error(err);
  res.status(500).send('Error' + err);
  });
});

//Create a new user using UUID
app.post('/users',(req,res) => {
  Users.findOne({Username: req.body.Username})
    .then((user) =>{
      console.log("IN POST OF USER" + req.body.Username);
     if(user){return res.status(400).send(user + 'already exists!');
    }else{
      Users.create({
        Username:req.body.Username,
        Password: req.body.Password,
        Email:req.body.Email,
        Birthday: req.body.Birthday
      })
  .then((user)=>{res.status(200).json(user)})
    .catch((error) => {
      console.error(error);
      res.status(400).send('Error' + err);
      })
    }
  })
  .catch((error)=>{
    console.error(error);
    res.status(500).send('Error' + err);
    });
  });

//Update existing username
app.put('/users/:Username', passport.authenticate('jwt',{session:false}),(req,res) =>{
  Users.findOneAndUpdate({ Username: req.params.Username },
    { $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
    }
}, 
{ new: true }, // this makes sure that the updated document is returned
(err, updatedUser) => {
    if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
    } else {
        res.json(updatedUser);
    }
  });
});

//Add movie to users favorites
app.post('/users/:Username/movies/:MovieID',  passport.authenticate('jwt',{session:false}), (req,res) =>{
  Users.findOneAndUpdate({Username:req.params.Username},
    {$push:{ favoriteMovies: req.params.MovieID}
  },
  //make sure updated doc is sent
  {new: true},
  (err, updatedUser) =>{
    if(err){
      console.error(err);
      res.status(500).send('Error:' + err);
    }else{
      res.json(updatedUser);
    }
  });
});

//Remove movie from users favorites
app.delete('/users/:Username/movies/:MovieID',  passport.authenticate('jwt',{session:false}),(req,res) =>{
  Users.findOneAndUpdate({Username:req.params.Username},
    {$pull:{favoriteMovies:req.params.MovieID}
    },
  {new:true},
  (err,updatedUser)=>{
    if(err){
      console.error(err);
      res.status(500).send('Error:' + err);
    }else{
      res.json(updatedUser);
    }
  });
});

//delete user
app.delete('/users/:Username',  passport.authenticate('jwt',{session:false}), (req,res) => {
  Users.findOneAndRemove({Username: req.params.Username})
    .then((user)=>{
      if (!user){
        res.status(400).send(req.params.Username + ' was not found!');
      }else{
        res.status(200).send(req.params.Username + ' was deleted!');
      }
    })
    .catch((err)=>{
      console.error(err);
      res.status(500).send('Error' + err);
    });
});


//using express to search public folder for any "/" extension that doesnt have an endpoint specified
app.use(express.static('public'));

//error handler
app.use((err,req,res,next) => {
  console.error(err.stack);
  res.status(400).send('Something went wrong!');
});
//telling which port to listen to for requests

app.listen(port,() => {
  console.log("app running on Port: " + port);
});