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

        {/* thumbnail */}
        {gift.imageUrl ? (
          <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
            <img
              src={gift.imageUrl}
              alt={gift.title}
              onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
              className="w-12 h-12 object-cover"
            />
          </div>
        ) : null}

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

            {/* Priority badge */}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium">
              {gift.priority === 'high' ? (
                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full">High</span>
              ) : gift.priority === 'low' ? (
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Low</span>
              ) : (
                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Medium</span>
              )}
            </span>

            {/* Tags */}
            {gift.tags && gift.tags.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                {gift.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Due date */}
            {gift.dueDate && (
              (() => {
                const d = new Date(gift.dueDate);
                const today = new Date();
                const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const isPast = diff < 0;
                const isSoon = diff >= 0 && diff <= 7;
                const classes = isPast ? 'text-red-600' : isSoon ? 'text-amber-600' : 'text-gray-600 dark:text-gray-400';
                return (
                  <span className={`text-sm ${classes} ml-2`}>Due: {d.toLocaleDateString()}</span>
                );
              })()
            )}

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
