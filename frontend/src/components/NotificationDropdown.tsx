import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, X } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { Notification } from '../../../shared/schemas';

interface NotificationDropdownProps {
  children: React.ReactNode;
}

export default function NotificationDropdown({ children }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, removeNotification } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'error':
        return '🔴';
      case 'warning':
        return '🟡';
      case 'success':
        return '🟢';
      default:
        return '🔵';
    }
  };

  const getNotificationBadgeVariant = (type: Notification['type']) => {
    switch (type) {
      case 'error':
        return 'destructive' as const;
      case 'warning':
        return 'secondary' as const;
      case 'success':
        return 'default' as const;
      default:
        return 'outline' as const;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {children}
        {notifications.length > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            variant="destructive"
          >
            {notifications.length > 9 ? '9+' : notifications.length}
          </Badge>
        )}
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute right-0 mt-2 w-80 z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Card>
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.15, delay: notifications.indexOf(notification) * 0.05 }}
                      >
                        <div className="flex justify-between items-start space-x-2">
                          <div className="flex space-x-3 flex-1 min-w-0">
                            <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                  {notification.title}
                                </h4>
                                <Badge variant={getNotificationBadgeVariant(notification.type)}>
                                  {notification.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 break-words">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notification.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 flex-shrink-0"
                            onClick={() => removeNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div className="p-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        notifications.forEach(n => removeNotification(n.id));
                        setIsOpen(false);
                      }}
                    >
                      Clear all
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}