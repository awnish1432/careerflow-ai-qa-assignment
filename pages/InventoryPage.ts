import { Page, Locator, expect } from "@playwright/test";

/**
 * Page Object Model for SauceDemo Inventory (Products) Page
 */
export class InventoryPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly inventoryItems: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator(".title");
    this.inventoryItems = page.locator(".inventory_item");
    this.sortDropdown = page.locator(".product_sort_container");
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.cartIcon = page.locator(".shopping_cart_link");
  }

  async assertOnInventoryPage() {
    await expect(this.page).toHaveURL(/.*inventory/);
    await expect(this.pageTitle).toHaveText("Products");
  }

  async getProductCount(): Promise<number> {
    return await this.inventoryItems.count();
  }

  async addProductToCartByName(productName: string) {
    const product = this.page
      .locator(".inventory_item")
      .filter({ hasText: productName });
    const addButton = product.locator('button[data-test^="add-to-cart"]');
    await addButton.click();
  }

  async removeProductFromCartByName(productName: string) {
    const product = this.page
      .locator(".inventory_item")
      .filter({ hasText: productName });
    const removeButton = product.locator('button[data-test^="remove"]');
    await removeButton.click();
  }

  async assertCartBadgeCount(expectedCount: number) {
    await expect(this.cartBadge).toHaveText(String(expectedCount));
  }

  async sortProductsBy(option: "az" | "za" | "lohi" | "hilo") {
    await this.sortDropdown.selectOption(option);
  }

  async getAllProductNames(): Promise<string[]> {
    return await this.page.locator(".inventory_item_name").allTextContents();
  }

  async getAllProductPrices(): Promise<number[]> {
    const priceTexts = await this.page
      .locator(".inventory_item_price")
      .allTextContents();
    return priceTexts.map((p) => parseFloat(p.replace("$", "")));
  }

  async goToCart() {
    await this.cartIcon.click();
  }
}
