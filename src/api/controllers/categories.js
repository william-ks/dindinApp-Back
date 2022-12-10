const db = require("../../database/dbConnect");

const read = async (req, res) => {
  try {
    const response = await db("categories");

    return res.json(response);
  } catch (e) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

module.exports = {
  read,
};
