import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@shared/api';

const DAY_LABELS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

const EXERCISE_ICONS = {
  yoga: '🧘',
  cardio: '🏃',
  strength: '🏋️',
  stretch: '🤸',
  walk: '🚶',
  meditation: '🧘‍♀️',
  default: '💪',
};

function getWeekDates(weekOffset) {
  const now = new Date();
  const day = now.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset + weekOffset * 7);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}

function formatDate(date) {
  return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' });
}

function formatRange(monday, sunday) {
  return `${formatDate(monday)} - ${formatDate(sunday)}`;
}

export default function WorkoutPlanner() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [session, setSession] = useState(null);
  const [completed, setCompleted] = useState({});

  const { monday, sunday } = getWeekDates(weekOffset);

  const fetchPlan = useCallback(async () => {
    setLoading(true);
    setError('');
    setSelectedDay(null);
    setSession(null);
    try {
      const weekStr = monday.toISOString().split('T')[0];
      const { data } = await api.get(`/wellness/workout/plan?week=${weekStr}`);
      setPlan(data);
      setCompleted(data.completed || {});
    } catch {
      setError('Không thể tải kế hoạch tập luyện.');
    } finally {
      setLoading(false);
    }
  }, [monday]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const weekStr = monday.toISOString().split('T')[0];
      await api.post('/wellness/workout/plan/generate', { week: weekStr });
      fetchPlan();
    } catch {
      setError('Không thể tạo kế hoạch AI. Thử lại sau.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDayClick = (dayIndex) => {
    if (dayIndex === 6) return; // Sunday rest
    const exercises = plan?.days?.[dayIndex] || plan?.exercises?.filter((e) => e.day === dayIndex) || [];
    setSelectedDay(dayIndex);
    setSession({
      dayIndex,
      dayLabel: DAY_LABELS[dayIndex],
      exercises,
      currentIndex: 0,
      timer: 0,
      running: false,
      done: false,
    });
  };

  const handleStartSession = () => {
    if (!session) return;
    setSession((prev) => ({ ...prev, running: true }));
  };

  const handleCompleteExercise = async (exerciseIndex) => {
    setSession((prev) => {
      const newIndex = exerciseIndex + 1;
      if (newIndex >= prev.exercises.length) {
        return { ...prev, done: true, running: false, currentIndex: newIndex };
      }
      return { ...prev, currentIndex: newIndex, timer: 0 };
    });
  };

  const handleCompleteSession = async () => {
    try {
      await api.post('/wellness/workout/complete', {
        week: monday.toISOString().split('T')[0],
        day: selectedDay,
      });
      setCompleted((prev) => ({ ...prev, [selectedDay]: true }));
      setSession(null);
      setSelectedDay(null);
      fetchPlan();
    } catch {
      setError('Không thể lưu kết quả.');
    }
  };

  const getDayExercises = (dayIndex) => {
    if (!plan) return [];
    return plan.days?.[dayIndex] || plan.exercises?.filter((e) => e.day === dayIndex) || [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setWeekOffset((w) => w - 1)}
          className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-gray-500 hover:bg-gray-50"
        >
          ←
        </button>
        <h2 className="text-base font-bold text-gray-800 text-center">
          {formatRange(monday, sunday)}
        </h2>
        <button
          onClick={() => setWeekOffset((w) => w + 1)}
          className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-gray-500 hover:bg-gray-50"
        >
          →
        </button>
      </div>

      {error && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-7 gap-2 mb-4">
        {DAY_LABELS.map((label, i) => {
          const exercises = getDayExercises(i);
          const isSunday = i === 6;
          const isDone = completed[i];
          return (
            <button
              key={i}
              onClick={() => handleDayClick(i)}
              disabled={isSunday || (exercises.length === 0 && !plan)}
              className={`rounded-xl p-2 text-center transition-all ${
                isSunday
                  ? 'bg-leaf-50 text-leaf-600 cursor-default'
                  : isDone
                  ? 'bg-green-100 text-green-700 ring-1 ring-green-400'
                  : exercises.length > 0
                  ? 'bg-white shadow-sm hover:shadow-md text-gray-800'
                  : 'bg-gray-50 text-gray-400 cursor-default'
              }`}
            >
              <p className="text-xs font-semibold mb-1">{label.slice(0, 3)}</p>
              {isSunday ? (
                <p className="text-xs">Nghỉ</p>
              ) : exercises.length > 0 ? (
                <div className="space-y-0.5">
                  {exercises.slice(0, 2).map((ex, j) => (
                    <div key={j} className="flex items-center gap-0.5 text-xs">
                      <span>{EXERCISE_ICONS[ex.type] || EXERCISE_ICONS.default}</span>
                      <span className="truncate">{ex.name || ex.type}</span>
                    </div>
                  ))}
                  {exercises.length > 2 && (
                    <span className="text-xs text-gray-400">+{exercises.length - 2}</span>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-300">-</p>
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleGenerate}
        disabled={generating}
        className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 mb-4"
      >
        {generating ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Đang tạo kế hoạch...
          </>
        ) : (
          <>
            <span>🤖</span>
            Tạo kế hoạch AI
          </>
        )}
      </button>

      {session && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 text-lg">{session.dayLabel}</h3>
            <button
              onClick={() => { setSession(null); setSelectedDay(null); }}
              className="text-gray-400 text-lg"
            >
              ✕
            </button>
          </div>

          {session.done ? (
            <div className="text-center py-6">
              <p className="text-5xl mb-3">🎉</p>
              <p className="text-xl font-bold text-green-600 mb-2">Buổi tập hoàn thành!</p>
              <p className="text-gray-500 mb-4">
                Bạn đã hoàn thành {session.exercises.length} bài tập
              </p>
              <button
                onClick={handleCompleteSession}
                className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                Lưu kết quả
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {session.exercises.map((ex, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl flex items-center gap-3 transition-all ${
                      i === session.currentIndex
                        ? 'bg-primary-50 ring-2 ring-primary-500'
                        : i < session.currentIndex
                        ? 'bg-green-50 opacity-70'
                        : 'bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl">
                      {EXERCISE_ICONS[ex.type] || EXERCISE_ICONS.default}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{ex.name || ex.type}</p>
                      <p className="text-xs text-gray-500">{ex.duration || ex.time || '--'} phút</p>
                    </div>
                    {i < session.currentIndex && (
                      <span className="text-green-500 text-lg">✓</span>
                    )}
                    {i === session.currentIndex && (
                      <button
                        onClick={() => handleCompleteExercise(i)}
                        className="px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg font-medium hover:bg-primary-700"
                      >
                        Xong
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Tiến độ: {session.currentIndex}/{session.exercises.length}
                </p>
                {!session.running ? (
                  <button
                    onClick={handleStartSession}
                    className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700"
                  >
                    Bắt đầu
                  </button>
                ) : (
                  <p className="text-sm text-primary-600 font-medium">Đang tập...</p>
                )}
              </div>

              <div className="mt-3 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary-600 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${session.exercises.length > 0 ? (session.currentIndex / session.exercises.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
