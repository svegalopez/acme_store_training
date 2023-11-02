/// <reference types="cypress" />

describe("basic workflows", () => {
  before(() => {
    cy.exec("npm run reset");
  });

  it("should be able to purchase products", () => {
    cy.visit("/");

    // Add items to cart:
    cy.contains("Premium Dog Food")
      .closest("[data-testselector=product]")
      .contains("Add to cart")
      .click();

    cy.contains("Cat Play Tower")
      .closest("[data-testselector=product]")
      .find("input[type=number]")
      .type("2");

    cy.contains("Cat Play Tower")
      .closest("[data-testselector=product]")
      .contains("Add to cart")
      .click();

    // Visit cart
    cy.get("[data-testselector=navbar]").contains("Cart (3)").click();

    // Click on Checkout
    cy.contains("Checkout").click();

    // Choose login option
    cy.contains("Log in").click();

    // Make sure stripe errors do not stop the test
    cy.origin("https://checkout.stripe.com", () => {
      cy.on("uncaught:exception", (e) => {
        return false;
      });
    });

    // Register as a new user
    cy.contains("create an account").click();
    cy.get("input[name=email]").type(`${Date.now()}@test.com`);
    cy.get("input[name=password]").type("Password1");
    cy.get("button").contains("Register").click();

    // Wait until stripe checkout is loaded
    cy.wait(5000);

    // Fill in the stripe checkout details
    cy.origin("https://checkout.stripe.com", () => {
      cy.get("input[name=email]").type("testuser@email.com");
      cy.get("input[name=shippingName]").type("Test User");
      cy.contains("Enter address manually").click();
      cy.get("input[name=shippingAddressLine1]").type("2345 Curry Lane");
      cy.get("input[name=shippingLocality]").type("Miami");
      cy.get("input[name=shippingPostalCode]").type("33137");
      cy.get("input[name=cardNumber]").type("4242424242424242424242");
      cy.get("input[name=cardExpiry]").type("3/33");
      cy.get("input[name=cardCvc]").type("333");
      cy.get("label[for=enableStripePass]").click();
      cy.get("button.SubmitButton").click();
    });

    // Check the order confirmation page
    cy.intercept({
      method: "GET",
      url: "http://localhost:3088/api/order-confirmation?session_id=*",
    }).as("orderConfirmation");
    cy.wait("@orderConfirmation", {
      timeout: 20000,
    });

    cy.contains("status: processing").should("exist");
  });
});
