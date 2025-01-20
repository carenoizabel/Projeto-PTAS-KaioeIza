const prisma = require("../prisma/prismaClient");

class ProfileController{
    static async getPerfil(req, res){
        prisma.usuario = await prisma.usuario.findUnique({
            where: {id: req.usuarioId},
            omit: {password: true},
        });

        //concluir a função
    }


    static async atualizarPerfil(req, res){
        prisma.usuario.update({
            where: {
                id: req.usuario.Id
            },
            data: {
                email: email,
                nome: nome,
            },
        })
    }
}