const prisma = require("../prisma/prismaClient");

class ProfileController {
    // Método para obter o perfil
    static async getPerfil(req, res) {
        try {
            const usuario = await prisma.usuario.findUnique({
                where: { id: req.usuarioId },
            });

            if (!usuario) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }

            // Removendo o campo de senha
            const { password, ...usuarioSemSenha } = usuario;

            res.status(200).json(usuarioSemSenha);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao buscar o perfil" });
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

            res.status(200).json(usuarioAtualizado);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao atualizar o perfil" });
        }
    }
}

module.exports = ProfileController;
