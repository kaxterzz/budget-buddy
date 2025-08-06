/**
 * ExpenseForm - Form to create or edit expenses with validation
 * Props: expense?, onSuccess?, onCancel?, showAsCard?
 */


import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCreateExpense, useUpdateExpense } from '@/hooks/use-expenses'
import { useCategories } from '@/hooks/use-budgets'
import { useUIStore } from '@/store/use-ui-store'
import { type Expense } from '@/services/expense-service'
import { useEffect } from 'react'
import { X } from 'lucide-react'

// Form data shape - matches our Expense interface but with string amounts for form handling
interface ExpenseFormData {
  description: string
  amount: string
  category: string
  date: string
}

interface ExpenseFormProps {
  expense?: Expense
  onSuccess?: () => void
  onCancel?: () => void
  showAsCard?: boolean
}

export function ExpenseForm({ expense, onSuccess, onCancel, showAsCard = true }: ExpenseFormProps) {
  const { setEditingExpenseId } = useUIStore()
  const { data: categories = [] } = useCategories()
  const createExpenseMutation = useCreateExpense()
  const updateExpenseMutation = useUpdateExpense()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    defaultValues: {
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0], // Today's date
    },
  })

  const selectedCategory = watch('category')

  // Populate form when editing
  useEffect(() => {
    if (expense) {
      setValue('description', expense.description)
      setValue('amount', expense.amount.toString())
      setValue('category', expense.category)
      setValue('date', expense.date)
    }
  }, [expense, setValue])

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      // Convert form data to the right format for our API
      const expenseData = {
        description: data.description.trim(), // Remove any extra whitespace
        amount: parseFloat(data.amount), // Convert string to number
        category: data.category,
        date: data.date,
      }

      if (expense) {
        // We're editing an existing expense
        await updateExpenseMutation.mutateAsync({
          id: expense.id!,
          data: expenseData,
        })
        setEditingExpenseId(null) // Exit edit mode
      } else {
        // Creating a brand new expense
        await createExpenseMutation.mutateAsync(expenseData)
        reset() // Clear the form so they can add another one
      }

      onSuccess?.() // Let parent component know we're done
    } catch (error) {
      console.error('Error saving expense:', error)
      // The mutation hooks will show toast notifications for errors
    }
  }

  const handleCancel = () => {
    if (expense) {
      setEditingExpenseId(null)
    }
    reset()
    onCancel?.()
  }

  const form = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="Enter expense description"
          {...register('description', {
            required: 'Description is required',
            minLength: {
              value: 3,
              message: 'Description must be at least 3 characters',
            },
          })}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount ($)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          {...register('amount', {
            required: 'Amount is required',
            min: {
              value: 0.01,
              message: 'Amount must be at least $0.01',
            },
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: 'Amount must have max 2 decimal places',
            },
          })}
        />
        {errors.amount && (
          <p className="text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={selectedCategory} onValueChange={(value) => setValue('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!selectedCategory && (
          <p className="text-sm text-red-600">Please select a category</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          max={new Date().toISOString().split('T')[0]}
          {...register('date', {
            required: 'Date is required',
          })}
        />
        {errors.date && (
          <p className="text-sm text-red-600">{errors.date.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        {(expense || onCancel) && (
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={isSubmitting || !selectedCategory}
          className="min-w-[100px]"
        >
          {isSubmitting ? 'Saving...' : expense ? 'Update' : 'Add Expense'}
        </Button>
      </div>
    </form>
  )

  if (!showAsCard) {
    return form
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{expense ? 'Edit Expense' : 'Add New Expense'}</CardTitle>
        {expense && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>{form}</CardContent>
    </Card>
  )
}