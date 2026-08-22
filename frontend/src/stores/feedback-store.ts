import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FeedbackEntry {
  id: string;
  rating: number;
  comment: string;
  page: string;
  walletAddress?: string;
  timestamp: number;
}

interface FeedbackState {
  entries: FeedbackEntry[];
  addFeedback: (entry: Omit<FeedbackEntry, 'id' | 'timestamp'>) => void;
  clearFeedback: () => void;
}

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set) => ({
      entries: [],
      addFeedback: (entry) =>
        set((state) => ({
          entries: [
            {
              ...entry,
              id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              timestamp: Date.now(),
            },
            ...state.entries,
          ],
        })),
      clearFeedback: () => set({ entries: [] }),
    }),
    {
      name: 'feedback-storage',
    }
  )
);
