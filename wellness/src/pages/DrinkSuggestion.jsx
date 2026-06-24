import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '@shared/api';

const WEATHER_ICONS = {
  'clear': '☀️',
  'partly-cloudy': '⛅',
  'cloudy': '☁️',
  'rain': '🌧️',
  'drizzle': '🌦️',
  'thunderstorm': '⛈️',
  'snow': '❄️',
  'fog': '🌫️',
  'default': '🌤️',
};

function TeaCard({ tea }) {
  if (!tea) return null;
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-leaf-50">
      <h3 className="font-bold text-gray-800 text-lg mb-1">{tea.name}</h3>
      <p className="text-sm text-gray-500 mb-3">{tea.reason}</p>
      <a
        href="/teas"
        className="inline-block text-sm text-primary-600 font-medium hover:underline"
      >
        Xem tại cửa hàng
      </a>
    </div>
  );
}

export default function DrinkSuggestion() {
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState('');
  const [coords, setCoords] = useState(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setCoords({ lat: 21.0285, lng: 105.8542 });
      setLocationDenied(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setCoords({ lat: 21.0285, lng: 105.8542 });
        setLocationDenied(true);
      },
      { timeout: 5000 }
    );
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const fetchSuggestions = useCallback(async (lat, lng) => {
    setSuggestLoading(true);
    setSuggestError('');
    setSuggestions(null);
    try {
      const { data } = await api.get(`/wellness/suggest/drink?lat=${lat}&lng=${lng}`);
      setSuggestions(data);
      setWeather(data.weather);
      setWeatherLoading(false);
    } catch {
      setSuggestError('Không thể tải gợi ý. Thử lại sau.');
      setWeatherLoading(false);
    } finally {
      setSuggestLoading(false);
    }
  }, []);

  useEffect(() => {
    if (coords) {
      fetchSuggestions(coords.lat, coords.lng);
    }
  }, [coords, fetchSuggestions]);

  useEffect(() => {
    api.get('/wellness/suggest/drink/history')
      .then(({ data }) => setHistory(data))
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  }, []);

  const handleRefresh = () => {
    if (coords) {
      fetchSuggestions(coords.lat, coords.lng);
    }
  };

  if (weatherLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-gray-400">Đang tải thời tiết...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      {weather && (
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl mb-1">
                {WEATHER_ICONS[weather.condition] || WEATHER_ICONS.default}
              </p>
              <p className="text-2xl font-bold">{weather.temperature}°C</p>
              <p className="text-sm opacity-80">{weather.description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Độ ẩm</p>
              <p className="font-semibold">{weather.humidity}%</p>
              <p className="text-sm opacity-80 mt-2">Thành phố</p>
              <p className="font-semibold">{weather.city || 'Hà Nội'}</p>
            </div>
          </div>
          {locationDenied && (
            <p className="text-xs opacity-70 mt-2">Đang dùng vị trí mặc định: Hà Nội</p>
          )}
        </div>
      )}

      {weatherError && !weather && (
        <div className="p-6 text-center">
          <p className="text-red-500 mb-3">{weatherError}</p>
          <button onClick={handleRefresh} className="text-primary-600 underline">
            Thử lại
          </button>
        </div>
      )}

      {suggestLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-gray-400">Đang tìm gợi ý trà phù hợp...</p>
          </div>
        </div>
      )}

      {suggestError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {suggestError}
        </div>
      )}

      {suggestions && !suggestLoading && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Trà gợi ý cho bạn</h2>
            <button
              onClick={handleRefresh}
              disabled={suggestLoading}
              className="text-sm text-primary-600 font-medium hover:underline disabled:opacity-50"
            >
              Làm mới
            </button>
          </div>

          <div className="space-y-3">
            {(suggestions.teas || suggestions.suggestions || suggestions.data || []).map((tea, i) => (
              <TeaCard key={tea._id || tea.id || i} tea={tea} />
            ))}
          </div>

          {(!suggestions.teas && !suggestions.suggestions && !suggestions.data) && (
            <div className="text-center py-8 text-gray-400">
              <p>Chưa có gợi ý nào. Nhấn &quot;Làm mới&quot; để thử lại.</p>
            </div>
          )}
        </>
      )}

      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-3">Lịch sử gợi ý</h2>
        {historyLoading ? (
          <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
        ) : history.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Chưa có lịch sử gợi ý</p>
        ) : (
          <div className="space-y-2">
            {history.map((item, i) => (
              <div key={item._id || item.id || i} className="bg-white rounded-xl p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">
                      {(item.teas || []).map((t) => t.name).join(', ') || item.query}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(item.createdAt).toLocaleDateString('vi-VN', {
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className="text-sm text-gray-400">
                    {item.teas?.length || 0} trà
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
