/**
 * BudgetList - Shows budgets with spending progress, over-budget warnings, and month filtering
 * No props - gets data from hooks
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useBudgets, useDeleteBudget } from '@/hooks/use-budgets'
import { useExpenses } from '@/hooks/use-expenses'
import { BudgetForm } from './budget-form'
import { type Budget } from '@/services/budget-service'
import { Edit, Trash2, Calendar, Target, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { useMemo } from 'react'

interface BudgetWithSpending extends Budget {
  actualSpent: number
  remaining: number
  percentageUsed: number
  isOverBudget: boolean
}

export function BudgetList() {
  const [editingBudgetId, setEditingBudgetId] = useState<number | null>(null)
  const [filterMonth, setFilterMonth] = useState<string>('')

  const { data: budgets = [], isLoading: budgetsLoading } = useBudgets()
  const { data: expenses = [], isLoading: expensesLoading } = useExpenses()
  const deleteBudgetMutation = useDeleteBudget()

  // Calculate spending for each budget
  const budgetsWithSpending = useMemo((): BudgetWithSpending[] => {
    if (!budgets || !expenses) return []

    return budgets
      .filter(budget => !filterMonth || budget.month === filterMonth)
      .map(budget => {
        // Calculate actual spending for this category and month
        const categoryExpenses = expenses.filter(expense => 
          expense.category === budget.category && 
          expense.date.startsWith(budget.month)
        )
        
        const actualSpent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)
        const remaining = budget.monthlyLimit - actualSpent
        const percentageUsed = (actualSpent / budget.monthlyLimit) * 100
        const isOverBudget = actualSpent > budget.monthlyLimit

        return {
          ...budget,
          actualSpent,
          remaining,
          percentageUsed: Math.min(percentageUsed, 100),
          isOverBudget,
        }
      })
      .sort((a, b) => {
        // Sort by month (newest first), then by over-budget status, then by percentage used
        if (a.month !== b.month) {
          return b.month.localeCompare(a.month)
        }
        if (a.isOverBudget !== b.isOverBudget) {
          return a.isOverBudget ? -1 : 1
        }
        return b.percentageUsed - a.percentageUsed
      })
  }, [budgets, expenses, filterMonth])

  const handleEdit = (budget: Budget) => {
    setEditingBudgetId(budget.id!)
  }

  const handleDelete = async (budget: Budget) => {
    if (window.confirm(`Are you sure you want to delete the budget for ${budget.category}?`)) {
      try {
        await deleteBudgetMutation.mutateAsync(budget.id!)
      } catch (error) {
        console.error('Error deleting budget:', error)
      }
    }
  }

  // Generate month options for filtering
  const monthOptions = useMemo(() => {
    const uniqueMonths = [...new Set(budgets.map(budget => budget.month))].sort().reverse()
    return uniqueMonths.map(month => ({
      value: month,
      label: new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }))
  }, [budgets])

  if (budgetsLoading || expensesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Filter Budgets</span>
            <div className="flex items-center gap-2">
              <Select value={filterMonth || undefined} onValueChange={(value) => setFilterMonth(value === 'all' ? '' : value)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All months</SelectItem>
                  {monthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filterMonth && (
                <Button onClick={() => setFilterMonth('')} variant="outline" size="sm">
                  Clear
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Budget Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
          <p className="text-sm text-muted-foreground">
            Showing {budgetsWithSpending.length} budget{budgetsWithSpending.length !== 1 ? 's' : ''}
            {filterMonth && ` for ${monthOptions.find(o => o.value === filterMonth)?.label}`}
          </p>
        </CardHeader>
        <CardContent>
          {budgetsWithSpending.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {filterMonth ? 'No budgets for the selected month' : 'No budgets set yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {budgetsWithSpending.map((budget) => (
                <div key={budget.id}>
                  {editingBudgetId === budget.id ? (
                    <BudgetForm
                      budget={budget}
                      showAsCard={false}
                      onSuccess={() => setEditingBudgetId(null)}
                      onCancel={() => setEditingBudgetId(null)}
                    />
                  ) : (
                    <div className={`p-4 border rounded-lg ${budget.isOverBudget ? 'border-red-200 bg-red-50/50' : 'hover:bg-muted/50'} transition-colors`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{budget.category}</h3>
                            <Badge variant="outline">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(budget.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </Badge>
                            {budget.isOverBudget && (
                              <Badge variant="destructive">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Over Budget
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Target className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Budget:</span>
                              <span className="font-medium">${budget.monthlyLimit.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <TrendingUp className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Spent:</span>
                              <span className={`font-medium ${budget.isOverBudget ? 'text-red-600' : ''}`}>
                                ${budget.actualSpent.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <TrendingDown className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Remaining:</span>
                              <span className={`font-medium ${budget.remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                ${Math.abs(budget.remaining).toFixed(2)}
                                {budget.remaining < 0 && ' over'}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span className={budget.isOverBudget ? 'text-red-600 font-medium' : ''}>
                                {budget.percentageUsed.toFixed(1)}%
                              </span>
                            </div>
                            <Progress 
                              value={budget.percentageUsed} 
                              className={`h-2 ${budget.isOverBudget ? 'bg-red-100' : ''}`}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(budget)}
                            disabled={deleteBudgetMutation.isPending}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(budget)}
                            disabled={deleteBudgetMutation.isPending}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}