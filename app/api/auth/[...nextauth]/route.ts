import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // Hardcoded admin for simplicity as requested
                // In production, fetch from DB
                const isValid = credentials?.email === "admin@xgboost.io" && credentials?.password === process.env.ADMIN_PASSWORD;

                if (isValid) {
                    return { id: "1", name: "Admin", email: "admin@xgboost.io" };
                }
                return null;
            }
        })
    ],
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login', // Custom login page
    },
    callbacks: {
        async session({ session, token }) {
            return session;
        },
        async jwt({ token, user }) {
            return token;
        }
    },
    secret: process.env.NEXTAUTH_SECRET || 'secret-key-change-me',
});

export { handler as GET, handler as POST };
