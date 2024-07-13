const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');

const requireAuth = (req,res,next) => {
    const token = req.cookies.jwt;

    // check if the web token exists & is verified

    if(token){
        jwt.verify(token, 'me hu don',(err,decodedToken) => {
            if(err)
            {
                console.log(err.message);
                res.redirect('/login');
            }
            else {
                console.log(decodedToken);
                next();
            }
        })
    }
    else{
        res.redirect('/login');
    }
}



// chekc the currect user

const checkUser = (req,res, next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, 'me hu don', async(err,decodedToken) => {
            if(err)
            {
                console.log(err.message);
                res.locals.user = null;
                // res.redirect('/');
                next();
            }
            else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                // const userData = {
                //     email: user.email
                // }
                res.locals.user = user;
                next();
            }
        })
    } 
    else{
      res.locals.user = null;   
      next();
    }
}

// If the user is logged in access of login and signup pages are denied

const userLoggedIn = (req,res, next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, 'me hu don', async(err,decodedToken) => {
            if(err)
            {
                console.log(err.message);
                res.locals.user = null;
                res.redirect('/login');
                next();
            }
            else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.redirect('/');
                res.locals.user = user;
                next();
            }
        })
    } 
    else{
      res.locals.user = null;   
      next();
    }
}

module.exports = {requireAuth, checkUser, userLoggedIn}