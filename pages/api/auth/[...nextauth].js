import NextAuth from "next-auth"

import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import Auth0Provider from "next-auth/providers/auth0";
import CredentialsProvider from "next-auth/providers/credentials"

import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "./lib/mongodb"
import User from "@/models/User";
import db from "@/utils/db"

import bcrypt from 'bcrypt';

db.connect();

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
    }),
    GithubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
    }),
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_ISSUER
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const email = credentials.email;
        const password = credentials.password;
        const user = await User.findOne({email});
        if (user) {
          return SignInUser({password, user});
        } else {
          throw new Error('This email does not exist.')
        }
      }
    })
  ],

  callbacks: {
      async session({ session, token }) {
        let user = await User.findById(token.sub);
        session.user.id = token.sub || user._id.toString();
        session.user.role = user.role || 'user';
        token.role = user.role || "user";
        return session;
      }
  },

  pages: {
    signIn: '/signin'
  },
  
  session: {
    strategy: 'jwt'
  },
  
  secret: process.env.JWT_SECRET
}

const SignInUser = async({password,user})=>{
  if(!user.password){
    throw new Error('Please enter your password.');
  }
  const isMatch = await bcrypt.compare(password,user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }
  return user;    
}

export default NextAuth(authOptions)