export { };

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BROWSER: "chrome" | "firefox" | "webkit",
            ENV: "dev" | "QA1",
            BASEURL: string,
            IS_LOCAL: "true" | "false",
            CUCUMBER_RETRY_COUNT: string,
            HEAD: "true" | "false",
            SLOW_MOTION_IN_MS: string,
            LOG_LEVEL: "error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly",
            DEFAULT_CACHE_TIMEOUT_IN_SEC: string,
            EXTENDED_CACHE_TIMEOUT_IN_SEC: string,
            EXTEND_CACHE: string,
            PASSWORD:string;
            USERNAME:string;
            CONFIG:string

        }
    }
}