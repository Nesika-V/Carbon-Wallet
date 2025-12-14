import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { storageService } from '@/services/storage';
import { calculationService } from '@/services/calculations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { MapPin, Play, Pause, Square, Navigation, Leaf, DollarSign, Clock } from 'lucide-react';
import type { RealtimeTrackingSession, ActivityHistory } from '@/types';

const RealtimeTracking: React.FC = () => {
  const { user } = useAuth();
  const [isSetup, setIsSetup] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [session, setSession] = useState<RealtimeTrackingSession | null>(null);
  const [setupData, setSetupData] = useState({
    vehicleType: 'car' as 'car' | 'bike' | 'scooter',
    fuelType: 'petrol' as 'petrol' | 'diesel' | 'electric',
    vehicleAge: 3,
  });
  const watchIdRef = useRef<number | null>(null);
  const lastPositionRef = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const requestLocationPermission = async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return false;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      if (permission.state === 'denied') {
        toast.error('Location permission denied. Please enable it in your browser settings.');
        return false;
      }
      return true;
    } catch (error) {
      return true;
    }
  };

  const handleSetup = async () => {
    if (!user) {
      toast.error('Please log in to use real-time tracking');
      return;
    }

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    const activeSession = storageService.getActiveTrackingSession(user.id);
    if (activeSession) {
      setSession(activeSession);
      setIsSetup(true);
      setIsTracking(true);
      lastPositionRef.current = activeSession.waypoints[activeSession.waypoints.length - 1] || null;
      startTracking(activeSession);
    } else {
      setIsSetup(true);
    }
  };

  const startTracking = (existingSession?: RealtimeTrackingSession) => {
    if (!user) return;

    const newSession: RealtimeTrackingSession = existingSession || {
      id: crypto.randomUUID(),
      userId: user.id,
      vehicleType: setupData.vehicleType,
      fuelType: setupData.fuelType,
      vehicleAge: setupData.vehicleAge,
      startTime: new Date().toISOString(),
      totalDistance: 0,
      carbonEmitted: 0,
      moneySpent: 0,
      averageSpeed: 0,
      isActive: true,
      waypoints: [],
    };

    setSession(newSession);
    setIsTracking(true);
    setIsPaused(false);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        if (isPaused) return;

        const newWaypoint = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: new Date().toISOString(),
        };

        setSession((prev) => {
          if (!prev) return null;

          const updatedWaypoints = [...prev.waypoints, newWaypoint];
          let additionalDistance = 0;

          if (lastPositionRef.current) {
            additionalDistance = calculationService.calculateDistance(
              lastPositionRef.current.lat,
              lastPositionRef.current.lng,
              newWaypoint.lat,
              newWaypoint.lng
            );
          }

          lastPositionRef.current = newWaypoint;

          const totalDistance = prev.totalDistance + additionalDistance;
          const carbonFactor = prev.fuelType === 'petrol' ? 0.12 : prev.fuelType === 'diesel' ? 0.15 : 0.05;
          const carbonEmitted = totalDistance * carbonFactor;

          const mileage = 12.5;
          const fuelCost = prev.fuelType === 'petrol' ? 1.5 : prev.fuelType === 'diesel' ? 1.4 : 0.3;
          const fuelConsumed = totalDistance / mileage;
          const moneySpent = fuelConsumed * fuelCost;

          const duration = (new Date().getTime() - new Date(prev.startTime).getTime()) / 1000 / 3600;
          const averageSpeed = duration > 0 ? totalDistance / duration : 0;

          const updated = {
            ...prev,
            waypoints: updatedWaypoints,
            totalDistance,
            carbonEmitted,
            moneySpent,
            averageSpeed,
          };

          storageService.saveTrackingSession(updated);
          return updated;
        });
      },
      (error) => {
        toast.error('Error getting location: ' + error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );
  };

  const handleStart = () => {
    startTracking();
    toast.success('Tracking started!');
  };

  const handlePause = () => {
    setIsPaused(true);
    toast.info('Tracking paused');
  };

  const handleResume = () => {
    setIsPaused(false);
    toast.success('Tracking resumed');
  };

  const handleStop = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (session && user) {
      const finalSession = {
        ...session,
        endTime: new Date().toISOString(),
        isActive: false,
      };

      storageService.saveTrackingSession(finalSession);

      const activity: ActivityHistory = {
        id: crypto.randomUUID(),
        userId: user.id,
        activityType: 'realtime_travel' as const,
        activityDate: new Date().toISOString().split('T')[0],
        activityTime: new Date().toISOString().split('T')[1].split('.')[0],
        inputData: {
          vehicleType: session.vehicleType,
          fuelType: session.fuelType,
          vehicleAge: session.vehicleAge,
        },
        carbonEmitted: session.carbonEmitted,
        costSpent: session.moneySpent,
        distanceTravelled: session.totalDistance,
        duration: Math.round((new Date().getTime() - new Date(session.startTime).getTime()) / 1000 / 60),
        alternativeApplied: false,
        createdAt: new Date().toISOString(),
      };

      storageService.addActivity(activity);
      toast.success('Trip saved successfully!');
    }

    setIsTracking(false);
    setIsPaused(false);
    setSession(null);
    setIsSetup(false);
    lastPositionRef.current = null;
  };

  if (!isSetup) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
              <MapPin className="w-8 h-8 mr-3 text-chart-4" />
              Real-Time GPS Tracking
            </h1>
            <p className="text-muted-foreground">
              Track your journey automatically with GPS
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Setup Your Vehicle</CardTitle>
              <CardDescription>Enter your vehicle details before starting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select
                  value={setupData.vehicleType}
                  onValueChange={(value: typeof setupData.vehicleType) =>
                    setSetupData({ ...setupData, vehicleType: value })
                  }
                >
                  <SelectTrigger id="vehicleType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="bike">Bike/Motorcycle</SelectItem>
                    <SelectItem value="scooter">Scooter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select
                  value={setupData.fuelType}
                  onValueChange={(value: typeof setupData.fuelType) =>
                    setSetupData({ ...setupData, fuelType: value })
                  }
                >
                  <SelectTrigger id="fuelType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleAge">Vehicle Age (years)</Label>
                <Input
                  id="vehicleAge"
                  type="number"
                  min="0"
                  max="30"
                  value={setupData.vehicleAge}
                  onChange={(e) => setSetupData({ ...setupData, vehicleAge: Number(e.target.value) })}
                />
              </div>

              <Button onClick={handleSetup} className="w-full">
                <Navigation className="w-4 h-4 mr-2" />
                Enable GPS & Start
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
            <MapPin className="w-8 h-8 mr-3 text-chart-4" />
            {isTracking ? 'Tracking Active' : 'Ready to Track'}
          </h1>
          <p className="text-muted-foreground">
            {isTracking ? 'Your journey is being recorded' : 'Start tracking your journey'}
          </p>
        </div>

        {session && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Live Stats</CardTitle>
              <CardDescription>Real-time journey information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Navigation className="w-4 h-4 text-primary" />
                    <p className="text-xs text-muted-foreground">Distance</p>
                  </div>
                  <p className="text-2xl font-bold text-primary">{session.totalDistance.toFixed(2)} km</p>
                </div>

                <div className="p-4 bg-secondary/10 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-secondary" />
                    <p className="text-xs text-muted-foreground">Avg Speed</p>
                  </div>
                  <p className="text-2xl font-bold text-secondary">{session.averageSpeed.toFixed(1)} km/h</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Leaf className="w-4 h-4 text-chart-1" />
                    <p className="text-xs text-muted-foreground">Carbon</p>
                  </div>
                  <p className="text-2xl font-bold">{session.carbonEmitted.toFixed(2)} kg</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-4 h-4 text-chart-3" />
                    <p className="text-xs text-muted-foreground">Cost</p>
                  </div>
                  <p className="text-2xl font-bold">${session.moneySpent.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
            <CardDescription>Manage your tracking session</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!isTracking && (
              <Button onClick={handleStart} className="w-full" size="lg">
                <Play className="w-5 h-5 mr-2" />
                Start Tracking
              </Button>
            )}

            {isTracking && !isPaused && (
              <Button onClick={handlePause} variant="secondary" className="w-full" size="lg">
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </Button>
            )}

            {isTracking && isPaused && (
              <Button onClick={handleResume} className="w-full" size="lg">
                <Play className="w-5 h-5 mr-2" />
                Resume
              </Button>
            )}

            {isTracking && (
              <Button onClick={handleStop} variant="destructive" className="w-full" size="lg">
                <Square className="w-5 h-5 mr-2" />
                Stop & Save Trip
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealtimeTracking;
