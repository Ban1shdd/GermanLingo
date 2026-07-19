"use client";

import { useState, useEffect, useCallback } from "react";
import HomePage from "./HomePage";
import LessonPage from "./LessonPage";
import ProfilePage from "./ProfilePage";
import AchievementsPage from "./AchievementsPage";

export type UserData = {
  id: number;
  username: string;
  displayName: string;
  xp: number;
  level: number;
  hearts: number;
  gems: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
};

export type UnitData = {
  id: number;
  orderIndex: number;
  title: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  lessons: LessonData[];
  completedCount: number;
  totalCount: number;
  isComplete: boolean;
};

export type LessonData = {
  id: number;
  unitId: number;
  orderIndex: number;
  title: string;
  description: string | null;
  type: string;
  xpReward: number;
  progress: {
    completed: boolean;
    stars: number;
    bestScore: number;
  } | null;
};

type Tab = "learn" | "profile" | "achievements";

export default function DeutschLingoApp() {
  const [user, setUser] = useState<UserData | null>(null);
  const [units, setUnits] = useState<UnitData[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("learn");
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [streakData, setStreakData] = useState<{
    currentStreak: number;
    longestStreak: number;
    practicedToday: boolean;
    recentActivity: Array<{ date: string; xpEarned: number }>;
  } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [userRes, unitsRes, streakRes] = await Promise.all([
        fetch("/api/user"),
        fetch("/api/units"),
        fetch("/api/streak"),
      ]);
      const userData = await userRes.json();
      const unitsData = await unitsRes.json();
      const streakD = await streakRes.json();
      setUser(userData);
      setUnits(unitsData);
      setStreakData(streakD);
    } catch (e) {
      console.error("Error fetching data:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const startLesson = (lessonId: number) => {
    setActiveLessonId(lessonId);
  };

  const finishLesson = () => {
    setActiveLessonId(null);
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="text-6xl mb-4">🇩🇪</div>
          <h1 className="text-3xl font-bold text-brand-green mb-2">DeutschLingo</h1>
          <p className="text-dark-muted">Loading your lessons...</p>
          <div className="mt-6 flex justify-center gap-1">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-3 h-3 bg-brand-green rounded-full"
                style={{
                  animation: `pulse 1s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeLessonId) {
    return (
      <LessonPage
        lessonId={activeLessonId}
        user={user!}
        onClose={finishLesson}
        onUserUpdate={setUser}
      />
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Header */}
      <header className="safe-top sticky top-0 z-50 bg-dark-bg/95 backdrop-blur-md border-b border-dark-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇩🇪</span>
            <h1 className="text-xl font-bold text-brand-green">DeutschLingo</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-dark-card px-2.5 py-1 rounded-full">
              <span className="text-sm">🔥</span>
              <span className="text-sm font-bold text-orange-400">
                {streakData?.currentStreak || 0}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-dark-card px-2.5 py-1 rounded-full">
              <span className="text-sm">💎</span>
              <span className="text-sm font-bold text-blue-400">{user?.gems || 0}</span>
            </div>
            <div className="flex items-center gap-1 bg-dark-card px-2.5 py-1 rounded-full">
              <span className="text-sm">❤️</span>
              <span className="text-sm font-bold text-red-400">{user?.hearts || 0}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto pb-20">
        {activeTab === "learn" && (
          <HomePage
            user={user!}
            units={units}
            streakData={streakData}
            onStartLesson={startLesson}
          />
        )}
        {activeTab === "profile" && (
          <ProfilePage user={user!} streakData={streakData} />
        )}
        {activeTab === "achievements" && <AchievementsPage />}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-dark-bg/95 backdrop-blur-md border-t border-dark-border safe-bottom z-50">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          {([
            { id: "learn" as Tab, icon: "📖", label: "Learn" },
            { id: "achievements" as Tab, icon: "🏆", label: "Awards" },
            { id: "profile" as Tab, icon: "👤", label: "Profile" },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-6 py-1.5 rounded-xl transition-all ${
                activeTab === tab.id
                  ? "text-brand-green"
                  : "text-dark-muted hover:text-dark-text"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
