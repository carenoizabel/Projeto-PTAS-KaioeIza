const prisma = require("../prisma/prismaClient");

class MesaController {
    static async novaMesa(req, res) {
        const { codigo, n_lugares } = req.body; 
        try {

            const novaMesa = await prisma.mesa.create({
                data: {
                    codigo: codigo.toString(),
                    n_lugares: parseInt(n_lugares),
                },
            });
            res.status(201).json({
                mensagem: "Mesa criada com sucesso!",
                erro: false,
                mesa: novaMesa,
            });
        } catch (error) {
            console.error("Erro ao criar mesa:", error);
            res.status(500).json({
                mensagem: "Ocorreu um erro ao criar a mesa",
                erro: true,
                detalhe: error.message,
            });
        }
    }
    

    static async getMesa(req, res) {
        const { id } = req.params;
        try {
            const mesa = await prisma.mesa.findUnique({
                where: { id: parseInt(id) },
            });
            if (!mesa) {
                return res.status(404).json({
                    mensagem: "mesa não encontrada",
                    erro: true,
                });
            }
            res.json({
                mensagem: "mesa encontrada",
                erro: false,
                mesa: mesa,
            });
        } catch (error) {
            res.status(500).json({
                mensagem: "Ocorreu um erro",
                erro: true,
            });
        }
    }

    static async getMesaDisponibilidade(req, res) {
        try {
            console.log("requisição recebida:", req.body);

            const { data } = req.body;

            if (!data) {
                console.error("Erro: Nenhuma data foi enviada.");
                return res.status(400).json({ mensagem: "A data é obrigatória.", erro: true });
            }

            const dataInicio = new Date(data);
            console.log("Data convertida:", dataInicio);

            if (isNaN(dataInicio.getTime())) {
                console.error("Erro: Formato de data inválido.");
                return res.status(400).json({ mensagem: "Formato de data inválido.", erro: true });
            }

            const mesas = await prisma.mesa.findMany({
                include: {
                    reservas: {
                        where: {
                            data: dataInicio,
                            status: true,
                        },
                    },
                },
            });

            if (mesas.length === 0) {
                return res.status(404).json({
                    mensagem: "Nenhuma mesa disponível encontrada para a data especificada.",
                    erro: true,
                });
            }

            console.log("mesas encontradas:", mesas);

            return res.json({
                mensagem: "mesas encontradas com sucesso!",
                erro: false,
                mesas,
            });



        } catch (error) {
            console.error("Erro ao buscar mesas:", error);
            return res.status(500).json({
                mensagem: "Ocorreu um erro ao buscar as mesas.",
                erro: true,
                detalhe: error.message,
            });
        }
    }

    static async getMesas(req, res) {
        try {
            const mesas = await prisma.mesa.findMany();
            res.json({
                erro: false,
                mensagem: "Mesas encontradas com sucesso!",
                mesas: mesas,
            });


        } catch (error) {
            res.status(500).json({
                erro: true,
                mensagem: "Ocorreu um erro ao buscar as mesas.",
            });
        }
    }

    static async atualizarMesas(req, res) {

        const { id, numero, lugares } = req.body;
        if (!id || !numero || !lugares) {
            return res.status(400).json({
                erro: true,
                mensagem: 'Dados inválidos',
            });
        }


    
        try {
            await prisma.mesa.update({
                where: { id: parseInt(id) },
                data: { numero, lugares: parseInt(lugares) },
            });

            return res.status(200).json({
                erro: false,
                mensagem: "Mesa atualizada com sucesso!",
            });


        } catch (error) {
            res.status(500).json({
                erro: true,
                mensagem: "Ocorreu um erro ao atualizar a mesa",
            });
        }
    }
}



module.exports = MesaController;