const jwt = require("jsonwebtoken");
const prisma = require("../prisma/prismaClient");

const verificarAutenticacao = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; 

    if (!token) {
        return res.status(401).json({ erro: true, mensagem: "Token não fornecido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await prisma.usuario.findUnique({ where: { id: decoded.id } });

        if (!usuario) {
            return res.status(401).json({ erro: true, mensagem: "Usuário não encontrado" });
        }

        req.usuarioId = usuario.id;
        req.usuario = usuario; 

        next(); 
    } catch (err) {
        return res.status(401).json({ erro: true, mensagem: "Token inválido ou expirado" });
    }
};

module.exports = verificarAutenticacao;
