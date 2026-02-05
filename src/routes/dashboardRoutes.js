const router = require("express").Router();
const Transaction = require("../models/Transaction");

router.get("/", async (req, res) => {
  const { period } = req.query;
  const now = new Date();
  let start;

  if (period === "weekly")
    start = new Date(now.setDate(now.getDate() - 7));
  else if (period === "monthly")
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  else
    start = new Date(now.getFullYear(), 0, 1);

  const data = await Transaction.aggregate([
    { $match: { createdAt: { $gte: start } } },
    { $group: { _id: "$type", total: { $sum: "$amount" } } }
  ]);

  res.json(data);
});

module.exports = router;
