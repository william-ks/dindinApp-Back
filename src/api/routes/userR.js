const express = require("express");
const router = express.Router();

const authenticationVerify = require("../middleware/authenticationVerify");

const { create, update, detail } = require("../controllers/users");
const login = require("../controllers/login");

router.post("/user", create);
router.post("/login", login);

router.use(authenticationVerify);

router.put("/user", update);
router.get("/user", detail);

module.exports = router;
