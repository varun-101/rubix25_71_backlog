import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getServerSession } from "next-auth/next";
import { writeClient } from "@/sanity/lib/write-client";
import { USER_BY_GOOGLE_ID } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account, profile }) {
            if (!profile) return false;

            try {
                const googleId = profile.sub;
                const existingUser = await client.fetch(USER_BY_GOOGLE_ID, { id: googleId });
                
                if (!existingUser) {
                    const newUser = await writeClient.create({
                        _type: 'user',
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        id: googleId,
                    });
                    user._id = newUser._id;
                    user.id = googleId;
                } else {
                    user._id = existingUser._id;
                    user.id = googleId;
                }
                return true;
            } catch (error) {
                console.log("ERROR", error);
                return false;
            }
        },
        async jwt({ token, user, account }) {
            if (user) {
                // Persist the OAuth access_token and or the user id to the token right after signin
                token.accessToken = account?.access_token;
                token._id = user._id;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            // Send properties to the client
            session.accessToken = token.accessToken;
            session.user._id = token._id;
            session.user.id = token.id;
            
            console.log("Final session:", session); // Debug log
            return session;
        }
    }
};

const handler = NextAuth(authOptions);

export async function auth() {
    return await getServerSession(authOptions);
}

export { handler as GET, handler as POST };
