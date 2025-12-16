import { Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Gift } from '../types';
import { formatCurrency } from '../utils/helpers';

interface GiftItemProps {
  gift: Gift;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePurchased: () => void;
}

export default function GiftItem({ gift, onEdit, onDelete, onTogglePurchased }: GiftItemProps) {
  return (
    <div
      className={`p-4 rounded-lg border transition-all ${
        gift.purchased
          ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={gift.purchased}
          onChange={onTogglePurchased}
          className="w-5 h-5 mt-0.5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-600 cursor-pointer"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4
              className={`font-medium text-gray-900 dark:text-white ${
                gift.purchased ? 'line-through opacity-60' : ''
              }`}
            >
              {gift.title}
            </h4>
            <div className="flex gap-1 flex-shrink-0">
              <button
                onClick={onEdit}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Edit gift"
              >
                <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Delete gift"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span
              className={`font-semibold ${
                gift.purchased ? 'text-gray-500 dark:text-gray-400' : 'text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {formatCurrency(gift.price)}
            </span>

            {gift.url && (
              <>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <a
                  href={gift.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>View Product</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
