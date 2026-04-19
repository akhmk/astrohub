import prisma from "../../utils/prisma.js";
import type { UpdateUserInput } from "./users.schema.js";

export class UsersService {
  async getById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firebaseUid: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        photoURL: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async update(id: string, data: UpdateUserInput) {
    // Check username uniqueness if being updated
    if (data.username) {
      const existing = await prisma.user.findUnique({
        where: { username: data.username },
      });
      if (existing && existing.id !== id) {
        throw new Error("Username is already taken");
      }
    }

    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        photoURL: true,
        role: true,
        createdAt: true,
      },
    });
  }
}

export const usersService = new UsersService();
