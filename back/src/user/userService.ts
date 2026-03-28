import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/client";
import bcrypt from "bcrypt";

const adapter = new PrismaMariaDb(`${process.env.DATABASE_URL}`);
const prisma = new PrismaClient({ adapter });
const rounds = Number(process.env.SALT_ROUNDS) || 12;

type User = {
  id?: number;
  name: string;
  password: string;
  role?: string;
};

export async function createUser(user: User) {
  const hashed = await bcrypt.hash(user.password, rounds);

  return prisma.user.create({
    data: {
      name: user.name,
      password: hashed,
    },
  });
}

export function deleteUserById(id: number) {
  return prisma.user.delete({
    where: {
      id: id,
    },
  });
}

export function getUserByName(username: string) {
  return prisma.user.findUnique({
    where: { name: username },
  });
}

export function getUserById(id: number) {
  return prisma.user.findUnique({
    where: { id: id },
  });
}

export async function editUserById(id: number, password: string) {
  const hashed = await bcrypt.hash(password, rounds);
  return prisma.user.update({
    where: {
      id: id,
    },
    data: {
      password: hashed,
    },
  });
}
