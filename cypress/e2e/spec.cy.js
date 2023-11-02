/// <reference types="cypress" />

describe("basic workflows", () => {
  before(() => {
    cy.exec("npm run reset");
  });

  it("should be able to purchase products", () => {
    cy.visit("/");

    // Exercise 1. Add items to cart using the UI

    // Exercise 2. Visit the cart page

    // Exercise 3. Click on Checkout

    // Exercise 4. Choose login option when prompted

    // Make sure stripe errors do not stop the test
    cy.origin("https://checkout.stripe.com", () => {
      cy.on("uncaught:exception", (e) => {
        return false;
      });
    });

    // Exercise 5. Register as a new user

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

    // Exercise 6. Assert order details
  });
});
