import type { User, UserProfile, ActivityHistory, RealtimeTrackingSession } from '@/types';

const STORAGE_KEYS = {
  USERS: 'carbon_wallet_users',
  PROFILES: 'carbon_wallet_profiles',
  ACTIVITIES: 'carbon_wallet_activities',
  CURRENT_USER: 'carbon_wallet_current_user',
  TRACKING_SESSIONS: 'carbon_wallet_tracking_sessions',
} as const;

export const storageService = {
  getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getUserByEmail(email: string): User | undefined {
    const users = this.getUsers();
    return users.find(u => u.email === email);
  },

  createUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  },

  getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getProfiles(): UserProfile[] {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILES);
    return data ? JSON.parse(data) : [];
  },

  saveProfiles(profiles: UserProfile[]): void {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
  },

  getProfile(userId: string): UserProfile | undefined {
    const profiles = this.getProfiles();
    return profiles.find(p => p.userId === userId);
  },

  saveProfile(profile: UserProfile): void {
    const profiles = this.getProfiles();
    const index = profiles.findIndex(p => p.userId === profile.userId);
    if (index >= 0) {
      profiles[index] = profile;
    } else {
      profiles.push(profile);
    }
    this.saveProfiles(profiles);
  },

  getActivities(): ActivityHistory[] {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return data ? JSON.parse(data) : [];
  },

  saveActivities(activities: ActivityHistory[]): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  },

  getUserActivities(userId: string): ActivityHistory[] {
    const activities = this.getActivities();
    return activities.filter(a => a.userId === userId);
  },

  addActivity(activity: ActivityHistory): void {
    const activities = this.getActivities();
    activities.push(activity);
    this.saveActivities(activities);
  },

  getTrackingSessions(): RealtimeTrackingSession[] {
    const data = localStorage.getItem(STORAGE_KEYS.TRACKING_SESSIONS);
    return data ? JSON.parse(data) : [];
  },

  saveTrackingSessions(sessions: RealtimeTrackingSession[]): void {
    localStorage.setItem(STORAGE_KEYS.TRACKING_SESSIONS, JSON.stringify(sessions));
  },

  getUserTrackingSessions(userId: string): RealtimeTrackingSession[] {
    const sessions = this.getTrackingSessions();
    return sessions.filter(s => s.userId === userId);
  },

  getActiveTrackingSession(userId: string): RealtimeTrackingSession | undefined {
    const sessions = this.getUserTrackingSessions(userId);
    return sessions.find(s => s.isActive);
  },

  saveTrackingSession(session: RealtimeTrackingSession): void {
    const sessions = this.getTrackingSessions();
    const index = sessions.findIndex(s => s.id === session.id);
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.push(session);
    }
    this.saveTrackingSessions(sessions);
  },

  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};
