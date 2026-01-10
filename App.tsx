
import React, { useState, useEffect } from 'react';
import { AppView, FamilyMember } from './types';
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

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<any>(null);

  const userName = session?.user?.user_metadata?.full_name || 'Usuario';
  const userEmail = session?.user?.email || '';
  const userId = session?.user?.id;
  const userAvatar = session?.user?.user_metadata?.avatar_url || null;
  const userJoinedAt = session?.user?.created_at || new Date().toISOString();
  const userPhone = session?.user?.user_metadata?.phone || '';
  const userLocation = session?.user?.user_metadata?.location || '';

  // Stats derived from session metadata or state
  const supportedAlerts = session?.user?.user_metadata?.supported_alerts || 0;
  const directoryReviews = session?.user?.user_metadata?.directory_reviews || 0;

  const refreshSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (session) {
      setSession(session);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch initial family data from Supabase
  useEffect(() => {
    const fetchFamily = async () => {
      // Don't show global loader on landing or login, only when navigating in
      if (!session || currentView === AppView.LANDING || currentView === AppView.LOGIN) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('family_members')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Supabase fetch error:', error);
          // Fallback to empty if error
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
  }, [currentView, session]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleViewMemberProfile = (id: string) => {
    setSelectedMemberId(id);
    setCurrentView(AppView.PROFILE_DETAIL);
  };

  const handleAddMember = async (newMember: FamilyMember) => {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .insert([newMember])
        .select();

      if (error) {
        console.error('Error adding member:', error);
        // Optimistic local update if DB fails (demo mode)
        if (error.message === 'Database not configured') {
          setFamily(prev => [...prev, newMember]);
          setCurrentView(AppView.PROFILE);
          return;
        }
        alert('Error al guardar en la base de datos: ' + error.message);
      } else if (data) {
        setFamily(prev => [...prev, data[0] as FamilyMember]);
        setCurrentView(AppView.PROFILE);
      }
    } catch (err) {
      console.error('Error adding member:', err);
      alert('Error inesperado al guardar.');
    }
  };

  const handleUpdateMember = async (updatedMember: FamilyMember) => {
    // Optimistic update
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
          setFamily(previousFamily); // Rollback on real error
        }
      }
    } catch (err) {
      console.error('Error updating member:', err);
      setFamily(previousFamily);
    }
  };

  const handleEnterApp = () => {
    if (session) {
      setCurrentView(AppView.DASHBOARD);
    } else {
      setCurrentView(AppView.LOGIN);
    }
  };

  const renderView = () => {
    if (isLoading && currentView !== AppView.LANDING && currentView !== AppView.LOGIN) {
      return (
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
    }

    switch (currentView) {
      case AppView.LANDING:
        return <LandingPage onEnterApp={handleEnterApp} />;
      case AppView.LOGIN:
        return <Login onLoginSuccess={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.DASHBOARD:
        return (
          <Dashboard
            userName={userName}
            childrenList={family.filter(m => m.role === 'Hijo/a')}
            onViewProfile={handleViewMemberProfile}
            onAddChild={() => setCurrentView(AppView.ADD_CHILD)}
          />
        );
      case AppView.ADD_CHILD:
        return (
          <AddChild
            onSave={handleAddMember}
            onCancel={() => setCurrentView(AppView.PROFILE)}
          />
        );
      case AppView.PROFILE:
        return (
          <FamilyView
            childrenList={family}
            onViewChild={handleViewMemberProfile}
            onAddChild={() => setCurrentView(AppView.ADD_CHILD)}
          />
        );
      case AppView.PROFILE_DETAIL:
        return (
          <ChildProfile
            childId={selectedMemberId}
            childrenList={family}
            onUpdateChild={handleUpdateMember}
            onBack={() => setCurrentView(AppView.PROFILE)}
          />
        );
      case AppView.USER_PROFILE:
        return (
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
            onNavigateToSettings={() => setCurrentView(AppView.SETTINGS)}
          />
        );
      case AppView.SETTINGS:
        return (
          <Settings
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onBack={() => setCurrentView(AppView.USER_PROFILE)}
          />
        );
      case AppView.DIRECTORY:
        return <Directory />;
      case AppView.EMERGENCY:
        return <EmergencyAlert onCancel={() => setCurrentView(AppView.DASHBOARD)} />;
      default:
        return <LandingPage onEnterApp={handleEnterApp} />;
    }
  };

  const showSidebar = currentView !== AppView.LANDING && currentView !== AppView.LOGIN && currentView !== AppView.EMERGENCY;

  return (
    <div className="flex min-h-screen">
      {showSidebar && (
        <Sidebar
          userName={userName}
          activeView={activeViewMapper(currentView)}
          onNavigate={setCurrentView}
        />
      )}
      <div className={`flex-1 w-full ${showSidebar ? 'lg:pl-0' : ''}`}>
        {renderView()}
      </div>
    </div>
  );
};

function activeViewMapper(view: AppView): AppView {
  if (view === AppView.SETTINGS || view === AppView.PROFILE_DETAIL || view === AppView.ADD_CHILD) return AppView.PROFILE;
  return view;
}

export default App;
