import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

module.exports.getShops = async (req: any, res: any) => {
  const shops = await prisma.shop.findMany();
  return res.json(shops);
};
