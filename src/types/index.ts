export interface Gift {
  id: string;
  title: string;
  price: number;
  purchased: boolean;
  url: string;
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
