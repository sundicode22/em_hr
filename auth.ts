import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { loginSchema } from "@/lib/schemas/login.schema";
import { authConfig } from "@/auth.config";
import { db } from "@/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";
import { validateLocalCredentials } from "@/server/services/auth.service";
import {
  assignRoleToUser,
  getUserPermissions,
  getUserRoles,
} from "@/server/services/permission.service";
import { ROLES } from "@/types/permissions";
import type { AppJwt } from "@/types/next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "jwt" },
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await validateLocalCredentials(
          parsed.data.email,
          parsed.data.password,
        );
        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.id) {
        const roles = await getUserRoles(user.id);
        if (roles.length === 0) {
          await assignRoleToUser(user.id, ROLES.USER);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      const appToken = token as AppJwt;
      if (user?.id) {
        appToken.id = user.id;
        appToken.roles = await getUserRoles(user.id);
        appToken.permissions = await getUserPermissions(user.id);
      } else if (appToken.id) {
        appToken.roles = await getUserRoles(appToken.id);
        appToken.permissions = await getUserPermissions(appToken.id);
      }
      return appToken;
    },
    async session({ session, token }) {
      const appToken = token as AppJwt;
      if (session.user && appToken.id) {
        session.user.id = appToken.id;
        session.user.roles = appToken.roles ?? [];
        session.user.permissions = appToken.permissions ?? [];

        const [dbUser] = await db
          .select()
          .from(users)
          .where(eq(users.id, appToken.id))
          .limit(1);

        if (dbUser) {
          session.user.email = dbUser.email;
          session.user.name = dbUser.name;
          session.user.image = dbUser.image;
        }
      }
      return session;
    },
  },
});
