/**
 * Budget Page - Set and track monthly budgets by category
 * 
 * What it does:
 * - Allows setting monthly budget limits for different spending categories
 * - Shows budget vs actual spending with progress bars
 * - Highlights over-budget categories with red indicators
 * - Filters budgets by month to see historical data
 * - Calculates remaining budget and percentage used
 * 
 * Components used:
 * - BudgetForm: Create/edit monthly budget limits
 * - BudgetList: Display budgets with spending progress
 * 
 * Key features:
 * - Month selector to view different time periods
 * - Visual progress bars showing budget usage
 * - Over-budget warnings with red styling
 * - Edit/delete existing budgets
 * - Automatic calculation of spent amounts from expenses
 * - Responsive cards layout
 */

import { BudgetForm } from '@/components/budget-form'
import { BudgetList } from '@/components/budget-list'

export default function BudgetPage() {
  return (
    <div className="space-y-6 mx-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budget</h1>
        <p className="text-muted-foreground">
          Set monthly budgets by category and track your spending
        </p>
      </div>
      
      <BudgetForm />
      <BudgetList />
    </div>
  )
}