const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req,res) => {
    try{
        const {name , email , password} = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({error: "Email already in use"});

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({name,email, password:hashedPassword});
        await newUser.save();
        res.status(201).json({message: "User registered succesfully"});
    }catch (error){
        console.log("Registration error: " , error);
        res.status(500).json({error: "Registration failed", details:error.message});
    }
});

router.post("/login",async(req,res)=> {
    try {
        const{email,password}= req.body;

        const user = await User.findOne({ email });
        if(!user) return res.status(400).json({error : "User not found"});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({error :"Invalid credentials"});
        
        //JWR Token
        const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
        
        res.json({token, user: {id:user._id, name: user.name, email: user.email} });
    } catch (error) {
        res.status(500).json({error:"Login Failed"});
    }
});
module.exports= router;