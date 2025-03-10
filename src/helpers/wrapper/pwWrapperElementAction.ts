/* eslint @typescript-eslint/no-explicit-any: "off" */
import { Locator, Page } from "@playwright/test";
import PlaywrightWrapperPageElement from "./pwWrapperPageElement";
import PlaywrightWrapperCommon from "./pwWrapperCommon";
import HtmlRoles from "./htmlRoles";
import path = require("path");
import { fixture } from "../../hooks/fixture";
export default class PlaywrightWrapperElementAction {

    constructor(private page: Page, private common: PlaywrightWrapperCommon, private pageElement: PlaywrightWrapperPageElement) { }
         //const path = require('path');
         //const fs = require('fs');
    overridePage(newPage:Page):Page{
        const oldPage=this.page;
        this.page=newPage;
        return oldPage;
    }

    /**
     * returns true if the button is visible and enabled 
     * @param btnName 
     */
    async canClickButton(btnName: string){
        const button = await this.pageElement.getButton(btnName);
        return await button.isEnabled();
    }

    async canClickButtonByTestId(testId: string, timeout: number = 25000){
       const value = this.page.getByTestId(testId);
       await value.waitFor({ state: 'visible', timeout: timeout });
       return await value.isEnabled();
    }

    async waitAndClick(locator: string,timeout:number=8000) {
        const element = await this.pageElement.getVisibleElement(locator);
        await element.waitFor({state: 'visible', timeout: timeout});
        await element.click();
        await element.waitFor({timeout:timeout});
    }
    
    async waitAndClickButtonByRole(btnName: string, timeout: number = 2000) {
        const element = await this.pageElement.getButton(btnName, timeout);
        await element.click();
    }

    async clickElementById(id: string){
        await this.page.click(this.common.getXPathWithId(id));
    }

    /**
     * Must be called only when there are multiple elements matching the given ID
     * @param id 
     * @param elementIndex zero-based index; to click the first element, this value must be zero
     */
    async clickIndexedElementById(id: string, elementIndex: number){
        const ele = this.page.locator(this.common.getXPathWithId(id)).nth(elementIndex);
        await ele.click();
    }

    async clickElementByPlaceholder(placeholderText: string){
        await (await this.pageElement.getElementByPlaceholder(placeholderText)).click();
    }

    async clickElement(elementXPath: string,shouldIgnoreIfDisabled: boolean = false, disabledStatusAttribute:string = ''): Promise<Locator>{
        const element = this.page.locator(elementXPath);
        
        await this.clickElementIfAppropriate(element, shouldIgnoreIfDisabled, disabledStatusAttribute);
        return element;
    }

    async clickElementHavingText(elementText: string, shouldIgnoreIfDisabled: boolean = false, disabledStatusAttribute:string = ''): Promise<Locator>{
        const elementXPath = `//*[text()='${elementText}']`;
        return await this.clickElement(elementXPath, shouldIgnoreIfDisabled, disabledStatusAttribute);
    }

    async clickRadioButtonOption(elementText: string, shouldIgnoreIfDisabled: boolean = false, disabledStatusAttribute:string = ''): Promise<Locator>{
        return await this.clickElementHavingText(elementText, shouldIgnoreIfDisabled, disabledStatusAttribute);
    }
    /**
     * Must be called only when there are multiple elements matching the given XPath
     * @param elementIndex 
     * @param elementXPath 
     * @param shouldIgnoreIfDisabled 
     * @param disabledStatusAttribute 
     * @returns 
     */
    async clickIndexedElement(elementIndex: number, elementXPath: string, shouldIgnoreIfDisabled: boolean = false, disabledStatusAttribute: string = ''): Promise<Locator> {
        const element = this.page.locator(elementXPath).nth(elementIndex);
        await this.clickElementIfAppropriate(element, shouldIgnoreIfDisabled, disabledStatusAttribute);
        return element;
    }
    private async clickElementIfAppropriate(element:Locator, shouldIgnoreIfDisabled: boolean, disabledStatusAttribute:string){
        if (shouldIgnoreIfDisabled) {
            let isDisabled: boolean = false;
            if(disabledStatusAttribute){
                const temp = await element.getAttribute(disabledStatusAttribute);
                if(temp.toLowerCase() == "true")
                    isDisabled = true;
            }else{
                isDisabled = await element.isDisabled();
            }
            
            if (isDisabled)
                return false;
        }

        await element.click();
    }

