import dotenv from "dotenv";

export const envs = {
    ...process.env,
    ...dotenv.config().parsed
};

export const CORS_WHITE_LIST = (envs.CORS_WHITE_LIST as string).split(",");

export const isProduction = process.env.NODE_ENV === "production";
