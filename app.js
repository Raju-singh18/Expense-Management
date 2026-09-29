
const express = require("express");
const userRoutes = require("./routes/user.routes");
const expenseRoutes = require("./routes/expense.routes");
const errorHandler = require("./middleware/error.middleware");


const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);

app.use(errorHandler);

module.exports = app;

