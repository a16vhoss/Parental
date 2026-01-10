
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { FamilyMember } from './types';
import LandingPage from './views/LandingPage';
import Dashboard from './views/Dashboard';
import ChildProfile from './views/ChildProfile';
import UserProfile from './views/UserProfile';
import Settings from './views/Settings';
import Directory from './views/Directory';
import EmergencyAlert from './views/EmergencyAlert';
import AddChild from './views/AddChild';
import FamilyView from './views/FamilyView';
import Login from './views/Login';
import Sidebar from './components/Sidebar';
import { supabase } from './lib/supabase';

// Wrapper component that provides navigation context
const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true); // Track if session is being fetched

  const userName = session?.user?.user_metadata?.full_name || 'Usuario';
  const userEmail = session?.user?.email || '';
  const userId = session?.user?.id;
  const userAvatar = session?.user?.user_metadata?.avatar_url || null;
  const userJoinedAt = session?.user?.created_at || new Date().toISOString();
  const userPhone = session?.user?.user_metadata?.phone || '';
  const userLocation = session?.user?.user_metadata?.location || '';

  const supportedAlerts = session?.user?.user_metadata?.supported_alerts || 0;
  const directoryReviews = session?.user?.user_metadata?.directory_reviews || 0;

  const refreshSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setSession(session);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsSessionLoading(false); // Session check complete
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsSessionLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch family data when authenticated
  useEffect(() => {
    const fetchFamily = async () => {
      if (!session) return;
      if (location.pathname === '/' || location.pathname === '/login') return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('family_members')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Supabase fetch error:', error);
          if (family.length === 0) setFamily([]);
        } else if (data) {
          setFamily(data as FamilyMember[]);
        }
      } catch (err) {
        console.error('Unexpected error fetching family:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFamily();
  }, [location.pathname, session]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleViewMemberProfile = (id: string) => {
    navigate(`/familia/${id}`);
  };

  const handleAddMember = async (newMember: FamilyMember) => {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .insert([newMember])
        .select();

      if (error) {
        console.error('Error adding member:', error);
        if (error.message === 'Database not configured') {
          setFamily(prev => [...prev, newMember]);
          navigate('/familia');
          return;
        }
        alert('Error al guardar en la base de datos: ' + error.message);
      } else if (data) {
        setFamily(prev => [...prev, data[0] as FamilyMember]);
        navigate('/familia');
      }
    } catch (err) {
      console.error('Error adding member:', err);
      alert('Error inesperado al guardar.');
    }
  };

  const handleUpdateMember = async (updatedMember: FamilyMember) => {
    const previousFamily = [...family];
    setFamily(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));

    try {
      const { error } = await supabase
        .from('family_members')
        .update(updatedMember)
        .eq('id', updatedMember.id);

      if (error) {
        console.error('Error updating member:', error);
        if (error.message !== 'Database not configured') {
          setFamily(previousFamily);
        }
      }
    } catch (err) {
      console.error('Error updating member:', err);
      setFamily(previousFamily);
    }
  };

  const handleEnterApp = () => {
    if (session) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  // Protected route wrapper
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Wait for session to be determined before redirecting
    if (isSessionLoading) {
      return <LoadingSpinner />;
    }
    if (!session) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  // Determine if sidebar should show
  const showSidebar = !["/", "/login", "/alerta"].includes(location.pathname);

  // Loading spinner
  const LoadingSpinner = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-20">
      <div className="size-20 bg-primary/10 rounded-full mb-6 flex items-center justify-center relative">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">sync</span>
        <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
      <div className="text-center">
        <h2 className="text-lg font-bold text-text-main dark:text-white mb-1">Sincronizando</h2>
        <p className="text-text-muted dark:text-gray-400 text-xs font-bold tracking-widest uppercase">Conectando con tu nube familiar</p>
      </div>
    </div>
  );

  // Child profile wrapper to get ID from URL
  const ChildProfileWrapper = () => {
    const { id } = useParams();
    return (
      <ChildProfile
        childId={id || null}
        childrenList={family}
        onUpdateChild={handleUpdateMember}
        onBack={() => navigate('/familia')}
      />
    );
  };

  return (
    <div className="flex min-h-screen">
      {showSidebar && (
        <Sidebar
          userName={userName}
          currentPath={location.pathname}
        />
      )}
      <div className={`flex-1 w-full ${showSidebar ? 'lg:pl-0' : ''}`}>
        {isLoading && showSidebar ? (
          <LoadingSpinner />
        ) : (
          <Routes>
            <Route path="/" element={<LandingPage onEnterApp={handleEnterApp} />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard
                  userName={userName}
                  childrenList={family.filter(m => m.role === 'Hijo/a')}
                  onViewProfile={handleViewMemberProfile}
                  onAddChild={() => navigate('/familia/nuevo')}
                />
              </ProtectedRoute>
            } />

            <Route path="/familia" element={
              <ProtectedRoute>
                <FamilyView
                  childrenList={family}
                  onViewChild={handleViewMemberProfile}
                  onAddChild={() => navigate('/familia/nuevo')}
                />
              </ProtectedRoute>
            } />

            <Route path="/familia/nuevo" element={
              <ProtectedRoute>
                <AddChild
                  onSave={handleAddMember}
                  onCancel={() => navigate('/familia')}
                />
              </ProtectedRoute>
            } />

            <Route path="/familia/:id" element={
              <ProtectedRoute>
                <ChildProfileWrapper />
              </ProtectedRoute>
            } />

            <Route path="/perfil" element={
              <ProtectedRoute>
                <UserProfile
                  userName={userName}
                  userEmail={userEmail}
                  userAvatar={userAvatar}
                  userId={userId}
                  joinedAt={userJoinedAt}
                  userPhone={userPhone}
                  userLocation={userLocation}
                  stats={{
                    membersCount: family.length,
                    supportedAlerts: supportedAlerts,
                    directoryReviews: directoryReviews
                  }}
                  onProfileUpdate={refreshSession}
                  onNavigateToSettings={() => navigate('/configuracion')}
                />
              </ProtectedRoute>
            } />

            <Route path="/configuracion" element={
              <ProtectedRoute>
                <Settings
                  isDarkMode={isDarkMode}
                  onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                  onBack={() => navigate('/perfil')}
                />
              </ProtectedRoute>
            } />

            <Route path="/directorio" element={
              <ProtectedRoute>
                <Directory />
              </ProtectedRoute>
            } />

            <Route path="/alerta" element={
              <ProtectedRoute>
                <EmergencyAlert onCancel={() => navigate('/dashboard')} />
              </ProtectedRoute>
            } />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
