import type { NextAuthOptions } from "next-auth"; 
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { compare } from "bcrypt";

type SessionProps = {
  session: any;
  token: any;
}; 


export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email:",
          type: "text",
          placeholder: "your-cool-eamil",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "your-awesome-password",
        },
      },
      async authorize(credentials, req) {
        try {
          // Retrieve user from the database based on the provided email
          const user = await db.user.findUnique({
            where: { email: credentials?.email },
            select: { id: true, email: true, password: true, firstName: true, lastName: true }, 
          });

          if (!user) {
            console.log("User not found");
            return null;
          }

          // Compare the provided password with the hashed password stored in the database
          const passwordCorrect =
            user.password &&
            (await compare(credentials?.password || "", user.password));

          if (passwordCorrect) {
            // console.log(user);
            return user
          } else {
            console.log("Incorrect password");
            return null;
          }
        } catch (error) {
          console.error("Error retrieving user from the database:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    session: async ({ session, token }: SessionProps) => { 
      if (session?.user) {
      try { 
        const user = await db.user.findUnique({
          where: { email: session.user.email }, 
          select: { firstName: true, lastName: true, birthday: true },  
        });

        if (user) {
          session.user.firstName = user.firstName;
          session.user.lastName = user.lastName;
          session.user.birthday = user.birthday;
          session.user.id = token.sub;
        }
      } catch (error) {
        console.error("Error fetching user from the database:", error);
      }
      }
      return session;
    },
  },
};
