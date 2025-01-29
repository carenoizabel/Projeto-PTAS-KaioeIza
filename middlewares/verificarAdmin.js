const verificarAdmin = async (req, res, next) => {
    const usuario = req.usuario; 

    if (!usuario || !usuario.isAdmin) {
        return res.status(403).json({ erro: true, mensagem: "Acesso negado. Somente administradores podem acessar este recurso." });
    }

    next(); 
};

module.exports = verificarAdmin;
