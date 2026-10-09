import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

// The localhost fallback keeps the app buildable; configure MONGODB_URL before using auth.
const client = new MongoClient(process.env.MONGODB_URL || "mongodb://127.0.0.1:27017");
const db = client.db("bazar-dor");
const socialProviders = {};
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET };
}
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = { clientId: process.env.GITHUB_CLIENT_ID, clientSecret: process.env.GITHUB_CLIENT_SECRET };
}
export const auth = betterAuth({
  appName: "BazarDor",
  secret: process.env.BETTER_AUTH_SECRET || "development-only-change-this-secret-before-deploying-123456789",
  baseURL: process.env.BETTER_AUTH_URL || "<http://localhost:3000>",
  emailAndPassword: { enabled: true },
  socialProviders,
  database: mongodbAdapter(db, { client })
});