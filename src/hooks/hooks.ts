import { BeforeAll, AfterAll, Before, After, Status, ITestCaseHookParameter } from "@cucumber/cucumber"
import { Browser, BrowserContext } from "@playwright/test";
import { fixture } from "./fixture";
import { invokeBrowser } from "../helpers/browser/browserManager";
import { getEnv } from "../helpers/env/env";
import { createLogger } from "winston";
import { options } from "../helpers/util/logger";
import DataBag from "../helpers/util/dataBag";
import TestDataProvider from "../helpers/util/test-data/testDataProvider";
import PageFactory from "../pages/pageFactory";
import DataBagKeys from "../tests/steps/dataBagKeys";

/*eslint @typescript-eslint/no-unsafe-argument: "off" */
/*eslint @typescript-eslint/no-unsafe-assignment: "off" */
/*eslint @typescript-eslint/no-unsafe-call: "off" */
/*eslint @typescript-eslint/no-unsafe-member-access: "off" */
const fs = require("fs-extra");

let browser: Browser;
let context: BrowserContext;
const buildSignalFilePath = 'buildSignal.txt';

BeforeAll(async function () {
    getEnv();
    browser = await invokeBrowser();
    fixture.testDataProvider = new TestDataProvider();
    fixture.scenarioRetryCount = {};
    fixture.maxRetryCount= parseInt(process.env.CUCUMBER_RETRY_COUNT);
    if(fs.existsSync(buildSignalFilePath)){
        fs.removeSync(buildSignalFilePath); 
     }
});
// It will trigger for all tests/scenarios that don't have any tags
Before(async function ({ pickle }) {
    const scenarioName = pickle.name + " - " + Date.now().toString();
  
    fixture.logger = createLogger(options(scenarioName));

    if(!fs.existsSync(buildSignalFilePath)) //track scenario count only if build signal file is not created
    {
        if (!fixture.scenarioRetryCount[pickle.name]) {
            fixture.scenarioRetryCount[pickle.name] = 1; // Initialize retry count for the scenario
            //fixture.logger.info(`retry count initialized for ${pickle.name}`);
        } else {
            fixture.scenarioRetryCount[pickle.name]++; // Increment retry count on subsequent attempts
            //fixture.logger.info(`retry count incremented for ${pickle.name}`);
        }
    }
    
    context = await browser.newContext({
        recordVideo: {
            dir: `test-results/videos/${scenarioName}`,
        },

        httpCredentials:{
            username:"520864",
            password:""
        }
    });
    await context.tracing.start({
        name: scenarioName,
        title: pickle.name,
        sources: true, screenshots: true, snapshots: true,
    });
    const page = await context.newPage();
    fixture.page = page;
    fixture.pageFactory = new PageFactory();
    const dataBag = new DataBag();
    fixture.dataBag = dataBag; //we want databag to be unique for each scenario and accessible for all steps in that scenario
    fixture.dataBag.saveData(DataBagKeys.SCENARIO_NAME, scenarioName);
    fixture.logger.info(`Scenario - ${scenarioName} - started`);
    fixture.logger.info(`Feature file path: ${pickle.uri}`);
});


After(async function ({ pickle, result }) {
    const scenarioName = fixture.dataBag.getData(DataBagKeys.SCENARIO_NAME) as string;
    try {
        //scenarioName = pickle.name + " - " + pickle.id
        let videoPath: string;
        let img: Buffer;
        let downloadPath: string;
        if (result?.status == Status.PASSED) {
            //img = await fixture.page.screenshot({ path: `./test-results/screenshots/${pickle.name}.png`, type: "png" })
            img = await fixture.page.screenshot({ path: `./test-results/screenshots/${scenarioName}/${pickle.name}.png`, type: "png" })
            videoPath = await fixture.page.video().path();
        }else if (result?.status == Status.FAILED) {
            
            if(!fs.existsSync(buildSignalFilePath)) {
                const currentRetry = fixture.scenarioRetryCount[pickle.name];
                //fixture.logger.info(`currentRetry for ${pickle.name} is ${currentRetry}`);
                //fixture.logger.info(`maxRetryCount is ${fixture.maxRetryCount}`);
                if (currentRetry == fixture.maxRetryCount + 1) {
                    fs.createFileSync(buildSignalFilePath);
                    fs.writeFileSync(buildSignalFilePath, "failed");
                }
            }
        }

        const tracePath = `./test-results/traces/${scenarioName}/${pickle.name}`;
        await context.tracing.stop({path: tracePath});
        await fixture.page.close();
        fixture.pageFactory.clear();
        await context.close();
        if (result?.status == Status.PASSED) {
            this.attach(
                img, "image/png"
            );
            this.attach(
                fs.readFileSync(videoPath),
                'video/webm'
            );
            fixture.logger.info(`Scenario - ${scenarioName} - completed SUCCESSFULLY`);
        }else{
            fixture.logger.error(`Scenario - ${scenarioName} - completed WITH ERRORS`);
        }
        fixture.dataBag = null;
    } catch (error) {
        fixture.logger.error(`After-logic for the scenario - ${scenarioName} - failed: ${error}`);
    }
});

AfterAll(async function () {
    fixture.testDataProvider.close();
    await browser.close();
});
