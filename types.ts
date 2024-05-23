type Item = {
  name: string;
  price: number;
  quantity: number;
  imported: boolean;
};

type Receipt = {
  items: {
    name: string;
    finalPrice: number;
    quantity: number;
  }[];
  totalCost: number;
  totalTaxes: number;
};

export { Item, Receipt };
