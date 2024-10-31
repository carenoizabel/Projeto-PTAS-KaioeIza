const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

console.log("Prisma Client instanciado.");

module.exports = prisma;