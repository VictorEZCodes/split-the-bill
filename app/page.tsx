'use client'

import { useState, useEffect } from 'react';
import { Bill, BillItem, Person } from '../types';
import AddItemForm from '../components/AddItemForm';
import AddPersonForm from '../components/AddPersonForm';
import BillSummary from '../components/BillSummary';

const LOCAL_STORAGE_KEY = 'splitthebill_data';

export default function Home() {
  const [bill, setBill] = useState<Bill>({ items: [], people: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedBill = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedBill) {
      setBill(JSON.parse(savedBill));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bill));
    }
  }, [bill, isLoading]);

  const addItem = (item: BillItem) => {
    setBill(prevBill => ({
      ...prevBill,
      items: [...prevBill.items, item],
    }));
  };

  const addPerson = (person: Person) => {
    setBill(prevBill => ({
      ...prevBill,
      people: [...prevBill.people, person],
    }));
  };

  const editItem = (updatedItem: BillItem) => {
    setBill(prevBill => ({
      ...prevBill,
      items: prevBill.items.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      ),
    }));
  };

  const deleteItem = (itemId: string) => {
    setBill(prevBill => ({
      ...prevBill,
      items: prevBill.items.filter(item => item.id !== itemId),
    }));
  };

  const editPerson = (updatedPerson: Person) => {
    setBill(prevBill => ({
      ...prevBill,
      people: prevBill.people.map(person =>
        person.id === updatedPerson.id ? updatedPerson : person
      ),
    }));
  };

  const deletePerson = (personId: string) => {
    setBill(prevBill => ({
      ...prevBill,
      people: prevBill.people.filter(person => person.id !== personId),
      items: prevBill.items.map(item => ({
        ...item,
        sharedBy: item.sharedBy.filter(share => share.personId !== personId),
      })),
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">SplitTheBill</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <AddPersonForm onAddPerson={addPerson} />
            <div className="mt-8">
              <AddItemForm onAddItem={addItem} people={bill.people} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <BillSummary
              bill={bill}
              onEditItem={editItem}
              onDeleteItem={deleteItem}
              onEditPerson={editPerson}
              onDeletePerson={deletePerson}
            />
          </div>
        </div>
      </main>
    </div>
  );
}