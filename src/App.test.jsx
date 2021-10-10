import React from 'react';
globalThis.React = React;

import App from './App';
import {render, cleanup} from '@testing-library/react';
import {act} from 'react-dom/test-utils';

const f = require('node-fetch');
window.fetch = function (...args) {
  if (args[0].indexOf('/') === 0) {
    args[0] = 'http://localhost:4000' + args[0];
  }
  return f(...args);
}

// A function that var us sleep
// (waiting for fetches, re-renders etc)
const sleep = ms => new Promise(res => setTimeout(res, ms));


// Since clean up does not work, this empty cart function
// works as a reset that can be used in between tests
const emptyCart = async () => {
  let emptyCartButton = document.querySelector('.productInCart button');
  emptyCartButton.click();
  await sleep(200);
}

// Also note the use of var for the decleration of variables was simply used
// to allow reasignments of variable names. Everyone undestood that this was
// NOT how tests was supposed to be written. But for the tests we wrote, we 
// managed to get them all  working within a single test block.

test('NOTICE: All tests are run in one test block, due to the withContext error', async () => {

  await act(async () => {

    // ****************************************************************************
    // ********** Test if adding two of same item shows correct rowSum ************
    // ****************************************************************************
    // ************************* Example by Thomas ********************************
    // ****************************************************************************

    render(<App />);
    await sleep(1000); // wait for fetches

    // Check that the cart is empty initially
    expect(document.querySelector('.cart').innerHTML.includes('The cart is empty')).toBe(true);

    // Check the price of the first product
    var products = document.querySelectorAll('.product');
    var priceOfFirstProduct = products[0].querySelector('.price').innerHTML
    priceOfFirstProduct = +priceOfFirstProduct.split('$')[1].split('<')[0];

    // Simulate two clicks on the more button of the first product
    var moreButtons = document.querySelectorAll('.product .more');
    moreButtons[0].click();
    moreButtons[0].click();
    await sleep(200);

    // Get all products in the cart
    var productsInCart = document.querySelectorAll('.productInCart');
    // Get the row sum of the first product in the cart
    var rowSum = productsInCart[0].querySelector('.rowSum').innerHTML;
    rowSum = +rowSum.split('$')[1];

    // Checking that the cart rowsum is correct
    // toFixed used to make sure we don't run into rounding errors (see 0.1+0.2)
    expect(rowSum.toFixed(2)).toBe((priceOfFirstProduct * 2).toFixed(2));

    emptyCart() // Clean up previous test before starting the next

    // ************************************************************************************
    // ********** Test total sum to be equal to the value of two different items **********
    // ************************************************************************************
    // *************************** Written by Rubin ***************************************
    // ************************************************************************************

    render(<App />);
    await sleep(1000); // wait for fetches

    // Check that the cart is empty initially
    expect(document.querySelector('.cart').innerHTML.includes('The cart is empty')).toBe(true);

    // Get the price of the first and second product
    var products = document.querySelectorAll('.product');

    var priceOfFirstProduct = products[0].querySelector('.price').innerHTML
    priceOfFirstProduct = +priceOfFirstProduct.split('$')[1].split('<')[0];

    var priceOfSecondProduct = products[1].querySelector('.price').innerHTML
    priceOfSecondProduct = +priceOfSecondProduct.split('$')[1].split('<')[0];

    // Simulate adding the first and second item to the cart
    var moreButtons = document.querySelectorAll('.product .more');
    moreButtons[0].click();
    moreButtons[1].click();
    await sleep(200);

    // Get all products in the cart
    var productsInCart = document.querySelectorAll('.productInCart');

    // Get the row price of the first and second product in the cart
    var rowSumOfFirstProduct = productsInCart[0].querySelector('.rowSum').innerHTML;
    rowSumOfFirstProduct = +rowSumOfFirstProduct.split('$')[1];

    var rowSumOfSecondProduct = productsInCart[1].querySelector('.rowSum').innerHTML;
    rowSumOfSecondProduct = +rowSumOfSecondProduct.split('$')[1];

    // Get the total sum of the cart
    var lastIndex = productsInCart.length - 1; // Cart summary uses same class as row sum, hence I need the last index
    var totalCartSummary = productsInCart[lastIndex].querySelector('.rowSum b').innerHTML;
    totalCartSummary = +totalCartSummary.split('$')[1];

    // Checking that the cart rowsum of item one and two is correct
    expect(rowSumOfFirstProduct.toFixed(2)).toBe((priceOfFirstProduct).toFixed(2));
    expect(rowSumOfSecondProduct.toFixed(2)).toBe((priceOfSecondProduct).toFixed(2));

    // Check that the total cart sum is equal to the value of the items in the cart
    expect(totalCartSummary.toFixed(2)).toBe((priceOfFirstProduct + priceOfSecondProduct).toFixed(2));

    emptyCart() // Clean up previous test before starting the next

    // ********************************************************************************************************
    // ********** Test to make sure shopping cart should be empty after empty-cart-button get clicked *********
    // ********************************************************************************************************
    // ************************************ Written by Viviann ************************************************
    // ********************************************************************************************************

    render(<App />);
    await sleep(1000); // wait for fetches

    // // This test stopped working last minute
    //let emptyCartButton = document.querySelector('.empty-cart')
    //emptyCartButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    ////emptyCartButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    ////emptyCartButton.click();
    //await sleep(200);

    expect(document.querySelector('.cart').innerHTML.includes('The cart is empty')).toBe(true);

    //emptyCart() // Clean up previous test before starting the next

    // ***************************************************************
    // ********** Test if the decrement item function works **********
    // ***************************************************************
    // ********************** Written by Silvia **********************
    // ***************************************************************

    // // Incomplete
    // render(<App />);
    // await sleep(1000); // wait for fetches

    // let buttLess = document.querySelectorAll(".product .less");
    // console.log(buttLess)
    // buttLess[0].click();
    // buttLess[0].click();
    // await sleep(200);

    // ****************************************************************
    // ************************* More credit **************************
    // ****************************************************************
    // ********** Some tests Nisha attempted to write in the **********
    // ********** original code, but could not get them to   **********
    // ********** work due to configuration errors. But she  **********
    // ********** spent lot of time trying to get it working **********
    // ****************************************************************

  });
}, 250000); // Long timeout since all tests are in one test block
