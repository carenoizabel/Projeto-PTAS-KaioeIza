const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class AuthController {
  static async login(req, res) {
  }
  static async cadastro(req, res) {
    const { nome, email, password } = req.body;

    if(!nome || nome.length <6){
        return res.json({
            erro: true,
            mensagem: "O nome deve ter pelo menos 6 caracteres.",
        });
    }

    return res.json({
        erro: false,
        mensagem: "Usuario cadastrado com sucesso!",
        token: "success",
    });
  }
}

module.exports = AuthController;
