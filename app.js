const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const router = require('./routes/authRoutes.js')
const cookieParser = require('cookie-parser');
const {requireAuth, checkUser} = require('./middlewares/authMiddleware.js');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json()); // converts the form data to the javascript object and attaches that object to req object 
app.use(cookieParser());


// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = process.env.MONGODB_URL;
const PORT = process.env.PORT;
mongoose.connect(dbURI)
  .then((result) => app.listen(PORT,()=> {console.log(`Server running on http://localhost:3000`);}))
  .catch((err) => console.log(err));

// routes

app.get('*',checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',requireAuth , (req, res) => res.render('smoothies'));

app.use(router);


// cookies












// app.get('/write-cookie',(req,res) => {

//   // res.setHeader("Set-Cookie","newUser = true");
//   res.cookie("newUser" , false);
//   res.cookie("newEmploye" , true, {maxAge: 1000*60*60*24, httpOnly:true });
//   res.send("New cookie is there");
// })

// app.get('/read-cookie', (req,res) => {
//     console.log(req.cookies);
//     res.send(req.cookies)
// })