import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Bell, Shield, Palette, Globe, Sun, Moon, Monitor } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();
  const settingsRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState({
    notifications: true,
    language: 'en',
    autoSave: true,
  });
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Create GSAP timeline animation
    const tl = gsap.timeline();
    
    tl.fromTo(".settings-card", {
      y: 30,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out"
    }).fromTo(".settings-icon", {
      scale: 0,
      rotation: 180,
      opacity: 0
    }, {
      scale: 1,
      rotation: 0,
      opacity: 1,
      duration: 0.4,
      stagger: 0.05,
      ease: "back.out(1.7)"
    }, "-=0.3");
    
  }, [user, navigate]);
  
  const handleSettingChange = (key: keyof typeof settings, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Simulate API call that doesn't properly handle errors
    setTimeout(() => {
      console.log(`Setting ${key} updated to ${value}`);
      // Should validate and handle errors here
    }, 1000);
  };

  return (
    <div className="space-y-8" ref={settingsRef}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="settings-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 settings-icon text-blue-600 dark:text-blue-400" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Email notifications</span>
              <Button
                variant={settings.notifications ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('notifications', !settings.notifications)}
              >
                {settings.notifications ? 'On' : 'Off'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Push notifications</span>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Auto-save</span>
              <Button
                variant={settings.autoSave ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('autoSave', !settings.autoSave)}
              >
                {settings.autoSave ? 'On' : 'Off'}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="settings-card overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5 settings-icon text-purple-600 dark:text-purple-400" />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Appearance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Theme Mode</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Choose your preferred theme</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('light')}
                    className="gap-2"
                  >
                    <Sun className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                    className="gap-2"
                  >
                    <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('system')}
                    className="gap-2"
                  >
                    <Monitor className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    System
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Accent Color</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Customize your interface colors</p>
                </div>
                <div className="flex gap-2">
                  {(['blue', 'purple', 'green', 'orange', 'pink'] as const).map((color) => (
                    <button
                      key={color}
                      onClick={() => setAccentColor(color)}
                      className={`w-8 h-8 rounded-full transition-all ${
                        accentColor === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-105'
                      }`}
                      style={{
                        backgroundColor: {
                          blue: '#3b82f6',
                          purple: '#a855f7',
                          green: '#10b981',
                          orange: '#f97316',
                          pink: '#ec4899'
                        }[color]
                      }}
                      aria-label={`Set ${color} accent color`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <span className="text-sm text-gray-700 dark:text-gray-300">Compact mode</span>
                <Button variant="outline" size="sm" disabled>
                  Beta
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <Card className="settings-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 settings-icon text-green-600 dark:text-green-400" />
              <span>Privacy & Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Two-factor authentication</span>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Data sharing</span>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Account deletion</span>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="settings-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5 settings-icon text-orange-600 dark:text-orange-400" />
              <span>Regional Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Language</span>
              <Select 
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-32"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Timezone</span>
              <Select className="w-40">
                <option>GMT-8 (Pacific)</option>
                <option>GMT-5 (Eastern)</option>
                <option>GMT+0 (UTC)</option>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Date format</span>
              <Select className="w-36">
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end" style={{ marginTop: '3rem' }}>
        <Button onClick={() => {
          // Simulate settings save
          console.log('Settings saved:', settings);
          alert('Settings saved successfully');
        }}>
          Save All Settings
        </Button>
      </div>
    </div>
  );
}