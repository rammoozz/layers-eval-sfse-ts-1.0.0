import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../hooks/useAuth';
import NotificationDropdown from './NotificationDropdown';
import { ThemeToggle } from './ThemeToggle';
import { Bell, LogOut, Layers, LayoutDashboard, User, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();
  

  if (location.pathname === '/login') {
    return null;
  }

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-800/50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <Layers className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Layers
            </h1>
          </motion.div>
          <nav className="hidden md:flex space-x-2">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === '/'
                  ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/profile"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === '/profile'
                  ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
              }`}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
            <Link
              to="/settings"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === '/settings'
                  ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>
        
        {user && (
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <NotificationDropdown>
              <Button variant="ghost" size="sm" className="hover:bg-gray-100/50 dark:hover:bg-gray-800/50">
                <Bell className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </Button>
            </NotificationDropdown>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">{user.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="group hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
              >
                <LogOut className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.header>
  );
}