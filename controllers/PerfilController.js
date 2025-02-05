const prisma = require("../prisma/prismaClient");

class ProfileController {
    // Método para obter o perfil
    static async getPerfil(req, res) {
        try {
            const usuario = await prisma.usuario.findUnique({
                where: { id: req.usuarioId },
            });

            // Concluir a função
            if (!usuario) {
                return res.status(404).json({
                    erro: true,
                    mensagem: "Usuário não encontrado"
                });
            }

            // Removendo o campo de senha
            const { password, ...usuarioSemSenha } = usuario;

            res.status(200).json({
                erro: false,
                mensagem: "Perfil carregado",
                usuario: usuarioSemSenha
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                erro: true,
                mensagem: "Erro ao carregar"
            });
        }
    }

    // Método para atualizar o perfil
    static async atualizarPerfil(req, res) {
        const { email, nome } = req.body;

        if (!email || !nome) {
            return res.status(400).json({ error: "Email e nome são obrigatórios" });
        }

        try {
            const usuarioAtualizado = await prisma.usuario.update({
                where: { id: req.usuarioId },
                data: { email, nome },
            });

            res.json({
                erro: false,
                mensagem: "Perfil atualizado",
                usuario: usuarioAtualizado
            });
        } catch (erro) {
            return res.status(500).json({
                erro: true,
                mensagem: "Erro ao atualizar"
            });
        }
    }
}

module.exports = ProfileController;
