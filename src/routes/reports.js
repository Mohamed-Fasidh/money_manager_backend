router.get("/category-summary", async (req, res) => {
  const data = await Transaction.aggregate([
    {
      $group: {
        _id: "$category",
        income: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
          },
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
          },
        },
      },
    },
  ]);

  res.json(data);
});
