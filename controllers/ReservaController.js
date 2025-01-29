const prisma = require("../prisma/prismaClient");
const router = require("../routes/mesaRoutes");
const verificarAutenticacao = require("../middlewares/verificarAutenticacao");
const verificarAdmin = require("../middlewares/verificarAdmin");

class ReservaController {
    // Registra uma nova reserva
    static async registrarReservas(req, res) {
        const { mesaId, n_pessoas } = req.body;
        const data = new Date(req.body.data);

        // Verifica se a data é maior ou igual à data atual
        try {
            if (data < new Date()) {
                return res.status(400).json({
                    erro: true,
                    mensagem: "A data da reserva deve ser maior ou igual à data atual.",
                });
            }

            // Busca a mesa e as reservas para a data selecionada
            const mesa = await prisma.mesa.findUnique({
                where: { id: mesaId },
                include: {
                    reservas: {
                        where: {
                            data: data,
                            status: true,
                        },
                    },
                },
            });

            // Verifica se a mesa foi encontrada
            if (!mesa) {
                return res.status(404).json({
                    erro: true,
                    mensagem: "Mesa não encontrada.",
                });
            }

            // Verifica se a mesa comporta o número de pessoas indicado
            if (mesa.n_lugares < n_pessoas) {
                return res.status(400).json({
                    erro: true,
                    mensagem: "O número de pessoas excede a capacidade da mesa.",
                });
            }

            // Verifica se a mesa está reservada para a data selecionada
            if (mesa.reservas.length > 0) {
                return res.status(400).json({
                    erro: true,
                    mensagem: "A mesa selecionada já está reservada para esta data.",
                });
            }

            // Cria a reserva
            const reserva = await prisma.reserva.create({
                data: {
                    data: data,
                    n_pessoas: n_pessoas,
                    usuario: {
                        connect: {
                            id: req.usuarioId, // ID do usuário autenticado
                        },
                    },
                    mesa: {
                        connect: {
                            id: mesaId, // Conecta a mesa à reserva
                        },
                    },
                },
            });

            return res.status(201).json({
                reserva,
                mensagem: "Reserva realizada com sucesso.",
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                erro: true,
                mensagem: "Erro ao realizar a reserva.",
            });
        }
    }

    // Ver as reservas do usuário autenticado
    static async verMinhasReservas(req, res) {
        const reservas = await prisma.reserva.findMany({
            where: { usuarioId: req.usuarioId },
            include: { mesa: true },
        });
        return res.json({ reservas });
    }

    // Cancelar uma reserva
    static async cancelarReserva(req, res) {
        const { reservaId } = req.params;
        const reserva = await prisma.reserva.findUnique({
            where: { id: reservaId },
            include: { usuario: true },
        });

        // Verifica se o usuário autenticado é o dono da reserva
        if (reserva.usuario.id !== req.usuarioId) {
            return res.status(403).json({
                erro: true,
                mensagem: "Você não pode cancelar essa reserva.",
            });
        }

        // Verifica se a data da reserva é hoje ou futura
        if (new Date(reserva.data) < new Date()) {
            return res.status(400).json({
                erro: true,
                mensagem: "Não é possível cancelar uma reserva para uma data passada.",
            });
        }

        // Cancela a reserva
        await prisma.reserva.update({
            where: { id: reservaId },
            data: { status: false },  // Cancelamento da reserva
        });

        return res.status(200).json({ erro: false, mensagem: "Reserva cancelada com sucesso." });
    }

    // Buscar reservas por data
    static async buscarReservasPorData(req, res) {
        const { data } = req.query; // Data recebida como parâmetro na query string

        const reservas = await prisma.reserva.findMany({
            where: { data: { gte: new Date(data) } },  // Busca reservas a partir da data
            include: { mesa: true, usuario: true },   // Inclui as mesas e os usuários associados
        });

        return res.json({ reservas });
    }
}

module.exports = ReservaController;
