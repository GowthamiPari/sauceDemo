import { Page } from "@playwright/test";
import BasePage from "./basePage";
import { fixture } from "../hooks/fixture";
import HtmlRoles from "../helpers/wrapper/htmlRoles";



export default class SauceDemoPage extends BasePage {
    newPage: Page;
    replaceIndex="replace-index";
    Elements = {
      userNameId:"user-name",
      passwordId:"password",
      loginBtnId:"login-button",
      shoppingCartLinkXPath:"//*[@data-test='shopping-cart-link']",
      filterIconXPath:"//*[@data-test='product-sort-container']",
      itemsCountXPath:"(//*[@class='inventory_item_price'])",
      itemPriceXPath:`(//*[@class='inventory_item_price'])[${this.replaceIndex}]`,
      itemNameXPath:`(//*[@class='inventory_item']//*[@class='inventory_item_name '])[${this.replaceIndex}]`,
      addToCartId:"add-to-cart-sauce-labs-backpack",
      shoppingCartBadgeXPath:"//span[@class='shopping_cart_badge']",
      checkOutBtnName:"Checkout",

    }
    async canNavigateWithUrl(): Promise<boolean>{
        return false;
    }
    
    /*eslint @typescript-eslint/require-await: "off" */
    async isPageStable(): Promise<boolean> {
        return true;
    }
    async getPageCurrentTitle(): Promise<string> {
        return await this.page.title();
    }
    async enterUserName(){
        fixture.logger.info("Username: " + process.env.USERNAME);
        await this.pwWrapper.common.delay(3000);// just for viewing
        await this.pwWrapper.dataWriter.enterValueIntoTextboxById(this.Elements.userNameId,process.env.USERNAME);
    }
    async enterPassword(){
        fixture.logger.info("Password: " + process.env.PASSWORD);
        await this.pwWrapper.common.delay(3000);// just for viewing
        await this.pwWrapper.dataWriter.enterValueIntoTextboxById(this.Elements.passwordId,process.env.PASSWORD);
    }
    async navigateToLoginPage() {
        await this.pwWrapper.goto(process.env.BASEURL);
    }
    async clickLoginBtn(){
        await this.pwWrapper.common.delay(3000);// just for viewing
        await this.pwWrapper.elementAction.clickElementById(this.Elements.loginBtnId);
    }
    async isShoppingCartLinkVisible(): Promise<boolean> {   
        await this.pwWrapper.common.delay(3000);// just for viewing 
        return await this.pwWrapper.pageElement.isElementVisible(this.Elements.shoppingCartLinkXPath);
    }
    async clickOnFilterIcon(){
        await this.pwWrapper.elementAction.clickElementByXPath(this.Elements.filterIconXPath);
        await this.pwWrapper.common.delay(3000);// just for viewing
    }
    async getAllItemPrices(){
      let count =  await this.pwWrapper.pageElement.getAvailableElementCount(this.Elements.itemsCountXPath);
      let prices: string[] = [];
      for(let i=1;i<=count;i++){
        let newXPath = this.Elements.itemPriceXPath.replace(this.replaceIndex,i.toString());
        let itemPrice = (await this.pwWrapper.dataReader.getElementTextByXPath(newXPath, false)).replace("$","");
        fixture.logger.info("Item price: " + itemPrice);  
        prices.push(itemPrice);
      }
      return prices;
    }

    
      async clickOnAddToCartBtn( expectedItemName:string){
        let count =  await this.pwWrapper.pageElement.getAvailableElementCount(this.Elements.itemsCountXPath);
        fixture.logger.info("Count: " + count);
        for(let i=1;i<=count;i++){
          let newXPath = this.Elements.itemNameXPath.replace(this.replaceIndex,i.toString());
          let actualItemName = await this.pwWrapper.dataReader.getElementTextByXPath(newXPath, false);
          fixture.logger.info("Item name: " + actualItemName);
          if(actualItemName == expectedItemName){
            await this.pwWrapper.elementAction.clickElementById(this.Elements.addToCartId);
            await this.pwWrapper.common.delay(3000);// just for viewing
            break;
          }
        }   
      }

      async isItemInCart(expectedItemName:string):Promise<boolean>{
        await this.pwWrapper.elementAction.clickElement(this.Elements.shoppingCartBadgeXPath);
        await this.pwWrapper.common.delay(3000);// just for viewing
        let result = await this.pwWrapper.pageElement.isElementVisibleByText(expectedItemName);
        fixture.logger.info("Result: " + result);
        return result;
      }

}
