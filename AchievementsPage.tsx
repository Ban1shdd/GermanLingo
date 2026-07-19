"use client";

import { useState, useEffect } from "react";

type Achievement = {
  id: number;
  key: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  requirement: number;
  category: string;
  unlocked: boolean;
};

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/achievements")
      .then(r => r.json())
      .then(data => {
        setAchievements(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 text-center">
        <p className="text-dark-muted">Loading achievements...</p>
      </div>
    );
  }

  const categories = ["all", ...Array.from(new Set(achievements.map(a => a.category)))];
  const filtered = filter === "all" ? achievements : achievements.filter(a => a.category === filter);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const categoryLabels: Record<string, string> = {
    all: "All",
    lessons: "📖 Lessons",
    streak: "🔥 Streaks",
    xp: "⭐ XP",
    special: "💎 Special",
    units: "🏅 Units",
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6 animate-slide-up">
        <h2 className="text-2xl font-bold mb-1">Achievements</h2>
        <p className="text-dark-muted text-sm">
          {unlockedCount} of {achievements.length} unlocked
        </p>
        <div className="mt-3 w-full bg-dark-card rounded-full h-2 overflow-hidden max-w-xs mx-auto">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all"
            style={{ width: `${achievements.length > 0 ? (unlockedCount / achievements.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none animate-slide-up" style={{ animationDelay: "0.1s" }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === cat
                ? "bg-brand-green text-white"
                : "bg-dark-card text-dark-muted hover:text-white"
            }`}
          >
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {/* Achievement cards */}
      <div className="space-y-3">
        {filtered.map((achievement, i) => (
          <div
            key={achievement.id}
            className={`bg-dark-card rounded-2xl p-4 flex items-center gap-4 transition-all animate-slide-up ${
              achievement.unlocked ? "" : "opacity-50"
            }`}
            style={{ animationDelay: `${(i + 2) * 0.05}s` }}
          >
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                achievement.unlocked
                  ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
                  : "bg-dark-bg"
              }`}
            >
              {achievement.unlocked ? achievement.icon : "🔒"}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm">{achievement.title}</h3>
              <p className="text-xs text-dark-muted">{achievement.description}</p>
              {achievement.unlocked && (
                <span className="text-xs text-brand-green font-medium">✅ Unlocked</span>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-brand-green font-bold">+{achievement.xpReward} XP</p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-dark-muted mt-8">
          <p className="text-4xl mb-2">🏆</p>
          <p>No achievements in this category yet!</p>
        </div>
      )}
    </div>
  );
}
