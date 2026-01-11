
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { FamilyMember } from './types';
import LandingPage from './views/LandingPage';
import Dashboard from './views/Dashboard';
import ChildProfile from './views/ChildProfile';
import UserProfile from './views/UserProfile';
import Settings from './views/Settings';
import Directory from './views/Directory';
import Blog from './views/Blog';
import EmergencyAlert from './views/EmergencyAlert';
import AddChild from './views/AddChild';
import FamilyView from './views/FamilyView';
import GuidesView from './views/GuidesView';
import GuideDetail from './views/GuideDetail';
import ModuleView from './views/ModuleView';
import Login from './views/Login';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import { supabase } from './lib/supabase';

// Wrapper component that provides navigation context
const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [currentFamilyId, setCurrentFamilyId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [showAddChild, setShowAddChild] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
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
        // 1. Get User's Family ID first
        let userFamilyId = currentFamilyId;
        if (!userFamilyId) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('family_id')
            .eq('id', session.user.id)
            .single();

          if (profile?.family_id) {
            userFamilyId = profile.family_id;
            setCurrentFamilyId(profile.family_id);
          }
        }

        // 2. Fetch Family Members (RLS will filter, but we can be explicit)
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

  const handleEditMember = (member: FamilyMember) => {
    setEditingMember(member);
    setShowAddChild(true);
  };

  const handleChildSelect = (childId: string) => {
    setSelectedChildId(childId);
    setActiveTab('child_profile');
  };

  const handleViewMemberProfile = (id: string) => {
    navigate(`/familia/${id}`);
  };

  const handleAddMember = async (newMember: FamilyMember) => {
    try {
      if (!userId) {
        throw new Error('No se encontró ID de usuario (inicia sesión nuevamente)');
      }

      let targetFamilyId = currentFamilyId;

      // Auto-create family if user doesn't have one
      if (!targetFamilyId) {
        console.log('No family found, creating new family for user...');
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();

        // 1. Create Family
        const { data: familyData, error: familyError } = await supabase
          .from('families')
          .insert([{
            name: `Familia de ${userName || 'Usuario'}`,
            invite_code: code,
            created_by: userId
          }])
          .select()
          .single();

        if (familyError) throw new Error(`Error creando familia: ${familyError.message}`);

        targetFamilyId = familyData.id;
        setCurrentFamilyId(targetFamilyId);

        // 2. Link Profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ family_id: targetFamilyId, role: 'admin' })
          .eq('id', userId);

        if (profileError) console.error('Error updating profile with new family:', profileError);
      }

      const { data, error } = await supabase
        .from('family_members')
        .insert({ ...newMember, family_id: targetFamilyId, created_by: userId })
        .select()
        .single();

      if (error) {
        console.error('Error adding new member:', error);
        throw error;
      }

      if (data) {
        setFamily(prev => [...prev, data as FamilyMember]);
        setShowAddChild(false);
        setEditingMember(undefined);
        navigate('/familia');
      }
    } catch (err: any) {
      console.error('Unexpected error adding member:', err);
      // Show user feedback
      alert(`Error al guardar: ${err.message || 'Error desconocido'}`);
    }
  };

  const handleUpdateMember = async (updatedMember: FamilyMember) => {
    const previousFamily = family;
    setFamily(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));

    try {
      const { error } = await supabase
        .from('family_members')
        .update(updatedMember)
        .eq('id', updatedMember.id);

      if (error) {
        console.error('Error updating member:', error);
        throw error;
      } else {
        setShowAddChild(false);
        setEditingMember(undefined);
      }
    } catch (err: any) {
      console.error('Error updating member:', err);
      alert(`Error al actualizar: ${err.message || 'Error desconocido'}`);
      setFamily(previousFamily);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    const previousFamily = family;
    setFamily(prev => prev.filter(m => m.id !== memberId));

    try {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', memberId);

      if (error) {
        console.error('Error deleting member:', error);
        throw error;
      }
    } catch (err: any) {
      console.error('Error deleting member:', err);
      alert(`Error al eliminar: ${err.message || 'Error desconocido'}`);
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



  // Lock body scroll when modal is open
  useEffect(() => {
    if (showAddChild) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddChild]);

  // Child profile wrapper to get ID from URL
  const ChildProfileWrapper = () => {
    const { id } = useParams();
    return (
      <ChildProfile
        childId={id || null}
        childrenList={family}
        currentUserId={userId}
        onUpdateChild={handleUpdateMember}
        onBack={() => navigate('/familia')}
        onEditMember={handleEditMember}
        onAddMember={(role) => {
          // We might want to pre-select the role. 
          // For now, just opening the modal is good, but pre-filling role would be better.
          // However, AddChild doesn't strictly support "pre-fill role only" via memberToEdit easily without a fake object.
          // Let's pass a special partial member or handle role selection state if possible.
          // Simpler: Just open AddChild, user picks role. 
          // Better: Add `initialRole` to AddChild?
          // Let's stick to standard add for now to keep it simple, or implement a quick hack using setEditingMember for a "new" member with just role?
          // Actually, let's just navigate to /familia/nuevo for now or use the modal if available.
          setShowAddChild(true);
        }}
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
        {/* Mobile Navigation Bar */}
        {showSidebar && <MobileNav />}

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
                  onEditMember={handleEditMember}
                  onDeleteMember={handleDeleteMember}
                />
              </ProtectedRoute>
            } />

            <Route path="/familia/nuevo" element={
              <ProtectedRoute>
                <AddChild
                  onSave={handleAddMember}
                  onCancel={() => navigate('/familia')}
                  userId={userId}
                />
              </ProtectedRoute>
            } />

            <Route path="/familia/:id" element={
              <ProtectedRoute>
                <ChildProfileWrapper />
              </ProtectedRoute>
            } />

            {/* Guides Routes */}
            <Route path="/guias" element={
              <ProtectedRoute>
                <GuidesView
                  childrenList={family}
                  onAddChild={() => navigate('/familia/nuevo')}
                />
              </ProtectedRoute>
            } />

            <Route path="/guias/:stageId" element={
              <ProtectedRoute>
                <GuideDetail childrenList={family} />
              </ProtectedRoute>
            } />

            <Route path="/guias/:stageId/:moduleId" element={
              <ProtectedRoute>
                <ModuleView />
              </ProtectedRoute>
            } />

            <Route path="/perfil" element={
              <ProtectedRoute>
                <UserProfile
                  userName={session?.user?.user_metadata?.full_name || 'Usuario'}
                  userEmail={session?.user?.email || 'usuario@email.com'}
                  userAvatar={session?.user?.user_metadata?.avatar_url}
                  userId={session?.user?.id}
                  joinedAt={session?.user?.created_at}
                  userPhone={session?.user?.user_metadata?.phone}
                  userLocation={session?.user?.user_metadata?.location}
                  stats={{
                    membersCount: family.length,
                    supportedAlerts: supportedAlerts,
                    directoryReviews: directoryReviews
                  }}
                  childrenList={family}
                  onProfileUpdate={refreshSession}
                  onNavigateToSettings={() => navigate('/configuracion')}
                  onEditMember={handleEditMember}
                  onViewMember={handleViewMemberProfile}
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

            <Route path="/blog" element={
              <ProtectedRoute>
                <Blog />
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
      {showAddChild && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="w-full max-w-2xl transform overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all animate-in zoom-in-95 duration-200">
              <AddChild
                memberToEdit={editingMember}
                onSave={editingMember ? handleUpdateMember : handleAddMember}
                onCancel={() => {
                  setShowAddChild(false);
                  setEditingMember(undefined);
                }}
                userId={userId}
              />
            </div>
          </div>
        </div>
      )}
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
