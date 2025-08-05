import { createFileRoute } from '@tanstack/react-router'
import BudgetPage from '@/pages/budget-page'

export const Route = createFileRoute('/budget')({
  component: BudgetPage,
})