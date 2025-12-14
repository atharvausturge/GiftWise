import { AppData, Person } from '../types';

const STORAGE_KEY = 'giftwise-data';
const DARK_MODE_KEY = 'giftwise-darkmode';

export const loadData = (): Person[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.people || [];
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
  return [];
};

export const saveData = (people: Person[]): void => {
  try {
    const data: AppData = {
      people,
      darkMode: loadDarkMode(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const loadDarkMode = (): boolean => {
  try {
    const darkMode = localStorage.getItem(DARK_MODE_KEY);
    return darkMode === 'true';
  } catch (error) {
    console.error('Error loading dark mode:', error);
  }
  return false;
};

export const saveDarkMode = (darkMode: boolean): void => {
  try {
    localStorage.setItem(DARK_MODE_KEY, darkMode.toString());
  } catch (error) {
    console.error('Error saving dark mode:', error);
  }
};

export const exportData = (people: Person[]): void => {
  const data: AppData = {
    people,
    darkMode: loadDarkMode(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `giftwise-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importData = (file: File): Promise<Person[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.people && Array.isArray(data.people)) {
          resolve(data.people);
        } else {
          reject(new Error('Invalid data format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};
