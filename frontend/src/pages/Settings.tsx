import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import gsap from 'gsap';
import { Bell, Shield, Palette, Globe } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const settingsRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
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
    
    tl.from(".settings-card", {
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out"
    }).from(".settings-icon", {
      scale: 0,
      rotation: 180,
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
    <div className="space-y-6" ref={settingsRef}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="settings-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 settings-icon" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Email notifications</span>
              <Button
                variant={settings.notifications ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('notifications', !settings.notifications)}
              >
                {settings.notifications ? 'On' : 'Off'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Push notifications</span>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Auto-save</span>
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
        
        <Card className="settings-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="w-5 h-5 settings-icon" />
              <span>Appearance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Dark mode</span>
              <Button
                variant={settings.darkMode ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('darkMode', !settings.darkMode)}
              >
                {settings.darkMode ? 'Dark' : 'Light'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Theme</span>
              <Select defaultValue="blue" className="w-24">
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="purple">Purple</option>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Compact mode</span>
              <Button variant="outline" size="sm" disabled>
                Beta
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="settings-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 settings-icon" />
              <span>Privacy & Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Two-factor authentication</span>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Data sharing</span>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Account deletion</span>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="settings-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5 settings-icon" />
              <span>Regional Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Language</span>
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
              <span className="text-sm text-gray-700">Timezone</span>
              <Select className="w-40">
                <option>GMT-8 (Pacific)</option>
                <option>GMT-5 (Eastern)</option>
                <option>GMT+0 (UTC)</option>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Date format</span>
              <Select className="w-36">
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
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