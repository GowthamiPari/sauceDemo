import { Page } from "@playwright/test";
import HtmlElementProperties from "./htmlElementProperties";
import HtmlRoles from "./htmlRoles";

export default class PlaywrightWrapperCommon {
    constructor(private page: Page) { }
    
    overridePage(newPage:Page):Page{
        const oldPage=this.page;
        this.page=newPage;
        return oldPage;
    }
    async delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
    getXPathWithId(id: string){
        return `[${HtmlElementProperties.ID}='${id}']`;
    }

    getInputXPathWithId(inputId: string){
        return `${HtmlRoles.INPUT}[name="${inputId}"]`
    }
}