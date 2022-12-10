const db = require("../../database/dbConnect");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await db("users").where({ email }).first();

    if (!response) {
      return res.status(400).json({ message: "Email ou senha inválidos" });
    }

    const { password: userPass, ...user } = response;

    const correctPassValidation = await bcrypt.compare(password, userPass);

    if (!correctPassValidation) {
      return res.status(400).json({ message: "Email ou senha inválidos" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    return res.json({
      user,
      token,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

module.exports = login;
