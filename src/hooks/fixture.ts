import { Page } from "@playwright/test";
import { Logger } from "winston";
import DataBag from "../helpers/util/dataBag";
import TestDataProvider from "../helpers/util/test-data/testDataProvider";
import PageFactory from "../pages/pageFactory";

export const fixture = {
    /* eslint @typescript-eslint/ban-ts-comment: "off" */
    //@ts-ignore"
    scenarioRetryCount: undefined as { [key: string]: number },// Global object to store retry attempts
    maxRetryCount: undefined as number, // Max retry count from environment variable or default value
    page: undefined as Page,
    logger: undefined as Logger,
    dataBag: undefined as DataBag,
    testDataProvider: undefined as TestDataProvider,
    pageFactory: undefined as PageFactory,
}