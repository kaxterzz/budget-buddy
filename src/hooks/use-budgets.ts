import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { budgetService, getCategories, type Budget } from '@/services/budget-service'
import { toast } from 'sonner'

// Query keys
  export const BUDGET_KEYS = {
    all: ['budgets'] as const,
    // Base: ['budgets']

    lists: () => [...BUDGET_KEYS.all, 'list'] as const,
    // All budget lists: ['budgets', 'list']

    list: (filters: Record<string, unknown>) => [...BUDGET_KEYS.lists(), filters] as const,
    // Filtered budgets: ['budgets', 'list', { month: '2025-08' }]

    details: () => [...BUDGET_KEYS.all, 'detail'] as const,
    // Detail base: ['budgets', 'detail']

    detail: (id: number) => [...BUDGET_KEYS.details(), id] as const,
    // Specific budget: ['budgets', 'detail', 456]
  }

export const CATEGORY_KEYS = {
  all: ['categories'] as const,
}

// Get all budgets
export const useBudgets = () => {
  return useQuery({
    queryKey: BUDGET_KEYS.lists(),
    queryFn: budgetService.getBudgets,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: 1000,
  })
}

// Get budget by ID
export const useBudget = (id: number) => {
  return useQuery({
    queryKey: BUDGET_KEYS.detail(id),
    queryFn: () => budgetService.getBudget(id),
    enabled: !!id,
  })
}

// Get budgets by month
export const useBudgetsByMonth = (month: string) => {
  return useQuery({
    queryKey: BUDGET_KEYS.list({ month }),
    queryFn: () => budgetService.getBudgetsByMonth(month),
    enabled: !!month,
  })
}

// Get budget by category and month
export const useBudgetByCategoryAndMonth = (category: string, month: string) => {
  return useQuery({
    queryKey: BUDGET_KEYS.list({ category, month }),
    queryFn: () => budgetService.getBudgetByCategoryAndMonth(category, month),
    enabled: !!category && !!month,
  })
}

// Get categories
export const useCategories = () => {
  return useQuery({
    queryKey: CATEGORY_KEYS.all,
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
  })
}

// Create budget mutation
export const useCreateBudget = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: budgetService.createBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGET_KEYS.all })
      toast.success('Budget created successfully!')
    },
    onError: (error) => {
      console.error('Error creating budget:', error)
      toast.error('Failed to create budget')
    },
  })
}

// Update budget mutation
export const useUpdateBudget = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Budget> }) =>
      budgetService.updateBudget(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: BUDGET_KEYS.all })
      queryClient.invalidateQueries({ queryKey: BUDGET_KEYS.detail(id) })
      toast.success('Budget updated successfully!')
    },
    onError: (error) => {
      console.error('Error updating budget:', error)
      toast.error('Failed to update budget')
    },
  })
}

// Delete budget mutation
export const useDeleteBudget = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: budgetService.deleteBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGET_KEYS.all })
      toast.success('Budget deleted successfully!')
    },
    onError: (error) => {
      console.error('Error deleting budget:', error)
      toast.error('Failed to delete budget')
    },
  })
}