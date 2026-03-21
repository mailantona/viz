import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UIState {
  showResizer: boolean;
  toggleResizer: () => void;
}

export const useStore = create<UIState>()(
  persist(
    (set) => ({
      showResizer: false,
      toggleResizer: () => set((state) => ({ showResizer: !state.showResizer })),
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);