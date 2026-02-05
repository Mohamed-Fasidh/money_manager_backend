const router = require("express").Router();
const Transaction = require("../models/Transaction");

router.get("/", async (req, res) => {
  const data = await Transaction.aggregate([
    { $group: { _id: "$category", total: { $sum: "$amount" } } }
  ]);
  res.json(data);
});

module.exports = router;
