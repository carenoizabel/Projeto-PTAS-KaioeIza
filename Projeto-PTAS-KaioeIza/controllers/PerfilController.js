const prisma = require("../prisma/prismaClient");

class ProfileController{
    static async visualizar(req, res) {
   const usuario = await prisma.usuario.findUnique({
    where: {id: req.usuarioId},
    omit: {password: true},
   });

  }
    static async atualizar(req, res) {}
}

module.exports = PerfilController;