const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
    const errors = {email:"", password: ""}
    console.log(err.message, err.code);

    // to check email 
    if(err.message === "Incorrect password")
    {
        errors.password = "Entered Incorrect Password";
        return errors;
    }
    
    // to check email 
    if(err.message === "Incorrect email")
    {
       errors.email = "Entered Email Does not exists ";
       return errors;

    }

    // to check duplicate key errors
    
    if(err.code === 11000)
    {
        errors.email = "Account Already Exists with this username";
        return errors;
    }

    if(err.message.includes('User validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
        })
        return errors;
    }
}

// create jwt token
const maxAge = 3 * 24 * 60 * 60 ; // 3 days in seconds
const createToken = (id) => {
    return jwt.sign({id},"me hu don",{
        expiresIn: maxAge
    });

}

module.exports.signup_get = (req,res) => {
    res.render('signup');
}

module.exports.login_get = (req,res) => {
    
    res.render('login');
}
 
module.exports.signup_post = async(req,res) => {
    const {email , password} = req.body;
    try {
       const user = await User.create({  email, password })

       const token = createToken(user._id);

       res.cookie('jwt',token, {httpOnly:true, maxAge: maxAge * 1000});


        
        res.status(201).json({user: user._id}); 

    } catch (err) {
       const errors =  handleErrors(err);
        res.status(401).send({errors}) 
    }
}
 
module.exports.login_post = async(req,res) => {
    const {email , password} = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt',token, {httpOnly:true, maxAge: maxAge * 1000});

        res.status(200).json({ user: user._id })
        
    } catch (err) {
        console.log(err.message ,"  message");
        const errors = handleErrors(err);
        res.status(400).json({errors})
    }
}
 
module.exports.logout_get = (req,res)=> {
    res.cookie('jwt',"",{maxAge: 1});

    res.redirect('/');
}