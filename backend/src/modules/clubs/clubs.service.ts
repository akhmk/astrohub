import prisma from "../../utils/prisma.js";
import { paginate, paginatedResponse, type PaginationQuery } from "../../utils/pagination.js";
import type { CreateClubInput, CreateClubPostInput } from "./clubs.schema.js";

const clubSelect = {
  id: true,
  name: true,
  description: true,
  imageURL: true,
  isApproved: true,
  createdAt: true,
  owner: {
    select: { id: true, username: true, firstName: true, lastName: true, photoURL: true },
  },
  memberships: {
    select: { userId: true },
  },
  _count: { select: { memberships: true, posts: true } },
};

export class ClubsService {
  async listClubs(query: PaginationQuery, isAdmin: boolean = false) {
    const where = isAdmin ? {} : { isApproved: true };

    const [data, total] = await Promise.all([
      prisma.club.findMany({
        where,
        ...paginate(query),
        orderBy: { createdAt: "desc" },
        select: clubSelect,
      }),
      prisma.club.count({ where }),
    ]);
    return paginatedResponse(data, total, query);
  }

  async getClub(id: string) {
    return prisma.club.findUnique({
      where: { id },
      select: clubSelect,
    });
  }

  async createClub(ownerId: string, data: CreateClubInput) {
    // Create club and auto-join the owner
    const club = await prisma.club.create({
      data: {
        ...data,
        owner: { connect: { id: ownerId } },
        memberships: {
          create: { user: { connect: { id: ownerId } } },
        },
      } as any,
      select: clubSelect,
    });
    return club;
  }

  async joinClub(clubId: string, userId: string) {
    // Check if already a member
    const existing = await prisma.clubMembership.findUnique({
      where: { userId_clubId: { userId, clubId } },
    });
    if (existing) {
      throw new Error("Already a member of this club");
    }

    return prisma.clubMembership.create({
      data: { userId, clubId },
    });
  }

  async leaveClub(clubId: string, userId: string) {
    // Check club ownership — owners can't leave
    const club = await prisma.club.findUnique({
      where: { id: clubId },
      select: { ownerId: true },
    });
    if (club?.ownerId === userId) {
      throw new Error("Club owners cannot leave their own club");
    }

    return prisma.clubMembership.delete({
      where: { userId_clubId: { userId, clubId } },
    });
  }

  async isMember(clubId: string, userId: string): Promise<boolean> {
    const membership = await prisma.clubMembership.findUnique({
      where: { userId_clubId: { userId, clubId } },
    });
    return !!membership;
  }

  // Club posts
  async listClubPosts(clubId: string, query: PaginationQuery) {
    const [data, total] = await Promise.all([
      prisma.clubPost.findMany({
        where: { clubId },
        ...paginate(query),
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: {
            select: { id: true, username: true, firstName: true, lastName: true, photoURL: true },
          },
        },
      }),
      prisma.clubPost.count({ where: { clubId } }),
    ]);
    return paginatedResponse(data, total, query);
  }

  async createClubPost(clubId: string, authorId: string, data: CreateClubPostInput) {
    return prisma.clubPost.create({
      data: { ...data, club: { connect: { id: clubId } }, author: { connect: { id: authorId } } } as any,
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: { id: true, username: true, firstName: true, lastName: true, photoURL: true },
        },
      },
    });
  }

  async approveClub(clubId: string) {
    const club = await prisma.club.findUnique({ where: { id: clubId } });
    if (!club) throw new Error("Club not found");

    return prisma.club.update({
      where: { id: clubId },
      data: { isApproved: true },
      select: clubSelect,
    });
  }
}

export const clubsService = new ClubsService();
