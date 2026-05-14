/**
 * Test data and constants for SauceDemo automation
 * Centralising test data here makes tests easy to maintain
 */

export const USERS = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  locked: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
  problemUser: {
    username: 'problem_user',
    password: 'secret_sauce',
  },
  performanceGlitch: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
  },
};

export const CUSTOMER_INFO = {
  valid: {
    firstName: 'Awnish',
    lastName: 'Yadav',
    postalCode: '122001',
  },
  empty: {
    firstName: '',
    lastName: '',
    postalCode: '',
  },
};

export const PRODUCTS = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
  fleeceJacket: 'Sauce Labs Fleece Jacket',
  onesie: 'Sauce Labs Onesie',
  tShirtRed: 'Test.allTheThings() T-Shirt (Red)',
};

export const ERROR_MESSAGES = {
  lockedUser: 'Epic sadface: Sorry, this user has been locked out.',
  missingFirstName: 'Error: First Name is required',
  missingLastName: 'Error: Last Name is required',
  missingPostalCode: 'Error: Postal Code is required',
  invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
};
