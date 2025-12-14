import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { storageService } from '@/services/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingDown, TrendingUp, Activity as ActivityIcon, Calendar } from 'lucide-react';
import type { ActivityHistory } from '@/types';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityHistory[]>([]);
  const [stats, setStats] = useState({
    totalCarbon: 0,
    totalCost: 0,
    totalActivities: 0,
    avgDailyCarbon: 0,
  });

  useEffect(() => {
    if (user) {
      const userActivities = storageService.getUserActivities(user.id);
      setActivities(userActivities);

      const totalCarbon = userActivities.reduce((sum, a) => sum + a.carbonEmitted, 0);
      const totalCost = userActivities.reduce((sum, a) => sum + a.costSpent, 0);
      const uniqueDays = new Set(userActivities.map(a => a.activityDate)).size;
      const avgDailyCarbon = uniqueDays > 0 ? totalCarbon / uniqueDays : 0;

      setStats({
        totalCarbon,
        totalCost,
        totalActivities: userActivities.length,
        avgDailyCarbon,
      });
    }
  }, [user]);

  const getDailyData = () => {
    const dailyMap = new Map<string, { carbon: number; cost: number }>();

    activities.forEach(activity => {
      const existing = dailyMap.get(activity.activityDate) || { carbon: 0, cost: 0 };
      dailyMap.set(activity.activityDate, {
        carbon: existing.carbon + activity.carbonEmitted,
        cost: existing.cost + activity.costSpent,
      });
    });

    return Array.from(dailyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-7)
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        carbon: Number(data.carbon.toFixed(2)),
        cost: Number(data.cost.toFixed(2)),
      }));
  };

  const getActivityTypeData = () => {
    const typeMap = new Map<string, number>();

    activities.forEach(activity => {
      const existing = typeMap.get(activity.activityType) || 0;
      typeMap.set(activity.activityType, existing + activity.carbonEmitted);
    });

    return Array.from(typeMap.entries()).map(([type, carbon]) => ({
      name: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: Number(carbon.toFixed(2)),
    }));
  };

  const getWeeklyComparison = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const thisWeek = activities.filter(a => new Date(a.activityDate) >= oneWeekAgo);
    const lastWeek = activities.filter(a => {
      const date = new Date(a.activityDate);
      return date >= twoWeeksAgo && date < oneWeekAgo;
    });

    const thisWeekCarbon = thisWeek.reduce((sum, a) => sum + a.carbonEmitted, 0);
    const lastWeekCarbon = lastWeek.reduce((sum, a) => sum + a.carbonEmitted, 0);

    return [
      { week: 'Last Week', carbon: Number(lastWeekCarbon.toFixed(2)) },
      { week: 'This Week', carbon: Number(thisWeekCarbon.toFixed(2)) },
    ];
  };

  const dailyData = getDailyData();
  const activityTypeData = getActivityTypeData();
  const weeklyComparison = getWeeklyComparison();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Visualize your carbon footprint and progress
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Carbon</CardTitle>
              <TrendingDown className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {stats.totalCarbon.toFixed(2)} kg
              </div>
              <p className="text-xs text-muted-foreground mt-1">CO₂ emissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              <TrendingUp className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                ${stats.totalCost.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total spending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Activities</CardTitle>
              <ActivityIcon className="w-4 h-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalActivities}</div>
              <p className="text-xs text-muted-foreground mt-1">Total logged</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
              <Calendar className="w-4 h-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgDailyCarbon.toFixed(2)} kg</div>
              <p className="text-xs text-muted-foreground mt-1">CO₂ per day</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Carbon Emissions</CardTitle>
              <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {dailyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="carbon" stroke="hsl(var(--chart-1))" name="Carbon (kg CO₂)" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Comparison</CardTitle>
              <CardDescription>This week vs last week</CardDescription>
            </CardHeader>
            <CardContent>
              {weeklyComparison.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="carbon" fill="hsl(var(--chart-2))" name="Carbon (kg CO₂)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Emissions by Activity Type</CardTitle>
              <CardDescription>Carbon footprint breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {activityTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={activityTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value} kg`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {activityTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Cost Trend</CardTitle>
              <CardDescription>Last 7 days spending</CardDescription>
            </CardHeader>
            <CardContent>
              {dailyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cost" fill="hsl(var(--chart-3))" name="Cost ($)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
