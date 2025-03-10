/* eslint @typescript-eslint/no-explicit-any: "off" */

import { Locator, Page } from "@playwright/test";
import HtmlElementProperties from "./htmlElementProperties";
import HtmlRoles from "./htmlRoles";
import PlaywrightWrapperCommon from "./pwWrapperCommon";
import { fixture } from "../../hooks/fixture";
export default class PlaywrightWrapperPageElement {

    constructor(private page: Page, private common: PlaywrightWrapperCommon) { }

    overridePage(newPage:Page):Page{
        const oldPage=this.page;
        this.page=newPage;
        return oldPage;
    }

    /*eslint @typescript-eslint/require-await: "off" */
    /*eslint @typescript-eslint/no-unsafe-argument: "off" */
    async getElementByRole(role:any, elementName: string): Promise<Locator>{
        return this.page.getByRole(role, { name: elementName });
    }

    /*eslint @typescript-eslint/require-await: "off" */
    /*eslint @typescript-eslint/no-unsafe-argument: "off" */
    async getIndexedElementByRole(index: number, role: any, elementName: string): Promise<Locator> {
        return this.page.getByRole(role, { name: elementName }).nth(index);
    }

    async getVisibleElement(locator: string, timeout: number = 3000): Promise<Locator> {
        const element = this.page.locator(locator);
        await element.waitFor({
            state: HtmlElementProperties.STATE_VISIBLE,
            timeout: timeout
        });
        //await expect(element).toBeVisible({timeout: timeout});
        return element;
    }

    async getVisibleElementByXPath(xpath: string, timeout: number = 3000): Promise<Locator> {
        const element = this.page.locator(xpath);
        await element.waitFor({
            state: HtmlElementProperties.STATE_VISIBLE,
            timeout: timeout
        });
        //await expect(element).toBeVisible({timeout: timeout});
        return element;
    }


    async getIndexedVisibleElement(index: number, locator: string, timeout: number = 3000): Promise<Locator> {
        const element = this.page.locator(locator).nth(index);
        await element.waitFor({
            state: HtmlElementProperties.STATE_VISIBLE,
            timeout: timeout
        });
        return element;
    }
    async getButton(btnName: string, timeout: number = 5000): Promise<Locator> {
        const element = this.page.getByRole(HtmlRoles.BUTTON, { name: btnName });
        await element.waitFor({
            state: HtmlElementProperties.STATE_VISIBLE,
            timeout: timeout
        });
        return element;
    }


    /*eslint @typescript-eslint/require-await: "off" */
    async getElementById(id: string): Promise<Locator> {
        return this.page.locator(this.common.getXPathWithId(id));
    }

    async getElementByIds(ids: string[]): Promise<Locator | null> {
        for (const id of ids) {
            const element = this.page.getByTestId(id);
            element.waitFor({ state: "visible", timeout: 25000 });
            if (element) {
                return element;
            }
        }
        return null;
    }
    async getElementByText(text: string) {
        return this.page.getByText(text);
    }

    /*eslint @typescript-eslint/require-await: "off" */
    async getElementByPlaceholder(placeholderText: string) {
        return this.page.getByPlaceholder(placeholderText);
    }

    async getVisibleElementByLinkName(linkName: string) {
        const element = this.page.getByRole(HtmlRoles.LINK, { name: linkName })
        await element.waitFor({ state: HtmlElementProperties.STATE_VISIBLE });
        return element;
    }

    /*eslint @typescript-eslint/require-await: "off" */
    async getElementByLabel(labelName: string, isExact: boolean = false) {
        return this.page.getByLabel(labelName, { exact: isExact });
    }

    async isElementByLabelAvailable(labelName: string): Promise<boolean> {
        const elementCount = await this.page.getByLabel(labelName).count();
        return elementCount > 0;
    }
    async getCountOfElements(xpath: string) {
        return await this.page.locator(xpath).count();
    }


    /*eslint @typescript-eslint/require-await: "off" */
    async getElementByTestId(testId: string): Promise<Locator> {
        const element = this.page.getByTestId(testId);
        return element;
    }
    async getElementByDataValue(dataValue: string): Promise<Locator> {
        const element = this.page.locator(`[data-value="${dataValue}"]`);
        return element;
    }

    /*eslint @typescript-eslint/require-await: "off" */
    async getUniqueTableRowWithPartialCellText(cellTextToSearch: string): Promise<Locator> {
        return this.page.locator(`tr:has-text("${cellTextToSearch}")`);
    }

