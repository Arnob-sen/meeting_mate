import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
          );

          const user = res.data;
          if (user && user.access_token) {
            return {
              id: user.user.id,
              name: user.user.name,
              email: user.user.email,
              image: user.user.avatar,
              accessToken: user.access_token,
            };
          }
          return null;
        } catch (_error) {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        console.log("NextAuth: Starting sync for Google user:", user.email);
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google-sync`,
            {
              email: user.email,
              firstName: user.name?.split(" ")[0] || "",
              lastName: user.name?.split(" ").slice(1).join(" ") || "",
              picture: user.image,
              accessToken: account.access_token,
            },
          );

          if (res.data && res.data.access_token) {
            console.log("NextAuth: Sync successful for:", user.email);
            (user as any).accessToken = res.data.access_token;
            return true;
          }
          console.warn(
            "NextAuth: Sync failed (no token returned) for:",
            user.email,
          );
          return false;
        } catch (error: any) {
          console.error(
            "NextAuth: Error syncing Google user:",
            error.response?.data || error.message,
          );
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken;
      session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
