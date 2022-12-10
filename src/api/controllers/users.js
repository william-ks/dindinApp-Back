const bcrypt = require("bcrypt");
const db = require("../../database/dbConnect");

const create = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const emailExists = await db("users").where({ email }).first();

    if (emailExists) {
      return res.status(400).json({
        message: "Já existe usuário cadastrado com o e-mail informado.",
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: encryptedPassword,
    };

    await db("users").insert({ ...newUser });

    return res.status(201).end();
  } catch (e) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

const update = async (req, res) => {
  const { id: userId } = req.user;
  const { name, email, password } = req.body;

  try {
    const emailExists = db("users")
      .where({ email })
      .andWhere("id", "!=", userId)
      .first();

    if (emailExists) {
      return res.json({ message: "O email já existe no banco de dados." });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUserData = {
      name,
      email,
      password: encryptedPassword,
    };

    await db("users")
      .update({ ...newUserData })
      .where({ id: userId });

    return res.status(204).end();
  } catch (e) {
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};

const detail = async (req, res) => {
  const { id: userId } = req.user;

  try {
    const response = await db("users").where({ id: userId });

    const { password: _, ...user } = response;

    return res.json(user);
  } catch (e) {
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};

module.exports = {
  create,
  update,
  detail,
};
