"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const exempItems_1 = require("./exempItems");
const readline = __importStar(require("readline"));
/**
 * @param name
 * @returns  Whether the item is exempt from basic sales tax
 */
const isExempt = (name) => {
    const pattern = exempItems_1.exemptItems.map((item) => `${item}s?`).join('|');
    const exemptRegex = new RegExp(`\\b(${pattern})\\b`, 'i');
    return exemptRegex.test(name);
};
/**
 * @param amount
 * @returns  The amount rounded up to the nearest 0.05
 */
const roundUpToNearestFiveCents = (amount) => {
    return Math.ceil(amount * 20) / 20;
};
/**
 *
 * @param price
 * @param exempt
 * @returns The basic sales tax for the item
 */
const calculateBasicSalesTax = (price, exempt) => {
    if (exempt)
        return 0;
    const tax = price * 0.1;
    return roundUpToNearestFiveCents(tax);
};
/**
 *
 * @param price
 * @param imported
 * @returns The import duty for the item
 */
const calculateImportDuty = (price, imported) => {
    if (!imported)
        return 0;
    const tax = price * 0.05;
    return roundUpToNearestFiveCents(tax);
};
/**
 * @param item
 * @returns The final price and taxes for the item
 */
const calculateItemFinalPrice = (item) => {
    const basicSalesTax = calculateBasicSalesTax(item.price, isExempt(item.name));
    const importDuty = calculateImportDuty(item.price, item.imported);
    const finalPrice = (item.price + basicSalesTax + importDuty) * item.quantity;
    return {
        finalPrice: finalPrice,
        taxes: basicSalesTax + importDuty * item.quantity,
        quantity: item.quantity,
    };
};
/**
 *
 * @param items
 * @returns The receipt for the items
 */
const generateReceipt = (items) => {
    const receiptItems = items.map((item) => {
        const calculatedItem = calculateItemFinalPrice(item);
        return {
            name: item.name,
            finalPrice: calculatedItem.finalPrice,
            taxes: calculatedItem.taxes,
            quantity: calculatedItem.quantity,
        };
    });
    const totalCost = receiptItems.reduce((acc, item) => acc + item.finalPrice, 0);
    const totalTaxes = receiptItems.reduce((acc, item) => acc + item.taxes, 0);
    return { items: receiptItems, totalCost, totalTaxes };
};
/**
 *
 * @param input
 * @returns  The items from the input string
 */
const buildItemsFromInput = (input) => {
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
const getUserInput = (query) => {
    return new Promise((resolve) => rl.question(query, resolve));
};
/**
 * @description  Main function
 * @returns  The receipt for the items
 */
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Please enter the items you want to add to the receipt. Type "done" when you are finished.\n\n');
    const inputLines = [];
    rl.on('line', (line) => {
        if (line.toLowerCase().trim() === 'done') {
            rl.close();
        }
        else {
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
        }
        catch (error) {
            console.error('Ups, Something went wrong! :(');
        }
    });
});
main();
