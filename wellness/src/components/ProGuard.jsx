import { Navigate } from 'react-router-dom';
import { useAuth } from '@shared/AuthContext';
import { useState, useEffect } from 'react';
import api from '@shared/api';

export default function ProGuard({ children }) {
  const { user } = useAuth();
  const [proStatus, setProStatus] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.get('/wellness/pro/status')
      .then((res) => {
        if (!cancelled) {
          setProStatus(res.data);
        }
      })
      .catch(() => {
        if (!cancelled) setProStatus({ isPro: false });
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => { cancelled = true; };
  }, [user]);

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!proStatus?.isPro) {
    return <Navigate to="/pro" replace />;
  }

  return children;
}
