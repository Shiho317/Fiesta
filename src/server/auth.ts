import { getServerSession } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { createTransport } from "nodemailer";

import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

import { type NextAuthOptions, type DefaultSession } from "next-auth";
import { type GetServerSidePropsContext } from "next";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, //1M
    updateAge: 24 * 60 * 60, //24h
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
    newUser: "/auth/signup", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  callbacks: {
    redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.email = user.email;
      }
      // session.user.role = user.role; <-- put other properties on the session here
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
      async sendVerificationRequest({
        identifier: email,
        url,
        provider: { server: from },
      }) {
        const userExists = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (!userExists) {
          throw new Error(
            `Email ${email} does not have any account. Please sign up before login.`
          );
        }
        const { host } = new URL(url);
        const transport = createTransport(this.server);
        const result = await transport.sendMail({
          to: email,
          from: from as string,
          subject: "Login to Fiesta",
          text: `Fiesta sign in to ${host}`,
          html: `Sign in to ${host} \n\n ${url}`,
        });
        if (!result.accepted || result.accepted.length === 0) {
          throw new Error("Failed to send email.");
        }
        //TODO: add email template and connect with mailer/server.ts
        // const mailOption = {
        //   to: email,
        //   from,
        //   subject: "Login to Fiesta",
        //   text:
        // }
      },
    }),
    // CredentialsProvider({
    //   type: "credentials",
    //   credentials: {
    //     email: {
    //       label: "Email",
    //       type: "email",
    //       placeholder: "fiesta@mail.com",
    //     },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials) {
    //     const user = await prisma.user.findUnique({
    //       where: {
    //         email: credentials?.email,
    //       },
    //     });
    //     if (!user) {
    //       throw new Error("Could not find user");
    //     }
    //     const tokenDecoded = verifyAndDecodeJWT(user.password as string);
    //     const { password } = tokenDecoded as { password: string };
    //     if (password === credentials?.password) {
    //       console.log(user);
    //       return user;
    //     }
    //     return null;
    //   },
    // }),
    /**
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
