const express = require("express");
const router = express.Router();

const {
  create,
  read,
  readOne,
  update,
  del,
} = require("../controllers/transactions");

const authenticationVerify = require("../middleware/authenticationVerify");

router.use(authenticationVerify);

router.post("/transactions", create);
router.get("/transactions", read);
router.get("/transactions/:id", readOne);
router.put("/transactions/:id", update);
router.delete("/transactions/:id", del);

module.exports = router;
