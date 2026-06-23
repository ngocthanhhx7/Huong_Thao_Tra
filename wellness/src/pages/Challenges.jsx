import { useState, useEffect, useCallback } from 'react';
import api from '@shared/api';

const TYPE_LABELS = {
  tea: 'Uống trà',
  exercise: 'Vận động',
  meditation: 'Thiền',
  sleep: 'Ngủ đủ giấc',
  water: 'Uống nước',
  journal: 'Nhật ký',
};

function ChallengeCard({ challenge, onJoin, joining }) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState(null);
  const [lbLoading, setLbLoading] = useState(false);
  const [lbError, setLbError] = useState('');

  const fetchLeaderboard = async () => {
    setLbLoading(true);
    setLbError('');
    try {
      const { data } = await api.get(`/wellness/challenges/${challenge._id || challenge.id}/leaderboard`);
      setLeaderboard(data);
    } catch {
      setLbError('Không thể tải bảng xếp hạng.');
    } finally {
      setLbLoading(false);
    }
  };

  const toggleLeaderboard = () => {
    if (!showLeaderboard && !leaderboard) {
      fetchLeaderboard();
    }
    setShowLeaderboard((prev) => !prev);
  };

  const progress = challenge.progress || 0;
  const daysLeft = challenge.daysRemaining || challenge.daysLeft || 0;
  const participants = challenge.participantCount || challenge.participants || 0;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 text-lg truncate">{challenge.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{challenge.description}</p>
        </div>
        <span className="ml-3 px-2.5 py-1 bg-leaf-50 text-leaf-800 rounded-full text-xs font-medium flex-shrink-0">
          {TYPE_LABELS[challenge.type] || challenge.type || 'Thử thách'}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Tiến độ</span>
          <span>{progress}%</span>
        </div>
        <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary-600 h-full rounded-full transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
        <span>Còn {daysLeft} ngày</span>
        <span>{participants} người tham gia</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onJoin(challenge._id || challenge.id)}
          disabled={joining === (challenge._id || challenge.id) || challenge.joined}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
            challenge.joined
              ? 'bg-green-50 text-green-600 cursor-default'
              : 'bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50'
          }`}
        >
          {challenge.joined ? 'Đã tham gia' : joining === (challenge._id || challenge.id) ? 'Đang tham gia...' : 'Tham gia'}
        </button>
        <button
          onClick={toggleLeaderboard}
          className="px-3 py-2 rounded-xl bg-gray-50 text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          {showLeaderboard ? 'Ẩn BXH' : 'BXH'}
        </button>
      </div>

      {showLeaderboard && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          {lbLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full" />
            </div>
          ) : lbError ? (
            <p className="text-sm text-red-500 text-center py-2">{lbError}</p>
          ) : leaderboard ? (
            <>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Bảng xếp hạng</h4>
              <div className="space-y-1.5">
                {(leaderboard.leaderboard || leaderboard.rankings || []).map((entry, i) => (
                  <div
                    key={entry._id || entry.id || i}
                    className="flex items-center gap-3 py-1.5"
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0 ? 'bg-amberSoft text-white' :
                      i === 1 ? 'bg-gray-300 text-white' :
                      i === 2 ? 'bg-amber-200 text-amber-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm font-medium text-gray-800 truncate">
                      {entry.name || entry.userName || entry.user?.name}
                    </span>
                    <span className="text-sm font-semibold text-primary-600">{entry.score}</span>
                  </div>
                ))}
              </div>
              {leaderboard.userRank && (
                <div className="mt-2 pt-2 border-t border-gray-100 text-center">
                  <p className="text-sm text-gray-500">
                    Vị trí của bạn: <span className="font-bold text-primary-600">#{leaderboard.userRank}</span>
                  </p>
                </div>
              )}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default function Challenges() {
  const [active, setActive] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(null);

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/wellness/challenges');
      setActive(data.active || data.current || []);
      setUpcoming(data.upcoming || data.future || []);
    } catch {
      setError('Không thể tải thử thách. Thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const handleJoin = async (challengeId) => {
    setJoining(challengeId);
    try {
      await api.post(`/wellness/challenges/${challengeId}/join`);
      fetchChallenges();
    } catch {
      setError('Không thể tham gia thử thách. Thử lại.');
    } finally {
      setJoining(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-3">Đang diễn ra</h2>
        {active.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            Hiện không có thử thách nào đang diễn ra.
          </p>
        ) : (
          <div className="space-y-3">
            {active.map((ch) => (
              <ChallengeCard
                key={ch._id || ch.id}
                challenge={ch}
                onJoin={handleJoin}
                joining={joining}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-3">Sắp tới</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            Chưa có thử thách sắp tới.
          </p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((ch) => (
              <div
                key={ch._id || ch.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 opacity-70"
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 truncate">{ch.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{ch.description}</p>
                  </div>
                  <span className="ml-3 px-2.5 py-1 bg-leaf-50 text-leaf-800 rounded-full text-xs font-medium flex-shrink-0">
                    {TYPE_LABELS[ch.type] || ch.type || 'Thử thách'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                  <span>
                    Bắt đầu:{' '}
                    {new Date(ch.startDate).toLocaleDateString('vi-VN', {
                      day: 'numeric',
                      month: 'numeric',
                    })}
                  </span>
                  <span>{ch.participantCount || ch.participants || 0} quan tâm</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
