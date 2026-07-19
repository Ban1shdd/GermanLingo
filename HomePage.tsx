"use client";

import type { UserData, UnitData } from "./DeutschLingoApp";

type Props = {
  user: UserData;
  units: UnitData[];
  streakData: {
    currentStreak: number;
    longestStreak: number;
    practicedToday: boolean;
    recentActivity: Array<{ date: string; xpEarned: number }>;
  } | null;
  onStartLesson: (lessonId: number) => void;
};

const colorMap: Record<string, string> = {
  green: "from-green-500/20 to-green-600/10 border-green-500/30",
  blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
  orange: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
  purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
  red: "from-red-500/20 to-red-600/10 border-red-500/30",
  pink: "from-pink-500/20 to-pink-600/10 border-pink-500/30",
  yellow: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30",
  teal: "from-teal-500/20 to-teal-600/10 border-teal-500/30",
};

const colorAccent: Record<string, string> = {
  green: "bg-green-500",
  blue: "bg-blue-500",
  orange: "bg-orange-500",
  purple: "bg-purple-500",
  red: "bg-red-500",
  pink: "bg-pink-500",
  yellow: "bg-yellow-500",
  teal: "bg-teal-500",
};

const lessonBtnColor: Record<string, string> = {
  green: "bg-green-500 hover:bg-green-400 shadow-green-500/30",
  blue: "bg-blue-500 hover:bg-blue-400 shadow-blue-500/30",
  orange: "bg-orange-500 hover:bg-orange-400 shadow-orange-500/30",
  purple: "bg-purple-500 hover:bg-purple-400 shadow-purple-500/30",
  red: "bg-red-500 hover:bg-red-400 shadow-red-500/30",
  pink: "bg-pink-500 hover:bg-pink-400 shadow-pink-500/30",
  yellow: "bg-yellow-500 hover:bg-yellow-400 shadow-yellow-500/30",
  teal: "bg-teal-500 hover:bg-teal-400 shadow-teal-500/30",
};

function getStarDisplay(stars: number) {
  return Array.from({ length: 3 }, (_, i) => (
    <span key={i} className={`text-xs ${i < stars ? "text-yellow-400" : "text-gray-600"}`}>
      ★
    </span>
  ));
}

