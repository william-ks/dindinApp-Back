const express = require("express");
const router = express.Router();

const userR = require("./userR");
const transactionsR = require("./transactionsR");
const categoriesR = require("./categoriesR");

router.use(userR);
router.use(transactionsR);
router.use(categoriesR);

module.exports = router;
