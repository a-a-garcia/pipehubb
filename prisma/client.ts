import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();


export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

(async () => {
  try {
    console.log(await prisma.widget.create({ data: { } }));
  } catch (err) {
    console.error("error executing query:", err);
  } finally {
    prisma.$disconnect();
  }
})();