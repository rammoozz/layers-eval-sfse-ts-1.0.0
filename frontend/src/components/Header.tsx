import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../hooks/useAuth';
import NotificationDropdown from './NotificationDropdown';
import { Bell, LogOut } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();
  

  if (location.pathname === '/login') {
    return null;
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">Layers</h1>
          <nav className="hidden md:flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/profile'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Profile
            </Link>
            <Link
              to="/settings"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/settings'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Settings
            </Link>
          </nav>
        </div>
        
        {user && (
          <div className="flex items-center space-x-4">
            <NotificationDropdown>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
            </NotificationDropdown>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">{user.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}