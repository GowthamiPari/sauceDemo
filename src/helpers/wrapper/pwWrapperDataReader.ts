import { Page } from "@playwright/test";
import PlaywrightWrapperCommon from "./pwWrapperCommon";
import HtmlRoles from "./htmlRoles";
import PlaywrightWrapperPageElement from "./pwWrapperPageElement";
export default class PlaywrightWrapperDataReader {

    constructor(private page: Page, private common: PlaywrightWrapperCommon, private pageElement: PlaywrightWrapperPageElement) { }
    overridePage(newPage:Page):Page{
        const oldPage=this.page;
        this.page=newPage;
        return oldPage;
    }

    async getTextboxValue(inputId: string){
        const locatorPath = this.common.getInputXPathWithId(inputId);
        return await this.page.locator(locatorPath).inputValue();
    }

    async getElementText(searchText: string, exact: boolean = false): Promise<string>{
        const element = this.page.getByText(searchText, {exact: exact});
        let result = "";
        if(element !== undefined && await element.isVisible())
            result = await element.textContent();

        return result;
    }

    async getElementTextById(id: string): Promise<string>{
        const element = await this.pageElement.getElementById(id);
        return await element.textContent();
    }
    async getElementTextByTestId(testId:string,timeout:number=2000):Promise<string>{
        await this.page.waitForTimeout(timeout);
        const element = this.page.getByTestId(testId);
        await element.waitFor({ state: 'visible', timeout: timeout })
        return (await element.textContent()).trim();
    }

   async getElementTextByXPath(xpath: string, includeChildElementsText: boolean): Promise<string>{
        if(includeChildElementsText)
            return await this.page.locator(xpath).textContent();
        else
            return await this.page.locator(xpath).innerText();
    }

    async getElementTextByName(name: string, timeout: number = 5000): Promise<string>{
        await this.page.waitForTimeout(timeout);
        const xPath = `//${HtmlRoles.COMBOBOX}[@name='${name}']`;
        return await this.page.locator(xPath).textContent();   
    }

    async getInputFieldValueByName(name: string): Promise<string>{
        const xPath = `//${HtmlRoles.INPUT}[@name='${name}']`;
        return await this.page.locator(xPath).inputValue();
    }
    async getInputFieldValueByPlaceholder(placeholder: string): Promise<string>{
        const xPath = `//${HtmlRoles.INPUT}[@placeholder='${placeholder}']`;
        return await this.page.locator(xPath).inputValue();
    }

    async getInputFieldValueByXPath(xpath: string): Promise<string>{
        return await this.page.locator(xpath).inputValue();
    }

    async getCurrentPageUrl(): Promise<string>{
     return this.page.url();
    }

    async getTodayDate(): Promise<Date>{
        let todayDate = new Date();
        return todayDate;
    } 

}