import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    DATABASE_URL: string;
    API_PREFIX: string;
}

const envSchema = joi.object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    API_PREFIX: joi.string().default('api'),
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
};