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
export const config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};