    async getSearchableDropDownHavingText(elementXPath: string, textToFilter: string, timeout: number = 4000): Promise<Locator> {
        const element = this.page.locator(elementXPath)
            .filter({ hasText: textToFilter }).getByRole(HtmlRoles.TEXT_BOX);
        await element.waitFor(
            {
                //state: "visible",
                timeout: timeout
            }
        );
        return element;
    }

    /*eslint @typescript-eslint/require-await: "off" */
    async getElementByClass(className: string): Promise<Locator> {
        return this.page.locator(`.${className}`);
    }
    async getElementByXPath(XPath: string): Promise<Locator> {
        return this.page.locator(XPath);
    }

    /*eslint @typescript-eslint/require-await: "off" */
    async getElementByNameAndAttributeValue(elementName: string, attributeName: string, attributeValue: string) {
        return this.page.locator(`//${elementName}[@${attributeName}='${attributeValue}']`);
    }

    /*eslint @typescript-eslint/require-await: "off" */
    async getButtonWithParentNode(parentNodeXPath: string, btnName: string) {
        return this.page.locator(parentNodeXPath).getByRole(HtmlRoles.BUTTON, { name: btnName });
    }

    async getAvailableElementCount(xpath: string) {
        return await this.page.locator(xpath).count();
    }
    async getAvailableElementCountByText(text: string, timeout: number = 2000) {
        //await this.common.delay(timeout);
        await this.page.waitForTimeout(timeout);
        return await this.page.getByText(text).count();
    }

    // async getAvailableElementCountbyTestId1(testId: string, timeout:number = 10000){
    //     const locator=this.page.getByTestId(testId);
    //     locator.waitFor({state:'visible',timeout:timeout});
    //     return await locator.count();

    //     //return await this.page.getByTestId(testId).count();
    // }
    async getAvailableElementCountbyTestId(testId: string, timeout: number = 5000): Promise<number> {
        try {
            const locator = this.page.getByTestId(testId);
            if (!this.page.isClosed()) {
                await locator.waitFor({ state: 'visible', timeout });
                return await locator.count();
            } else {
                fixture.logger.error('Page is closed. Unable to wait for the element.');
                return 0;
            }
        } catch (error) {
            fixture.logger.error(`Error: ${error}`);
            return 0;
        }
    }



    async getAvailableElementCountbyId(id: string) {
        const xpath = this.common.getXPathWithId(id);
        return await this.getAvailableElementCount(xpath);
    }

    async getAvailableElementCountByPlaceholder(placeholderTxt: string) {
        return await this.page.getByPlaceholder(placeholderTxt).count();
    }

    /**
     * Returns number of 'tr' items in the current page.
     * Note: this method assumes there is only one table in the current page
     * @param excludeHeaderRows if true then only those 'tr' items under 'tbody' will be considered; otherwise all 'tr' items including under 'thead' will be considered
     * @returns 
     */
    async getTableRowCount(excludeHeaderRows: boolean = true) {
        if (excludeHeaderRows) {
            return await this.page.locator(`//${HtmlRoles.TABLE_BODY}/${HtmlRoles.TABLE_ROW}`).count();
        } else {
            return await this.page.locator(`//${HtmlRoles.TABLE_ROW}`).count();
        }
    }

    /*eslint @typescript-eslint/require-await: "off" */
    /**
     * Note: this method assumes there is only one table in the current page
     * @param rowIndex 
     * @param cellIndex 
     * @returns 
     */
    async getTableCellElement(rowIndex: number, cellIndex: number): Promise<Locator> {
        return this.page.locator(`(((//${HtmlRoles.TABLE_BODY}/${HtmlRoles.TABLE_ROW})[${rowIndex}])/${HtmlRoles.TABLE_DATA})[${cellIndex}]`)
    }

    /*eslint @typescript-eslint/no-unsafe-argument: "off" */
    async getAvailableElementCountByRole(roleName: any, elementTxt: string = "") {
        if (elementTxt.length >= 0)
            return await this.page.getByRole(roleName, { name: elementTxt }).count();
        else
            return await this.page.getByRole(roleName).count();
    }