    async clickLabelledTextElement(label: string, txtToClick: string){
        await this.page.getByLabel(label).getByText(txtToClick).click();
    }

    async clickLinkElement(linkTxt: string, isExact: boolean = false){
        await this.page.getByText(linkTxt, {exact: isExact}).click();
    }

    async clickElementByLabel(labelName: string, isExact: boolean = false){
        const element = await this.pageElement.getElementByLabel(labelName, isExact);
        await element.click();
    }

    async clickElementByTestId(testId: string){
        const element = await this.pageElement.getElementByTestId(testId);
        await element.click();
    }
    async doubleClickElementByTestId(testId: string){
        const element = await this.pageElement.getElementByTestId(testId);
        await element.dblclick();
    }
    async clickElementByText(text: string){
        const element = this.page.getByText(text);
        await element.click();
    }
    async clickElementByXPath(xpath: string){
        await this.page.locator(xpath).waitFor({timeout: 5000});
        await this.page.locator(xpath).click();
    }
    async doubleClickElementByXPath(xpath: string){
        const element = this.page.locator(xpath);
        await element.dblclick();
    }

    async clickItemByTestIdAndRole(testId: string, role: any): Promise<Locator>{
        const element = await this.pageElement.getElementByTestId(testId);
        /*eslint @typescript-eslint/no-unsafe-argument: "off" */
        await element.getByRole(role).click();
        return element;
    }

    async clickElementByRole(role: any, name: string =""){
        if(name.length == 0)
            await this.page.getByRole(role).click();
        else
            await this.page.getByRole(role, {name : name}).click();
    }
    async clickChildElementByRole(parentElementXPath: string, role: any, name: string =""){
        if(name.length == 0)
            await this.page.locator(parentElementXPath).getByRole(role).click();
        else
            await this.page.locator(parentElementXPath).getByRole(role, {name : name}).click();
    }

    async clickChildElementByPlaceholder(parentElementXPath: string, placeholderTxt: any){
        await this.page.locator(parentElementXPath).getByPlaceholder(placeholderTxt).click();
    }
    async clickTableCell(cellName: string, isExact: boolean = false){
        let element: Locator;
        if(isExact)
        {
            element = this.page.getByRole(HtmlRoles.TABLE_CELL, { name: cellName, exact: true})
        }else{
            element = this.page.getByRole(HtmlRoles.TABLE_CELL, { name: cellName})
        }
        await element.click();
    }
    async clickItemByText(textToClick: string, isExact: boolean = false){
        await this.page.getByText(textToClick, {exact: isExact}).click();
    }

    async clickElementByNameAndAttributeValue(elementName: string, attributeName: string, attributeValue:string){
        await (await this.pageElement.getElementByNameAndAttributeValue(elementName, attributeName, attributeValue)).click();
    }
    async hoverElementByXPath(xpath: string,timeout:number=50000){
        const ele = this.page.locator(xpath)
        ele.hover();
        await ele.waitFor({timeout:timeout});
    }
    async clickDownloadByXPath(xPath: string) {
        const ele = this.page.locator(xPath);
        ele.click();
        fixture.logger.info("View icon is clicked");
        const download = await this.page.waitForEvent('download', {timeout: 50000});
        await this.page.waitForTimeout(3000);
        fixture.logger.info("Download is"+download);
        const downloadDir = path.join('test-results','downloads');
        fixture.logger.info("Dir is"+downloadDir);
        // Get the suggested filename and construct the full path
        const fileName = download.suggestedFilename();
        fixture.logger.info("File name is"+fileName);
        const filePath = path.join(downloadDir, fileName);
        fixture.logger.info("File path is"+filePath);
        // Save the downloaded file to the specified path
        await download.saveAs(filePath);
        fixture.logger.info("The file is downloaded in the file path:- "+filePath);
    }

}