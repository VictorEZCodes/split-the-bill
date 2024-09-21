import React, { useState } from 'react';
import { BillItem, Person } from '../types';

interface AddItemFormProps {
  onAddItem: (item: BillItem) => void;
  people: Person[];
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem, people }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [sharedBy, setSharedBy] = useState<Array<{ personId: string; percentage: number }>>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    const totalPercentage = sharedBy.reduce((sum, share) => sum + share.percentage, 0);
    if (totalPercentage !== 100) {
      newErrors.sharedBy = 'Total percentage must equal 100%';
    }

    if (Object.keys(newErrors).length === 0) {
      onAddItem({
        id: Date.now().toString(),
        name: name.trim(),
        price: parseFloat(price),
        sharedBy,
      });
      setName('');
      setPrice('');
      setSharedBy([]);
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  const handlePercentageChange = (personId: string, percentage: number) => {
    setSharedBy(prev => {
      const newSharedBy = prev.filter(share => share.personId !== personId);
      if (percentage > 0) {
        newSharedBy.push({ personId, percentage });
      }
      return newSharedBy;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h2 className="text-xl font-semibold mb-2 text-black">Add Item</h2>
      <div className="mb-2">
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors(prev => ({ ...prev, name: '' }));
          }}
          placeholder="Item name"
          className="w-full p-2 border rounded text-black"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>
      <div className="mb-2">
        <input
          type="number"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
            setErrors(prev => ({ ...prev, price: '' }));
          }}
          placeholder="Price"
          step="0.01"
          min="0"
          className="w-full p-2 border rounded text-black"
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
      </div>
      <div className="mb-2">
        <p className="mb-1 text-black">Shared by (percentage):</p>
        {people.map((person) => (
          <div key={person.id} className="flex items-center mb-1">
            <label className="flex-grow text-black">{person.name}</label>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={sharedBy.find(share => share.personId === person.id)?.percentage || ''}
              onChange={(e) => {
                handlePercentageChange(person.id, parseInt(e.target.value) || 0);
                setErrors(prev => ({ ...prev, sharedBy: '' }));
              }}
              className="w-20 p-1 border rounded text-black"
            />
            <span className="ml-1 text-black">%</span>
          </div>
        ))}
        {errors.sharedBy && <p className="text-red-500 text-sm">{errors.sharedBy}</p>}
      </div>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Add Item
      </button>
    </form>
  );
};

export default AddItemForm;