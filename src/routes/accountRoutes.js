const router = require("express").Router();
const Account = require("../models/Account");

router.post("/transfer", async (req, res) => {
  const { from, to, amount } = req.body;
  const a = await Account.findOne({ name: from });
  const b = await Account.findOne({ name: to });

  a.balance -= amount;
  b.balance += amount;

  await a.save();
  await b.save();
  res.json({ message: "Transfer successful" });
});

module.exports = router;
