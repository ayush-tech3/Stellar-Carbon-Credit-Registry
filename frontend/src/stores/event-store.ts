import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ActivityEvent } from '@/features/activity/types';
import { INITIAL_EVENTS } from '@/features/activity/data/initial-events';

interface EventState {
  events: ActivityEvent[];
  addEvent: (event: ActivityEvent) => void;
  clearEvents: () => void;
}

export const useEventStore = create<EventState>()(
  persist(
    (set) => ({
      events: INITIAL_EVENTS,
      addEvent: (event) =>
        set((state) => ({ events: [event, ...state.events] })),
      clearEvents: () => set({ events: INITIAL_EVENTS }),
    }),
    {
      name: 'event-storage',
    }
  )
);
