
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors({
  origin:'*'
}));
app.use(express.json());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch((err) => console.error(err));

app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/accounts", require("./routes/accountRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

app.listen(process.env.PORT, ()=>console.log("Server running"));
