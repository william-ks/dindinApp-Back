const express = require("express");
const router = express.Router();

const { read } = require("../controllers/categories");
const authenticationVerify = require("../middleware/authenticationVerify");

router.use(authenticationVerify);

router.get("/categories", read);

module.exports = router;
