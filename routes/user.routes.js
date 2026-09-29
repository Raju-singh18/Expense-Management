
const express = require("express");
const { createUser, login, getUsers } = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");


const router = express.Router();

router.post("/register", createUser);
router.post("/login",login);

router.get("/", auth, getUsers);

module.exports = router;
