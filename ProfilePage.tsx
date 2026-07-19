"use client";

import { useState } from "react";
import type { UserData } from "./DeutschLingoApp";

type Props = {
  user: UserData;
  streakData: {
    currentStreak: number;
    longestStreak: number;
    practicedToday: boolean;
    recentActivity: Array<{ date: string; xpEarned: number }>;
  } | null;
};

export default function ProfilePage({ user, streakData }: Props) {
  const [refilling, setRefilling] = useState(false);
  const [userState, setUserState] = useState(user);
  const xpProgress = userState.xp % 100;
  const xpForNext = userState.level * 100;

  const refillHearts = async () => {
    if (userState.gems < 50 || userState.hearts >= 5) return;
    setRefilling(true);
    try {
      const res = await fetch("/api/hearts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "refill" }),
      });
      if (res.ok) {
        const updated = await res.json();
        setUserState(updated);
      }
    } catch (e) {
      console.error("Error refilling hearts:", e);
    }
    setRefilling(false);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Profile Card */}
      <div className="bg-dark-card rounded-2xl p-6 mb-6 animate-slide-up text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-brand-green to-emerald-400 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-lg shadow-brand-green/20">
          🧑‍🎓
        </div>
        <h2 className="text-2xl font-bold">{userState.displayName}</h2>
        <p className="text-dark-muted text-sm">@{userState.username}</p>
        
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-sm font-bold">
            Level {userState.level}
          </span>
          <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-bold">
            {userState.xp} XP
          </span>
        </div>

        {/* XP Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-dark-muted mb-1">
            <span>Progress to Level {userState.level + 1}</span>
            <span>{xpProgress}/{xpForNext}</span>
          </div>
          <div className="w-full bg-dark-bg rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-green to-emerald-400 rounded-full transition-all"
              style={{ width: `${(xpProgress / xpForNext) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="bg-dark-card rounded-2xl p-4 text-center">
          <p className="text-3xl mb-1">🔥</p>
          <p className="text-2xl font-bold text-orange-400">{streakData?.currentStreak || 0}</p>
          <p className="text-xs text-dark-muted">Day Streak</p>
        </div>
        <div className="bg-dark-card rounded-2xl p-4 text-center">
          <p className="text-3xl mb-1">🏆</p>
          <p className="text-2xl font-bold text-yellow-400">{streakData?.longestStreak || 0}</p>
          <p className="text-xs text-dark-muted">Best Streak</p>
        </div>
        <div className="bg-dark-card rounded-2xl p-4 text-center">
          <p className="text-3xl mb-1">⭐</p>
          <p className="text-2xl font-bold text-brand-green">{userState.xp}</p>
          <p className="text-xs text-dark-muted">Total XP</p>
        </div>
        <div className="bg-dark-card rounded-2xl p-4 text-center">
          <p className="text-3xl mb-1">💎</p>
          <p className="text-2xl font-bold text-blue-400">{userState.gems}</p>
          <p className="text-xs text-dark-muted">Gems</p>
        </div>
      </div>

      {/* Hearts Shop */}
      <div className="bg-dark-card rounded-2xl p-5 mb-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <span>❤️</span> Hearts
        </h3>
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <span
                key={i}
                className={`text-2xl transition-all ${
                  i <= userState.hearts ? "scale-100" : "scale-75 opacity-30 grayscale"
                }`}
              >
                ❤️
              </span>
            ))}
          </div>
          <span className="text-sm text-dark-muted">{userState.hearts}/5</span>
        </div>
        
        {userState.hearts < 5 && (
          <button
            onClick={refillHearts}
            disabled={refilling || userState.gems < 50}
            className={`w-full py-3 rounded-xl font-bold transition-all active:scale-95 ${
              userState.gems >= 50
                ? "bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/30"
                : "bg-dark-bg text-dark-muted cursor-not-allowed"
            }`}
          >
            {refilling ? "Refilling..." : "Refill Hearts (💎 50)"}
          </button>
        )}
        {userState.hearts >= 5 && (
          <p className="text-center text-brand-green text-sm font-medium">Hearts are full! ✅</p>
        )}
      </div>

      {/* Recent Activity */}
      {streakData && streakData.recentActivity.length > 0 && (
        <div className="bg-dark-card rounded-2xl p-5 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span>📊</span> Recent Activity
          </h3>
          <div className="space-y-2">
            {streakData.recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-dark-border last:border-0">
                <span className="text-sm text-dark-muted">
                  {new Date(activity.date + "T00:00:00").toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-sm font-bold text-brand-green">+{activity.xpEarned} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
