/**
 * Report Page - Advanced analytics and data export
 * 
 * What it does:
 * - Provides detailed spending analysis with custom date ranges
 * - Shows key metrics: total spent, average expense, expense count, top category
 * - Displays pie chart for category breakdown and bar chart for monthly trends
 * - Exports filtered data to CSV format
 * - Filters expenses by date range and category
 * 
 * Filter options:
 * - Start Date: Beginning of date range (optional)
 * - End Date: End of date range (optional)  
 * - Category: Filter by specific category (optional)
 * 
 * Key features:
 * - Dynamic filtering that updates charts in real-time
 * - CSV export with custom filename based on filters
 * - Empty state when no data matches filters
 * - Responsive layout with metric cards
 * - Clear filters button to reset all options
 * - Date validation (end date must be after start date)
 */

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Chart } from '@/components/chart'
import { useExpenses } from '@/hooks/use-expenses'
import { useBudgets, useCategories } from '@/hooks/use-budgets'
import { Download, Calendar, TrendingUp, DollarSign, Target } from 'lucide-react'
import { toast } from 'sonner'

export default function ReportPage() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  
  const { data: expenses = [] } = useExpenses()
  const { data: budgets = [] } = useBudgets()
  const { data: categories = [] } = useCategories()

  // Filter expenses based on selected criteria
  const filteredExpenses = useMemo(() => {
    if (!Array.isArray(expenses)) return []
    
    return expenses.filter(expense => {
      const dateMatch = (!startDate || expense.date >= startDate) && 
                       (!endDate || expense.date <= endDate)
      const categoryMatch = !selectedCategory || expense.category === selectedCategory
      return dateMatch && categoryMatch
    })
  }, [expenses, startDate, endDate, selectedCategory])

  // Calculate report metrics
  const reportMetrics = useMemo(() => {
    if (!filteredExpenses.length) return null

    const totalSpent = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const averageExpense = totalSpent / filteredExpenses.length
    
    // Category breakdown
    const categorySpending = filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {} as Record<string, number>)

    const categoryData = Object.entries(categorySpending)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    // Monthly breakdown
    const monthlySpending = filteredExpenses.reduce((acc, expense) => {
      const month = expense.date.slice(0, 7) // YYYY-MM
      acc[month] = (acc[month] || 0) + expense.amount
      return acc
    }, {} as Record<string, number>)

    const monthlyData = Object.entries(monthlySpending)
      .map(([name, value]) => ({ 
        name: new Date(name + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        value 
      }))
      .sort((a, b) => a.name.localeCompare(b.name))

    return {
      totalSpent,
      averageExpense,
      expenseCount: filteredExpenses.length,
      categoryData,
      monthlyData,
      topCategory: categoryData[0] || null,
    }
  }, [filteredExpenses])

  const handleExportCSV = () => {
    if (filteredExpenses.length === 0) {
      toast.error('No data to export')
      return
    }

    const headers = ['Date', 'Description', 'Category', 'Amount']
    const csvContent = [
      headers.join(','),
      ...filteredExpenses.map(expense => [
        expense.date,
        `"${expense.description}"`,
        expense.category,
        expense.amount.toFixed(2)
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    const dateRange = startDate && endDate ? `${startDate}_to_${endDate}` : 'filtered'
    link.download = `expense-report-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.success('Report exported successfully!')
  }

  const clearFilters = () => {
    setStartDate('')
    setEndDate('')
    setSelectedCategory('')
  }

  return (
    <div className="space-y-6 mx-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Analyze your spending patterns with detailed insights and charts
        </p>
      </div>
      
      {/* Filter Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Filter Options</span>
            <Button onClick={handleExportCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={selectedCategory || undefined} onValueChange={(value) => setSelectedCategory(value === 'all' ? '' : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button onClick={clearFilters} variant="outline" className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Showing {filteredExpenses.length} expenses
            {startDate && endDate && ` from ${startDate} to ${endDate}`}
            {selectedCategory && ` in ${selectedCategory} category`}
          </p>
        </CardContent>
      </Card>

      {/* Report Metrics */}
      {reportMetrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${reportMetrics.totalSpent.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${reportMetrics.averageExpense.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportMetrics.expenseCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Category</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {reportMetrics.topCategory ? reportMetrics.topCategory.name : 'N/A'}
              </div>
              {reportMetrics.topCategory && (
                <p className="text-sm text-muted-foreground">
                  ${reportMetrics.topCategory.value.toFixed(2)}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      {reportMetrics && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Chart 
                data={reportMetrics.categoryData} 
                type="pie" 
                height={350}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <Chart 
                data={reportMetrics.monthlyData} 
                type="bar" 
                height={350}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {!reportMetrics && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <p>No data to display with current filters</p>
              <p className="text-sm mt-2">Try adjusting your filter criteria</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}