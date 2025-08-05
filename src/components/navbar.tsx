/**
 * Navbar Component - Main navigation for the app  
 * 
 * What it does:
 * - Shows the BudgetBuddy logo/brand name
 * - Provides navigation links to all main pages (Dashboard, Expenses, Budget, Reports)
 * - Includes dark mode toggle
 * - Responsive design with hamburger menu on mobile
 * - Highlights current active page
 * 
 * Navigation links:
 * - Dashboard (/): Home overview page
 * - Expenses (/expenses): Manage expense entries  
 * - Budget (/budget): Set and track budgets
 * - Reports (/report): Analytics and exports
 * 
 * Key features:
 * - Mobile-first responsive design
 * - Active link highlighting with TanStack Router
 * - Collapsible mobile menu
 * - Icons for each navigation item
 * - Sticky positioning with backdrop blur
 */

import { Link } from '@tanstack/react-router'
import { 
  Home, 
  Receipt, 
  Wallet, 
  BarChart3,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DarkModeToggle } from './dark-mode-toggle'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: Home },
    { to: '/expenses', label: 'Expenses', icon: Receipt },
    { to: '/budget', label: 'Budget', icon: Wallet },
    { to: '/report', label: 'Reports', icon: BarChart3 },
  ]

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold text-primary [&.active]:text-primary"
          >
            <Wallet className="h-6 w-6" />
            <span>BudgetBuddy</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center space-x-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary [&.active]:text-primary"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <DarkModeToggle />
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary [&.active]:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}