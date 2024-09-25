import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import { EmailProvider } from "next-auth/providers/email";
import prisma from "./db";

export const options = {
	providers: [
		EmailProvider({
			server: process.env.EMAIL_SERVER,
			from: process.env.EMAIL_FROM,
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	adapter: PrismaAdapter(prisma),
	session: {
		strategy: "database",
		maxAge: 30 * 24 * 660 * 60,
	},
} satisfies AuthOptions;
