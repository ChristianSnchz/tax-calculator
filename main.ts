import { exemptItems } from './exempItems';
import { Item, Receipt } from './types';
import * as readline from 'readline';

/**
 * @param name
 * @returns  Whether the item is exempt from basic sales tax
 */
const isExempt = (name: string): boolean => {
  const pattern = exemptItems.map((item) => `${item}s?`).join('|');
  const exemptRegex = new RegExp(`\\b(${pattern})\\b`, 'i');
  return exemptRegex.test(name);
};

/**
 * @param amount
 * @returns  The amount rounded up to the nearest 0.05
 * @description This function rounds up to the nearest 0.05 by multiplying
 * the amount by 20, rounding it up to the nearest integer, and then dividing it by 20.
 */
const roundUpToNearestFiveCents = (amount: number): number => {
  return Math.ceil(amount * 20) / 20;
};

/**
 *
 * @param price
 * @param exempt
 * @returns The basic sales tax for the item
 */
const calculateBasicSalesTax = (price: number, exempt: boolean): number => {
  if (exempt) return 0;
  const tax = price * 0.1;

  return roundUpToNearestFiveCents(tax);
};

/**
 *
 * @param price
 * @param imported
 * @returns The import duty for the item
 */
const calculateImportDuty = (price: number, imported: boolean): number => {
  if (!imported) return 0;
  const tax = price * 0.05;

  return roundUpToNearestFiveCents(tax);
};

/**
 * @param item
 * @returns The final price and taxes for the item
 */
const calculateItemFinalPrice = (
  item: Item
): {
  finalPrice: number;
  taxes: number;
  quantity: number;
} => {
  const basicSalesTax = calculateBasicSalesTax(item.price, isExempt(item.name));
  const importDuty = calculateImportDuty(item.price, item.imported);

  const finalPrice = (item.price + basicSalesTax + importDuty) * item.quantity;
  const taxes = basicSalesTax + importDuty * item.quantity;

  return {
    finalPrice: finalPrice,
    taxes: taxes,
    quantity: item.quantity,
  };
};

/**
 *
 * @param items
 * @returns The receipt for the items
 */
const generateReceipt = (items: Item[]): Receipt => {
  const receiptItems = items.map((item) => {
    const calculatedItem = calculateItemFinalPrice(item);
    return {
      name: item.name,
      finalPrice: calculatedItem.finalPrice,
      taxes: calculatedItem.taxes,
      quantity: calculatedItem.quantity,
    };
  });

  const totalCost = receiptItems.reduce(
    (acc, item) => acc + item.finalPrice,
    0
  );

  const totalTaxes = receiptItems.reduce((acc, item) => acc + item.taxes, 0);

  return { items: receiptItems, totalCost, totalTaxes };
};

/**
 *
 * @param input
 * @returns  The items from the input string
 * @description Regex explanation:
 * - (\d+): captures the quantity of the item
 * - (.*?): captures the name of the item
 * - (?:\s(?:at|:)\s): non-capturing group that matches the word "at" or ":" surrounded by spaces
 * - (\d+\.\d{2}): captures the price of the item
 */
const buildItemsFromInput = (input: string): Item[] => {
  const lines = input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const itemRegex = /^(\d+)\s(.*?)(?:\s(?:at|:)\s)(\d+\.\d{2})$/;

  return lines.map((line) => {
    const match = line.match(itemRegex);
    if (!match) {
      console.error(' \n\nInvalid input \n');

      console.info('Please enter the items in the following format: \n');
      console.info('1 book at 12.49\n\n');
      process.exit(1);
    }

    const [, quantity, name, price] = match;
    const imported = name.includes('imported');

    return {
      name: name.trim(),
      price: parseFloat(price),
      quantity: parseInt(quantity),
      imported,
    };
  });
};

//  -------------------------

/**
 * @param query
 * @returns  The user input
 * @description  Get user input from the console
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * @description  Main function
 * @returns  The receipt for the items
 */
const main = async () => {
  console.log(
    'Please enter the items you want to add to the receipt. Type "done" when you are finished.\n\n'
  );

  const inputLines: string[] = [];

  rl.on('line', (line) => {
    if (line.toLowerCase().trim() === 'done') {
      rl.close();
    } else {
      inputLines.push(line);
    }
  });

  rl.on('close', () => {
    const input = inputLines.join('\n');
    console.log(`\nInput captured:\n${input}\n`);
    const items = buildItemsFromInput(input);

    try {
      const receipt = generateReceipt(items);
      console.log('      _________');
      console.log(`     / =======  \ `);
      console.log(`    / __________ \ `);
      console.log('   | ___________ | ');
      console.log('   | | -       | | ');
      console.log('   | |         | | ');
      console.log('   | |_________| | ___________');
      console.log('    =____________/    Receipt ');
      console.log(`   / """"""""""" \           `);
      console.log(`  / ::::::::::::: \          `);
      console.log(' (_________________)');
      console.log('');
      console.log('');
      const displayItems = receipt.items.map((item) => {
        return {
          quantity: item.quantity,
          name: item.name,
          finalPrice: item.finalPrice.toFixed(2),
        };
      });

      const totals = [
        {
          name: 'Sales Taxes',
          value: receipt.totalTaxes.toFixed(2),
        },
        {
          name: 'Total',
          value: receipt.totalCost.toFixed(2),
        },
      ];

      console.table(displayItems);
      console.table(totals);
    } catch (error) {
      console.error('Ups, Something went wrong! :(');
    }
  });
};
main();
