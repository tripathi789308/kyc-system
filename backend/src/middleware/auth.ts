import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { PassportStatic } from "passport";
import { prisma } from "../db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

export const jwtStrategy = new JwtStrategy(
  jwtOptions,
  async (payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (user) {
        return done(null, { userId: user.id, role: user.assignedRole });
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  },
);
