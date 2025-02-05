const prisma = require("../prisma/prismaClient");

class ProfileController{
    static async getPerfil(req, res){
        prisma.usuario = await prisma.usuario.findUnique({
            where: {id: req.usuarioId},
            omit: {password: true},
        });

        //concluir a função
        if(!usuario){
            return res.status(404).json({
                erro: true,
                mensagem: "Usuário não encontrado"
            });
        }
         res.json({
            erro: false,
            mensagem: "Perfil carregado",
            usuario
         });
         }catch(error){
            return res.status(500).json({
                erro: true,
                mensagem: "Erro ao carregar"
            });
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
        });
        
        res.json({
            erro: false,
            mensagem: "Perfil atualizado"
        });
    }catch(erro){
        return res.status(500).json({
            erro: true,
            mensagem: "Erro ao atualizar"
        });
    }
}

