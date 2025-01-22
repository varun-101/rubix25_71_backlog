import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getServerSession } from "next-auth/next";
import { signIn } from "next-auth/react";
import { writeClient } from "@/sanity/lib/write-client";
import { USER_BY_GOOGLE_ID } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks:{
        async signIn({user, account, profile}){
            console.log("USER", user);
            console.log("ACCOUNT", account);
            console.log("PROFILE", profile);
            
            if (!profile) {
                return false;
            }

            try {
                const existingUser = await client.fetch(USER_BY_GOOGLE_ID, {id: user.id});
                if(!existingUser){
                    await writeClient.create({
                        _type: 'user',
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        id: user.id,
                    });
                }
                return true;
            } catch (error) {
                console.log("ERROR", error);
                return false;
            }
        },
        // async jwt({ token, account, profile }) {
        //     if (account && profile) {
        //       const user = await client.fetch(USER_BY_GOOGLE_ID, { id: profile.id })
        //       token.id = user?._id;
        //     }
        //     return token;
        //   },
        async session({session, token}){
            Object.assign(session, {id: token.id});
            return session;
        }
    }

});

export async function auth() {
    return await getServerSession(handler);
  }

export { handler as GET, handler as POST };
