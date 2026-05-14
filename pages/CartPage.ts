import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for SauceDemo Cart Page
 */
export class CartPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async assertOnCartPage() {
    await expect(this.page).toHaveURL(/.*cart/);
    await expect(this.pageTitle).toHaveText('Your Cart');
  }

  async assertCartItemCount(expectedCount: number) {
    await expect(this.cartItems).toHaveCount(expectedCount);
  }

  async assertProductInCart(productName: string) {
    const item = this.page.locator('.cart_item').filter({ hasText: productName });
    await expect(item).toBeVisible();
  }

  async assertProductNotInCart(productName: string) {
    const item = this.page.locator('.cart_item').filter({ hasText: productName });
    await expect(item).not.toBeVisible();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}
