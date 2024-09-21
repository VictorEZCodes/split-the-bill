import React, { useState } from 'react';
import { Person } from '../types';

interface AddPersonFormProps {
  onAddPerson: (person: Person) => void;
}

const AddPersonForm: React.FC<AddPersonFormProps> = ({ onAddPerson }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddPerson({ id: Date.now().toString(), name: name.trim() });
      setName('');
      setError('');
    } else {
      setError('Name cannot be empty');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h2 className="text-xl font-semibold mb-2 text-black">Add Person</h2>
      <div className="flex flex-col">
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          placeholder="Enter name"
          className="p-2 border rounded mb-2 text-black"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add
        </button>
      </div>
    </form>
  );
};

export default AddPersonForm;