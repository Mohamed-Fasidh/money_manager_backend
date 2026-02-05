const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

/* =========================
   GET TRANSACTIONS (FILTERS)
   ========================= */
router.get("/", async (req, res) => {
  try {
    const { startDate, endDate, category, division } = req.query;

    let filter = {};

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (category) filter.category = category;
    if (division) filter.division = division;

    const transactions = await Transaction.find(filter).sort({
      createdAt: -1,
    });

    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
});

/* =========================
   ADD TRANSACTION
   ========================= */
router.post("/", async (req, res) => {
  try {
    const transaction = new Transaction({
      type: req.body.type, // income | expense
      amount: req.body.amount,
      category: req.body.category,
      division: req.body.division, // Personal | Office
      account: req.body.account || "Cash", // ✅ IMPORTANT FIX
      description: req.body.description,
      createdAt: req.body.createdAt || new Date(),
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Transaction not saved" });
  }
});

/* =========================
   EDIT TRANSACTION (12 HOURS)
   ========================= */
router.put("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    const diff = Date.now() - new Date(transaction.createdAt).getTime();
    const hours = diff / (1000 * 60 * 60);

    if (hours > 12) {
      return res.status(403).json({ message: "Edit time expired" });
    }

    Object.assign(transaction, req.body);
    await transaction.save();

    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Update failed" });
  }
});

/* =========================
   ACCOUNT TRANSFER
   ========================= */
router.post("/transfer", async (req, res) => {
  const { fromAccount, toAccount, amount, date } = req.body;

  if (!fromAccount || !toAccount || !amount) {
    return res.status(400).json({ error: "Missing fields" });
  }

  if (fromAccount === toAccount) {
    return res
      .status(400)
      .json({ error: "From and To accounts cannot be same" });
  }

  if (amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  try {
    // Expense from FROM account
    const expenseTxn = new Transaction({
      type: "expense",
      amount,
      category: "Transfer",
      division: "Personal",
      account: fromAccount,
      description: `Transfer to ${toAccount}`,
      createdAt: date || new Date(),
    });

    // Income to TO account
    const incomeTxn = new Transaction({
      type: "income",
      amount,
      category: "Transfer",
      division: "Personal",
      account: toAccount,
      description: `Transfer from ${fromAccount}`,
      createdAt: date || new Date(),
    });

    await expenseTxn.save();
    await incomeTxn.save();

    res.json({ message: "Transfer successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Transfer failed" });
  }
});

module.exports = router;
