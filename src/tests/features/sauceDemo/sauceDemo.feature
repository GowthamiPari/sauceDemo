@SD
Feature: Sample automation of SauceDemo site
    Background:
        Given feature uses the data file "json://CONFIG"
        And user navigates to sauceDemo login page
    @1
    Scenario: Ability to login successfully
    User should be able to login to sauce demo application
        When user enters "userName"
        And user enters "password"
        And user clicks on "login button" 
        Then user should be able to view "ShoppingCart Icon"
    @2
    Scenario: Ability to get all item prices
    User should be able to get all item prices
        Given user successfully logs into application  
        Then user should be able to view prices for all elements
    @3
    Scenario: Ability to add Sauce Labs Backpack to cart
    User should be able to add Sauce Labs Backpack to cart
        Given user successfully logs into application
        When user adds item to cart
        Then user should be able to view item in cart