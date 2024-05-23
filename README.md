# Tax Calculator

This is a simple tax calculator application written in TypeScript/ Javascript. The application reads a list of items from the user via the console, calculates the sales taxes and total cost, and then prints a detailed receipt.

## Features

- Calculates basic sales tax and import duty.
- Supports exemption for books, food, and medical products.
- Handles multiple lines of input.
- Outputs a formatted receipt with item details and totals.

## How It Works

1. The user is prompted to enter items one by one or in multiple lines.
2. Each item should be entered in the format: `<quantity> <item name> at <price>` or `<quantity> <item name>: <price>`.
3. Type "done" to finish the input.
4. The application processes the input, calculates the taxes and totals, and prints a detailed receipt.

## Installation

1. Clone the repository:
2. Install dependencies:

```sh
npm install
```

3. Compile TypeScript to JavaScript:

```sh
tsc
```

or

```sh
npm run tsc
```

## Running the Application

1. Run the compiled JavaScript file:

```sh
npm start
```

or

```sh
node dist/main.js
```

2. Enter the items you want to add to the receipt. Type "done" when you are finished.

### Example Input

```
1 imported bottle of perfume at 27.99
1 bottle of perfume at 18.99
1 packet of headache pills at 9.75
3 imported boxes of chocolates at 11.25
done
```

## File Structure

```
project-root/
│
├── ./
│ ├── main.ts
│ └── exempItems.ts
│ └── types.ts
│
├── dist/
│ └── (compiled JavaScript files)
│
├── node_modules/
│
├── package.json
├── package-lock.json
└── tsconfig.json
```

## File Structure
