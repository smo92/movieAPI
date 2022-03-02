
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');

const app = express();

app.use(bodyParser.json());
app.use(morgan('common'));

let users = [];

let movies = [
  {
    title: ' Saving Praiate Ryan',
    year: '2000',
    genre:{
      type:'Action',
      description: 'Violence and drama, grab your popcorn!'
    },
    director:{
      name:'Steve',
      birthYear: '1969',
      deathYear: 'Still alive',
      bio:'Great guy'
    }
  },
  {
    title: 'Gladiator',
    year: '2000',
    genre:{
      type:'Action',
      description: 'Violence and drama, grab your popcorn!'
    },
    director:{
      name:'Steve',
      birthYear: '1969',
      deathYear: 'Still alive',
      bio:'Great guy'
    }
  }
];
//Responds by taking you to index
app.get('/',(req,res) =>{
  res.send('Welcome to FlixFans!!');
});

//responds with list of all movies
app.get('/movies',(req,res)=>{
  res.json(movies);
});

//Responds with a specific movie by title
app.get('/movies/:title',(req,res) =>{
  res.json(movies.find((movie) => {
    return movie.title === req.params.title
  }));
});

//Respond with all movies in specified genre
app.get('/movies/genres/:genre', (req, res) => {
  const genre = movies.find((movie) => movie.genres.type === req.params.genre).genre;

  if(genre) {
    res.status(200).json(genre);
  }else{
    res.status(404).send('Genre not found!');
  }
});

//Responds with json data about specified director
app.get('movies/director/:name', (req,res) => {
  const director = movies.find((movie) => {return movie.director.name === req.params.name});

  if(director){
    res.status(200).json(director);
  }else{
    res.status(404).send('Director not found!');
  }
});

//Create a new user using UUID
app.post('/users',(req,res) => {
  const newUser = req.body;

  if(newUser.username){
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(200).json(newUser);
  }else{
    const message = ('Missing username in request body');
    res.status(400).send(message);
  }
});

//Update existing username
app.put('users/:username',(req,res) =>{
  let user = users.find((user) => {return user.username === req.params.username});

  if(user) {
    user.username = newUsername.username;
    res.status(200).json(user)
  }else{
    res.status(404).send('User not found')
  };
});

//Add movie to users favorites
app.post('users/:username/:movie', (req,res) =>{
  let user = users.find((user) => {return user.usersname = req.params.username});

  if (user){
    user.favorites.push(req.params.movie);
    res.status(200).send(req.params.movie + ' has been added to ' + user.username + "'s list of favorites!");
  }else{
    res.status(404).send('User or movie not found');
  };
});

//Remove movie from users favorites
app.delete('/users/:username/:movie',(req,res) =>{
  let user = users.find((user) => {return user.username === req.params.username});

  if (user) {
     user.favorites = user.favorites.filter((movie) => {return movie !== req.params.movie});
     res.status(200).send(req.params.movie + ' was removed from your favorites list!');
  }else{
    res.status(404).send('User was not found');
  }
});

//using express to search public folder for any "/" extension that doesnt have an endpoint specified
app.use(express.static('public'));

//error handler
app.use((err,req,res,next) => {
  console.error(err.stack);
  res.status(400).send('Something went wrong!')
});
//telling which port to listen to for requests
app.listen(8080,() =>{
  console.log('Your app is listening on 8080');
});