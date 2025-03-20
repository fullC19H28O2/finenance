const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");

const router = express.Router();


router.post("/",authMiddleware,async (req,res) => {
    try {
        const {type , amount, category, description , date } = req.body;
        const newTransaction = new Transaction({
            userId: req.user.id,
            type,
            amount,
            category,
            description,
            date
        });
        await newTransaction.save();
        res.status(201).json({message : "Transaction added succesfully" });
    } catch (error) {
        console.log("Transaction Add Error: ", error);
        res.status(500).json({error: "Transaction failed"});
    }
});

router.get("/", authMiddleware,async (req,res) => {
    try {
        const transactions = await Transaction.find({userId : req.user.id}).sort({date : -1});
    } catch (error) {
        res.status(500).json({ error : "Error fetching transactions"});
    }
});

router.put("/:id", authMiddleware, async (req,res) => {
    try {
        const {type,amount,category,description,date } = req.body;
        await Transaction.findOneAndUpdate(
            { _id: req.params.id , userId: req.user.id},
            { type, amount,category,description,date},
            {new: true}
      );
    } catch (error) {
        res.status(500).json({ error: "Update failed"});
    }
});


router.delete("/:id",authMiddleware, async (req,res) => {
    try {
        await Transaction.findOneAndDelete({_id: req.params.id, userId: req.user.id});
        res.json({message : "Transaction deleted succesfully"});
    } catch (error) {
        res.status(500).json({error:"Delete failed"});
        
    }
});
module.exports = router;
