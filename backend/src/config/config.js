import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URI) {
  throw new console.error("Mongo Uri is not available in enviornment variable");
}

if (!process.env.JWT_SECRET) {
  throw new console.error(
    "JWT secret is not available in enviornment variable",
  );
}

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new console.error("Cient id is not available in enviornment variable");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new console.error(
    "Client secret is not available in enviornment variable",
  );
}

if (!process.env.NODE_ENV) {
  throw new console.error("NODE_ENV is not available in enviornment variable");
}

export const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
};
