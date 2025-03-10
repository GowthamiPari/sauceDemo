module.exports = {
    default: {
        tags: process.env.npm_config_TAGS || "",
        formatOptions: {
            snippetInterface: "async-await"
        },
        paths: [
            "src/tests/features/"
        ],
        dryRun: false,
        require: [
            "src/hooks/hooks.ts",
            "src/tests/steps/*.ts",
            "src/tests/steps/sauceDemoSteps/*.ts"
        ],
        requireModule: [
            "ts-node/register"
        ],
        format: [
            "progress-bar",
            "html:test-results/cucumber-report.html",
            "json:test-results/cucumber-report.json",
            "rerun:@rerun.txt"
        ],
        parallel: 1,
        retry: process.env.CUCUMBER_RETRY_COUNT || 3
    },
    rerun: {
        formatOptions: {
            snippetInterface: "async-await"
        },
        dryRun: false,
        require: [
            "src/hooks/hooks.ts",
            "src/tests/steps/*.ts",
            "src/tests/steps/sauceDemoSteps/*.ts"
        ],
        requireModule: [
            "ts-node/register"
        ],
        format: [
            "progress-bar",
            "html:test-results/cucumber-report.html",
            "json:test-results/cucumber-report.json",
            "rerun:@rerun.txt"
        ],
        parallel: 1,
        retry: process.env.CUCUMBER_RETRY_COUNT || 3
    },
    order: {
        formatOptions: {
            snippetInterface: "async-await"
        },
        dryRun: false,
        require: [
            "src/hooks/hooks.ts",
            "src/tests/steps/*.ts",
            "src/tests/steps/sauceDemoSteps/*.ts"
        ],
        requireModule: [
            "ts-node/register"
        ],
        format: [
            "progress-bar",
            "html:test-results/cucumber-report.html",
            "json:test-results/cucumber-report.json",
            "rerun:@rerun.txt"
        ],
        parallel: 1,
        retry: process.env.CUCUMBER_RETRY_COUNT || 3
    }
}