    async isElementVisibleByLinkName(linkName: string) {
        const element = this.page.getByRole(HtmlRoles.LINK, { name: linkName })
        await element.waitFor({ state: HtmlElementProperties.STATE_VISIBLE });
        return element.isVisible();
    }
    async isElementVisible(xpath: string, timeout: number = 25000): Promise<boolean> {

        const value = this.page.locator(xpath);
        await value.waitFor({ state: 'visible', timeout: timeout });
        return value.isVisible();
        //return await this.page.locator(xpath).isVisible();
    }
    async isElementHidden(xpath: string, timeout: number = 25000): Promise<boolean> {

        const value = this.page.locator(xpath);
        await value.waitFor({ state: 'hidden', timeout: timeout });
        return value.isHidden();
        //return await this.page.locator(xpath).isVisible();
    }
    async isElementHiddenByTestId(id: string, timeout: number = 25000): Promise<boolean> {

        const value = this.page.getByTestId(id);
        await value.waitFor({ state: 'visible', timeout: timeout });
        return value.isHidden();
        //return await this.page.locator(xpath).isVisible();
    }
    async isElementVisibleByTestId(id: string, timeout: number = 25000): Promise<boolean> {

        const value = this.page.getByTestId(id);
        await value.waitFor({ state: 'visible', timeout: timeout });
        return value.isVisible();
        //return await this.page.locator(xpath).isVisible();
    }
    async areElementsVisibleByTestIds(id1: string, id2: string, timeout: number = 50000): Promise<boolean> {
        let result = true;
        const value1 = this.page.getByTestId(id1);
        await value1.waitFor({ state: 'visible', timeout: timeout });
        result = await value1.isVisible();
        if (!result) {
            const value2 = this.page.getByTestId(id2);
            await value2.waitFor({ state: 'visible', timeout: timeout });
            result = await value2.isVisible();
        }
        return result;
    }
    async isElementVisibleByPlaceholder(placeholderTxt: string, timeout: number = 25000): Promise<boolean> {
        const value = this.page.getByPlaceholder(placeholderTxt);
        await value.waitFor({ state: 'visible', timeout: timeout });
        return value.isVisible();
    }
    async isElementVisibleByRole(role: any, name: string = "", timeout: number = 25000) {
        const value = this.page.getByRole(role, { name: name });
        await value.waitFor({ state: 'visible', timeout: timeout });
        return value.isVisible();
    }
    async isElementVisibleByText(text: string, timeout: number = 25000): Promise<boolean> {
        const value = this.page.getByText(text);
        await value.waitFor({ state: 'visible', timeout: timeout });
        return value.isVisible();
        //return await this.page.locator(xpath).isVisible();
    }

    async isElementHiddenByText(text: string, timeout: number = 25000): Promise<boolean>{
        const value = this.page.getByText(text);
        await value.waitFor({ state: 'hidden', timeout: timeout });
        return value.isHidden();
    }

    async isCheckBoxChecked(xpath: string) {
        return this.page.isChecked(xpath);
    }

    async isElementEnabled(xpath: string): Promise<boolean> {
        return await this.page.locator(xpath).isEnabled();
    }
    async isElementDisabled(xpath: string): Promise<boolean> {
        return await this.page.locator(xpath).isDisabled();
    }

    async isElementDisabledByTestId(testId: string){
        const value = this.page.getByTestId(testId);
        return value.isDisabled();
    }
    async isElementDisabledByName(name: string): Promise<boolean>{
        const xPath = `//${HtmlRoles.INPUT}[@name='${name}']`;
        return await this.page.locator(xPath).isDisabled();
    }
    
    async isElementEnabledByTestId(testId: string){
        const value = this.page.getByTestId(testId);
        return value.isEnabled();
    }

    async isElementDisabledByRole(role: any, name: string = "") {
        const value = this.page.getByRole(role, { name: name });
        return value.isDisabled();
    }
    async isElementEnabledByRole(role: any, name: string = "") {
        const value = this.page.getByRole(role, { name: name });
        return value.isEnabled();
    }
    /*eslint @typescript-eslint/require-await: "off" */
    async getElementByPara(paraText: string) {
        return this.page.locator(`//p[text()='${paraText}']`);
    }
    async isRadioBtnChecked(defaultDietSource: string){
        // const value = this.page.getByRole('radio').isChecked();
        // fixture.logger.info('the value is '+value);
        // return value;
        const radioButton = this.page.getByLabel(defaultDietSource);
        const isChecked = await radioButton.isChecked();
        fixture.logger.info('Checked status of radio button :' + isChecked);
        return isChecked;
    }

}