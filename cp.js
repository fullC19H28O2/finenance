const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");

const router = express.Router();

// 📌 1. Gelir-Gider EKLE (POST)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { type, amount, category, description, date } = req.body;
        const newTransaction = new Transaction({
            userId: req.user.id,
            type,
            amount,
            category,
            description,
            date
        });
        await newTransaction.save();
        res.status(201).json({ message: "Transaction added successfully" });
    } catch (error) {
        console.log("Transaction Add Error:", error);
        res.status(500).json({ error: "Transaction failed" });
    }
});

// 📌 2. Kullanıcının TÜM Gelir-Giderlerini GETİR (GET)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: "Error fetching transactions" });
    }
});

// 📌 3. Belirli Bir İşlemi GÜNCELLE (PUT)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { type, amount, category, description, date } = req.body;
        await Transaction.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { type, amount, category, description, date },
            { new: true }
        );
        res.json({ message: "Transaction updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Update failed" });
    }
});

// 📌 4. Belirli Bir İşlemi SİL (DELETE)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Delete failed" });
    }
});

module.exports = router;