import { Locator, Page } from "@playwright/test";
import PlaywrightWrapperCommon from "./pwWrapperCommon";
import HtmlRoles from "./htmlRoles";
import KeyBoardItems from "./keyBoardItems";
import PlaywrightWrapperPageElement from "./pwWrapperPageElement";
import { fixture } from "../../hooks/fixture";
export default class PlaywrightWrapperDataWriter {

    constructor(private page: Page, private common: PlaywrightWrapperCommon, private pageElement: PlaywrightWrapperPageElement) { }
    
    overridePage(newPage:Page):Page{
        const oldPage=this.page;
        this.page=newPage;
        return oldPage;
    }

    /**
     * Must be called only when there are multiple elements matching the given ID
     * @param id 
     * @param elementIndex zero-based index; to click the first element, this value must be zero
     * @param txtToFill
     */
    async fillIndexedElementById(id: string, elementIndex: number, txtToFill: string){
        const ele = this.page.locator(this.common.getXPathWithId(id)).nth(elementIndex);
        await ele.fill(txtToFill);
    }
    async enterValueIntoTextboxById(inputId: string, val: number | string, shouldTabOut: boolean = false){
        const locatorPath = this.common.getXPathWithId(inputId);
        const ele = this.page.locator(locatorPath);
        await this.enterDataIntoInput(ele, val.toString(), shouldTabOut);
    }

     private async enterDataIntoInput(element: Locator, val: string, shouldTabOut: boolean){
        await element.click();
        await element.fill(val);
        if(shouldTabOut)
            await element.press(KeyBoardItems.TAB);
    }
    async enterValueIntoTextboxByXPath(xpath: string, val: string, shouldTabOut: boolean = false){
        const element = await this.pageElement.getVisibleElement(xpath, 10000);
        await this.enterDataIntoInput(element, val, shouldTabOut);
    }

    async enterValueIntoTextboxByName(name: string, val: string, shouldTabOut: boolean = false){
        const xpath = `//${HtmlRoles.INPUT}[@name='${name}']`;
        const element = this.page.locator(xpath);
        await this.enterDataIntoInput(element, val, shouldTabOut);
      }

    async enterValueIntoIndexedTextboxByXPath(index: number, xpath: string, val: string, shouldTabOut: boolean = false){
        const element = await this.pageElement.getIndexedVisibleElement(index, xpath);
        await this.enterDataIntoInput(element, val, shouldTabOut);
    }
    async enterValueIntoTextbox(inputId: string, val: number | string, shouldTabOut: boolean = false){
        const locatorPath = this.common.getInputXPathWithId(inputId);
        const ele = this.page.locator(locatorPath);
        await this.enterDataIntoInput(ele, val.toString(), shouldTabOut);
    }

    async enterValueIntoIndexedTextbox(index: number, inputId: string, val: number | string, shouldTabOut: boolean = false){
        const locatorPath = this.common.getInputXPathWithId(inputId);
        const ele = this.page.locator(locatorPath).nth(index);
        await this.enterDataIntoInput(ele, val.toString(), shouldTabOut);
    }
    async enterValueIntoTextboxByTestId(txtBoxTestId: string, value: string, shouldTabOut: boolean = false){
        const element = this.page.getByTestId(txtBoxTestId);
        await this.enterDataIntoInput(element, value, shouldTabOut);
    }
    async enterValueIntoTextboxByPlaceholder(placeholderText: string, value: string, shouldTabOut: boolean = false){
        const element = this.page.getByPlaceholder(placeholderText);
        await this.enterDataIntoInput(element, value, shouldTabOut);
    }
    async enterValueIntoTextboxByRole(roleText: string, value: string, shouldTabOut: boolean = false){
        const element = this.page.getByRole(HtmlRoles.TABLE_ROW_ROLE, { name: `${roleText}` }).getByRole(HtmlRoles.TEXT_BOX);
        await this.enterDataIntoInput(element, value, shouldTabOut);
    }

