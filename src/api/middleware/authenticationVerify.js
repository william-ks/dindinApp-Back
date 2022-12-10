const db = require("../../database/dbConnect");
const jwt = require("jsonwebtoken");

const authenticationVerify = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      mensagem:
        "Para acessar este recurso um token de autenticação válido deve ser enviado.",
    });
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    if (!id) {
      return res.status(400).json({
        message: "Token inválido",
      });
    }

    const response = await db("users").where({ id }).first();

    if (!response) {
      return res
        .status(400)
        .json({ mensagem: "Usuário e/ou senha inválido(s)" });
    }

    const { password, ...user } = response;

    req.user = user;

    next();
  } catch (e) {
    return res.status(400).json({ mensagem: "Usuário e/ou senha inválido(s)" });
  }
};

module.exports = authenticationVerify;
