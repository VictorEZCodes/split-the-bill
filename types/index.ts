export interface BillItem {
  id: string;
  name: string;
  price: number;
  sharedBy: Array<{
    personId: string;
    percentage: number;
  }>;
}

export interface Person {
  id: string;
  name: string;
}

export interface Bill {
  items: BillItem[];
  people: Person[];
}
