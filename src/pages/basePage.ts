import PlaywrightWrapper from "../helpers/wrapper/playwrightWrappers";
import HtmlRoles from "../helpers/wrapper/htmlRoles";
import StepPageHelper from "../tests/steps/stepPageHelper";
import { Page } from "@playwright/test";
import SharedPageBehavior from "./sharedPageBehavior";

export default abstract class BasePage{
    protected Elements = {};
    protected pwWrapper: PlaywrightWrapper;
    protected sharedBehavior: SharedPageBehavior;

    constructor(protected page: Page) {
        this.pwWrapper = new PlaywrightWrapper(page);
    }
    

    /*eslint @typescript-eslint/require-await: "off" */
    async canNavigateWithUrl(): Promise<boolean>{
        return true;
    }
    async initialize(): Promise<boolean>{
        this.sharedBehavior = await StepPageHelper.getSharedPageBehavior();
        return true;
    }
    abstract isPageStable(): Promise<boolean>;
   
    clear(): void {
        this.Elements = null;
    }
}