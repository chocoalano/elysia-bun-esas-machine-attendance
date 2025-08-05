// src/middleware/auth.ts
import { PrismaClient } from "@prisma/client";
import type { Elysia } from "elysia";
import { jwtconfig } from "../utils/jwt";

const prisma = new PrismaClient();

export const auth = (app: Elysia) =>
  app
    .use(jwtconfig)
    .derive(async ({ jwt, set, request }) => {
      const authHeader = request.headers.get("authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        set.status = 401;
        throw new Error("Unauthorized: Missing or invalid Authorization header");
      }

      const token = authHeader.split(" ")[1];

      let payload;
      try {
        payload = await jwt.verify(token);
      } catch (error) {
        set.status = 401;
        throw new Error("Unauthorized: Invalid token");
      }

      if (!payload || !payload.id) {
        set.status = 401;
        throw new Error("Unauthorized: Invalid payload");
      }

      const user = await prisma.users.findUnique({
        where: {
          id: Number(payload.id),
        },
        include: {
          user_address: true,
          user_details: true,
          user_employes: true,
          user_families: true,
          user_formal_educations: true,
          user_informal_educations: true,
          user_salaries: true,
          user_work_experiences: true,
          companies: true,
        },
      });

      if (!user) {
        set.status = 401;
        throw new Error("Unauthorized: User not found");
      }

      return {
        user,
      };
    });
