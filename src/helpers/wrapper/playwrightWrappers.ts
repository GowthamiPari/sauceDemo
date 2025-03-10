import { Page } from "@playwright/test";
import KeyBoardItems from "./keyBoardItems";
import BrowserEvents from "./browserEvents";
import PlaywrightWrapperDataReader from "./pwWrapperDataReader";
import PlaywrightWrapperElementAction from "./pwWrapperElementAction";
import PlaywrightWrapperKeyboard from "./pwWrapperKeyboard";
import PlaywrightWrapperPageElement from "./pwWrapperPageElement";
import PlaywrightWrapperCommon from "./pwWrapperCommon";
import PlaywrightWrapperDataWriter from "./pwWrapperDataWriter";
import { fixture } from "../../hooks/fixture";
import { invokeBrowser } from "../browser/browserManager";

export default class PlaywrightWrapper {
    common: PlaywrightWrapperCommon;
    dataReader: PlaywrightWrapperDataReader;
    dataWriter: PlaywrightWrapperDataWriter;
    elementAction: PlaywrightWrapperElementAction;
    keyBoard: PlaywrightWrapperKeyboard;
    pageElement: PlaywrightWrapperPageElement;

    constructor(private page: Page) { 
        this.common = new PlaywrightWrapperCommon(this.page);

        this.pageElement = new PlaywrightWrapperPageElement(this.page, this.common);
        this.dataReader = new PlaywrightWrapperDataReader(this.page, this.common, this.pageElement);
        this.dataWriter = new PlaywrightWrapperDataWriter(this.page, this.common, this.pageElement);
        this.keyBoard = new PlaywrightWrapperKeyboard(this.page, this.common);
        
        this.elementAction = new PlaywrightWrapperElementAction(this.page, this.common, this.pageElement);
    }
    overridePage(newPage:Page):Page{
        const oldPage=this.page;
        this.page=newPage;
        this.common.overridePage(newPage);
        this.pageElement.overridePage(newPage);
        this.dataReader.overridePage(newPage);
        this.dataWriter.overridePage(newPage);
        this.keyBoard.overridePage(newPage);
        this.elementAction.overridePage(newPage);
        return oldPage;
    }
    async waitForNavigation(navigationUrl: string, timeout:number = 5000){
        await this.page.waitForURL(navigationUrl, {timeout: timeout});
    }
    async waitForPageStability(timeout:number = 50000){
        await this.page.waitForLoadState(BrowserEvents.PAGE_LOADED, {timeout: timeout});
    }
    
    async goto(url: string, timeout: number = 20000) {
        await this.page.goto(url, {
            waitUntil: BrowserEvents.PAGE_LOADED,
            timeout: timeout
        });
    }

    /**
     * Refreshes current page and reloads the same
     * @param delayOrTimeoutInMillSec amount of time to delay before refreshing and then to wait for page reload to complete after refreshing
     * @param [delayAfterRefresh=-1] amount of time to delay after refreshing the page; this is useful if the page is loading slowly  
    */
    async refreshCurrentPage(delayOrTimeoutInMillSec: number, delayAfterRefresh: number = 0){
        await this.keyBoard.pressKeyBoard(null, KeyBoardItems.F5, delayOrTimeoutInMillSec);
        await this.page.reload({timeout: delayOrTimeoutInMillSec});
        if(delayAfterRefresh > 0)
            await this.common.delay(delayAfterRefresh);
    }

    /**
     * navigates to previous action in the page
     * @param noOfClicks total number of clicks on back arrow icon to be performed
     * @param delayOrTimeoutInMillSec amount of time to delay before navigating back and then to wait for page naviagtion to complete after navigating back
     * @param delayAfterNavigate amount of time to delay after navigating back in the page; this is useful if the page is loading slowly
     */       
    async navigateBack(delayOrTimeoutInMillSec: number, delayAfterNavigate: number = 0, noOfClicks: number = 1) {
        for(let i = 0; i<noOfClicks; i++){
        await this.page.goBack({timeout: delayOrTimeoutInMillSec});
        }
        if (delayAfterNavigate > 0)
            await this.common.delay(delayAfterNavigate);
    }
    async closePage() {
        await this.page.close();
        await this.common.delay(3000);
    }
    async openPage(): Promise<Page> {
        const browser = await invokeBrowser();
        const context = await browser.newContext({
            httpCredentials:{
                username:"520864",
                password:""
            }
        });
        const newPage = await context.newPage();
        fixture.page = newPage;
        this.overridePage(newPage);
        return newPage;
    }
    
}