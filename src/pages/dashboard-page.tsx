/**
 * Dashboard Page - The main overview screen of BudgetBuddy
 * 
 * What it does:
 * - Shows financial overview for the currently selected month
 * - Displays key metrics: total spend, budget, remaining budget, category count
 * - Shows a pie chart breakdown of spending by category
 * - Lists the 5 most recent expenses
 * - Changes color indicators when over budget (red) or under budget (green)
 * 
 * Data sources:
 * - Expenses from useExpenses() hook
 * - Budgets from useBudgets() hook  
 * - Selected month from useUIStore()
 * 
 * Key features:
 * - Responsive grid layout that works on mobile
 * - Loading states with skeleton cards
 * - Error handling with debug info
 * - Over-budget warnings with visual indicators
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Chart } from '@/components/chart'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useExpenses } from '@/hooks/use-expenses'
import { useBudgets } from '@/hooks/use-budgets'
import { useUIStore } from '@/store/use-ui-store'
import { Receipt, TrendingUp, TrendingDown, Calendar } from 'lucide-react'
import { useMemo, useEffect } from 'react'

export default function DashboardPage() {
  const { selectedMonth, setSelectedMonth } = useUIStore()
  const { data: expenses = [], isLoading: expensesLoading } = useExpenses()
  const { data: budgets = [], isLoading: budgetsLoading } = useBudgets()

  // Calculate all the interesting numbers for our dashboard
  const dashboardMetrics = useMemo(() => {
    // Make sure we have data and it's in the right format
    if (!expenses || !budgets || !Array.isArray(expenses) || !Array.isArray(budgets)) return null

    // Only look at expenses from the currently selected month
    const currentMonthExpenses = expenses.filter(expense =>
      expense.date.startsWith(selectedMonth)
    )

    // Add up all the money spent this month
    const totalMonthlySpend = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    // Find budgets for the current month and add them up
    const currentMonthBudgets = budgets.filter(budget => budget.month === selectedMonth)
    const totalBudget = currentMonthBudgets.reduce((sum, budget) => sum + budget.monthlyLimit, 0)

    // Figure out how much budget is left (could be negative if over budget!)
    const remainingBudget = totalBudget - totalMonthlySpend

    // Group expenses by category for our pie chart
    const categorySpending = currentMonthExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {} as Record<string, number>)

    const categoryData = Object.entries(categorySpending).map(([name, value]) => ({
      name,
      value,
    }))

    // Count how many different categories we have expenses in
    const uniqueCategories = new Set(expenses.map(expense => expense.category))

    return {
      totalMonthlySpend,
      totalBudget,
      remainingBudget,
      categoryData,
      categoriesCount: uniqueCategories.size,
      recentExpenses: expenses.slice(0, 5), // Show the 5 most recent expenses
    }
  }, [expenses, budgets, selectedMonth])

  // Generate month options for filtering
  const monthOptions = useMemo(() => {
    const uniqueMonths = [...new Set(expenses.map(expense => expense.date.slice(0, 7)))].sort().reverse()
    return uniqueMonths.map(month => ({
      value: month,
      label: new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }))
  }, [expenses])

  useEffect(() => {
    console.log("Selected month:", selectedMonth)
  }, [selectedMonth])

  if (expensesLoading || budgetsLoading) {
    return (
      <div className="space-y-6 space-x-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Loading your financial overview...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!dashboardMetrics) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Unable to load dashboard data</p>
          <p className="text-sm text-muted-foreground mt-2">
            Debug: Expenses loaded: {expenses?.length || 0}, Budgets loaded: {budgets?.length || 0}
          </p>
        </div>
      </div>
    )
  }

  const isOverBudget = dashboardMetrics.remainingBudget < 0

  return (
    <div className="space-y-6 mx-4">
      <div className='flex flex-col md:flex-row justify-between items-center'>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your expenses and budgets for {new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedMonth || undefined} onValueChange={(value) => setSelectedMonth(value === 'all' ? '' : value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All months" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>



      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Monthly Spend
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardMetrics.totalMonthlySpend.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              This Month's Budget
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardMetrics.totalBudget.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Remaining Budget
            </CardTitle>
            {isOverBudget ? (
              <TrendingDown className="h-4 w-4 text-red-600" />
            ) : (
              <TrendingUp className="h-4 w-4 text-green-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
              ${Math.abs(dashboardMetrics.remainingBudget).toFixed(2)}
              {isOverBudget && ' over'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardMetrics.categoriesCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              data={dashboardMetrics.categoryData}
              type="pie"
              height={350}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardMetrics.recentExpenses.length === 0 ? (
                <p className="text-muted-foreground">No recent expenses</p>
              ) : (
                dashboardMetrics.recentExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {expense.category} • {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="font-bold">${expense.amount.toFixed(2)}</div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}