require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./api/routes/routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(process.env.PORT);
