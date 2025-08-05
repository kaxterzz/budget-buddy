/**
 * Budget Service - API calls for budget management
 * 
 * What it does:
 * - Handles all budget-related API operations (CRUD)
 * - Manages category data fetching
 * - Provides specialized queries for filtering budgets
 * - Auto-calculates spent amounts when creating budgets
 * 
 * Budget interface:
 * - id?: number - Unique identifier (auto-generated)
 * - category: string - Spending category name
 * - monthlyLimit: number - Budget limit amount
 * - month: string - Month in YYYY-MM format (e.g., "2025-08")
 * - spent: number - Amount already spent (calculated from expenses)
 * - createdAt?: string - ISO timestamp when budget was created
 * 
 * Available operations:
 * - getBudgets(): Get all budgets
 * - getBudget(id): Get specific budget by ID
 * - createBudget(): Create new budget (spent starts at 0)
 * - updateBudget(): Update existing budget
 * - deleteBudget(): Remove a budget
 * - getBudgetsByMonth(): Filter budgets by month
 * - getBudgetByCategoryAndMonth(): Find specific budget for category/month
 * - getCategories(): Get list of available spending categories
 */

import axiosInstance from './axios'

export interface Budget {
  id?: number
  category: string
  monthlyLimit: number
  month: string // Format: YYYY-MM
  spent: number
  createdAt?: string
}

export const budgetService = {
  // Get all budgets
  getBudgets: async (): Promise<Budget[]> => {
    const response = await axiosInstance.get('/budgets')
    return response.data
  },

  // Get budget by ID
  getBudget: async (id: number): Promise<Budget> => {
    const response = await axiosInstance.get(`/budgets/${id}`)
    return response.data
  },

  // Create new budget
  createBudget: async (budget: Omit<Budget, 'id' | 'createdAt' | 'spent'>): Promise<Budget> => {
    const response = await axiosInstance.post('/budgets', {
      ...budget,
      spent: 0,
      createdAt: new Date().toISOString(),
    })
    return response.data
  },

  // Update budget
  updateBudget: async (id: number, budget: Partial<Budget>): Promise<Budget> => {
    const response = await axiosInstance.patch(`/budgets/${id}`, budget)
    return response.data
  },

  // Delete budget
  deleteBudget: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/budgets/${id}`)
  },

  // Get budgets by month
  getBudgetsByMonth: async (month: string): Promise<Budget[]> => {
    const response = await axiosInstance.get(`/budgets?month=${month}`)
    return response.data
  },

  // Get budget by category and month
  getBudgetByCategoryAndMonth: async (category: string, month: string): Promise<Budget | null> => {
    const response = await axiosInstance.get(`/budgets?category=${category}&month=${month}`)
    return response.data[0] || null
  },
}

// Get available categories
export const getCategories = async (): Promise<string[]> => {
  const response = await axiosInstance.get('/categories')
  return response.data.map((category: { id: number; name: string }) => category.name)
}