// DEPENDENCIES
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
require('dotenv').config();
const PORT = process.env.PORT||8000;
const DATABASE=process.env.DATABASE;
const MONGO_USER=process.env.MONGO_USER;
const MONGO_PASSWORD=process.env.MONGO_PASSWORD;
const MONGO_BASE_URL=process.env.MONGO_BASE_URL;
const MONGO_URL=`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_BASE_URL}/${DATABASE}?retryWrites=true&w=majority`
app.use(methodOverride("_method"));

// MIDDLEWARE
// body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// static files middleware
app.use(express.static('public'))


app.use(session({
  secret: process.env.SECRET, //some random string
  resave: false,
  saveUninitialized: false
}));

const sessionController = require('./controllers/sessionController.js');
app.use('/sessions',sessionController)

// GET INDEX
app.get('/', (req, res) => {

  res.render('index.ejs', {session: req.session.user});
});


app.use((req, res,next)=>{
  console.log(req.session)
  if(req.session.user){
    next()
  }else{
    res.redirect('/')
  }
})


// CONTROLLERS
// fitting room three
const roomController = require('./controllers/room.js');
app.use('/room', roomController);


const userController = require('./controllers/userControllers.js');
app.use('/users', userController);




// // SEED ROUTE
// // NOTE: Do NOT run this route until AFTER you have a create user route up and running, as well as encryption working!
// const seed = require('./models/seed.js');
// const User = require('./models/users.js');

// app.get('/seedAgents', (req, res) => {
//   // encrypts the given seed passwords
//   seed.forEach((user) => {
//     user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
//   });
//   // seeds the data
//   User.create(seed, (err, createdUsers) => {
//     // logs created users
//     console.log(createdUsers);
//     // redirects to index
//     res.redirect('/');
//   });
// });


// CONNECTIONS
app.listen(PORT, () => {
  console.log('listening on port: ', PORT);
});

mongoose.connect(MONGO_URL, { useNewUrlParser: true });
mongoose.connection.once('open', () => {
    console.log('connected to mongo');
});
