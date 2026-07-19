"use client";

import { useState, useEffect, useCallback } from "react";
import type { UserData } from "./DeutschLingoApp";

type Question = {
  id: number;
  type: string;
  prompt: string;
  correctAnswer: string;
  options: string[] | null;
  hint: string | null;
};

type LessonDetail = {
  id: number;
  title: string;
  description: string | null;
  type: string;
  xpReward: number;
  questions: Question[];
};

type Props = {
  lessonId: number;
  user: UserData;
  onClose: () => void;
  onUserUpdate: (u: UserData) => void;
};

type CompletionResult = {
  xpEarned: number;
  stars: number;
  streak: number;
  newAchievements: Array<{ title: string; icon: string; description: string }>;
  user: UserData;
};

export default function LessonPage({ lessonId, user, onClose, onUserUpdate }: Props) {
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(user.hearts);
  const [showResult, setShowResult] = useState(false);
  const [completionResult, setCompletionResult] = useState<CompletionResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animateCorrect, setAnimateCorrect] = useState(false);
  const [animateWrong, setAnimateWrong] = useState(false);
  const [showAchievement, setShowAchievement] = useState<{ title: string; icon: string; description: string } | null>(null);

  useEffect(() => {
    fetch(`/api/lessons/${lessonId}`)
      .then(r => r.json())
      .then(data => {
        // Parse options from JSONB
        const qs = data.questions.map((q: Record<string, unknown>) => ({
          ...q,
          options: typeof q.options === "string" ? JSON.parse(q.options as string) : q.options,
        }));
        setLesson({ ...data, questions: qs });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [lessonId]);

  const checkAnswer = useCallback(async () => {
    if (!lesson || selected === null) return;

    const question = lesson.questions[currentQ];
    const correct = selected === question.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setScore(s => s + 1);
      setAnimateCorrect(true);
      setTimeout(() => setAnimateCorrect(false), 600);
    } else {
      setAnimateWrong(true);
      setTimeout(() => setAnimateWrong(false), 500);
      const newHearts = hearts - 1;
      setHearts(newHearts);
      fetch("/api/hearts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "lose" }),
      });
    }

    setTimeout(async () => {
      if (currentQ + 1 < lesson.questions.length && hearts > 0) {
        setCurrentQ(c => c + 1);
        setSelected(null);
        setIsCorrect(null);
        setShowHint(false);
      } else {
        // Lesson complete
        setShowResult(true);
        try {
          const res = await fetch(`/api/lessons/${lessonId}/complete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              score: score + (correct ? 1 : 0),
              totalQuestions: lesson.questions.length,
            }),
          });
          const result = await res.json();
          setCompletionResult(result);
          onUserUpdate(result.user);

          // Show achievements one by one
          if (result.newAchievements.length > 0) {
            for (let i = 0; i < result.newAchievements.length; i++) {
              await new Promise<void>(resolve => {
                setTimeout(() => {
                  setShowAchievement(result.newAchievements[i]);
                  setTimeout(() => {
                    setShowAchievement(null);
                    resolve();
                  }, 2500);
                }, (i + 1) * 1000);
              });
            }
          }
        } catch (e) {
          console.error("Error completing lesson:", e);
        }
      }
    }, 1200);
  }, [lesson, selected, currentQ, hearts, score, lessonId, onUserUpdate]);

  if (loading || !lesson) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">📚</div>
          <p className="text-dark-muted">Loading lesson...</p>
        </div>
      </div>
    );
  }

  const question = lesson.questions[currentQ];
  const progress = ((currentQ + (isCorrect !== null ? 1 : 0)) / lesson.questions.length) * 100;

  // Result screen
  if (showResult) {
    const finalScore = score;
    const totalQ = lesson.questions.length;
    const percentage = Math.round((finalScore / totalQ) * 100);
    const stars = completionResult?.stars ?? (finalScore === totalQ ? 3 : finalScore >= totalQ * 0.7 ? 2 : 1);

    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center px-4">
        {/* Achievement popup */}
        {showAchievement && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-2xl px-6 py-4 text-center shadow-xl">
              <span className="text-4xl">{showAchievement.icon}</span>
              <p className="font-bold text-yellow-400 mt-1">{showAchievement.title}</p>
              <p className="text-xs text-dark-muted">{showAchievement.description}</p>
            </div>
          </div>
        )}

        <div className="text-center animate-bounce-in max-w-sm w-full">
          {/* Stars */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map(s => (
              <span
                key={s}
                className={`text-5xl transition-all ${
                  s <= stars ? "text-yellow-400 scale-100" : "text-gray-700 scale-75"
                }`}
                style={{ animationDelay: `${s * 0.2}s` }}
              >
                ★
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-bold mb-2">
            {percentage === 100 ? "Perfect! 🎉" : percentage >= 70 ? "Great Job! 👏" : "Keep Practicing! 💪"}
          </h1>

          <p className="text-dark-muted mb-6">{lesson.title} completed</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-dark-card rounded-xl p-3">
              <p className="text-2xl font-bold text-brand-green">
                {completionResult?.xpEarned ?? 0}
              </p>
              <p className="text-xs text-dark-muted">XP Earned</p>
            </div>
            <div className="bg-dark-card rounded-xl p-3">
              <p className="text-2xl font-bold text-blue-400">
                {percentage}%
              </p>
              <p className="text-xs text-dark-muted">Accuracy</p>
            </div>
            <div className="bg-dark-card rounded-xl p-3">
              <p className="text-2xl font-bold text-orange-400">
                🔥 {completionResult?.streak ?? 0}
              </p>
              <p className="text-xs text-dark-muted">Streak</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-brand-green/30"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col safe-top">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-dark-bg px-4 pt-4 pb-2">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={onClose}
            className="text-dark-muted hover:text-white transition-colors p-1"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Progress bar */}
          <div className="flex-1 bg-dark-card rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-brand-green rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Hearts */}
          <div className="flex items-center gap-1">
            <span className="text-sm">❤️</span>
            <span className={`text-sm font-bold ${hearts <= 1 ? "text-red-400" : "text-dark-text"}`}>
              {hearts}
            </span>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-6">
        {/* Question type badge */}
        <div className="mb-2">
          <span className="text-xs bg-dark-card text-dark-muted px-3 py-1 rounded-full">
            {question.type === "translate"
              ? "Translate"
              : question.type === "match"
              ? "Choose the right answer"
              : "Fill in the blank"}
          </span>
        </div>

        {/* Question prompt */}
        <div className={`mb-8 ${animateWrong ? "animate-shake" : ""}`}>
          <h2 className="text-xl font-bold leading-relaxed">{question.prompt}</h2>
          
          {showHint && question.hint && (
            <p className="mt-2 text-sm text-brand-green/80 bg-brand-green/10 rounded-xl px-3 py-2 animate-fade-in">
              💡 {question.hint}
            </p>
          )}

          {!showHint && question.hint && isCorrect === null && (
            <button
              onClick={() => setShowHint(true)}
              className="mt-2 text-xs text-dark-muted hover:text-brand-green transition-colors"
            >
              Need a hint? 💡
            </button>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3 flex-1">
          {question.options &&
            (question.options as string[]).map((option, i) => {
              const isSelected = selected === option;
              const isAnswer = option === question.correctAnswer;
              const showFeedback = isCorrect !== null;

              let btnClass =
                "w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 font-medium ";

              if (showFeedback) {
                if (isAnswer) {
                  btnClass += "border-green-500 bg-green-500/20 text-green-300 ";
                } else if (isSelected && !isAnswer) {
                  btnClass += "border-red-500 bg-red-500/20 text-red-300 ";
                } else {
                  btnClass += "border-dark-border bg-dark-card text-dark-muted opacity-50 ";
                }
              } else if (isSelected) {
                btnClass += "border-brand-green bg-brand-green/10 text-white ";
              } else {
                btnClass +=
                  "border-dark-border bg-dark-card text-dark-text hover:border-dark-muted active:scale-[0.98] ";
              }

              return (
                <button
                  key={i}
                  onClick={() => isCorrect === null && setSelected(option)}
                  disabled={isCorrect !== null}
                  className={btnClass}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        showFeedback && isAnswer
                          ? "bg-green-500 text-white"
                          : showFeedback && isSelected && !isAnswer
                          ? "bg-red-500 text-white"
                          : isSelected
                          ? "bg-brand-green text-white"
                          : "bg-dark-bg text-dark-muted"
                      }`}
                    >
                      {showFeedback && isAnswer
                        ? "✓"
                        : showFeedback && isSelected && !isAnswer
                        ? "✗"
                        : String.fromCharCode(65 + i)}
                    </span>
                    {option}
                  </span>
                </button>
              );
            })}
        </div>

        {/* Feedback bar */}
        {isCorrect !== null && (
          <div
            className={`mt-4 p-4 rounded-2xl animate-slide-up ${
              isCorrect
                ? "bg-green-500/20 border border-green-500/40"
                : "bg-red-500/20 border border-red-500/40"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{isCorrect ? "🎉" : "😅"}</span>
              <div>
                <p className={`font-bold ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                  {isCorrect ? "Correct!" : "Not quite!"}
                </p>
                {!isCorrect && (
                  <p className="text-sm text-dark-muted">
                    Answer: <span className="text-white font-medium">{question.correctAnswer}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Check button */}
        <div className="mt-4 safe-bottom">
          <button
            onClick={checkAnswer}
            disabled={selected === null || isCorrect !== null}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 ${
              selected && isCorrect === null
                ? "bg-brand-green hover:bg-brand-green-dark text-white shadow-lg shadow-brand-green/30"
                : "bg-dark-card text-dark-muted cursor-not-allowed"
            }`}
          >
            Check
          </button>
        </div>
      </div>

      {/* Correct animation overlay */}
      {animateCorrect && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-8xl animate-bounce-in">✅</div>
        </div>
      )}
    </div>
  );
}
