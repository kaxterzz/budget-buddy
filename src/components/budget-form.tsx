/**
 * BudgetForm - Form to create or edit monthly budgets by category
 * Props: budget?, onSuccess?, onCancel?, showAsCard?
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
import { useCreateBudget, useUpdateBudget } from '@/hooks/use-budgets'
import { useCategories } from '@/hooks/use-budgets'
import { useUIStore } from '@/store/use-ui-store'
import { type Budget } from '@/services/budget-service'
import { useEffect } from 'react'
import { X } from 'lucide-react'

interface BudgetFormData {
  category: string
  monthlyLimit: string
  month: string
}

interface BudgetFormProps {
  budget?: Budget
  onSuccess?: () => void
  onCancel?: () => void
  showAsCard?: boolean
}

export function BudgetForm({ budget, onSuccess, onCancel, showAsCard = true }: BudgetFormProps) {
  const { selectedMonth } = useUIStore()
  const { data: categories = [] } = useCategories()
  const createBudgetMutation = useCreateBudget()
  const updateBudgetMutation = useUpdateBudget()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormData>({
    defaultValues: {
      category: '',
      monthlyLimit: '',
      month: selectedMonth,
    },
  })

  const selectedCategory = watch('category')
  const watchedMonth = watch('month')

  // Populate form when editing
  useEffect(() => {
    if (budget) {
      setValue('category', budget.category)
      setValue('monthlyLimit', budget.monthlyLimit.toString())
      setValue('month', budget.month)
    }
  }, [budget, setValue])

  const onSubmit = async (data: BudgetFormData) => {
    try {
      const budgetData = {
        category: data.category,
        monthlyLimit: parseFloat(data.monthlyLimit),
        month: data.month,
      }

      if (budget) {
        // Update existing budget
        await updateBudgetMutation.mutateAsync({
          id: budget.id!,
          data: budgetData,
        })
      } else {
        // Create new budget
        await createBudgetMutation.mutateAsync(budgetData)
        reset() // Clear form after successful creation
        setValue('month', selectedMonth) // Reset to current month
      }

      onSuccess?.()
    } catch (error) {
      console.error('Error saving budget:', error)
    }
  }

  const handleCancel = () => {
    reset()
    onCancel?.()
  }

  // Generate month options (current month and next 11 months)
  const generateMonthOptions = () => {
    const options = []
    const currentDate = new Date()
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1)
      const monthStr = date.toISOString().slice(0, 7) // YYYY-MM format
      const displayName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      options.push({ value: monthStr, label: displayName })
    }
    
    return options
  }

  const monthOptions = generateMonthOptions()

  const form = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        <Label htmlFor="monthlyLimit">Monthly Budget Limit ($)</Label>
        <Input
          id="monthlyLimit"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          {...register('monthlyLimit', {
            required: 'Monthly budget limit is required',
            min: {
              value: 0.01,
              message: 'Budget limit must be at least $0.01',
            },
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: 'Amount must have max 2 decimal places',
            },
          })}
        />
        {errors.monthlyLimit && (
          <p className="text-sm text-red-600">{errors.monthlyLimit.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="month">Month</Label>
        <Select value={watchedMonth} onValueChange={(value) => setValue('month', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a month" />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.month && (
          <p className="text-sm text-red-600">{errors.month.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        {(budget || onCancel) && (
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={isSubmitting || !selectedCategory}
          className="min-w-[100px]"
        >
          {isSubmitting ? 'Saving...' : budget ? 'Update Budget' : 'Set Budget'}
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
        <CardTitle>{budget ? 'Edit Budget' : 'Set Monthly Budget'}</CardTitle>
        {budget && (
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