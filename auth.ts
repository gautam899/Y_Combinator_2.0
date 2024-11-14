import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user: { name, email, image }, profile }) {
      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
          id: profile?.id,
        });

      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id: profile?.id,
          name,
          username: profile?.login,
          email,
          image,
          bio: profile?.bio || "",
        });
      }
      // console.log("Existing User:", existingUser);

      return true;
    },
    async jwt({ token, account, profile }) {
      // console.log("JWT Callback - Profile:", profile);
      // console.log("JWT Callback - Account:", account);

      if (account && profile) {
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
            id: profile?.id,
          });
        // console.log("JWT Callback - Fetched User:", user);

        token.id = user?._id;
      }
      // console.log("Token ID set to:", token.id);

      return token;
    },
    async session({ session, token }) {
      // console.log("Session Callback - Token:", token);
      Object.assign(session, { id: token.id });
      // console.log("Session after modification:", session);
      return session;
    },
  },
});
