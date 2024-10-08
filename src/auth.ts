import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient, UserRole } from "@prisma/client";
import authConfig from "./auth.config";
import { getUserById } from "./data/user";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";

declare module "next-auth" {
	interface Session {
		user: {
			role: UserRole;
			isTwoFactorEnabled: boolean;
			isOAuth: boolean;
		} & DefaultSession["user"];
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		role: UserRole;
		isTwoFactorEnabled: boolean;
		isOAuth: boolean;
	}
}

const prisma = new PrismaClient();

export const { auth, handlers, signIn, signOut } = NextAuth({
	pages: {
		signIn: "/auth/login",
		error: "/auth/error",
	},
	events: {
		async linkAccount({ user }) {
			await db.user.update({
				where: {
					id: user.id,
				},
				data: { emailVerified: new Date() },
			});
		},
	},
	callbacks: {
		async signIn({ user, account }) {
			if (account?.provider !== "credentials") return true;

			const existingUser = await getUserById(user.id || "");

			if (!existingUser?.emailVerified) return false;

			if (existingUser.isTwoFactorEnabled) {
				const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

				if (!twoFactorConfirmation) return false;

				await db.twoFactorConfirmation.delete({
					where: { id: twoFactorConfirmation.id },
				});
			}

			return true;
		},
		async session({ token, session }) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}

			if (token.role && session.user) {
				session.user.role = token.role;
			}
			if (session.user) {
				session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
			}

			if (session.user) {
				session.user.name = token.name;
				session.user.email = token.email as string;
				session.user.isOAuth = token.isOAuth;
			}

			return session;
		},
		async jwt({ token }: { token: JWT }) {
			if (!token.sub) return token;

			const existingUser = await getUserById(token.sub);

			if (!existingUser) return token;

			const existingAccount = await getUserById(token.sub);

			token.isOAuth = !!existingAccount;
			token.name = existingUser.name;
			token.email = existingUser.email;
			token.role = existingUser.role;
			token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

			return token;
		},
	},
	adapter: PrismaAdapter(prisma),
	session: { strategy: "jwt" },
	...authConfig,
});