export default function HomePage({ user, units, streakData, onStartLesson }: Props) {
  const xpForNextLevel = user.level * 100;
  const xpProgress = user.xp % 100;

  // Determine which lessons are unlocked
  const isLessonUnlocked = (unitIndex: number, lessonIndex: number): boolean => {
    if (unitIndex === 0 && lessonIndex === 0) return true;
    
    // Check if previous lesson in same unit is completed
    if (lessonIndex > 0) {
      const prevLesson = units[unitIndex].lessons[lessonIndex - 1];
      return prevLesson?.progress?.completed ?? false;
    }
    
    // First lesson of a new unit: previous unit must be complete
    if (unitIndex > 0) {
      return units[unitIndex - 1].isComplete;
    }
    
    return false;
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Streak Banner */}
      {streakData && (
        <div className="mb-6 animate-slide-up">
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">🔥</span>
                  <span className="text-2xl font-bold text-orange-400">
                    {streakData.currentStreak} day{streakData.currentStreak !== 1 ? "s" : ""}
                  </span>
                </div>
                <p className="text-sm text-dark-muted">
                  {streakData.practicedToday
                    ? "Great job today! Keep it up! ✅"
                    : "Practice today to keep your streak! ⏰"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-dark-muted">Best</p>
                <p className="text-lg font-bold text-orange-300">{streakData.longestStreak}</p>
              </div>
            </div>
            
            {/* Week dots */}
            <div className="flex justify-center gap-2 mt-3">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
                const today = new Date();
                const dayOfWeek = today.getDay();
                const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                const targetDate = new Date(today);
                targetDate.setDate(today.getDate() + mondayOffset + i);
                const dateStr = targetDate.toISOString().split("T")[0];
                const hasActivity = streakData.recentActivity.some(a => a.date === dateStr);
                const isToday = dateStr === today.toISOString().split("T")[0];

                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-dark-muted">{day}</span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        hasActivity
                          ? "bg-orange-500 text-white"
                          : isToday
                          ? "border-2 border-orange-500 text-orange-400"
                          : "bg-dark-card text-dark-muted"
                      }`}
                    >
                      {hasActivity ? "✓" : targetDate.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* XP Progress */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">Level {user.level}</span>
            <span className="text-xs bg-brand-green/20 text-brand-green px-2 py-0.5 rounded-full font-medium">
              {user.xp} XP
            </span>
          </div>
          <span className="text-xs text-dark-muted">{xpProgress}/{xpForNextLevel} XP</span>
        </div>
        <div className="w-full bg-dark-card rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-green to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${(xpProgress / xpForNextLevel) * 100}%` }}
          />
        </div>
      </div>

      {/* Units */}
      <div className="space-y-6">
        {units.map((unit, unitIndex) => {
          const unitUnlocked = unitIndex === 0 || units[unitIndex - 1].isComplete;
          
          return (
            <div
              key={unit.id}
              className="animate-slide-up"
              style={{ animationDelay: `${(unitIndex + 2) * 0.1}s` }}
            >
              {/* Unit Header */}
              <div
                className={`bg-gradient-to-br ${
                  colorMap[unit.color || "green"]
                } border rounded-2xl p-4 mb-3 ${!unitUnlocked ? "opacity-50" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{unit.icon}</span>
                    <div>
                      <h2 className="text-lg font-bold">{unit.title}</h2>
                      <p className="text-sm text-dark-muted">{unit.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">
                      {unit.completedCount}/{unit.totalCount}
                    </p>
                    {unit.isComplete && <span className="text-xs text-brand-green">✅ Done</span>}
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-3 w-full bg-dark-bg/50 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${
                      colorAccent[unit.color || "green"]
                    } rounded-full transition-all duration-500`}
                    style={{
                      width: `${unit.totalCount > 0 ? (unit.completedCount / unit.totalCount) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* Lessons */}
              <div className="flex flex-wrap justify-center gap-3 px-2">
                {unit.lessons.map((lesson, lessonIndex) => {
                  const unlocked = isLessonUnlocked(unitIndex, lessonIndex);
                  const completed = lesson.progress?.completed ?? false;
                  const stars = lesson.progress?.stars ?? 0;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => unlocked && onStartLesson(lesson.id)}
                      disabled={!unlocked}
                      className={`relative flex flex-col items-center justify-center w-[72px] h-[72px] rounded-2xl font-bold text-white transition-all duration-200 ${
                        !unlocked
                          ? "bg-dark-card/50 text-dark-muted cursor-not-allowed"
                          : completed
                          ? `${lessonBtnColor[unit.color || "green"]} shadow-lg cursor-pointer active:scale-95`
                          : `${lessonBtnColor[unit.color || "green"]} shadow-lg cursor-pointer active:scale-95 animate-pulse-glow`
                      }`}
                    >
                      {!unlocked ? (
                        <span className="text-2xl">🔒</span>
                      ) : (
                        <>
                          <span className="text-xs mb-0.5">{lesson.orderIndex}</span>
                          <span className="text-[10px] leading-tight text-center px-1 line-clamp-2">
                            {lesson.title}
                          </span>
                          {completed && (
                            <div className="flex gap-0 mt-0.5">
                              {getStarDisplay(stars)}
                            </div>
                          )}
                        </>
                      )}
                      {lesson.type === "review" && unlocked && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-[10px]">
                          ⭐
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* End message */}
      <div className="text-center mt-8 mb-4 text-dark-muted">
        <p className="text-sm">More units coming soon! 🚀</p>
      </div>
    </div>
  );
}
