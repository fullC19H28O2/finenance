const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

router.get("/profile", authMiddleware,async(req,res)=>
    {
        try {
            const user = await User.findById(req.user.id).select("-password");
            res.json(user);
        } catch (error) {
            res.status(500).json({  error: "Error fetching profile"});
        }
    });
    module.exports= router;