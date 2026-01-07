import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
            },
          },
        });
        if (error) throw error;
        setMessage('Revisa tu email para confirmar tu cuenta.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onLoginSuccess();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-surface rounded-2xl shadow-xl p-8 w-full max-w-md border border-neutral-light">
        <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
               <div className="bg-primary/10 p-3 rounded-full">
                  <span className="material-symbols-outlined text-4xl text-primary">family_restroom</span>
               </div>
            </div>
          <h2 className="text-2xl font-display font-bold text-text-main mb-2">
            {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h2>
          <p className="text-text-muted">
            {isSignUp ? 'Únete a Parental para proteger a tu familia' : 'Bienvenido de nuevo'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Nombre Completo</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-background border border-neutral-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-text-main"
                placeholder="Juan Pérez"
                required
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-neutral-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-text-main"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-text-muted mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-neutral-light focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-text-main"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-center gap-2">
                 <span className="material-symbols-outlined text-lg">check_circle</span>
                {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
                <span className="material-symbols-outlined animate-spin">sync</span>
            ) : isSignUp ? (
                'Registrarse'
            ) : (
                'Ingresar'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
            <button
                onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                    setMessage(null);
                }}
                className="text-primary hover:text-primary-dark text-sm font-medium transition-colors"
                type="button"
            >
                {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
