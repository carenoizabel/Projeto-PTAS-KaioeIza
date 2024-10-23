const PrismaClient = new PrismaClient();

async function main () {
    //insert de usuario
    PrismaClient.usuario.create({
        data: {
            nome: "KAIO E IZA",
            email: "kaioiza@gmail.com",
        },
    });

    console.log("Nova Usuario: " + JSON.stringify
    (novoUsuario));
}
