import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    DATABASE_URL: string;
    API_PREFIX: string;    
    JWT_SECRET: string;
}

const envSchema = joi.object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    API_PREFIX: joi.string().default('api'),
    JWT_SECRET: joi.string().required(),
}).unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const env = {
    port: envVars.PORT,
    databaseUrl: envVars.DATABASE_URL,
    apiPrefix: envVars.API_PREFIX,
    jwtSecret: envVars.JWT_SECRET,
};