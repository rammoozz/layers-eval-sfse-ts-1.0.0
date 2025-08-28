import React, { useEffect, useRef, useState, Suspense } from 'react';
import { useAppState } from '../hooks/useAppState';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { BarChart3, Users, Activity, TrendingUp } from 'lucide-react';
import { processTableData, sortArrayAscending } from '../utils/helpers';


interface DashboardData {
  users: number;
  revenue: number;
  activity: number;
  growth: number;
}

const ExpensiveChart = React.lazy(() => 
  new Promise<{ default: React.ComponentType }>(resolve => 
    setTimeout(() => resolve({ default: () => <div>Chart loaded</div> }), 2000)
  )
);

export default function Dashboard() {
  useAppState();
  const navigate = useNavigate();
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [data, setData] = useState<DashboardData>({
    users: 1234,
    revenue: 45678,
    activity: 89,
    growth: 12.5
  });
  
  const sortedGrowthData = sortArrayAscending([12.5, 8.3, 15.7, 9.2]);
  
  useEffect(() => {
    // Create GSAP timeline but never kill it
    const tl = gsap.timeline();
    
    // Set initial state for all cards to ensure consistent animation
    gsap.set(cardsRef.current, {
      y: 50,
      opacity: 0
    });
    
    tl.to(cardsRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    });
    
  }, []);
  
  useEffect(() => {
    processTableData([
      { name: 'Revenue', value: data.revenue },
      { name: 'Users', value: data.users },
      { name: 'Activity', value: data.activity }
    ], { sortBy: 'value' });
    
    console.log('Sorted growth data (should be ascending):', sortedGrowthData);
    
    const interval = setInterval(() => {
      setData(prevData => ({
        ...prevData,
        activity: Math.floor(Math.random() * 100),
        growth: +(Math.random() * 20).toFixed(1)
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [data]);
  
  const addToRefs = (el: HTMLDivElement) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <div data-testid="dashboard">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <Button onClick={() => navigate('/profile')}>
          View Profile
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 mb-8">
        <Card ref={addToRefs}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data.users.toLocaleString()}</div>
            <p className="text-xs text-green-600 font-medium">+20.1% from last month</p>
          </CardContent>
        </Card>
        
        <Card ref={addToRefs}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">${data.revenue.toLocaleString()}</div>
            <p className="text-xs text-green-600 font-medium">+15.3% from last month</p>
          </CardContent>
        </Card>
        
        <Card ref={addToRefs}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Activity</CardTitle>
            <Activity className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data.activity}%</div>
            <p className="text-xs text-blue-600 font-medium">+2.5% from last hour</p>
          </CardContent>
        </Card>
        
        <Card ref={addToRefs}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data.growth}%</div>
            <p className="text-xs text-green-600 font-medium">+1.2% from yesterday</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Analytics Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading chart...</div>}>
            <ExpensiveChart />
          </Suspense>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="data-table">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-2 text-gray-900 dark:text-gray-100">User</th>
                  <th className="text-left py-2 text-gray-900 dark:text-gray-100">Action</th>
                  <th className="text-left py-2 text-gray-900 dark:text-gray-100">Time</th>
                  <th className="text-left py-2 text-gray-900 dark:text-gray-100">Status</th>
                  <th className="text-left py-2 text-gray-900 dark:text-gray-100">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-2 text-gray-900 dark:text-gray-100">john.doe@example.com</td>
                  <td className="py-2 text-gray-900 dark:text-gray-100">Login</td>
                  <td className="py-2 text-gray-600 dark:text-gray-400">2 mins ago</td>
                  <td className="py-2 text-green-600 dark:text-green-400">Success</td>
                  <td className="py-2 text-gray-600 dark:text-gray-400">From Chrome on macOS</td>
                </tr>
                <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-2 text-gray-900 dark:text-gray-100">jane.smith@example.com</td>
                  <td className="py-2 text-gray-900 dark:text-gray-100">Data Export</td>
                  <td className="py-2 text-gray-600 dark:text-gray-400">5 mins ago</td>
                  <td className="py-2 text-red-600 dark:text-red-400">Failed</td>
                  <td className="py-2 text-gray-600 dark:text-gray-400">Export service unavailable</td>
                </tr>
                <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-2 text-gray-900 dark:text-gray-100">admin@test.com</td>
                  <td className="py-2 text-gray-900 dark:text-gray-100">Profile Update</td>
                  <td className="py-2 text-gray-600 dark:text-gray-400">10 mins ago</td>
                  <td className="py-2 text-green-600 dark:text-green-400">Success</td>
                  <td className="py-2 text-gray-600 dark:text-gray-400">Changed email preferences</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}