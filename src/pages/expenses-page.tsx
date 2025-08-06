/**
 * Expenses Page - Manage all your expense entries
 * 
 * What it does:
 * - Provides a form to add new expenses with validation
 * - Shows a list of all expenses with search and filter capabilities
 * - Allows editing expenses inline (click edit button)
 * - Supports deleting expenses with confirmation
 * - Exports expenses to CSV format
 * 
 * Components used:
 * - ExpenseForm: Handles creating/editing expenses
 * - ExpenseList: Shows filterable list with CRUD operations
 * 
 * Key features:
 * - Real-time search by description
 * - Filter by category and date range
 * - Sort by date, amount, or description
 * - Inline editing (no modal needed)
 * - CSV export functionality
 * - Responsive design for mobile use
 */

import { ExpenseForm } from '@/components/expense-form'
import { ExpenseList } from '@/components/expense-list'

export default function ExpensesPage() {
  return (
    <div className="space-y-6 mx-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
        <p className="text-muted-foreground">
          Add, edit, and delete your expense entries
        </p>
      </div>
      
      <ExpenseForm />
      <ExpenseList />
    </div>
  )
}