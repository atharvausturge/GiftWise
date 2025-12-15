import { Edit2, Trash2 } from 'lucide-react';
import { Person } from '../types';
import { calculateTotalCost, getBudgetStatus, formatCurrency } from '../utils/helpers';

interface PersonCardProps {
  person: Person;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PersonCard({ person, isSelected, onSelect, onEdit, onDelete }: PersonCardProps) {
  const totalCost = calculateTotalCost(person.gifts);
  const budgetStatus = getBudgetStatus(person);
  const giftCount = person.gifts.length;
  const purchasedCount = person.gifts.filter(g => g.purchased).length;

  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500'
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate flex-1">{person.name}</h3>
        <div className="flex gap-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="Edit person"
          >
            <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="Delete person"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>

      {person.notes && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{person.notes}</p>
      )}

      <div className="space-y-1 text-sm">
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Gifts:</span>
          <span>
            {purchasedCount}/{giftCount}
          </span>
        </div>

        {person.budget > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Budget:</span>
            <span
              className={`font-medium ${
                budgetStatus === 'over'
                  ? 'text-red-500'
                  : budgetStatus === 'under'
                  ? 'text-green-500'
                  : 'text-gray-900 dark:text-white'
              }`}
            >
              {formatCurrency(totalCost)} / {formatCurrency(person.budget)}
            </span>
          </div>
        )}

        {person.budget === 0 && totalCost > 0 && (
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Total:</span>
            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(totalCost)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
