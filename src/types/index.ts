export interface Gift {
  id: string;
  title: string;
  price: number;
  purchased: boolean;
  url: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  imageUrl?: string;
  dueDate?: string; // ISO date string, optional
}

export interface Person {
  id: string;
  name: string;
  notes: string;
  budget: number;
  gifts: Gift[];
}

export interface AppData {
  people: Person[];
  darkMode: boolean;
}
