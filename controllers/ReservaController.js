const prisma = require("../prisma/prismaClient");
const router = require("../routes/mesaRoutes");

class ReservaContoller {
    static async registrarReservas(req, res) {
        const { mesaId, n_pessoas } = req.body;
        const data = new Date(req.body.data);

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

        //verificar se a data da reserva é >= hoje

        //verificar se a mesa consegue comportar o numero de pessoas indicado 

        //verificar se a mesa esta livre para a data selecionada

        if (mesa.reservas.lenght > 0) {
            return res.status(400).json({
                erro: true,
                mensagem: "A mesa selecionada já esta reservada para esta data",
            });
        }

        prisma.reserva.create({
            data: {
                data: data,
                n_pessoas: n_pessoas,
                usuario: {
                    connect: {
                        id: mesaId,
                    },
                },

            },
        }).then(() =>{
            return res.status(201).json({
                erro: true,
                mensagem: "Ocorreu um erro ao cadastrar reserva",
            });
        })
        .catch((err)=>{

        })
    }
}

module.exports = ReservaContoller;