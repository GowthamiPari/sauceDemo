import { Page } from "@playwright/test";
import BasePage from "./basePage";
import { fixture } from "../hooks/fixture";

export default class PageFactory {
    // we will have a collection of page objects in 'pages' whose type is a map where
    //      key is constructor function matching BasePage class
    //      value is an instance of BasePage 
    // NOTE 1: this map will always have only one current page
    // NOTE 2: only "real" page will be cached
    private pages: Map<new (p: Page) => BasePage, BasePage> = new Map();
    
    public async getPage<T extends BasePage>(pageClass: new (p: Page) => T, page: Page, checkPageStability: boolean = true): Promise<T> {
        const existingPage = this.pages.get(pageClass);
        if (existingPage) {
          //console.log(`Returning existing page: ${pageClass.name}`);
          return existingPage as T;
        }
    
        const newPage = new pageClass(page);

        await newPage.initialize();
        // fixture.logger.info(`Checking page stability`);
        // // if(checkPageStability)
        // //     while(!await newPage.isPageStable());
        // fixture.logger.info(`Checking page stability completed`);
        if(await newPage.canNavigateWithUrl())//we will cache only "real" page
        {
            //fixture.logger.info("Removing current page");
            this.pages.clear();//remove current cached page
            //fixture.logger.info("Removing current page completed");
            this.pages.set(pageClass, newPage);
            //fixture.logger.info(`New page: ${pageClass.name}`);
        //console.log(`Creating new page: ${pageClass.name}`);
        }
        return newPage;
    }
    clear(){
        this.pages.forEach((value) => value.clear());
        this.pages.clear();
    }
} 