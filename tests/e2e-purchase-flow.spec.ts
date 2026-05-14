/**
 * Test Suite: SauceDemo End-to-End Purchase Flow
 *
 * Why this flow was chosen:
 * The Login → Browse Products → Add to Cart → Checkout flow is the most critical
 * user journey on any e-commerce platform. It tests authentication, product selection,
 * cart state management, form validation, and order confirmation — all in one flow.
 * A bug anywhere in this path directly impacts revenue, making it the highest-priority
 * regression test to automate.
 *
 * Site under test: https://www.saucedemo.com (SauceDemo by Sauce Labs)
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { USERS, PRODUCTS, CUSTOMER_INFO, ERROR_MESSAGES } from '../utils/testData';

test.describe('SauceDemo - End-to-End Purchase Flow', () => {

  test.beforeEach(async ({ page }) => {
    // Always start from login page for a clean state
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // ─────────────────────────────────────────────
  // TC-001: Complete E2E — Login → Add to Cart → Checkout → Order Confirmed
  // ─────────────────────────────────────────────
  test('TC-001: Complete purchase flow from login to order confirmation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Step 1: Login with valid credentials
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.assertOnInventoryPage();

    // Step 2: Verify products are loaded (at least 1 item)
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);

    // Step 3: Add two products to cart
    await inventoryPage.addProductToCartByName(PRODUCTS.backpack);
    await inventoryPage.addProductToCartByName(PRODUCTS.bikeLight);
    await inventoryPage.assertCartBadgeCount(2);

    // Step 4: Navigate to cart and verify items
    await inventoryPage.goToCart();
    await cartPage.assertOnCartPage();
    await cartPage.assertCartItemCount(2);
    await cartPage.assertProductInCart(PRODUCTS.backpack);
    await cartPage.assertProductInCart(PRODUCTS.bikeLight);

    // Step 5: Proceed to checkout
    await cartPage.proceedToCheckout();
    await checkoutPage.assertOnCheckoutStep1();

    // Step 6: Fill in customer information
    await checkoutPage.fillCustomerInfo(
      CUSTOMER_INFO.valid.firstName,
      CUSTOMER_INFO.valid.lastName,
      CUSTOMER_INFO.valid.postalCode
    );
    await checkoutPage.assertOnCheckoutStep2();

    // Step 7: Verify order summary is shown with amounts
    await checkoutPage.assertOrderSummaryVisible();
    const total = await checkoutPage.getTotalAmount();
    expect(total).toBeGreaterThan(0);

    // Step 8: Finish order and verify confirmation
    await checkoutPage.finishOrder();
    await checkoutPage.assertOrderConfirmed();
  });

  // ─────────────────────────────────────────────
  // TC-002: Login Failure — Locked Out User
  // ─────────────────────────────────────────────
  test('TC-002: Locked-out user sees correct error message on login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login(USERS.locked.username, USERS.locked.password);
    await loginPage.assertErrorMessage(ERROR_MESSAGES.lockedUser);

    // Confirm user is NOT redirected to inventory
    await expect(page).toHaveURL('/');
  });

  // ─────────────────────────────────────────────
  // TC-003: Checkout Form Validation — Missing Fields
  // ─────────────────────────────────────────────
  test('TC-003: Checkout form shows error when required fields are missing', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.addProductToCartByName(PRODUCTS.backpack);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.assertOnCheckoutStep1();

    // Submit without filling any fields
    await checkoutPage.fillCustomerInfo('', '', '');
    await checkoutPage.assertErrorMessage(ERROR_MESSAGES.missingFirstName);

    // Should remain on step 1 — not proceed
    await checkoutPage.assertOnCheckoutStep1();
  });

  // ─────────────────────────────────────────────
  // TC-004: Cart State — Add and Remove Product
  // ─────────────────────────────────────────────
  test('TC-004: Cart badge updates correctly when product is added then removed', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.login(USERS.standard.username, USERS.standard.password);

    // Add product → badge should show 1
    await inventoryPage.addProductToCartByName(PRODUCTS.backpack);
    await inventoryPage.assertCartBadgeCount(1);

    // Remove product → badge should disappear
    await inventoryPage.removeProductFromCartByName(PRODUCTS.backpack);
    await expect(inventoryPage.cartBadge).not.toBeVisible();

    // Cart should be empty
    await inventoryPage.goToCart();
    await cartPage.assertOnCartPage();
    await cartPage.assertCartItemCount(0);
    await cartPage.assertProductNotInCart(PRODUCTS.backpack);
  });

  // ─────────────────────────────────────────────
  // TC-005: Product Sort — Low to High Price
  // ─────────────────────────────────────────────
  test('TC-005: Products sort correctly in ascending price order', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.assertOnInventoryPage();

    await inventoryPage.sortProductsBy('lohi');

    const prices = await inventoryPage.getAllProductPrices();
    const sortedPrices = [...prices].sort((a, b) => a - b);

    // Prices should already be in ascending order after sort
    expect(prices).toEqual(sortedPrices);
  });

});
