import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Global UI state - keeps track of themes, what we're editing, and filters
// Using Zustand because it's lighter than Redux and perfect for this kind of stuff
interface UIState {
    // Theme management - supports system preference which is nice
    theme: 'light' | 'dark' | 'system'
    setTheme: (theme: 'light' | 'dark' | 'system') => void

    selectedMonth: string // Format: YYYY-MM (like "2025-08")
    setSelectedMonth: (month: string) => void
}

export const useUIStore = create<UIState>()(
    persist(
        (set, get) => ({
            // Theme state
            theme: 'system',
            setTheme: (theme) => set({ theme }),

            selectedMonth: new Date().toISOString().slice(0, 7), // Start with current month (like "2025-08")
            setSelectedMonth: (month) => set({ selectedMonth: month }),
        }),
        {
            name: 'budget-buddy-ui-store',
            // Only persist theme and selectedMonth - no need to remember temporary filters
            partialize: (state) => ({
                theme: state.theme,
            }),
        }
    )
)