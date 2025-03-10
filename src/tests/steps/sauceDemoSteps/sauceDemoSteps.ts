import { Given, setDefaultTimeout, Then, When } from "@cucumber/cucumber";
import StepPageHelper from "../stepPageHelper";
import { fixture } from "../../../hooks/fixture";
import { expect } from "playwright/test";
import DataBagKeys from "../dataBagKeys";
import ConfigData from "../../../test-data-models/config/configData";
import { TestDataType } from "../../../helpers/util/test-data/TestDataType";
import StepDataHelper from "../stepDataHelper";
setDefaultTimeout(60 * 1000 * 5);

Given('feature uses the data file {string}', async function (dataFilePath: string) {
    const configDataPath = "json://CONFIG";
    const data = StepDataHelper.getSingleTestDataRecordForType(TestDataType.ConfigData, configDataPath) as ConfigData;
    fixture.dataBag.saveData(DataBagKeys.CONFIG, data);
    const dataStoreName = StepDataHelper.getDataStoreName(dataFilePath);
  
     if (dataStoreName == "CONFIG") {
      const data = StepDataHelper.getSingleTestDataRecordForType(TestDataType.ConfigData, dataFilePath) as ConfigData;
      fixture.dataBag.saveData(DataBagKeys.CONFIG, data);
    }
   
  
  });

Given('user successfully logs into application', async function (){
    let sauceDemoPage = await StepPageHelper.getSauceDemoPage();
    await sauceDemoPage.enterUserName();
    await sauceDemoPage.enterPassword();
    await sauceDemoPage.clickLoginBtn();
    expect (await sauceDemoPage.isShoppingCartLinkVisible()).toBeTruthy();
})
Given('user navigates to sauceDemo login page', async () => {
    let sauceDemoPage = await StepPageHelper.getSauceDemoPage();
    try{
        await sauceDemoPage.navigateToLoginPage();
        fixture.logger.info("Navigated to sauceDemo login page");
    }
    catch(error)
    {
        fixture.logger.error("Failed to navigate to revenue calculator page. Error: " + error);
    }
})
When(`user enters {string}`, async function(field: string){
    let sauceDemoPage = await StepPageHelper.getSauceDemoPage();
try{
    switch(field){
        case "userName":
        await sauceDemoPage.enterUserName();
        break;
        case "password":
            await sauceDemoPage.enterPassword();
            break;
        default:
            fixture.logger.error('No such field exists');
    }
    fixture.logger.info(`User entered ${field}`);
}
catch(error){    
    fixture.logger.error(`Failed to enter ${field}. Error: ${error}`);
}
    
})
When('user clicks on {string}', async function(field : string) {
    let sauceDemoPage = await StepPageHelper.getSauceDemoPage();
    try{
        switch(field){
            case "login button":
                await sauceDemoPage.clickLoginBtn();
                break;
            case "filter icon":
                await sauceDemoPage.clickOnFilterIcon();
                break;
            default:
                fixture.logger.error('No such field exists');
        }
        fixture.logger.info(`User clicked on ${field}`);
    }
    catch(error){    
        fixture.logger.error(`Failed to click on ${field}. Error: ${error}`);
    }
})
Then ('user should be able to view {string}', async function (field: string) {
    let sauceDemoPage = await StepPageHelper.getSauceDemoPage();
    let result = false;
    try{
        switch(field){
            case "ShoppingCart Icon":
                result = await sauceDemoPage.isShoppingCartLinkVisible();
                fixture.logger.info("Shopping cart icon is visible: " + result);
                break;
            default:
                fixture.logger.error('No such field exists');
        }
    }
    catch(error){
        fixture.logger.error(`Failed to check if ${field} is visible. Error: ${error}`);
    }
    expect(result).toBeTruthy();
})

Then('user should be able to view prices for all elements', async function () {
    let sauseDemoPage = await StepPageHelper.getSauceDemoPage();
    let prices: string[] = [];
    let result = true;
    try{
                prices = await sauseDemoPage.getAllItemPrices();
                fixture.logger.info("Result is  : " +result );
    }    
    catch(error){  
        result = false;  
        fixture.logger.error(`Failed to check prices for all elements. Error: ${error}`);
    }
    expect(result).toBeTruthy();        
}) 
    When('user adds item to cart', async function () {
        let sauceDemoPage = await StepPageHelper.getSauceDemoPage();
        const configData = fixture.dataBag.getData(DataBagKeys.CONFIG) as ConfigData;//config data has the item name I wanted to select
        try{
            fixture.logger.info(`Item name is ${configData.itemName}`);
            await sauceDemoPage.clickOnAddToCartBtn(configData.itemName);
            
        }
        catch(error){
            fixture.logger.error(`Failed to add to cart. Error: ${error}`);
        }    
    })
    Then(`user should be able to view item in cart`, async function () {
        let sauceDemoPage = await StepPageHelper.getSauceDemoPage();
        let result=true;
        const configData = fixture.dataBag.getData(DataBagKeys.CONFIG) as ConfigData;//config data has the item name I wanted to select
        try{
            result = await sauceDemoPage.isItemInCart(configData.itemName);
            fixture.logger.info("Result is  : " +result );
        }    
        catch(error){
            result=false;
            fixture.logger.error(`Failed to check if item is in cart. Error: ${error}`);    
        }
        expect(result).toBeTruthy();
        }
    )
