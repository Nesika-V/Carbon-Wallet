import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Exercise from './pages/Exercise';
import Food from './pages/Food';
import Travel from './pages/Travel';
import RealtimeTracking from './pages/RealtimeTracking';
import History from './pages/History';
import Analytics from './pages/Analytics';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    element: <Dashboard />,
    visible: true,
  },
  {
    name: 'Profile',
    path: '/profile',
    element: <Profile />,
    visible: true,
  },
  {
    name: 'Exercise',
    path: '/exercise',
    element: <Exercise />,
    visible: true,
  },
  {
    name: 'Food',
    path: '/food',
    element: <Food />,
    visible: true,
  },
  {
    name: 'Travel',
    path: '/travel',
    element: <Travel />,
    visible: true,
  },
  {
    name: 'GPS Tracking',
    path: '/realtime-tracking',
    element: <RealtimeTracking />,
    visible: true,
  },
  {
    name: 'History',
    path: '/history',
    element: <History />,
    visible: true,
  },
  {
    name: 'Analytics',
    path: '/analytics',
    element: <Analytics />,
    visible: true,
  },
];

export default routes;
