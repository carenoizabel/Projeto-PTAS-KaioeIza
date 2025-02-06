const { PrismaClient } = require('@prisma/client');
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

class AuthController {
  // Cadastro de usuário
  static async cadastro(req, res) {
    try {
      const { nome, email, password } = req.body;

      if (!nome || nome.length < 6) {
        return res.status(422).json({ erro: true, mensagem: "O nome deve ter pelo menos 6 caracteres." });
      }

      if (!email || email.length < 10) {
        return res.status(422).json({ erro: true, mensagem: "O email deve ter pelo menos 10 caracteres." });
      }

      if (!password || password.length < 8) {
        return res.status(422).json({ erro: true, mensagem: "A senha deve ter pelo menos 8 caracteres." });
      }

      // Verifica se o usuário já existe
      const existe = await prisma.usuario.count({ where: { email } });

      if (existe > 0) {
        return res.status(400).json({ erro: true, mensagem: "Já existe um usuário cadastrado com este e-mail." });
      }

      // Criptografar a senha
      const salt = bcryptjs.genSaltSync(8);
      const hashPassword = bcryptjs.hashSync(password, salt);

      // Criar novo usuário
      const usuario = await prisma.usuario.create({
        data: {
          nome,
          email,
          password: hashPassword,
          tipo: "cliente",
        },
      });

      const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo }, process.env.SECRET_KEY, { expiresIn: "1h" });

      return res.status(201).json({ 
        erro: false, 
        mensagem: "Usuário cadastrado com sucesso!", 
        token 
      });

    } catch (error) {
      console.error("Erro no cadastro:", error);
      return res.status(500).json({ erro: true, mensagem: "Erro interno do servidor. " + error.message });
    } finally {
      await prisma.$disconnect();
    }
  }

  // Login de usuário
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(422).json({ erro: true, mensagem: "E-mail e senha são obrigatórios." });
      }

      // Verifica se o usuário existe no banco
      const usuario = await prisma.usuario.findUnique({ where: { email } });

      if (!usuario) {
        return res.status(404).json({ erro: true, mensagem: "Usuário não encontrado." });
      }

      // Comparação da senha criptografada
      const senhaCorreta = await bcryptjs.compare(password, usuario.password);

      if (!senhaCorreta) {
        return res.status(401).json({ erro: true, mensagem: "Senha incorreta." });
      }

      // Criando token de autenticação
      const token = jwt.sign(
        { id: usuario.id, tipo: usuario.tipo }, 
        process.env.SECRET_KEY, 
        { expiresIn: "1h" }
      );

      return res.status(200).json({ 
        erro: false, 
        mensagem: "Login realizado com sucesso!", 
        token,
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo }
      });

    } catch (error) {
      console.error("Erro no login:", error);
      return res.status(500).json({ erro: true, mensagem: "Erro interno do servidor. " + error.message });
    } finally {
      await prisma.$disconnect();
    }
  }

  // Middleware para verificar autenticação do usuário
  static async autenticar(req, res, next) {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return res.status(422).json({ message: "Token não encontrado." });
      }

      jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
        if (err) {
          return res.status(401).json({ message: "Token inválido." });
        }

        req.usuarioId = payload.id;
        req.usuarioTipo = payload.tipo;
        next();
      });
    } catch (error) {
      console.error("Erro na autenticação:", error);
      return res.status(500).json({ erro: true, mensagem: "Erro interno do servidor. " + error.message });
    }
  }

  // Middleware para verificar se o usuário é administrador
  static async verificaPermissaoAdm(req, res, next) {
    try {
      const usuario = await prisma.usuario.findUnique({ where: { id: req.usuarioId } });

      if (!usuario) {
        return res.status(404).json({ erro: true, mensagem: "Usuário não encontrado." });
      }

      if (usuario.tipo === "adm") {
        next();
      } else {
        return res.status(401).json({ erro: true, mensagem: "Você não tem permissão para acessar esse recurso!" });
      }
    } catch (error) {
      console.error("Erro na verificação de permissão:", error);
      return res.status(500).json({ erro: true, mensagem: "Erro interno do servidor. " + error.message });
    }
  }
}

module.exports = AuthController;
