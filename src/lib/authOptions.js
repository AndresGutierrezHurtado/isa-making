import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

// Models
import { User } from "@/database/models";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                user_email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
                user_password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const { user_email, user_password } = credentials;
                const user = await User.findOne({
                    where: {
                        user_email,
                    },
                });

                if (!user) {
                    throw new Error("El usuario no existe");
                }

                const isPasswordValid = await bcrypt.compare(user_password, user.user_password);

                if (!isPasswordValid) {
                    throw new Error("La contraseña es incorrecta");
                }

                return {
                    id: user.user_id,
                    name: user.user_name,
                    lastname: user.user_lastname,
                    email: user.user_email,
                };
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
    ],
    callbacks: {
        async session({ session, user }) {
            session.user = await User.findOne({
                where: {
                    user_email: user?.email || session.user.email,
                },
            });
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
};

export default authOptions;
