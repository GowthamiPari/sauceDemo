import { fixture } from "../../hooks/fixture";
import SauceDemoPage from "../../pages/loginPage";
import SharedPageBehavior from "../../pages/sharedPageBehavior";

export default class StepPageHelper {
    static async getSharedPageBehavior()
    {
        return await fixture.pageFactory.getPage(SharedPageBehavior, fixture.page);
    }

    // static async getLoggedInUserHomePage(){
    //     return await fixture.pageFactory.getPage(LoggedInUserHomePage, fixture.page);
    // }

    static async getSauceDemoPage(){
        return await fixture.pageFactory.getPage(SauceDemoPage, fixture.page);
    }
}