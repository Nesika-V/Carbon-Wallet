import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { storageService } from '@/services/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Activity, Utensils, Car, MapPin, TrendingDown, DollarSign, Leaf } from 'lucide-react';
import type { ActivityHistory } from '@/types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityHistory[]>([]);
  const [todayStats, setTodayStats] = useState({
    carbon: 0,
    cost: 0,
    activities: 0,
  });

  useEffect(() => {
    if (user) {
      const userActivities = storageService.getUserActivities(user.id);
      setActivities(userActivities);

      const today = new Date().toISOString().split('T')[0];
      const todayActivities = userActivities.filter(a => a.activityDate === today);
      
      const stats = todayActivities.reduce(
        (acc, activity) => ({
          carbon: acc.carbon + activity.carbonEmitted,
          cost: acc.cost + activity.costSpent,
          activities: acc.activities + 1,
        }),
        { carbon: 0, cost: 0, activities: 0 }
      );

      setTodayStats(stats);
    }
  }, [user]);

  const moduleCards = [
    {
      title: 'Exercise Tracking',
      description: 'Track your workouts and calories burned',
      icon: Activity,
      path: '/exercise',
      color: 'text-primary',
    },
    {
      title: 'Food Intake',
      description: 'Monitor your food carbon footprint',
      icon: Utensils,
      path: '/food',
      color: 'text-secondary',
    },
    {
      title: 'Manual Travel',
      description: 'Log your travel emissions',
      icon: Car,
      path: '/travel',
      color: 'text-chart-3',
    },
    {
      title: 'Real-Time Tracking',
      description: 'GPS-based journey tracking',
      icon: MapPin,
      path: '/realtime-tracking',
      color: 'text-chart-4',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Track your carbon footprint and make sustainable choices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Carbon</CardTitle>
              <Leaf className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {todayStats.carbon.toFixed(2)} kg
              </div>
              <p className="text-xs text-muted-foreground mt-1">CO₂ emissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Cost</CardTitle>
              <DollarSign className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                ${todayStats.cost.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total spending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Activities Logged</CardTitle>
              <TrendingDown className="w-4 h-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.activities}</div>
              <p className="text-xs text-muted-foreground mt-1">Today's entries</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Track Your Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {moduleCards.map((module) => (
              <Card
                key={module.path}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(module.path)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg bg-muted ${module.color}`}>
                      <module.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="mt-2">{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Start Tracking
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Your latest tracked activities</CardDescription>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No activities yet. Start tracking to see your progress!
                </p>
              ) : (
                <div className="space-y-4">
                  {activities.slice(0, 5).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {activity.activityType === 'exercise' && <Activity className="w-5 h-5 text-primary" />}
                        {activity.activityType === 'food' && <Utensils className="w-5 h-5 text-secondary" />}
                        {(activity.activityType === 'manual_travel' || activity.activityType === 'realtime_travel') && (
                          <Car className="w-5 h-5 text-chart-3" />
                        )}
                        <div>
                          <p className="font-medium capitalize">{activity.activityType.replace('_', ' ')}</p>
                          <p className="text-sm text-muted-foreground">{activity.activityDate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary">{activity.carbonEmitted.toFixed(2)} kg CO₂</p>
                        {activity.costSpent > 0 && (
                          <p className="text-sm text-muted-foreground">${activity.costSpent.toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => navigate('/history')}
              >
                View All History
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your profile and view analytics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/profile')}
              >
                <Activity className="w-4 h-4 mr-2" />
                Update Profile
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/analytics')}
              >
                <TrendingDown className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/history')}
              >
                <Car className="w-4 h-4 mr-2" />
                Activity History
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
