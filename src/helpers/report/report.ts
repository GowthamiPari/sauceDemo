/*eslint @typescript-eslint/no-unsafe-assignment: "off" */
/*eslint @typescript-eslint/no-unsafe-call: "off" */
/*eslint @typescript-eslint/no-unsafe-member-access: "off" */
const report = require("multiple-cucumber-html-reporter");

report.generate({
    jsonDir: "test-results",
    reportPath: "test-results/reports/",
    reportName: "Playwright Automation Report Sprint - 5.3",
    pageTitle: "Truterra test report Sprint - 5.3",
    displayDuration: false,
    metadata: {
        browser: {
            // name: "chrome",
            name: "firefox",
            version: "112",
        },
        device: "Gowthami - PC",
        platform: {
            name: "Windows",
            version: "10",
        },
    },
    customData: {
        title: "Test Info",
        data: [
            { attributeKey: "attribute1", attributeValue: "value1" },
            { attributeKey: "attribute2", attributeValue: "value2" },
        ],
    },
});