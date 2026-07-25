import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CreditItem {
  id: string;
  project: string;
  amount: number;
  vintageYear: number;
  methodology: string;
  color: string;
}

interface PortfolioState {
  totalProjects: number;
  userCredits: number;
  totalRetired: number;
  transfers24h: number;
  items: CreditItem[];
  addCredits: (project: string, amount: number, vintageYear: number, methodology: string) => void;
  transferCredits: (amount: number) => void;
  retireCredits: (amount: number) => void;
}

const DEFAULT_ITEMS: CreditItem[] = [
  { id: "c1", project: "Amazon Reforestation", amount: 2500, vintageYear: 2024, methodology: "VCS VM0015", color: "#10b981" },
  { id: "c2", project: "Wind Farm Texas", amount: 2000, vintageYear: 2023, methodology: "Gold Standard", color: "#14b8a6" },
];

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      totalProjects: 12,
      userCredits: 4500,
      totalRetired: 1222145,
      transfers24h: 156,
      items: DEFAULT_ITEMS,
      addCredits: (project, amount, vintageYear, methodology) =>
        set((state) => {
          const existing = state.items.find((i) => i.project.toLowerCase() === project.toLowerCase());
          let updatedItems = [...state.items];
          if (existing) {
            updatedItems = updatedItems.map((i) =>
              i.id === existing.id ? { ...i, amount: i.amount + amount } : i
            );
          } else {
            updatedItems.push({
              id: `c-${Date.now()}`,
              project,
              amount,
              vintageYear,
              methodology,
              color: "#06b6d4",
            });
          }
          return {
            items: updatedItems,
            userCredits: state.userCredits + amount,
            totalProjects: existing ? state.totalProjects : state.totalProjects + 1,
          };
        }),
      transferCredits: (amount) =>
        set((state) => ({
          userCredits: Math.max(0, state.userCredits - amount),
          transfers24h: state.transfers24h + 1,
        })),
      retireCredits: (amount) =>
        set((state) => ({
          userCredits: Math.max(0, state.userCredits - amount),
          totalRetired: state.totalRetired + amount,
        })),
    }),
    {
      name: 'portfolio-storage',
    }
  )
);
