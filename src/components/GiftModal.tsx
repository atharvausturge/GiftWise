import { useState, useEffect } from 'react';
import Modal from './Modal';
import { Gift } from '../types';
import { isValidUrl } from '../utils/helpers';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (gift: { title: string; price: number; purchased: boolean; url: string; priority: 'low' | 'medium' | 'high'; tags?: string[]; imageUrl?: string; dueDate?: string }) => void;
  gift?: Gift | null;
}

export default function GiftModal({ isOpen, onClose, onSave, gift }: GiftModalProps) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [purchased, setPurchased] = useState(false);
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [tagsInput, setTagsInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (gift) {
      setTitle(gift.title);
      setPrice(gift.price.toString());
      setPurchased(gift.purchased);
      setUrl(gift.url);
      setPriority(gift.priority || 'medium');
      setTagsInput((gift.tags || []).join(', '));
      setImageUrl(gift.imageUrl || '');
      setDueDate(gift.dueDate || '');
    } else {
      setTitle('');
      setPrice('');
      setPurchased(false);
      setUrl('');
    }
    setUrlError('');
    setImageError('');
  }, [gift, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    if (url && !isValidUrl(url)) {
      setUrlError('Please enter a valid URL');
      return;
    }

    if (imageUrl && !isValidUrl(imageUrl)) {
      setImageError('Please enter a valid image URL');
      return;
    }

    onSave({
      title: title.trim(),
      price: parseFloat(price) || 0,
      purchased,
      url: url.trim(),
      priority,
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
      imageUrl: imageUrl.trim(),
      dueDate: dueDate || undefined,
    });
    onClose();
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (urlError && (!value || isValidUrl(value))) {
      setUrlError('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={gift ? 'Edit Gift' : 'Add Gift'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Gift Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter gift title"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Price (USD) *
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Product URL
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              urlError ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="https://example.com/product"
          />
          {urlError && <p className="text-red-500 text-sm mt-1">{urlError}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="e.g. socks, toys, electronics"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="purchased"
            checked={purchased}
            onChange={(e) => setPurchased(e.target.checked)}
            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-600"
          />
          <label htmlFor="purchased" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Purchased
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Due date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Image URL (optional)
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              imageError ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="https://example.com/image.jpg"
          />
          {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
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
            {gift ? 'Save Changes' : 'Add Gift'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
