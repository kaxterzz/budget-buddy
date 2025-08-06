import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { expenseService, type Expense } from '@/services/expense-service'
import { toast } from 'sonner'

// Query keys
export const EXPENSE_KEYS = {
    all: ['expenses'] as const,
    // Base key: ['expenses']

    lists: () => [...EXPENSE_KEYS.all, 'list'] as const,
    // List key: ['expenses', 'list']

    list: (filters: Record<string, unknown>) => [...EXPENSE_KEYS.lists(), filters] as const,
    // Filtered list: ['expenses', 'list', { category: 'Food', month: '2025-08' }]

    details: () => [...EXPENSE_KEYS.all, 'detail'] as const,
    // Detail base: ['expenses', 'detail']

    detail: (id: number) => [...EXPENSE_KEYS.details(), id] as const,
    // Specific expense: ['expenses', 'detail', 123]
  }

// Get all expenses
export const useExpenses = () => {
  return useQuery({
    queryKey: EXPENSE_KEYS.lists(),
    queryFn: expenseService.getExpenses,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: 1000,
  })
}

// Get expense by ID
export const useExpense = (id: number) => {
  return useQuery({
    queryKey: EXPENSE_KEYS.detail(id),
    queryFn: () => expenseService.getExpense(id),
    enabled: !!id,
  })
}

// Get expenses by category
export const useExpensesByCategory = (category: string) => {
  return useQuery({
    queryKey: EXPENSE_KEYS.list({ category }),
    queryFn: () => expenseService.getExpensesByCategory(category),
    enabled: !!category,
  })
}

// Get expenses by date range
export const useExpensesByDateRange = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: EXPENSE_KEYS.list({ startDate, endDate }),
    queryFn: () => expenseService.getExpensesByDateRange(startDate, endDate),
    enabled: !!startDate && !!endDate,
  })
}

// Create expense mutation
export const useCreateExpense = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: expenseService.createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.all })
      toast.success('Expense created successfully!')
    },
    onError: (error) => {
      console.error('Error creating expense:', error)
      toast.error('Failed to create expense')
    },
  })
}

// Update expense mutation
export const useUpdateExpense = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Expense> }) =>
      expenseService.updateExpense(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.all })
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.detail(id) })
      toast.success('Expense updated successfully!')
    },
    onError: (error) => {
      console.error('Error updating expense:', error)
      toast.error('Failed to update expense')
    },
  })
}

// Delete expense mutation
export const useDeleteExpense = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: expenseService.deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.all })
      toast.success('Expense deleted successfully!')
    },
    onError: (error) => {
      console.error('Error deleting expense:', error)
      toast.error('Failed to delete expense')
    },
  })
}