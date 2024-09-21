import React, { useState } from 'react';
import { Bill, BillItem, Person } from '../types';

interface BillSummaryProps {
  bill: Bill;
  onEditItem: (item: BillItem) => void;
  onDeleteItem: (itemId: string) => void;
  onEditPerson: (person: Person) => void;
  onDeletePerson: (personId: string) => void;
}

const BillSummary: React.FC<BillSummaryProps> = ({
  bill,
  onEditItem,
  onDeleteItem,
  onEditPerson,
  onDeletePerson
}) => {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingPerson, setEditingPerson] = useState<string | null>(null);

  const calculateSplitBill = () => {
    const splitBill: { [key: string]: number } = {};

    bill.people.forEach((person) => {
      splitBill[person.id] = 0;
    });

    bill.items.forEach((item) => {
      item.sharedBy.forEach((share) => {
        splitBill[share.personId] += item.price * (share.percentage / 100);
      });
    });

    return splitBill;
  };

  const splitBill = calculateSplitBill();

  return (
    <div className="text-black">
      <h2 className="text-xl font-semibold mb-4">Bill Summary</h2>
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Items:</h3>
        <ul className="space-y-2">
          {bill.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              {editingItem === item.id ? (
                <input
                  value={item.name}
                  onChange={(e) => onEditItem({ ...item, name: e.target.value })}
                  onBlur={() => setEditingItem(null)}
                  className="border rounded px-2 py-1 w-full mr-2 text-black"
                  autoFocus
                />
              ) : (
                <span onClick={() => setEditingItem(item.id)} className="flex-grow cursor-pointer">
                  {item.name} - ${item.price.toFixed(2)}
                </span>
              )}
              <div>
                <button onClick={() => onDeleteItem(item.id)} className="text-red-500 hover:text-red-700 ml-2">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2">Split:</h3>
        <ul className="space-y-2">
          {Object.entries(splitBill).map(([personId, amount]) => {
            const person = bill.people.find(p => p.id === personId);
            return (
              <li key={personId} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                {editingPerson === personId ? (
                  <input
                    value={person?.name}
                    onChange={(e) => onEditPerson({ ...person!, name: e.target.value })}
                    onBlur={() => setEditingPerson(null)}
                    className="border rounded px-2 py-1 w-full mr-2 text-black"
                    autoFocus
                  />
                ) : (
                  <span onClick={() => setEditingPerson(personId)} className="flex-grow cursor-pointer">
                    {person?.name}: ${amount.toFixed(2)}
                  </span>
                )}
                <div>
                  <button onClick={() => onDeletePerson(personId)} className="text-red-500 hover:text-red-700 ml-2">
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Shared Percentages:</h3>
        {bill.items.map((item) => (
          <div key={item.id} className="mb-4">
            <h4 className="font-medium">{item.name}</h4>
            <ul className="list-disc list-inside">
              {item.sharedBy.map((share) => {
                const person = bill.people.find(p => p.id === share.personId);
                return (
                  <li key={share.personId}>
                    {person?.name}: {share.percentage}%
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillSummary;