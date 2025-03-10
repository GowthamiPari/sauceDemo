/*eslint @typescript-eslint/no-unsafe-argument: "off" */
/*eslint @typescript-eslint/no-unsafe-assignment: "off" */
/*eslint @typescript-eslint/no-unsafe-call: "off" */
/*eslint @typescript-eslint/no-unsafe-member-access: "off" */
import PageConstants from "./pageConstants";
import BasePage from "./basePage";
import { fixture } from "../hooks/fixture";
import { expect } from "playwright/test";


export default class SharedPageBehavior extends BasePage {

    Elements = {
       

    }
    /*eslint @typescript-eslint/require-await: "off" */
    async initialize(): Promise<boolean> {
        return true;
    }
    /*eslint @typescript-eslint/require-await: "off" */
    async isPageStable(): Promise<boolean> {
        return true;
    }
}











