const router = require("express").Router();
const Transaction = require("../models/Transaction");

router.get("/category-summary", async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      {
        $group: {
          _id: "$category",
          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
            }
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
            }
          }
        }
      }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/:type", async (req, res) => {
  const { type } = req.params;

  let groupId;
  if (type === "weekly") groupId = { $week: "$createdAt" };
  if (type === "monthly") groupId = { $month: "$createdAt" };
  if (type === "yearly") groupId = { $year: "$createdAt" };

  const data = await Transaction.aggregate([
    {
      $group: {
        _id: groupId,
        income: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
          }
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
          }
        }
      }
    }
  ]);

  res.json(data);
});

module.exports = router;
