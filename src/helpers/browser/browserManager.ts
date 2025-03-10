import { LaunchOptions, chromium, firefox, webkit } from "@playwright/test"

const options: LaunchOptions = {
    /*
    //TODO: investigate how to launch specified version
    executablePath: chromeExecutablePath, //RISK: https://playwright.dev/docs/api/class-browsertype#browser-type-launch-option-executable-path
    */
    headless: false,
    slowMo: parseInt(process.env.SLOW_MOTION_IN_MS)
}
export const invokeBrowser = () => {
    // const browserType = process.env.BROWSER || "chrome";
    const browserType = process.env.BROWSER || "firefox";
    switch (browserType) {
        case "chrome":
            return chromium.launch(options);
        case "firefox":
            return firefox.launch(options);
        case "webkit":
            return webkit.launch(options);
        default:
            throw new Error("Please set the proper browser!")
    }

}