    async enterValueIntoChildTextboxByPlaceholder(parentElementXPath: string, placeholderText: string, value: string, shouldTabOut: boolean = false){
        const element = this.page.locator(parentElementXPath).getByPlaceholder(placeholderText);
        await this.enterDataIntoInput(element, value, shouldTabOut);
    }
    async enterValueIntoTextboxByLabel(labelText: string, value: string, shouldTabOut: boolean = false, isExact: boolean = false){
        const element = this.page.getByLabel(labelText, {exact: isExact});
        await this.enterDataIntoInput(element, value, shouldTabOut);
    }
    async enterValueIntoTextboxInATableRow(rowName: string, value: string, shouldTabOut: boolean = false){
        const element = this.page.getByRole(HtmlRoles.TABLE_ROW_ROLE, { name: `${rowName}` }).getByRole(HtmlRoles.TEXT_BOX);
        await this.enterDataIntoInput(element, value, shouldTabOut);
    }

    /**
     * Note: this methdo does not check if the specified xpath corresponds to an INPUT type. If it does not then this method will fail.
     * @param xpath xpath of the element to find below a table row ('row') element
     * @param rowName 
     * @param value 
     */
    async enterValueIntoTextboxInATableRowByXPath(xpath: string, rowName: string, value: string, shouldTabOut: boolean = false){
        const element = this.page.getByRole(HtmlRoles.TABLE_ROW_ROLE, { name: `${rowName}` }).locator(xpath);
        await this.enterDataIntoInput(element, value, shouldTabOut);
    }

    async enterValueIntoIndexedTextboxInATableRow(index: number, rowName: string, value: string, shouldTabOut: boolean = false){
        const element = this.page.getByRole(HtmlRoles.TABLE_ROW_ROLE, { name: `${rowName}` }).getByRole(HtmlRoles.TEXT_BOX).nth(index);
        await this.enterDataIntoInput(element, value, shouldTabOut);
    }

    async enterValueIntoTextAreaByName(txtAreaInputName: string, val: string){
        const locatorPath = `//${HtmlRoles.TEXT_AREA}[@name='${txtAreaInputName}']`;
        const element = this.page.locator(locatorPath);
        await element.fill(val);
    }
    
    async selectOption(optionName: string){
        const element = this.page.getByRole(HtmlRoles.OPTION, { name: optionName });
        await element.click({ force: true });
    }
    async selectOptionByTestId(testId:string,optionValue:string,isExact:boolean=true){
        (await this.pageElement.getElementByTestId(testId)).click();
        await this.page.getByRole(HtmlRoles.OPTION, { name: optionValue, exact: isExact }).click();
    }

    async selectMenuItemByTestId(testId:string, menuItem:string,isExact:boolean=true){
        (await this.pageElement.getElementByTestId(testId)).click();
        await this.page.getByRole(HtmlRoles.MENUITEM, { name: menuItem, exact: isExact }).click();  
      }

    async selectLabelledDropdownOption(dropdownLabel: string, optionName: string){
        await this.page.getByLabel(dropdownLabel).selectOption(optionName);
    }
    async selectDropdownOption(dropdownElement: Locator, optionText: string){
        await dropdownElement.click();
        await dropdownElement.fill(optionText);
        await this.page.waitForTimeout(1000);
        await dropdownElement.press(KeyBoardItems.ENTER);
    }



    async selectDropDownByXPath(XPath: string, option: string) {
        await this.page.locator(XPath).click();
        await this.selectOption(option);
    }

    async checkCheckboxByLabel(labelName: string){
        const element = await this.pageElement.getElementByLabel(labelName);
        await element.check();
    }

    async checkCheckBox(xpath: string){
        const element = this.page.locator(xpath);
        if(!await element.isChecked())
            await element.check();
    }

    async uploadFile(XPath: string , fileToUpload: string){
        await this.page.setInputFiles(XPath, fileToUpload);
    }
    async enterTextByXpath(xpath: string, value: string){
        this.page.locator(xpath).fill(value);
    }

    async setTextByXpath(xpath: string, value: string){
        let ele = this.page.locator(xpath)
        await ele.click();
        ele.evaluate((ele, value) => {ele.textContent = value}, value);
    }
    async setSliderValueByInputAttribute(xpath: string, value: string,currentVal: string): Promise<void> {
        const element = this.page.locator(xpath);
        await element.focus();
        if(currentVal < value){
            await element.press(KeyBoardItems.RIGHT_ARROW); 
        }
        else if(currentVal > value){
            await element.press(KeyBoardItems.LEFT_ARROW); 
        }
        fixture.logger.info("Slider value set to: " + value);
      }
      
}