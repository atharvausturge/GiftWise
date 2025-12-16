import { useState, useEffect } from 'react';
import { Plus, Search, Moon, Sun, Download, Upload, Gift as GiftIcon, Menu, X } from 'lucide-react';
import { Person, Gift } from './types';
import { loadData, saveData, loadDarkMode, saveDarkMode, exportData, importData } from './utils/storage';
import { generateId, calculateTotalCost, calculateTotalSpent, getBudgetStatus, formatCurrency } from './utils/helpers';
import PersonCard from './components/PersonCard';
import PersonModal from './components/PersonModal';
import GiftModal from './components/GiftModal';
import GiftItem from './components/GiftItem';
import ConfirmDialog from './components/ConfirmDialog';

function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [giftSort, setGiftSort] = useState<'default' | 'priceAsc' | 'priceDesc' | 'priority'>('default');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [purchasedFilter, setPurchasedFilter] = useState<'all' | 'purchased' | 'notPurchased' | 'dueSoon'>('all');

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    const loadedData = loadData();
    setPeople(loadedData);
    if (loadedData.length > 0) {
      setSelectedPersonId(loadedData[0].id);
    }

    const isDark = loadDarkMode();
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    saveData(people);
  }, [people]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    saveDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleAddPerson = (personData: { name: string; notes: string; budget: number }) => {
    const newPerson: Person = {
      id: generateId(),
      ...personData,
      gifts: [],
    };
    const updatedPeople = [...people, newPerson];
    setPeople(updatedPeople);
    setSelectedPersonId(newPerson.id);
  };

  const handleEditPerson = (personData: { name: string; notes: string; budget: number }) => {
    if (!editingPerson) return;
    setPeople(people.map(p => (p.id === editingPerson.id ? { ...p, ...personData } : p)));
    setEditingPerson(null);
  };

  const handleDeletePerson = (personId: string) => {
    const person = people.find(p => p.id === personId);
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Person',
      message: `Are you sure you want to delete ${person?.name}? This will also delete all their gift ideas.`,
      onConfirm: () => {
        const updatedPeople = people.filter(p => p.id !== personId);
        setPeople(updatedPeople);
        if (selectedPersonId === personId) {
          setSelectedPersonId(updatedPeople.length > 0 ? updatedPeople[0].id : null);
        }
      },
    });
  };

  const handleAddGift = (giftData: { title: string; price: number; purchased: boolean; url: string; priority?: 'low' | 'medium' | 'high'; tags?: string[]; imageUrl?: string; dueDate?: string }) => {
    if (!selectedPersonId) return;
    const newGift: Gift = {
      id: generateId(),
      ...giftData,
      tags: giftData.tags || [],
      imageUrl: giftData.imageUrl || '',
      dueDate: giftData.dueDate || '',
    };
    setPeople(people.map(p => (p.id === selectedPersonId ? { ...p, gifts: [...p.gifts, newGift] } : p)));
  };

  const handleEditGift = (giftData: { title: string; price: number; purchased: boolean; url: string; priority?: 'low' | 'medium' | 'high'; tags?: string[]; imageUrl?: string; dueDate?: string }) => {
    if (!selectedPersonId || !editingGift) return;
    setPeople(
      people.map(p =>
        p.id === selectedPersonId
          ? { ...p, gifts: p.gifts.map(g => (g.id === editingGift.id ? { ...g, ...giftData } : g)) }
          : p
      )
    );
    setEditingGift(null);
  };

  const markAllPurchased = () => {
    if (!selectedPersonId) return;
    setPeople(people.map(p => (p.id === selectedPersonId ? { ...p, gifts: p.gifts.map(g => ({ ...g, purchased: true })) } : p)));
  };

  const unmarkAllPurchased = () => {
    if (!selectedPersonId) return;
    setPeople(people.map(p => (p.id === selectedPersonId ? { ...p, gifts: p.gifts.map(g => ({ ...g, purchased: false })) } : p)));
  };

  const deletePurchasedGifts = () => {
    if (!selectedPersonId) return;
    const person = people.find((p) => p.id === selectedPersonId);
    setConfirmDialog({
      isOpen: true,
      title: 'Delete purchased gifts',
      message: `Are you sure you want to delete all purchased gifts for ${person?.name}? This cannot be undone.`,
      onConfirm: () => {
        setPeople(people.map(p => (p.id === selectedPersonId ? { ...p, gifts: p.gifts.filter(g => !g.purchased) } : p)));
      },
    });
  };

  const handleDeleteGift = (giftId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Gift',
      message: 'Are you sure you want to delete this gift idea?',
      onConfirm: () => {
        if (!selectedPersonId) return;
        setPeople(
          people.map(p => (p.id === selectedPersonId ? { ...p, gifts: p.gifts.filter(g => g.id !== giftId) } : p))
        );
      },
    });
  };

  const handleTogglePurchased = (giftId: string) => {
    if (!selectedPersonId) return;
    setPeople(
      people.map(p =>
        p.id === selectedPersonId ? { ...p, gifts: p.gifts.map(g => (g.id === giftId ? { ...g, purchased: !g.purchased } : g)) } : p
      )
    );
  };

  const handleExport = () => {
    exportData(people);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedPeople = await importData(file);
      setPeople(importedPeople);
      if (importedPeople.length > 0) {
        setSelectedPersonId(importedPeople[0].id);
      }
    } catch (error) {
      alert('Error importing data. Please check the file format.');
    }

    e.target.value = '';
  };

  const sortedPeople = [...people].sort((a, b) => a.name.localeCompare(b.name));

  // Compute list of unique tags across everyone (for filter options)
  const allTags = Array.from(new Set(people.flatMap((p) => p.gifts.flatMap((g) => g.tags || [])))).sort();

  const filteredPeople = sortedPeople.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (tagFilter === 'all' ? true : person.gifts.some((g) => (g.tags || []).includes(tagFilter)))
  );

  const selectedPerson = people.find(p => p.id === selectedPersonId);

  // Compute sorted/filtered gift list based on selected sort option
  const giftsToShow = (() => {
    if (!selectedPerson) return [] as Gift[];
    let arr = [...selectedPerson.gifts];

    // apply tag filter if any
    if (tagFilter !== 'all') {
      arr = arr.filter((g) => (g.tags || []).includes(tagFilter));
    }

    // apply purchased/due filters
    if (purchasedFilter === 'purchased') {
      arr = arr.filter((g) => g.purchased);
    } else if (purchasedFilter === 'notPurchased') {
      arr = arr.filter((g) => !g.purchased);
    } else if (purchasedFilter === 'dueSoon') {
      const today = new Date();
      arr = arr.filter((g) => {
        if (!g.dueDate) return false;
        const d = new Date(g.dueDate);
        const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff >= 0 && diff <= 7;
      });
    }
    if (giftSort === 'priceAsc') return arr.sort((a, b) => a.price - b.price);
    if (giftSort === 'priceDesc') return arr.sort((a, b) => b.price - a.price);
    if (giftSort === 'priority') {
      const weight: Record<string, number> = { high: 2, medium: 1, low: 0 };
      return arr.sort((a, b) => (weight[b.priority || 'medium'] ?? 1) - (weight[a.priority || 'medium'] ?? 1));
    }
    return arr;
  })();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="flex h-screen">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          ) : (
            <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          )}
        </button>

        <aside className={`w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col fixed md:relative inset-0 z-40 transform transition-transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GiftIcon className="w-6 h-6 text-emerald-600" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">GiftWise</h1>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Toggle dark mode"
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
                <button
                  onClick={handleExport}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Export data"
                >
                  <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <label className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer" title="Import data">
                  <Upload className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>
              </div>
            </div>

            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search people..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="mb-3">
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Filter by tag</label>
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
              >
                <option value="all">All tags</option>
                {allTags.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setEditingPerson(null);
                setIsPersonModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Person
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredPeople.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {searchQuery ? 'No people found' : 'No people yet. Add one to get started!'}
              </div>
            ) : (
              filteredPeople.map(person => (
                <PersonCard
                  key={person.id}
                  person={person}
                  isSelected={person.id === selectedPersonId}
                  onSelect={() => {
                    setSelectedPersonId(person.id);
                    setIsMobileMenuOpen(false);
                  }}
                  onEdit={() => {
                    setEditingPerson(person);
                    setIsPersonModalOpen(true);
                  }}
                  onDelete={() => handleDeletePerson(person.id)}
                />
              ))
            )}
          </div>
        </aside>

        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <main className="flex-1 overflow-hidden flex flex-col w-full">
          {selectedPerson ? (
            <>
              <div className="p-4 md:p-6 pt-16 md:pt-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedPerson.name}</h2>
                {selectedPerson.notes && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm md:text-base">{selectedPerson.notes}</p>
                )}

                <div className="flex flex-wrap gap-4 md:gap-6 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Total Cost: </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(calculateTotalCost(selectedPerson.gifts))}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Total Spent: </span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(calculateTotalSpent(selectedPerson.gifts))}
                    </span>
                  </div>
                  {selectedPerson.budget > 0 && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Budget: </span>
                      <span
                        className={`font-semibold ${
                          getBudgetStatus(selectedPerson) === 'over'
                            ? 'text-red-500'
                            : 'text-green-500'
                        }`}
                      >
                        {formatCurrency(selectedPerson.budget)}
                      </span>
                    </div>
                  )}
                </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={markAllPurchased}
                      className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
                    >
                      Mark all purchased
                    </button>
                    <button
                      onClick={unmarkAllPurchased}
                      className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
                    >
                      Unmark all
                    </button>
                    <button
                      onClick={deletePurchasedGifts}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm"
                    >
                      Delete purchased
                    </button>
                  </div>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setEditingGift(null);
                      setIsGiftModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Gift
                  </button>

                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">Sort:</label>
                    <select
                      value={giftSort}
                      onChange={(e) => setGiftSort(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                    >
                      <option value="default">Default</option>
                      <option value="priceAsc">Price ↑</option>
                      <option value="priceDesc">Price ↓</option>
                      <option value="priority">Priority</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">Filter:</label>
                    <select
                      value={purchasedFilter}
                      onChange={(e) => setPurchasedFilter(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                    >
                      <option value="all">All</option>
                      <option value="purchased">Purchased</option>
                      <option value="notPurchased">Not purchased</option>
                      <option value="dueSoon">Due soon</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                {selectedPerson.gifts.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm md:text-base">
                    No gift ideas yet. Add one to get started!
                  </div>
                ) : (
                  <div className="space-y-3 max-w-3xl w-full">
                    {giftsToShow.map(gift => (
                      <GiftItem
                        key={gift.id}
                        gift={gift}
                        onEdit={() => {
                          setEditingGift(gift);
                          setIsGiftModalOpen(true);
                        }}
                        onDelete={() => handleDeleteGift(gift.id)}
                        onTogglePurchased={() => handleTogglePurchased(gift.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <GiftIcon className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p className="text-lg">Select a person or add a new one to get started</p>
              </div>
            </div>
          )}
        </main>
      </div>

      <PersonModal
        isOpen={isPersonModalOpen}
        onClose={() => {
          setIsPersonModalOpen(false);
          setEditingPerson(null);
        }}
        onSave={editingPerson ? handleEditPerson : handleAddPerson}
        person={editingPerson}
      />

      <GiftModal
        isOpen={isGiftModalOpen}
        onClose={() => {
          setIsGiftModalOpen(false);
          setEditingGift(null);
        }}
        onSave={editingGift ? handleEditGift : handleAddGift}
        gift={editingGift}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
      />
    </div>
  );
}

export default App;
