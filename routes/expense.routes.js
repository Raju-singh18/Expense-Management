
const express = require("express");
const auth = require("../middleware/auth.middleware");
const { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense } = require("../controllers/expense.controller");

const router = express.Router();

router.use(auth);

router.post("/", createExpense);
router.get("/", getExpenses);
router.get("/:id", getExpenseById);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;