import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { storageService } from '@/services/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, Utensils, Car, MapPin, Calendar, Search } from 'lucide-react';
import type { ActivityHistory, ActivityType } from '@/types';

const History: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityHistory[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityHistory[]>([]);
  const [filterType, setFilterType] = useState<ActivityType | 'all'>('all');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    if (user) {
      const userActivities = storageService.getUserActivities(user.id);
      const sorted = userActivities.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setActivities(sorted);
      setFilteredActivities(sorted);
    }
  }, [user]);

  useEffect(() => {
    let filtered = activities;

    if (filterType !== 'all') {
      filtered = filtered.filter(a => a.activityType === filterType);
    }

    if (searchDate) {
      filtered = filtered.filter(a => a.activityDate === searchDate);
    }

    setFilteredActivities(filtered);
  }, [filterType, searchDate, activities]);

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'exercise':
        return <Activity className="w-5 h-5 text-primary" />;
      case 'food':
        return <Utensils className="w-5 h-5 text-secondary" />;
      case 'manual_travel':
      case 'realtime_travel':
        return <Car className="w-5 h-5 text-chart-3" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const formatActivityType = (type: ActivityType) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Activity History</h1>
          <p className="text-muted-foreground">
            View and filter your tracked activities
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter activities by type and date</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Activity Type</label>
                <Select
                  value={filterType}
                  onValueChange={(value: ActivityType | 'all') => setFilterType(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="exercise">Exercise</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="manual_travel">Manual Travel</SelectItem>
                    <SelectItem value="realtime_travel">Real-time Travel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  placeholder="Filter by date"
                />
              </div>
            </div>

            {(filterType !== 'all' || searchDate) && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setFilterType('all');
                  setSearchDate('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>

        {filteredActivities.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No activities found</h3>
                <p className="text-muted-foreground">
                  {activities.length === 0
                    ? 'Start tracking your activities to see them here'
                    : 'Try adjusting your filters'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <Card key={activity.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-3 bg-muted rounded-lg">
                        {getActivityIcon(activity.activityType)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {formatActivityType(activity.activityType)}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {activity.activityDate}
                          </span>
                          <span>{activity.activityTime}</span>
                          {activity.alternativeApplied && (
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                              Alternative Applied
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Carbon Emitted</p>
                            <p className="font-medium text-primary">{activity.carbonEmitted.toFixed(2)} kg CO₂</p>
                          </div>
                          {activity.costSpent > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground">Cost</p>
                              <p className="font-medium text-secondary">${activity.costSpent.toFixed(2)}</p>
                            </div>
                          )}
                          {activity.distanceTravelled && (
                            <div>
                              <p className="text-xs text-muted-foreground">Distance</p>
                              <p className="font-medium">{activity.distanceTravelled.toFixed(2)} km</p>
                            </div>
                          )}
                          {activity.duration && (
                            <div>
                              <p className="text-xs text-muted-foreground">Duration</p>
                              <p className="font-medium">{activity.duration} min</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
