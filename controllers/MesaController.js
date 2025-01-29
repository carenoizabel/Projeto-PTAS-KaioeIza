const prisma = require("../prisma/prismaClient");

class MesaController{
    static async novaMesa(req,res){
        return res.json({mensagem: "acessou o cadastro de mesa"});
    }
}

module.exports = MesaController;