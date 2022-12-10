const db = require("../../database/dbConnect");

const create = async (req, res) => {
  const { type, description, value, date, category_id } = req.body;
  const { id: userId } = req.user;

  if (!type || !description || !value || !date || !category_id) {
    return res
      .status(400)
      .json({ message: "Todos os campos obrigatórios devem ser informados." });
  }

  if (type.toLowerCase() !== "entrada" && type.toLowerCase() !== "saida") {
    return res.status(400).json({ message: "O tipo informado é inválido." });
  }

  try {
    const response = await db("categories").where({ id: category_id });

    if (!response) {
      return res.status(400).json({
        message: "A categoria informada é inválida.",
      });
    }

    const newTransaction = {
      type,
      description,
      value,
      date,
      category_id,
      user_id: userId,
    };

    await db("transactions").insert({ ...newTransaction });

    return res.status(201).end();
  } catch (e) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

const read = async (req, res) => {
  const { id: userId } = req.user;

  try {
    const response = await db("transactions")
      .where("transactions.user_id", "=", userId)
      .leftJoin("categories", "categories.id", "=", "transactions.category_id")
      .select("transactions.*", "categories.name as category_name");

    let entrada = 0;
    let saida = 0;
    response.forEach((transaction) => {
      if (transaction.type === "entrada") {
        entrada += transaction.value;
      } else {
        saida += transaction.value;
      }
    });

    const balance = {
      entrada,
      saida,
      result: entrada - saida,
    };

    return res.json({
      balance,
      transactions: response,
    });
  } catch (e) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

const readOne = async (req, res) => {
  const { id: idToFind } = req.params;

  if (!Number(idToFind)) {
    return res.status(400).json({ message: "Parametro inválido" });
  }

  try {
    const response = await db("transactions")
      .where("transactions.user_id", "=", userId)
      .andWhere("transactions.id", "=", idToFind)
      .leftJoin("categories", "categories.id", "=", "transactions.category_id")
      .select("transactions.*", "categories.name")
      .first();

    if (!response) {
      return res.status(404).json({ message: "Transação não foi encontrada." });
    }

    return res.json(response);
  } catch (e) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

const update = async (req, res) => {
  const { type, description, value, date, category_id } = req.body;
  const { id: idToUpdate } = req.params;
  const { id: userId } = req.user;

  if (!Number(idToUpdate)) {
    return res.status(400).json({ message: "Parametro inválido" });
  }

  try {
    const response = await db("users")
      .where({
        id: idToUpdate,
        user_id: userId,
      })
      .first();

    if (!response) {
      return res.status(404).json({ message: "Esse registro não existe." });
    }

    const dataToUpdate = { type, description, value, date, category_id };

    await db("transactions")
      .update({ ...dataToUpdate })
      .where({
        id: idToUpdate,
        user_id: userId,
      });

    return res.status(204).end();
  } catch (e) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

const del = async (req, res) => {
  const { id: idToDel } = req.params;
  const { id: userId } = req.user;

  try {
    const validateIdToDel = await db("transactions")
      .where({
        id: idToDel,
        user_id: userId,
      })
      .first();

    if (!validateIdToDel)
      return res.status(404).json({ message: "Transação não encontrada." });

    await db("transactions").del().where({ id: idToDel, user_id: userId });

    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

module.exports = {
  create,
  read,
  readOne,
  update,
  del,
};
