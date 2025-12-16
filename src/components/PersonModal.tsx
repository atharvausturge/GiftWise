import { useState, useEffect } from 'react';
import Modal from './Modal';
import { Person } from '../types';

interface PersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (person: { name: string; notes: string; budget: number }) => void;
  person?: Person | null;
}

export default function PersonModal({ isOpen, onClose, onSave, person }: PersonModalProps) {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [budget, setBudget] = useState('');

  useEffect(() => {
    if (person) {
      setName(person.name);
      setNotes(person.notes);
      setBudget(person.budget > 0 ? person.budget.toString() : '');
    } else {
      setName('');
      setNotes('');
      setBudget('');
    }
  }, [person, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({
        name: name.trim(),
        notes: notes.trim(),
        budget: parseFloat(budget) || 0,
      });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={person ? 'Edit Person' : 'Add Person'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter name"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Optional notes"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Budget (USD)
          </label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            {person ? 'Save Changes' : 'Add Person'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
