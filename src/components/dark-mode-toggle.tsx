/**
 * DarkModeToggle - Dropdown to switch between light/dark/system themes
 * No props - gets theme state from Zustand store
 */

import { Moon, Sun, Monitor } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUIStore } from '@/store/use-ui-store'
import { useEffect } from 'react'

export function DarkModeToggle() {
  const { theme, setTheme } = useUIStore()

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  return (
    <Select value={theme} onValueChange={(value: 'light' | 'dark' | 'system') => setTheme(value)}>
      <SelectTrigger className="w-[140px]">
        <SelectValue>
          <div className="flex items-center space-x-2">
            {theme === 'light' && <Sun className="h-4 w-4" />}
            {theme === 'dark' && <Moon className="h-4 w-4" />}
            {theme === 'system' && <Monitor className="h-4 w-4" />}
            <span className="text-sm">
              {theme === 'light' && 'Light'}
              {theme === 'dark' && 'Dark'}
              {theme === 'system' && 'System'}
            </span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4" />
            <span>Light</span>
          </div>
        </SelectItem>
        <SelectItem value="dark">
          <div className="flex items-center space-x-2">
            <Moon className="h-4 w-4" />
            <span>Dark</span>
          </div>
        </SelectItem>
        <SelectItem value="system">
          <div className="flex items-center space-x-2">
            <Monitor className="h-4 w-4" />
            <span>System</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}