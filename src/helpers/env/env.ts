import * as dotenv from 'dotenv'

export const getEnv = () => {
    if (!process.env.npm_config_ENV){
        process.env.npm_config_ENV = "QA"
    }

    dotenv.config({
        override: true,
        path: `src/helpers/env/.env.${process.env.npm_config_ENV}`
    })
}