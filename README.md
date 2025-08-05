# 💰 Budget Buddy - Your Personal Finance Companion

Budget Buddy is a modern, intuitive personal finance management application that helps you track your expenses, manage budgets, and gain insights into your spending habits. Built with React and powered by a robust tech stack, it offers a seamless experience for managing your financial life.

## ✨ Features

### Dashboard Overview
- Financial summary cards showing monthly spending, budget limits, remaining budget, and active categories
- Month filtering to easily switch between different time periods
- Interactive pie chart showing spending breakdown by category
- Recent activity feed to track your latest expenses
- Over-budget alerts with visual indicators

### Expense Management
- Add and edit expenses with simple, intuitive forms
- Smart categorization for organizing expenses (Food, Transportation, Shopping, etc.)
- Date-based filtering to view expenses by specific time periods
- Real-time updates across the entire application

### Budget Planning
- Set monthly spending limits for different categories
- Track actual spending vs planned budgets
- Individual budget controls for each expense category
- Budget analytics to understand spending patterns

### Reports & Analytics
- Visualize spending trends over time
- Detailed category breakdown analysis
- Monthly spending comparisons
- Export capabilities for external use

### User Experience
- Dark and light mode support
- Fully responsive design for desktop, tablet, and mobile
- Modern, clean interface built with premium UI components
- Smooth loading states and animations

## 🛠️ Tech Stack

### Core Technologies
- **React 19** - Latest version for building the user interface
- **TypeScript** - Type-safe development for better code quality
- **Vite** - Lightning-fast build tool and development server

### State Management & Data
- **TanStack Query** - Powerful data fetching, caching, and synchronization
- **Zustand** - Lightweight state management for UI preferences
- **Axios** - HTTP client for API communication
- **JSON Server** - Mock REST API for development

### UI & Styling
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Beautiful, reusable component library
- **Lucide React** - Customizable SVG icons
- **Recharts** - Interactive charts and data visualization

### Routing & Forms
- **TanStack Router** - Type-safe, file-based routing
- **React Hook Form** - Performant forms with validation

### Development Tools
- **ESLint & Prettier** - Code linting and formatting
- **Vitest** - Fast unit testing framework

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone and install**
   - Clone the repository to your local machine
   - Navigate to the project directory
   - Run `npm install` to install all dependencies

2. **Start the API server**
   - Run `npm run api` to start the JSON Server on port 8000
   - This provides the mock API for expenses and budgets

3. **Start the application**
   - Run `npm run dev` or `npm start`
   - Open your browser and go to `http://localhost:3000`

### Available Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Check code quality
- `npm run api` - Start the mock API server

## 📁 Project Structure

The project follows a clean, organized structure:
- **components/** - Reusable UI components and forms
- **hooks/** - Custom React hooks for data management
- **pages/** - Main page components (Dashboard, Expenses, Budgets, Reports)
- **services/** - API service layers for data operations
- **store/** - Global state management
- **routes/** - File-based routing configuration

## 🎯 How to Use

### Getting Started
1. **Set up budgets** - Create monthly spending limits for different categories
2. **Log expenses** - Record your daily purchases with descriptions, amounts, and categories
3. **Monitor progress** - Use the dashboard to track spending against your budgets
4. **Analyze trends** - Review reports to understand your spending patterns

### Key Workflows
- **Monthly Planning**: Set realistic budgets at the beginning of each month
- **Daily Tracking**: Quickly log expenses as they happen
- **Regular Review**: Check your dashboard weekly to stay on track
- **Historical Analysis**: Use month filtering to compare spending over time

---

**Author**: [Thilanka Kasun](https://kasuns.me)

*Built with ❤️ by Thilanka Kasun*