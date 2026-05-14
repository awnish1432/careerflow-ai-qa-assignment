import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for SauceDemo Checkout Pages (Step 1 & 2 + Confirmation)
 */
export class CheckoutPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  // Step 1: Customer Info
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;
  // Step 2: Overview
  readonly summarySubtotal: Locator;
  readonly summaryTax: Locator;
  readonly summaryTotal: Locator;
  readonly finishButton: Locator;
  // Confirmation
  readonly confirmationHeader: Locator;
  readonly confirmationText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.summarySubtotal = page.locator('.summary_subtotal_label');
    this.summaryTax = page.locator('.summary_tax_label');
    this.summaryTotal = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');
    this.confirmationHeader = page.locator('.complete-header');
    this.confirmationText = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async assertOnCheckoutStep1() {
    await expect(this.page).toHaveURL(/.*checkout-step-one/);
    await expect(this.pageTitle).toHaveText('Checkout: Your Information');
  }

  async assertOnCheckoutStep2() {
    await expect(this.page).toHaveURL(/.*checkout-step-two/);
    await expect(this.pageTitle).toHaveText('Checkout: Overview');
  }

  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async assertOrderSummaryVisible() {
    await expect(this.summarySubtotal).toBeVisible();
    await expect(this.summaryTax).toBeVisible();
    await expect(this.summaryTotal).toBeVisible();
  }

  async getTotalAmount(): Promise<number> {
    const totalText = await this.summaryTotal.textContent() ?? '';
    const match = totalText.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }

  async finishOrder() {
    await this.finishButton.click();
  }

  async assertOrderConfirmed() {
    await expect(this.page).toHaveURL(/.*checkout-complete/);
    await expect(this.confirmationHeader).toHaveText('Thank you for your order!');
    await expect(this.confirmationText).toBeVisible();
  }

  async assertErrorMessage(expectedText: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedText);
  }
}
