const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const usuario = await prisma.usuario.create({
        data: {
            nome: 'Iza',
            email: 'iza@ifms.com',
            password: 'izinha@ifms',
            tipo: 'cliente',
        },
    });

    console.log('Novo Usuário: ' + JSON.stringify(usuario));

    const usuarios = await prisma.usuario.findMany();
    console.log('Usuários: ');
    console.log(usuarios);
}


main();
