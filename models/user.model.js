const mongoose = require('mongoose');
const {isEmail} = require('validator')
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    
    email:{
        type : String,
        required:[true,'Email cannot be empty'],
        unique:true, // validation will not work for this we will require err code 
        lowercase:true,
        validate: [isEmail,'Please enter a valid email']
    },
    password:{
        type: String,
        required: [true,'Password cannot be empty'],
        minlength: [6,'Minimum length of password required is 6']
    }

})

// Mongoose fire a function before the data saved to database

userSchema.pre("save", async function (next){
    const salt = await bcrypt.genSalt();

    this.password = await bcrypt.hash(this.password,salt);

    next();
})

// static method to login user

userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email});

    if(user){
        const auth = await bcrypt.compare(password,user.password);

        if(auth){
            return user;
        }

        throw Error("Incorrect password");
    }
    throw Error('Incorrect email');
}


module.exports = mongoose.model("User",userSchema);
