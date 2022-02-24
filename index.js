
const express = require('express');
const app = express();

const morgan = require('morgan'),
    bodyParser = require('body-parser');

app.use(morgan('common'));
app.use(bodyParser.json());

let topMovies = [
    {
      title: 'Harry Potter and the Sorcerer\'s Stone',
      author: 'J.K. Rowling'
    },
    {
      title: 'Lord of the Rings',
      author: 'J.R.R. Tolkien'
    },
    {
      title: 'Twilight',
      author: 'Stephanie Meyer'
    }
  ];

  
  // GET requests
  app.get('/', (req, res) => {
    let responseText= 'Welcome to FlixFans!!';
    responseText += '<small>Request at: ' + req.requestTime + '</small>';
    
    res.send(responseText);
  });

  //useing express function to get all satic files in pulic folder
  app.use(express.static('public'));
  
  app.get('/topMovies', (req, res) => {
    res.json(topMovies);
  });


  //error handler  err.stack console logs error
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  // listen for requests on 8080
  const port = 5000;
  app.listen(port, () => {
    console.log('Your app is listening on port 5000.');
  });