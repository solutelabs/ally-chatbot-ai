import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();

                try {
                    const user = await UserModel.findOne({ username: credentials.username });

                    if (!user) {
                        throw new Error("No user found with this username.")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if (isPasswordCorrect) {
                        return user;
                    }
                    else {
                        throw new Error("Incorrect Password!");
                    }


                } catch (error: any) {
                    throw new Error(error); // or you can return null to show message to users
                }
            },

        })
    ],
    callbacks: {
        async jwt({ token, user }) {

            if (user) {
                token._id = user._id?.toString();
                token.username = user.username;
            }

            return token;
        },
        async session({ session, token }) {

            if (token) {
                session.user._id = token._id;
                session.user.username = token.username;
            }

            return session;
        }
    },
    pages: {
        signIn: "/sign-in"
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_URL
}