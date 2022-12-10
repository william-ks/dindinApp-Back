require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./api/routes/routes");

const app = express();

const port = 3001;

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(port);
